package com.makemytrip.makemytrip.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.beans.factory.annotation.Value;
import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${upload.dir:uploads}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        // Build absolute path from project root
        String absolutePath = System.getProperty("user.dir")
                + File.separator
                + uploadDir;

        // Windows-compatible file URL format
        String fileUrl = "file:///" + absolutePath.replace("\\", "/") + "/";

        // Debug log
        System.out.println("========== WEBCONFIG ==========");
        System.out.println("Upload dir: " + uploadDir);
        System.out.println("Absolute path: " + absolutePath);
        System.out.println("Serving uploads from: " + fileUrl);
        System.out.println("================================");

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(fileUrl);
    }
}


