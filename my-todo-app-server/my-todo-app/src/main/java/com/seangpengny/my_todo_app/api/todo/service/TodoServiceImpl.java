package com.seangpengny.my_todo_app.api.todo.service;

import com.seangpengny.my_todo_app.api.todo.db.TodoMapper;
import com.seangpengny.my_todo_app.api.todo.web.Todo;
import com.seangpengny.my_todo_app.api.todo.web.TodoDto;
import com.seangpengny.my_todo_app.exception.custome.InvalidTodoIdException;
import com.seangpengny.my_todo_app.exception.custome.TodoNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class TodoServiceImpl implements TodoService{
    private final TodoMapper todoMapper;
    @Override
    public Todo createTodo(TodoDto todoDto) {
        UUID uuid = UUID.randomUUID();
        Todo todo = new Todo();
        todo.setTodo(todoDto.todo());
        todo.setIsCompleted(true);
        todo.setId(String.valueOf(uuid));
        todo.setCreatedAt(LocalDateTime.now());
        todoMapper.register(todo,uuid);
        return todo;
    }

    @Override
    public Boolean updateTodoById(TodoDto todoDto) {

        try {
            Todo todo = todoMapper.search(UUID.fromString(todoDto.id()));
            Todo data = new Todo();
            UUID uuid = UUID.fromString(todoDto.id());
            if(todo ==null){
                throw new TodoNotFoundException(todoDto.id());
            }else {
                data.setTodo(todoDto.todo());
                data.setIsCompleted(todoDto.isCompleted());
            }
                return todoMapper.update(data,uuid);
        } catch (IllegalArgumentException e) {
            throw new InvalidTodoIdException(todoDto.id());
        }
    }

    @Override
    public List<Todo> findAllTodo() {
        return todoMapper.findAll();
    }

    @Override
    public Todo findTodoById(String id) {
        try{
            UUID uuid = UUID.fromString(id);
            Todo todo = todoMapper.search(uuid);
            if(todo ==null){
                throw new TodoNotFoundException(id);
            }else {
                return todoMapper.search(uuid);
            }
        }catch (IllegalArgumentException e) {
            throw new InvalidTodoIdException(id);
        }
    }

    @Override
    public Boolean deleteTodoById(String id) {
        this.findTodoById(id);
        try {
            return todoMapper.delete(UUID.fromString(id));
        }catch (IllegalArgumentException e) {
            throw new InvalidTodoIdException(id);
        }
    }

    @Override
    public TodoDto updateStatusTodo(Boolean status) {
        return null;
    }
}
