package com.seangpengny.my_todo_app.api.todo.db;

import org.apache.ibatis.jdbc.SQL;

public class TodoProvider {
    public String registerSql(){
        return new SQL() {{
            INSERT_INTO("todos");
            VALUES("id","#{id}");
            VALUES("todo","#{todo.todo}");
            VALUES("isCompleted","#{todo.isCompleted}");
        }}.toString();
    }

    public String updateSql() {
        return new SQL() {{
            UPDATE("todos");
            SET("todo = #{todo.todo}");
            SET("isCompleted = #{todo.isCompleted}");
            WHERE("id = #{id}");
        }}.toString();
    }

    public String deleteSql() {
        return new SQL() {{
            DELETE_FROM("todos");
            WHERE("id = #{id}");
        }}.toString();
    }

    public String searchSql() {
        return new SQL() {{
            SELECT("*");
            FROM("todos");
            WHERE("id = #{id}");
        }}.toString();
    }

    public String findAll() {
        return new SQL() {{
            SELECT("*");
            FROM("todos");
//            WHERE("id = #{id}");
        }}.toString();
    }
}
