package com.campus.backend.dtos;

import com.campus.backend.entity.enums.Role;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EducatorDto {
    private Long id;
    private String username; // From User entity
    private String email;    // From User entity
    private String password; // For creation/update
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
    private Role role = Role.ROLE_EDUCATOR; // Default role
}
