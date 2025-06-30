package com.campus.backend.dtos;
import com.campus.backend.entity.enums.Role;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class StudentDto {
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
    private LocalDate enrollmentDate;
    private String grade;
    private Role role = Role.ROLE_STUDENT;
    private List<Long> classIds;
}
