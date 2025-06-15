package com.seangpengny.my_todo_app.api.todo.web;


import java.util.UUID;

public record TodoDto(String id, String todo, Boolean isCompleted) {
}
