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

    @GetMapping("/enrolled-classes")
    public ResponseEntity<List<ClassDto>> getMyEnrolledClasses(@AuthenticationPrincipal UserDetails userDetails) {
        List<ClassDto> classes = studentService.getEnrolledClasses(userDetails);
        return ResponseEntity.ok(classes);
    }

    @GetMapping("/feedback")
    public ResponseEntity<List<FeedbackDto>> getMyFeedback(@AuthenticationPrincipal UserDetails userDetails) {
        List<FeedbackDto> feedback = studentService.getFeedbackForStudent(userDetails);
        return ResponseEntity.ok(feedback);
    }
}
