package com.campus.backend.dtos;

import lombok.Data;

@Data
public class ClassDto {
    private Long id;
    private String className;
    private String classCode;
    private String description;
    private Long educatorId; // ID of the educator teaching this class
    private String educatorFirstName; // For displaying
    private String educatorLastName;  // For displaying
}
