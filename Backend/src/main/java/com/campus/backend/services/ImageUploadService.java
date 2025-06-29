package com.campus.backend.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class ImageUploadService {

    // Add Logger instance
    private static final Logger logger = LoggerFactory.getLogger(ImageUploadService.class);

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String uploadFile(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
            logger.info("Created upload directory: {}", uploadPath);
        }

        // Generate a unique file name
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        logger.info("Uploaded file: {} to {}", file.getOriginalFilename(), filePath);
        return "/uploads/" + fileName; // Return a URL path
    }

    public void deleteFile(String filePath) {
        if (filePath == null || filePath.isEmpty()) {
            logger.warn("Attempted to delete file with null or empty path.");
            return;
        }
        try {
            // Assuming filePath is like "/uploads/unique_filename.jpg"
            String actualFileName = filePath.substring(filePath.lastIndexOf("/") + 1);
            Path fileToDelete = Paths.get(uploadDir).resolve(actualFileName);

            if (Files.exists(fileToDelete)) {
                Files.delete(fileToDelete);
                logger.info("Successfully deleted file: {}", fileToDelete);
            } else {
                logger.warn("Attempted to delete non-existent file: {}", fileToDelete);
            }
        } catch (IOException e) {
            // Log the exception, don't rethrow if it's not critical for main operation
            // Replaced System.err.println
            logger.error("Could not delete file: {}. Error: {}", filePath, e.getMessage(), e);
        }
    }

    public Path getFile(String filename) {
        return Paths.get(uploadDir).resolve(filename);
    }
}