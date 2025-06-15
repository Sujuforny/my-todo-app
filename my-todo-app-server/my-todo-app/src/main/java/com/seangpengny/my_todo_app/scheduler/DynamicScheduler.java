package com.seangpengny.my_todo_app.scheduler;

import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ConcurrentTaskScheduler;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Date;
import java.util.concurrent.ScheduledFuture;

@Component
public class DynamicScheduler {

    private final TaskScheduler taskScheduler = new ConcurrentTaskScheduler();
    private ScheduledFuture<?> future;

    public void scheduleAt(String time) {
        if (future != null) {
            future.cancel(false);  // Cancel previous task if any
        }

        LocalTime localTime = LocalTime.parse(time);  // e.g. "15:30"
        LocalDateTime dateTime = LocalDateTime.of(LocalDate.now(), localTime);
        if (dateTime.isBefore(LocalDateTime.now())) {
            dateTime = dateTime.plusDays(1);  // Schedule for tomorrow if time has passed
        }

        long delay = Duration.between(LocalDateTime.now(), dateTime).toMillis();

        future = taskScheduler.schedule(this::runTask, new Date(System.currentTimeMillis() + delay));
    }

    private void runTask() {
        System.out.println("Running dynamic task at " + new Date());
        // your logic here
    }
}
