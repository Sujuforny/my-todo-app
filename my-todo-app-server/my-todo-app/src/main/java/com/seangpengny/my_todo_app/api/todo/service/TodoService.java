package com.seangpengny.my_todo_app.api.todo.service;

import com.seangpengny.my_todo_app.api.todo.web.Todo;
import com.seangpengny.my_todo_app.api.todo.web.TodoDto;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@Service
public interface TodoService {

    Todo createTodo(TodoDto todoDto);
    Boolean updateTodoById(TodoDto todoDto);
    List<Todo> findAllTodo();
    Todo findTodoById(String id);
    Boolean deleteTodoById(String id);
    TodoDto updateStatusTodo(Boolean status);
}
