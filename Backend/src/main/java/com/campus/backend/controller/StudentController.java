package com.campus.backend.controller;

import com.campus.backend.dtos.ClassDto;
import com.campus.backend.dtos.FeedbackDto;
import com.campus.backend.dtos.StudentDto;
import com.campus.backend.services.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional; // Import Optional

@RestController
@RequestMapping("/api/student")
@PreAuthorize("hasRole('ROLE_STUDENT')") // Only accessible by STUDENT role
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/profile")
    public ResponseEntity<StudentDto> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        StudentDto profile = studentService.getStudentProfile(userDetails);
        return ResponseEntity.ok(profile);
    }

    // --- MODIFIED ENDPOINT ---
    @GetMapping("/enrolled-class") // Renamed endpoint to reflect singular class
    public ResponseEntity<ClassDto> getMyEnrolledClass(@AuthenticationPrincipal UserDetails userDetails) {
        Optional<ClassDto> classDto = studentService.getEnrolledClass(userDetails); // Call the new method
        // Handle the Optional: if present, return OK; otherwise, return 404 Not Found or 204 No Content
        return classDto.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build()); // Or .orElse(ResponseEntity.noContent().build());
    }
    // --- END MODIFIED ENDPOINT ---

    @GetMapping("/feedback")
    public ResponseEntity<List<FeedbackDto>> getMyFeedback(@AuthenticationPrincipal UserDetails userDetails) {
        List<FeedbackDto> feedback = studentService.getFeedbackForStudent(userDetails);
        return ResponseEntity.ok(feedback);
    }
}