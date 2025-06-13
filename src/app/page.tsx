"use client"; // <--- VERY IMPORTANT: This makes it a Client Component

import React, { useState, useEffect, useCallback, useRef, KeyboardEvent } from 'react';
// Import from your new Firebase client config
import { auth, db, appIdForFirestore } from '@/utils/firebaseClient';
import { signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Timestamp, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

// Define the Todo item interface for strong typing
interface Todo {
    id: string;
    todo: string;
    isCompleted: boolean;
    createdAt: string; // Storing as ISO string for client-side use
}

// Main App component (now `page.tsx` in App Router)
const TodoApp = () => {
    // State for the current todo input value
    const [todoText, setTodoText] = useState<string>('');
    // State for the list of todos
    const [todos, setTodos] = useState<Todo[]>([]);
    // State to store the ID of the todo being edited (null if not editing)
    const [editingId, setEditingId] = useState<string | null>(null);
    // State for displaying user warnings (e.g., duplicate, empty)
    const [warning, setWarning] = useState<string>('');
    // State for filtered todos (when filtering is active)
    const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
    // State to indicate if filtering is active
    const [isFiltering, setIsFiltering] = useState<boolean>(false);
    // State for Firebase authentication readiness
    const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
    // State for current user ID
    const [userId, setUserId] = useState<string | null>(null);
    // State for loading status (e.g., during API calls/DB operations)
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Ref to track if component is mounted to prevent state updates on unmounted component
    const isMounted = useRef<boolean>(true);

    // Firebase Authentication
    useEffect(() => {
        isMounted.current = true; // Mark component as mounted

        // Check if 'auth' object from firebaseClient is initialized
        // The 'auth/configuration-not-found' error indicates an issue during Firebase app initialization
        // which happens in firebaseClient.ts, likely due to incorrect/missing .env.local variables.
        if (!auth) {
            console.error("Firebase Auth object is null/undefined. This usually means Firebase failed to initialize.");
            if (isMounted.current) {
                setWarning('Firebase Auth not available. Ensure .env.local is correct and server restarted.');
            }
            return;
        }

        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (user) {
                if (isMounted.current) {
                    setUserId(user.uid);
                    setIsAuthReady(true);
                    console.log("Firebase Auth Ready. User ID:", user.uid);
                }
            } else {
                try {
                    // The __initial_auth_token is specific to the Canvas environment
                    // In a standard Next.js app, you wouldn't typically rely on this global.
                    // We'll try to sign in anonymously if no such token is present.
                    const initialAuthToken = (typeof window !== 'undefined' && typeof (window as any).__initial_auth_token !== 'undefined')
                        ? (window as any).__initial_auth_token as string
                        : null;

                    if (initialAuthToken) {
                      await signInWithCustomToken(auth, initialAuthToken);
                    } else {
                        await signInAnonymously(auth);
                    }
                } catch (error: any) { // Use 'any' for unknown error types or define more specific Error type
                    console.error("Error signing in:", error.message);
                    if (isMounted.current) {
                        setWarning(`Error signing in: ${error.message}. Please check your Firebase project config.`);
                    }
                }
            }
        });

        return () => {
            isMounted.current = false; // Mark component as unmounted
            unsubscribeAuth(); // Unsubscribe from auth state changes
        };
    }, []); // Run only once on component mount

    // Firestore Real-time Data Fetching
    useEffect(() => {
        // Ensure both db and auth are initialized and ready before setting up snapshot listener
        if (db && auth && isAuthReady) {
            // The collection path is structured for the Canvas environment
            const todosCollectionRef = collection(db, `artifacts/${appIdForFirestore}/public/data/todos`);

            const unsubscribe = onSnapshot(todosCollectionRef, (snapshot) => {
                const fetchedTodos: Todo[] = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        todo: data.todo as string,
                        isCompleted: (data.isCompleted as boolean) || false,
                        createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate().toISOString() : new Date().toISOString()
                    };
                }).sort((a: Todo, b: Todo) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

                if (isMounted.current) {
                    setTodos(fetchedTodos);
                }
            }, (error: any) => {
                console.error("Error fetching todos:", error.message);
                if (isMounted.current) {
                    setWarning('Failed to fetch todos. Check console for details.');
                }
            });

            return () => unsubscribe();
        }
    }, [db, auth, isAuthReady]); // Re-run when db, auth, or authReady changes

    // Function to show a temporary warning message
    const showWarning = (message: string) => {
        setWarning(message);
        const timer = setTimeout(() => {
            if (isMounted.current) {
                setWarning('');
            }
        }, 3000);
        return () => clearTimeout(timer); // Cleanup timer on re-render or unmount
    };

    // Handle adding a new todo or updating an existing one
    const handleAddOrUpdateTodo = useCallback(async () => {
        const trimmedText: string = todoText.trim();
        if (!trimmedText) {
            showWarning('Todo item cannot be empty!');
            return;
        }

        if (editingId === null && todos.some((todo: Todo) => todo.todo.toLowerCase() === trimmedText.toLowerCase())) {
            showWarning('This todo already exists!');
            return;
        }

        setIsLoading(true);

        try {
            const todosCollectionRef = collection(db, `artifacts/${appIdForFirestore}/public/data/todos`);

            if (editingId) {
                const todoRef = doc(db, `artifacts/${appIdForFirestore}/public/data/todos`, editingId);
                await updateDoc(todoRef, {
                    todo: trimmedText,
                });
                console.log('Todo updated successfully!');
            } else {
                await addDoc(todosCollectionRef, {
                    todo: trimmedText,
                    isCompleted: false,
                    createdAt: Timestamp.now(),
                });
                console.log('Todo added successfully!');
            }
            if (isMounted.current) {
                setTodoText('');
                setEditingId(null);
                setWarning('');
            }
        } catch (error: any) {
            console.error('Error adding/updating todo:', error.message);
            if (isMounted.current) {
                showWarning('Failed to save todo. Please try again.');
            }
        } finally {
            if (isMounted.current) {
                setIsLoading(false);
            }
        }
    }, [todoText, editingId, todos, db]);

    // Handle key press in the input field
    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAddOrUpdateTodo();
        }
    };

    // Handle removing a todo
    const handleRemoveTodo = useCallback(async (id: string) => {
        setIsLoading(true);
        try {
            const todoRef = doc(db, `artifacts/${appIdForFirestore}/public/data/todos`, id);
            await deleteDoc(todoRef);
            console.log('Todo removed successfully!');
            if (isMounted.current) {
                setWarning('');
            }
        } catch (error: any) {
            console.error('Error removing todo:', error.message);
            if (isMounted.current) {
                showWarning('Failed to remove todo. Please try again.');
            }
        } finally {
            if (isMounted.current) {
                setIsLoading(false);
            }
        }
    }, [db]);

    // Handle editing a todo
    const handleEditTodo = useCallback((todo: Todo) => {
        if (isMounted.current) {
            setTodoText(todo.todo);
            setEditingId(todo.id);
            setWarning('');
        }
    }, []);

    // Handle marking a todo as complete/incomplete
    const handleToggleComplete = useCallback(async (id: string, isCompleted: boolean) => {
        setIsLoading(true);
        try {
            const todoRef = doc(db, `artifacts/${appIdForFirestore}/public/data/todos`, id);
            await updateDoc(todoRef, {
                isCompleted: !isCompleted,
            });
            console.log('Todo completion status updated!');
            if (isMounted.current) {
                setWarning('');
            }
        } catch (error: any) {
            console.error('Error updating todo completion status:', error.message);
            if (isMounted.current) {
                showWarning('Failed to update todo status. Please try again.');
            }
        } finally {
            if (isMounted.current) {
                setIsLoading(false);
            }
        }
    }, [db]);

    // Filter logic based on input text
    useEffect(() => {
        const currentTodoText: string = todoText.trim().toLowerCase();
        if (currentTodoText) {
            setIsFiltering(true);
            const filtered: Todo[] = todos.filter((todo: Todo) =>
                todo.todo.toLowerCase().includes(currentTodoText)
            );
            if (isMounted.current) {
                setFilteredTodos(filtered);
            }
        } else {
            setIsFiltering(false);
            if (isMounted.current) {
                setFilteredTodos([]);
            }
        }
    }, [todoText, todos]);

    const displayTodos: Todo[] = isFiltering ? filteredTodos : todos;
    const showNoResult: boolean = isFiltering && filteredTodos.length === 0;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 font-sans antialiased">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md my-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Collaborative Todo List</h1>
                {userId && (
                    <p className="text-sm text-gray-500 text-center mb-4">
                        Your User ID: <span className="font-semibold text-blue-600 break-words">{userId}</span>
                    </p>
                )}

                <div className="mb-4">
                    <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                        placeholder={editingId ? "Edit your todo..." : "Add a new todo..."}
                        value={todoText}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTodoText(e.target.value)}
                        onKeyDown={handleKeyPress}
                        disabled={isLoading || !isAuthReady}
                    />
                    {warning && (
                        <p className="text-red-500 text-sm mt-2 transition-opacity duration-300 ease-in-out opacity-100">
                            {warning}
                        </p>
                    )}
                </div>

                {isLoading && (
                    <div className="text-center text-blue-500 mb-4">Loading...</div>
                )}

                <ul className="space-y-3">
                    {showNoResult ? (
                        <li className="text-center text-gray-500 py-4">
                            No result. Create a new one instead!
                        </li>
                    ) : (
                        displayTodos.map((todo: Todo) => (
                            <li
                                key={todo.id}
                                className={`flex items-center justify-between p-3 rounded-lg border border-gray-200 transition-all duration-200 ease-in-out
                                    ${todo.isCompleted ? 'bg-green-50' : 'bg-gray-50'}
                                    hover:shadow-md group`}
                                >
                                    <span className={`flex-1 text-gray-800 ${todo.isCompleted ? 'line-through text-gray-500' : ''}`}>
                                        {todo.todo}
                                    </span>
                                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out">
                                        <button
                                            onClick={() => handleToggleComplete(todo.id, todo.isCompleted)}
                                            className={`px-3 py-1 text-sm rounded-md font-medium
                                                ${todo.isCompleted ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-green-500 text-white hover:bg-green-600'}`}
                                            disabled={isLoading || !isAuthReady}
                                        >
                                            {todo.isCompleted ? 'Incomplete' : 'Complete'}
                                        </button>
                                        <button
                                            onClick={() => handleEditTodo(todo)}
                                            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600"
                                            disabled={isLoading || !isAuthReady}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleRemoveTodo(todo.id)}
                                            className="px-3 py-1 text-sm bg-red-500 text-white rounded-md font-medium hover:bg-red-600"
                                            disabled={isLoading || !isAuthReady}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        );
    };

export default TodoApp;
