package com.seangpengny.my_todo_app.api.user;

import com.seangpengny.my_todo_app.api.role.Role;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class User {
    private Integer id;
    private String username;
    private String email;
    private String password;

    private List<Role> roleIds;
}
