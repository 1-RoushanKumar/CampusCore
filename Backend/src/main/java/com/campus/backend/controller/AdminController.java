package com.campus.backend.controller;

import com.campus.backend.dtos.EducatorDto;
import com.campus.backend.dtos.StudentDto;
import com.campus.backend.services.AdminService;
import com.campus.backend.services.ImageUploadService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController()
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ROLE_ADMIN')") // Only accessible by ADMIN role
public class AdminController {

    private final AdminService adminService;
    private final ImageUploadService imageUploadService;

    public AdminController(AdminService adminService, ImageUploadService imageUploadService) {
        this.adminService = adminService;
        this.imageUploadService = imageUploadService;
    }

    // --- Educator Management ---

    @PostMapping(value = "/educators", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<EducatorDto> createEducator(
            @RequestPart("educator") @Valid EducatorDto educatorDto,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage) {
        try {
            if (profileImage != null && !profileImage.isEmpty()) {
                String imageUrl = imageUploadService.uploadFile(profileImage);
                educatorDto.setProfileImageUrl(imageUrl);
            }
            EducatorDto createdEducator = adminService.createEducator(educatorDto);
            return new ResponseEntity<>(createdEducator, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/educators/{id}")
    public ResponseEntity<EducatorDto> getEducatorById(@PathVariable Long id) {
        EducatorDto educator = adminService.getEducatorById(id);
        return ResponseEntity.ok(educator);
    }

    @GetMapping("/educators")
    public ResponseEntity<Page<EducatorDto>> getAllEducators(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<EducatorDto> educators = adminService.getAllEducators(page, size);
        return ResponseEntity.ok(educators);
    }

    @PutMapping(value = "/educators/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<EducatorDto> updateEducator(
            @PathVariable Long id,
            @RequestPart("educator") @Valid EducatorDto educatorDto,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage) {
        try {
            if (profileImage != null && !profileImage.isEmpty()) {
                // First, delete old image if it exists
                EducatorDto existingEducator = adminService.getEducatorById(id);
                if (existingEducator.getProfileImageUrl() != null) {
                    imageUploadService.deleteFile(existingEducator.getProfileImageUrl());
                }
                String imageUrl = imageUploadService.uploadFile(profileImage);
                educatorDto.setProfileImageUrl(imageUrl);
            }
            EducatorDto updatedEducator = adminService.updateEducator(id, educatorDto);
            return ResponseEntity.ok(updatedEducator);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/educators/{id}")
    public ResponseEntity<Void> deleteEducator(@PathVariable Long id) {
        adminService.deleteEducator(id);
        return ResponseEntity.noContent().build();
    }

    // --- Student Management ---

    @PostMapping(value = "/students", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<StudentDto> createStudent(
            @RequestPart("student") @Valid StudentDto studentDto,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage) {
        try {
            if (profileImage != null && !profileImage.isEmpty()) {
                String imageUrl = imageUploadService.uploadFile(profileImage);
                studentDto.setProfileImageUrl(imageUrl);
            }
            StudentDto createdStudent = adminService.createStudent(studentDto);
            return new ResponseEntity<>(createdStudent, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/students/{id}")
    public ResponseEntity<StudentDto> getStudentById(@PathVariable Long id) {
        StudentDto student = adminService.getStudentById(id);
        return ResponseEntity.ok(student);
    }

    @GetMapping("/students")
    public ResponseEntity<Page<StudentDto>> getAllStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<StudentDto> students = adminService.getAllStudents(page, size);
        return ResponseEntity.ok(students);
    }

    @PutMapping(value = "/students/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<StudentDto> updateStudent(
            @PathVariable Long id,
            @RequestPart("student") @Valid StudentDto studentDto,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage) {
        try {
            if (profileImage != null && !profileImage.isEmpty()) {
                // First, delete old image if it exists
                StudentDto existingStudent = adminService.getStudentById(id);
                if (existingStudent.getProfileImageUrl() != null) {
                    imageUploadService.deleteFile(existingStudent.getProfileImageUrl());
                }
                String imageUrl = imageUploadService.uploadFile(profileImage);
                studentDto.setProfileImageUrl(imageUrl);
            }
            StudentDto updatedStudent = adminService.updateStudent(id, studentDto);
            return ResponseEntity.ok(updatedStudent);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/students/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        adminService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
}
