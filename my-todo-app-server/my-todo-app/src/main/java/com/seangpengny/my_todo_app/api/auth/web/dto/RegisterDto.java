package com.seangpengny.my_todo_app.api.auth.web.dto;


import java.util.List;

public record RegisterDto (
        String emailOrUsername,
        String password,
        String confirmedPassword,
        List<Integer>roles
){
}
