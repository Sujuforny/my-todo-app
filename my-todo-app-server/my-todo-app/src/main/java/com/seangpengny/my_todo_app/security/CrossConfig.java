package com.seangpengny.my_todo_app.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CrossConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Allow cross-origin requests from any domain
        registry.addMapping("/**")
                .allowedOrigins("*")  // specify allowed origins
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // specify allowed methods
                .allowedHeaders("*");  // specify allowed headers
//                .allowCredentials(true)  // allow credentials (cookies, authorization headers)
//                .maxAge(3600);  // cache pre-flight response for 1 hour
    }
}
