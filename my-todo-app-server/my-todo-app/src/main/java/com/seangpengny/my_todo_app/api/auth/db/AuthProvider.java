package com.seangpengny.my_todo_app.api.auth.db;

import org.apache.ibatis.jdbc.SQL;

public class AuthProvider {
    public String registerSql(){
        return new SQL() {{
            INSERT_INTO("users");
            VALUES("username","#{user.username}");
            VALUES("email","#{user.email}");
            VALUES("password","#{user.password}");
//            VALUES("is_verified","#{user.isVerified}");
        }}.toString();
    }
    public String createUserRoles(){
        return new SQL() {{
            INSERT_INTO("user_roles");
            VALUES("user_id","#{userId}");
            VALUES("role_id","#{roleId}");
        }}.toString();
    }

    public String buildLoadUserByUsernameSql() {
        return new SQL() {{
            SELECT("*");
            FROM("users");
            WHERE("email = #{email} OR username = #{email}");
        }}.toString();
    }

    public String loadUserRolesSql(){
        return new SQL(){{
            SELECT("r.id, r.role_name");
            FROM("roles AS r");
            INNER_JOIN("user_roles AS ur ON ur.role_id = r.id");
            WHERE("ur.user_id=#{id}");
        }}.toString();
    }
}
