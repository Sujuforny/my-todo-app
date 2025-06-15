package com.seangpengny.my_todo_app.exception.custome;

public class InvalidTodoIdException extends RuntimeException {
    public InvalidTodoIdException(String id) {
        super("Invalid UUID format for todo ID: " + id);
    }
}
