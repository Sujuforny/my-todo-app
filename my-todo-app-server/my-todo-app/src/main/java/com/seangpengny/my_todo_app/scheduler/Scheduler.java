package com.seangpengny.my_todo_app.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Date;
@Component
public class Scheduler {
//    @Scheduled(fixedRate = 5000) // Runs every 5 seconds
    @Scheduled(cron = "0 29 15 * * ?") // 3:30 PM every day
    public void runTask() {
        System.out.println("Running task at " + new Date());
    }
}
