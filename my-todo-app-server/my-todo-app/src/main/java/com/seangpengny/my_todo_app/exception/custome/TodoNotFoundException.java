package com.seangpengny.my_todo_app.exception.custome;

public class TodoNotFoundException extends RuntimeException {
    public TodoNotFoundException(String id) {
        super("Todo with ID " + id + " not found.");
    }
}