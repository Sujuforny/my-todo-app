package com.seangpengny.my_todo_app.api.todo.web;

import com.seangpengny.my_todo_app.api.todo.service.TodoService;
import com.seangpengny.my_todo_app.base.BaseRest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/todo")
public class TodoRestController {

    private final TodoService todoService;
    private final SimpMessagingTemplate messagingTemplate;

    @GetMapping
    public BaseRest<?> findAllTodo(){
        List<Todo> todoDtoList = todoService.findAllTodo();
        return BaseRest.builder()
                .status(true)
                .code(HttpStatus.OK.value())
                .message("Todo have been found!")
                .timestamp(LocalDateTime.now())
                .data(todoDtoList)
                .build();
    }

    @GetMapping("/find")
    public BaseRest<?> findTodoById(@RequestParam String id){
        Todo todo = todoService.findTodoById(id);
        return BaseRest.builder()
                .status(true)
                .code(HttpStatus.OK.value())
                .message("Todo have been found!")
                .timestamp(LocalDateTime.now())
                .data(todo)
                .build();
    }
    @PostMapping
    public BaseRest<?> createTodo(@RequestBody TodoDto todoDto){
        log.info("todo :{}",todoDto);
        Todo todo = todoService.createTodo(todoDto);
        return BaseRest.builder()
                .status(true)
                .code(HttpStatus.OK.value())
                .message("todo created!!!")
                .timestamp(LocalDateTime.now())
                .data(todo)
                .build();
    }
    @PutMapping
    public BaseRest<?> updateTodoById(@RequestBody TodoDto todoDto){
        Boolean status = todoService.updateTodoById(todoDto);
        messagingTemplate.convertAndSend("/update/public","hello");
        return BaseRest.builder()
                .status(true)
                .code(HttpStatus.OK.value())
                .message("todo Updated!!!")
                .timestamp(LocalDateTime.now())
                .data(status)
                .build();
    }
    @DeleteMapping
    public BaseRest<?> deleteTodoById(@RequestParam String id){
        Boolean status = todoService.deleteTodoById(id);
        return BaseRest.builder()
                .status(true)
                .code(HttpStatus.OK.value())
                .message("todo deleted!!!")
                .timestamp(LocalDateTime.now())
                .data(status)
                .build();
    }

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload Object payload) {
        log.info("user send :{}",payload);
        messagingTemplate.convertAndSend("/update/public","update");
        
    }
}
