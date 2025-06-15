package com.seangpengny.my_todo_app.security.custom_user;

import com.seangpengny.my_todo_app.api.auth.db.AuthMapper;
import com.seangpengny.my_todo_app.api.user.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserDetailsServiceImpl implements UserDetailsService {
    private final AuthMapper authMapper;
    @Override
    public UserDetails loadUserByUsername(String username) {
        User user = authMapper.loadUserByUsername(username).orElseThrow(()
        -> new UsernameNotFoundException("User is not valid"));
        log.info("loadUserByUsername : {}",user);
        CustomUserDetails customUserDetails = new CustomUserDetails();
        customUserDetails.setUser(user);
        return customUserDetails;
    }
}
