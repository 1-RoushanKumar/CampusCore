package com.campus.backend.services;

import com.campus.backend.dtos.FeedbackDto;
import com.campus.backend.entity.*;
import com.campus.backend.dtos.ClassDto;
import com.campus.backend.dtos.EducatorDto;
import com.campus.backend.dtos.StudentDto;
import com.campus.backend.entity.Class; // Ensure this import is correct
import com.campus.backend.exceptions.ResourceNotFoundException;
import com.campus.backend.repositories.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Comparator; // Added for sorting educators by ID in DTO for consistent output

@Service
public class EducatorService {

    private final EducatorRepository educatorRepository;
    private final ClassRepository classRepository; // Still needed for class lookup
    private final StudentRepository studentRepository;
    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    public EducatorService(EducatorRepository educatorRepository, ClassRepository classRepository,
                           StudentRepository studentRepository, FeedbackRepository feedbackRepository,
                           UserRepository userRepository) {
        this.educatorRepository = educatorRepository;
        this.classRepository = classRepository;
        this.studentRepository = studentRepository;
        this.feedbackRepository = feedbackRepository;
        this.userRepository = userRepository;
    }

    public EducatorDto getEducatorProfile(UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Educator educator = educatorRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Educator profile not found"));
        return convertToEducatorDto(educator);
    }

    public List<ClassDto> getClassesTaughtByEducator(UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Educator educator = educatorRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Educator profile not found"));

        // FIX: A class now has many educators. The educator directly holds the classes they teach.
        // Leverage the ManyToMany relationship from the Educator side.
        return educator.getClasses().stream()
                .map(this::convertToClassDto)
                .collect(Collectors.toList());
    }

    public Page<StudentDto> getStudentsInClass(Long classId, int page, int size) {
        Class clazz = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + classId));

        // The ManyToMany relationship between Class and Student means clazz.getStudents()
        // will fetch the associated students.
        List<StudentDto> studentDtos = clazz.getStudents().stream()
                .map(this::convertToStudentDto)
                .collect(Collectors.toList());

        // Manual pagination remains correct for a Set<Student> converted to List
        int start = Math.min((int) page * size, studentDtos.size());
        int end = Math.min((start + size), studentDtos.size());
        List<StudentDto> paginatedStudents = studentDtos.subList(start, end);

        return new PageImpl<>(paginatedStudents, PageRequest.of(page, size), studentDtos.size());
    }


    public StudentDto getStudentDetailForEducator(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        return convertToStudentDto(student);
    }

    @Transactional
    public FeedbackDto createOrUpdateFeedback(Long studentId, Long classId, FeedbackDto feedbackDto, UserDetails userDetails) {
        User educatorUser = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Educator user not found"));
        Educator educator = educatorRepository.findByUser(educatorUser)
                .orElseThrow(() -> new ResourceNotFoundException("Educator profile not found"));

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        Class clazz = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + classId));

        // FIX: Check if the educator actually teaches this class using the ManyToMany relationship
        boolean educatorTeachesClass = clazz.getEducators().stream()
                .anyMatch(e -> e.getId().equals(educator.getId()));
        if (!educatorTeachesClass) {
            throw new IllegalArgumentException("Educator does not teach this class.");
        }

        // Check if the student is actually in this class
        boolean studentInClass = clazz.getStudents().stream()
                .anyMatch(s -> s.getId().equals(student.getId()));
        if (!studentInClass) {
            throw new IllegalArgumentException("Student is not enrolled in this class.");
        }

        Optional<Feedback> existingFeedback = feedbackRepository.findByEducatorAndStudentAndClazz(educator, student, clazz);
        Feedback feedback;

        if (existingFeedback.isPresent()) {
            feedback = existingFeedback.get();
            feedback.setFeedbackText(feedbackDto.getFeedbackText());
            feedback.setRating(feedbackDto.getRating());
        } else {
            feedback = new Feedback();
            feedback.setEducator(educator);
            feedback.setStudent(student);
            feedback.setClazz(clazz);
            feedback.setFeedbackText(feedbackDto.getFeedbackText());
            feedback.setRating(feedbackDto.getRating());
        }

        Feedback savedFeedback = feedbackRepository.save(feedback);
        return convertToFeedbackDto(savedFeedback);
    }

    public List<FeedbackDto> getFeedbackForStudentByEducatorAndClass(Long studentId, Long classId, UserDetails userDetails) {
        User educatorUser = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Educator user not found"));
        Educator educator = educatorRepository.findByUser(educatorUser)
                .orElseThrow(() -> new ResourceNotFoundException("Educator profile not found"));

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        Class clazz = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + classId));

        // FIX: Ensure the educator teaches the class (same check as above)
        boolean educatorTeachesClass = clazz.getEducators().stream()
                .anyMatch(e -> e.getId().equals(educator.getId()));
        if (!educatorTeachesClass) {
            throw new IllegalArgumentException("Educator does not teach this class.");
        }

        boolean studentInClass = clazz.getStudents().stream()
                .anyMatch(s -> s.getId().equals(student.getId()));
        if (!studentInClass) {
            throw new IllegalArgumentException("Student is not enrolled in this class.");
        }

        return feedbackRepository.findByEducatorAndStudentAndClazz(educator, student, clazz)
                .map(List::of) // Wrap in a list if present
                .orElse(List.of()) // Return empty list if not present
                .stream()
                .map(this::convertToFeedbackDto)
                .collect(Collectors.toList());
    }

    // --- Helper methods to convert Entity to DTO ---
    private EducatorDto convertToEducatorDto(Educator educator) {
        EducatorDto dto = new EducatorDto();
        dto.setId(educator.getId());
        dto.setUsername(educator.getUser().getUsername());
        dto.setEmail(educator.getUser().getEmail());
        dto.setFirstName(educator.getFirstName());
        dto.setLastName(educator.getLastName());
        dto.setDateOfBirth(educator.getDateOfBirth());
        dto.setGender(educator.getGender());
        dto.setPhoneNumber(educator.getPhoneNumber());
        dto.setAddress(educator.getAddress());
        dto.setProfileImageUrl(educator.getProfileImageUrl());
        dto.setHireDate(educator.getHireDate());
        dto.setQualification(educator.getQualification());
        dto.setExperienceYears(educator.getExperienceYears());
        dto.setRole(educator.getUser().getRole());
        // Populate classIds for the EducatorDto
        dto.setClassIds(educator.getClasses().stream()
                .map(Class::getId)
                .collect(Collectors.toList()));
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
                    .sorted(Comparator.comparing(Educator::getId)) // Optional: sort for consistent output
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
        // If you want to include enrolled class IDs in StudentDto for educators, add here
        dto.setClassIds(student.getClasses().stream()
                .map(Class::getId)
                .collect(Collectors.toList()));
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