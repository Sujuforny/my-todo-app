'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchTodos, createTodo, deleteTodo, updateTodo, addTodoLocal, updateTodoLocal, deleteTodoLocal} from '../../store/todoSlice';
import { Todo } from '../../interface/types';
import React, { KeyboardEvent } from 'react';
import { WebSocketManager } from '@/store/useWebSocket';


export default function HomePage() {
    const dispatch = useAppDispatch();
    const todos: Todo[] = useAppSelector((state) => state.todos.items);
    const todoStatus = useAppSelector((state) => state.todos.status);
    const error = useAppSelector((state) => state.todos.error);

    const [newTodoText, setNewTodoText] = useState<string>('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [warning, setWarning] = useState<string>('');
    const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
    const [isFiltering, setIsFiltering] = useState<boolean>(false);

    const wsManagerRef = useRef<WebSocketManager | null>(null);


    const isRefreshRef = useRef(true);


      useEffect(() => {
        const manager = new WebSocketManager('http://localhost:7777/ws', (receivedMessage) => {
            if(isRefreshRef.current){
                const {type,data}=receivedMessage;
                switch (type) {
                    case "create":
                            dispatch(addTodoLocal(data));
                        break;
                    case "update":
                            dispatch(updateTodoLocal(data));
                        break;
                    case "delete":
                            dispatch(deleteTodoLocal(data.id));
                        break;
                    default:
                        break;
                }
            }
           isRefreshRef.current = true;
        });

        wsManagerRef.current = manager;
        manager.connect();
    
        return () => {
          manager.disconnect();
        };
      },[]);

    useEffect(() => {
        if (todoStatus === 'idle') {
            dispatch(fetchTodos());
        }
    }, [todoStatus, dispatch]);

    // Function to show a temporary warning message
    const showWarning = (message: string) => {
        setWarning(message);
        const timer = setTimeout(() => {
            setWarning('');
        }, 3000);
        return () => clearTimeout(timer);
    };

    const handleAddOrUpdateTodo = () => {
        isRefreshRef.current = false;
        const trimmedText: string = newTodoText.trim();
        if (!trimmedText) {
            showWarning('Todo item cannot be empty!');
            return;
        }

        // Check for duplicates only when adding a new todo
        if (editingId === null && todos.some((todo: Todo) => todo.todo.toLowerCase() === trimmedText.toLowerCase())) {
            showWarning('This todo already exists!');
            return;
        }

        if (editingId) {
            // If editing, dispatch update
            const todo = todos.find((todo: Todo) => todo.id === editingId)
            dispatch(updateTodo({ id: editingId, todo: trimmedText, isCompleted: todo?.isCompleted }));
            setEditingId(null);
        } else {
            // If not editing, dispatch create
            dispatch(createTodo(trimmedText));
        }
        setNewTodoText('');
        setWarning('');
    };

    const handleDeleteTodo = (id: string) => {
        isRefreshRef.current = false;
        dispatch(deleteTodo(id));
    };

    const handleEditTodo = (todo: Todo) => {
        setNewTodoText(todo.todo);
        setEditingId(todo.id);
        setWarning('');
    };

    const handleToggleComplete = (todoItem: Todo) => {
        dispatch(updateTodo({ ...todoItem, isCompleted: !todoItem.isCompleted }));
    };

    // Handle key press in the input field
    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAddOrUpdateTodo();
        }
    };

    // Filter logic based on input text
    useEffect(() => {
        const currentTodoText: string = newTodoText.trim().toLowerCase();
        if (currentTodoText) {
            setIsFiltering(true);
            const filtered: Todo[] = todos.filter((todo: Todo) =>
                todo.todo.toLowerCase().includes(currentTodoText)
            );
            setFilteredTodos(filtered);
        } else {
            setIsFiltering(false);
            setFilteredTodos([]);
        }
    }, [newTodoText, todos]); // Re-run when input text or todos change

    const displayTodos: Todo[] = isFiltering ? filteredTodos : todos;
    const showNoResult: boolean = isFiltering && filteredTodos.length === 0;

    if (todoStatus === 'loading') {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 font-sans antialiased">
                <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md my-8 text-center text-blue-500">
                    Loading todos...
                </div>
            </div>
        );
    }

    if (todoStatus === 'failed') {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 font-sans antialiased">
                <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md my-8 text-center text-red-500">
                    Error: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 font-sans antialiased">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md my-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">My Todos</h1>

                <div className="mb-4 flex items-center">
                    <input
                        type="text"
                        value={newTodoText}
                        onChange={(e) => setNewTodoText(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder={editingId ? "Edit your todo..." : "Add a new todo..."}
                        className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 mr-2"
                    />
                    <button
                        onClick={handleAddOrUpdateTodo}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 text-sm font-medium"
                    >
                        {editingId ? 'Update Todo' : 'Add Todo'}
                    </button>
                </div>
                {warning && (
                    <p className="text-red-500 text-sm mt-2 transition-opacity duration-300 ease-in-out opacity-100">
                        {warning}
                    </p>
                )}

                <ul className="space-y-3 mt-4">
                    {showNoResult ? (
                        <li className="text-center text-gray-500 py-4">
                            No result. Create a new one instead!
                        </li>
                    ) : (
                        displayTodos.map((todo) => (
                            <li
                                key={todo.id}
                                className={`flex items-center justify-between p-3 rounded-lg border border-gray-200 transition-all duration-200 ease-in-out
                  ${todo.isCompleted ? 'bg-green-50' : 'bg-gray-50'}
                  hover:shadow-md group`}
                            >
                                <div className="flex items-center flex-grow">
                                    <input
                                        type="checkbox"
                                        checked={todo.isCompleted}
                                        onChange={() => handleToggleComplete(todo)}
                                        className="mr-3 h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className={`flex-1 text-gray-800 ${todo.isCompleted ? 'line-through text-gray-500' : ''}`}>
                                        {todo.todo}
                                    </span>
                                </div>
                                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out">
                                    <button
                                        onClick={() => handleEditTodo(todo)}
                                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteTodo(todo.id)}
                                        className="px-3 py-1 text-sm bg-red-500 text-white rounded-md font-medium hover:bg-red-600"
                                    >
                                        Remove
                                    </button>
                                    <button
                                        onClick={() => handleToggleComplete(todo)}
                                        className={`px-3 py-1 text-sm rounded-md font-medium ${todo.isCompleted ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-green-500 text-white hover:bg-green-600'}`}
                                    >
                                        {todo.isCompleted ? 'Incomplete' : 'Complete'}
                                    </button>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
                {todos.length === 0 && todoStatus === 'succeeded' && !isFiltering && (
                    <p className="text-center text-gray-500 py-4">No todos yet. Add one!</p>
                )}
            </div>
        </div>
    );
}