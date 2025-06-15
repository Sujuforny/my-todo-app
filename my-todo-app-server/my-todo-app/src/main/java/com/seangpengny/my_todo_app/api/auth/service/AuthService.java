package com.seangpengny.my_todo_app.api.auth.service;

import com.seangpengny.my_todo_app.api.auth.web.dto.AuthDto;
import com.seangpengny.my_todo_app.api.auth.web.dto.LoginDto;
import com.seangpengny.my_todo_app.api.auth.web.dto.RefreshTokenDto;
import com.seangpengny.my_todo_app.api.auth.web.dto.RegisterDto;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {
    void register(RegisterDto registerDto);
    AuthDto login (LoginDto loginDto);
    AuthDto refreshToken (RefreshTokenDto token);
}
