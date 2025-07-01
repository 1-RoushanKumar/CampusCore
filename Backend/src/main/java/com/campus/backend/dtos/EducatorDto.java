package com.campus.backend.dtos;

import com.campus.backend.entity.enums.Role;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class EducatorDto {
    private Long id;
    private String username;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String gender;
    private String phoneNumber;
    private String address;
    private String profileImageUrl;
    private LocalDate hireDate;
    private String qualification;
    private Integer experienceYears;
    private Role role = Role.ROLE_EDUCATOR;
    private List<Long> classIds;
    // Remains Long, as an Educator still teaches only ONE Subject
    private Long subjectId;
    // Add subject name for display in DTO
    private String subjectName;
}