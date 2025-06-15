package com.seangpengny.my_todo_app.api.auth.web.dto;

public record AuthDto( String tokenType,String accessToken,String refreshToken) {
}
