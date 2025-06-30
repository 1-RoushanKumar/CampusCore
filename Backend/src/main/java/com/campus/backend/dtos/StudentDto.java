package com.campus.backend.dtos;
import com.campus.backend.entity.enums.Role;
import lombok.Data;
import java.time.LocalDate;
// import java.util.List; // No longer a list of class IDs, but a single class ID

@Data
public class StudentDto {
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
    private LocalDate enrollmentDate;
    private String grade;
    private Role role = Role.ROLE_STUDENT;
    // --- CHANGE STARTS HERE ---
    private Long classId; // Single class ID
    // --- CHANGE ENDS HERE ---
}