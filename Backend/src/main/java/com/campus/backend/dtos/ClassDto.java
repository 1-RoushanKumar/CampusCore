package com.campus.backend.dtos;

import lombok.Data;

import java.util.List; // Import List

@Data
public class ClassDto {
    private Long id;
    private String className;
    private String classCode;
    private String description;

    // Change from single educator to a list of educators for ManyToMany relationship
    private List<EducatorInfo> educators; // New field

    // Inner class to hold minimal educator info for the DTO
    @Data
    public static class EducatorInfo {
        private Long id;
        private String firstName;
        private String lastName;
    }
}
