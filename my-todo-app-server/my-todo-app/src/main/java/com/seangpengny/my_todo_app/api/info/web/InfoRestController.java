package com.seangpengny.my_todo_app.api.info.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/info")
public class InfoRestController {
    @GetMapping
    public String getInfo(){
        return "up";
    }
}
