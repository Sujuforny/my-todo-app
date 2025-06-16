import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Todo, ApiResponse } from '../interface/types';
import Logger from '@/services/logger';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const CONTEXT = process.env.NEXT_PUBLIC_API_CONTEXT;


// Async Thunks for API Calls
export const fetchTodos = createAsyncThunk<Todo[], void>(
    'todos/fetchTodos',
    async () => {
        const response = await axios.get<ApiResponse<Todo[]>>(`${API_BASE_URL}${CONTEXT}todo`);
        return response.data.data;
    }
);

export const createTodo = createAsyncThunk<Todo, string>(
    'todos/createTodo',
    async (todoText) => {
        const response = await axios.post<ApiResponse<Todo>>(`${API_BASE_URL}${CONTEXT}todo`, { todo: todoText });
        return response.data.data;
    }
);

export const deleteTodo = createAsyncThunk<string, string>(
    'todos/deleteTodo',
    async (id) => {
        await axios.delete<ApiResponse<boolean>>(`${API_BASE_URL}${CONTEXT}todo?id=${id}`);
        return id;
    }
);

export const updateTodo = createAsyncThunk<Todo, Todo>(
    'todos/updateTodo',
    async (todoItem) => {
        Logger.instance.log(todoItem);
        await axios.put<ApiResponse<boolean>>(`${API_BASE_URL}${CONTEXT}todo`, todoItem);
        return todoItem;
    }
);

// Define the shape of your Todo slice state
interface TodoState {
    items: Todo[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Todo Slice
const todoSlice = createSlice({
    name: 'todos',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    } as TodoState,

    reducers: {
        addTodoLocal: (state, action: PayloadAction<Todo>) => {
            state.items.push(action.payload);
        },
        deleteTodoLocal: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(todo => todo.id !== action.payload);
        },
        updateTodoLocal: (state, action: PayloadAction<Todo>) => {
            const index = state.items.findIndex(todo => todo.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodos.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchTodos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch todos';
            })
            .addCase(createTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
                state.items.push(action.payload);
            })
            .addCase(deleteTodo.fulfilled, (state, action: PayloadAction<string>) => {
                state.items = state.items.filter(todo => todo.id !== action.payload);
            })
            .addCase(updateTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
                const index = state.items.findIndex(todo => todo.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            });
    },
});

export default todoSlice.reducer;
export const { addTodoLocal, deleteTodoLocal, updateTodoLocal } = todoSlice.actions;