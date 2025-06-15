package com.seangpengny.my_todo_app.api.auth.db;

import com.seangpengny.my_todo_app.api.role.Role;
import com.seangpengny.my_todo_app.api.user.User;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@Mapper
public interface AuthMapper {
    @InsertProvider(type = AuthProvider.class, method = "registerSql")
    @Options(useGeneratedKeys = true, keyColumn = "id", keyProperty = "id")
    Boolean register(@Param("user") User user);

    @InsertProvider(type = AuthProvider.class, method = "createUserRoles")
    void createUserRoles(@Param("userId") Integer userId,@Param("roleId") Integer roleId);

    @SelectProvider(type = AuthProvider.class, method = "buildLoadUserByUsernameSql")
    @Results(id = "authResultMap", value = {
            @Result(column = "id" ,property = "roleIds" ,many = @Many(select = "loadUserRole"))
    })
    Optional<User> loadUserByUsername(@Param("email") String email);




    @SelectProvider(type = AuthProvider.class, method = "loadUserRolesSql")
    @Results({
            @Result(column = "role_name", property = "roleName")
    })
    List<Role> loadUserRole (@Param("id") Integer id);
}
