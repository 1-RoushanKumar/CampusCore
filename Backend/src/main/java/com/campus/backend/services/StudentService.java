package com.campus.backend.services;

import com.campus.backend.dtos.ClassDto;
import com.campus.backend.dtos.FeedbackDto;
import com.campus.backend.dtos.StudentDto;
import com.campus.backend.entity.Feedback;
import com.campus.backend.entity.Student;
import com.campus.backend.entity.User;
import com.campus.backend.exceptions.ResourceNotFoundException;
import com.campus.backend.repositories.FeedbackRepository;
import com.campus.backend.repositories.StudentRepository;
import com.campus.backend.repositories.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import com.campus.backend.entity.Class; // Ensure this is imported correctly

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final FeedbackRepository feedbackRepository;

    public StudentService(StudentRepository studentRepository, UserRepository userRepository,
                          FeedbackRepository feedbackRepository) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.feedbackRepository = feedbackRepository;
    }

    public StudentDto getStudentProfile(UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return convertToStudentDto(student);
    }

    public List<ClassDto> getEnrolledClasses(UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        return student.getClasses().stream()
                .map(this::convertToClassDto)
                .collect(Collectors.toList());
    }

    public List<FeedbackDto> getFeedbackForStudent(UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        List<Feedback> feedbacks = feedbackRepository.findByStudent(student);
        return feedbacks.stream()
                .map(this::convertToFeedbackDto)
                .collect(Collectors.toList());
    }

    // --- Helper methods to convert Entity to DTO ---
    private StudentDto convertToStudentDto(Student student) {
        StudentDto dto = new StudentDto();
        dto.setId(student.getId());
        dto.setUsername(student.getUser().getUsername());
        dto.setEmail(student.getUser().getEmail());
        dto.setFirstName(student.getFirstName());
        dto.setLastName(student.getLastName());
        dto.setDateOfBirth(student.getDateOfBirth());
        dto.setGender(student.getGender());
        dto.setPhoneNumber(student.getPhoneNumber());
        dto.setAddress(student.getAddress());
        dto.setProfileImageUrl(student.getProfileImageUrl());
        dto.setEnrollmentDate(student.getEnrollmentDate());
        dto.setGrade(student.getGrade());
        dto.setRole(student.getUser().getRole());
        // For a student DTO, if you also want enrolled class IDs, you can add it here.
        // dto.setClassIds(student.getClasses().stream().map(Class::getId).collect(Collectors.toList()));
        return dto;
    }

    private ClassDto convertToClassDto(Class clazz) {
        ClassDto dto = new ClassDto();
        dto.setId(clazz.getId());
        dto.setClassName(clazz.getClassName());
        dto.setClassCode(clazz.getClassCode());
        dto.setDescription(clazz.getDescription());

        // FIX: A class now has multiple educators (Set<Educator>)
        // Collect educator details into a list of EducatorInfo DTOs
        if (clazz.getEducators() != null && !clazz.getEducators().isEmpty()) {
            dto.setEducators(clazz.getEducators().stream()
                    .map(educator -> {
                        ClassDto.EducatorInfo educatorInfo = new ClassDto.EducatorInfo();
                        educatorInfo.setId(educator.getId());
                        educatorInfo.setFirstName(educator.getFirstName());
                        educatorInfo.setLastName(educator.getLastName());
                        return educatorInfo;
                    })
                    .collect(Collectors.toList()));
        } else {
            dto.setEducators(List.of()); // Ensure it's not null if no educators
        }
        return dto;
    }

    private FeedbackDto convertToFeedbackDto(Feedback feedback) {
        FeedbackDto dto = new FeedbackDto();
        dto.setId(feedback.getId());
        dto.setEducatorId(feedback.getEducator().getId());
        dto.setEducatorFirstName(feedback.getEducator().getFirstName());
        dto.setEducatorLastName(feedback.getEducator().getLastName());
        dto.setStudentId(feedback.getStudent().getId());
        dto.setStudentFirstName(feedback.getStudent().getFirstName());
        dto.setStudentLastName(feedback.getStudent().getLastName());
        dto.setClassId(feedback.getClazz().getId());
        dto.setClassName(feedback.getClazz().getClassName());
        dto.setFeedbackText(feedback.getFeedbackText());
        dto.setRating(feedback.getRating());
        dto.setFeedbackDate(feedback.getFeedbackDate());
        return dto;
    }
}