package com.seangpengny.my_todo_app.exception;


import com.seangpengny.my_todo_app.base.BaseError;
import com.seangpengny.my_todo_app.exception.custome.InvalidTodoIdException;
import com.seangpengny.my_todo_app.exception.custome.TodoNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class ApiException {

    @ExceptionHandler(TodoNotFoundException.class)
    public BaseError<?> handleTodoNotFound(TodoNotFoundException e){
        return BaseError.builder()
                .status(false)
                .code(404)
                .timestamp(LocalDateTime.now())
                .message(e.getMessage())
                .errors("todo not found")
                .build();
    }

    @ExceptionHandler(InvalidTodoIdException.class)
    public BaseError<?> handleTodoIdException(InvalidTodoIdException e){
        return BaseError.builder()
                .status(false)
                .code(404)
                .timestamp(LocalDateTime.now())
                .message(e.getMessage())
                .errors(e.getMessage())
                .build();
    }
}

