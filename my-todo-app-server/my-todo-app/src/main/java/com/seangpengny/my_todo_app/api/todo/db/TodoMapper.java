package com.seangpengny.my_todo_app.api.todo.db;

import com.seangpengny.my_todo_app.api.todo.web.Todo;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;


@Repository
@Mapper
public interface TodoMapper {
    @InsertProvider(type = TodoProvider.class, method = "registerSql")
    Boolean register(@Param("todo") Todo todo,UUID id);

    @UpdateProvider(type = TodoProvider.class, method = "updateSql")
    Boolean update(@Param("todo") Todo todo,UUID id);

    @DeleteProvider(type = TodoProvider.class, method = "deleteSql")
    Boolean delete(@Param("id") UUID id);

    @SelectProvider(type = TodoProvider.class, method = "searchSql")
    Todo search(@Param("id") UUID id);

    @SelectProvider(type = TodoProvider.class, method = "findAll")
    List<Todo> findAll();
}
