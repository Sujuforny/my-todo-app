package com.seangpengny.my_todo_app.api.schedule;

import com.seangpengny.my_todo_app.scheduler.DynamicScheduler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class ScheduleController {

    @Autowired
    private DynamicScheduler scheduler;

    @PostMapping("/schedule")
    public String scheduleTask(@RequestParam("time") String time) {
        scheduler.scheduleAt(time);  // e.g. "15:30"
        return "Task scheduled at " + time;
    }
}

