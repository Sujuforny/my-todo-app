package com.seangpengny.my_todo_app.api.todo.web;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class Todo {
    private String id;
    private String todo;
    private Boolean isCompleted;
    private LocalDateTime createdAt;
}
