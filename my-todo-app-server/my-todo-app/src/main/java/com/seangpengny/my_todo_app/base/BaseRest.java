package com.seangpengny.my_todo_app.base;

import lombok.Builder;

import java.time.LocalDateTime;
@Builder
public record BaseRest<T>(Boolean status,
                       Integer code,
                       String message,
                       LocalDateTime timestamp,
                       T data) {
}
