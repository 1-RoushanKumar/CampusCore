package com.campus.backend.services;

import com.campus.backend.dtos.EducatorDto;
import com.campus.backend.dtos.StudentDto;
import com.campus.backend.entity.Educator;
import com.campus.backend.entity.Student;
import com.campus.backend.entity.User;
import com.campus.backend.entity.enums.Role;
import com.campus.backend.exceptions.ResourceNotFoundException;
import com.campus.backend.repositories.EducatorRepository;
import com.campus.backend.repositories.StudentRepository;
import com.campus.backend.repositories.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final EducatorRepository educatorRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final ImageUploadService imageUploadService; // Inject image service

    public AdminService(UserRepository userRepository, EducatorRepository educatorRepository,
                        StudentRepository studentRepository, PasswordEncoder passwordEncoder,
                        ImageUploadService imageUploadService) {
        this.userRepository = userRepository;
        this.educatorRepository = educatorRepository;
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.imageUploadService = imageUploadService;
    }

    // --- Educator Management ---

    @Transactional
    public EducatorDto createEducator(EducatorDto educatorDto) {
        if (userRepository.existsByUsername(educatorDto.getUsername())) {
            throw new IllegalArgumentException("Username already exists!");
        }
        if (userRepository.existsByEmail(educatorDto.getEmail())) {
            throw new IllegalArgumentException("Email already exists!");
        }

        User user = new User();
        user.setUsername(educatorDto.getUsername());
        user.setEmail(educatorDto.getEmail());
        user.setPassword(passwordEncoder.encode(educatorDto.getPassword()));
        user.setRole(Role.ROLE_EDUCATOR);
        User savedUser = userRepository.save(user);

        Educator educator = new Educator();
        educator.setUser(savedUser);
        educator.setFirstName(educatorDto.getFirstName());
        educator.setLastName(educatorDto.getLastName());
        educator.setDateOfBirth(educatorDto.getDateOfBirth());
        educator.setGender(educatorDto.getGender());
        educator.setPhoneNumber(educatorDto.getPhoneNumber());
        educator.setAddress(educatorDto.getAddress());
        educator.setHireDate(educatorDto.getHireDate());
        educator.setQualification(educatorDto.getQualification());
        educator.setExperienceYears(educatorDto.getExperienceYears());

        if (educatorDto.getProfileImageUrl() != null && !educatorDto.getProfileImageUrl().isEmpty()) {
            educator.setProfileImageUrl(educatorDto.getProfileImageUrl()); // Assume URL is already handled by image service
        }

        Educator savedEducator = educatorRepository.save(educator);
        return convertToEducatorDto(savedEducator);
    }

    public EducatorDto getEducatorById(Long id) {
        Educator educator = educatorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Educator not found with id: " + id));
        return convertToEducatorDto(educator);
    }

    public Page<EducatorDto> getAllEducators(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Educator> educatorsPage = educatorRepository.findAll(pageable);
        List<EducatorDto> dtoList = educatorsPage.getContent().stream()
                .map(this::convertToEducatorDto)
                .collect(Collectors.toList());
        return new PageImpl<>(dtoList, pageable, educatorsPage.getTotalElements());
    }

    @Transactional
    public EducatorDto updateEducator(Long id, EducatorDto educatorDto) {
        Educator existingEducator = educatorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Educator not found with id: " + id));

        User user = existingEducator.getUser();
        user.setUsername(educatorDto.getUsername());
        user.setEmail(educatorDto.getEmail());
        if (educatorDto.getPassword() != null && !educatorDto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(educatorDto.getPassword()));
        }
        userRepository.save(user); // Save user changes

        existingEducator.setFirstName(educatorDto.getFirstName());
        existingEducator.setLastName(educatorDto.getLastName());
        existingEducator.setDateOfBirth(educatorDto.getDateOfBirth());
        existingEducator.setGender(educatorDto.getGender());
        existingEducator.setPhoneNumber(educatorDto.getPhoneNumber());
        existingEducator.setAddress(educatorDto.getAddress());
        existingEducator.setHireDate(educatorDto.getHireDate());
        existingEducator.setQualification(educatorDto.getQualification());
        existingEducator.setExperienceYears(educatorDto.getExperienceYears());

        if (educatorDto.getProfileImageUrl() != null && !educatorDto.getProfileImageUrl().isEmpty()) {
            existingEducator.setProfileImageUrl(educatorDto.getProfileImageUrl());
        }

        Educator updatedEducator = educatorRepository.save(existingEducator);
        return convertToEducatorDto(updatedEducator);
    }

    @Transactional
    public void deleteEducator(Long id) {
        Educator educator = educatorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Educator not found with id: " + id));
        User user = educator.getUser();

        // Delete associated image file if exists
        if (educator.getProfileImageUrl() != null && !educator.getProfileImageUrl().isEmpty()) {
            imageUploadService.deleteFile(educator.getProfileImageUrl());
        }

        educatorRepository.delete(educator);
        userRepository.delete(user); // Also delete the associated user
    }

    // --- Student Management ---

    @Transactional
    public StudentDto createStudent(StudentDto studentDto) {
        if (userRepository.existsByUsername(studentDto.getUsername())) {
            throw new IllegalArgumentException("Username already exists!");
        }
        if (userRepository.existsByEmail(studentDto.getEmail())) {
            throw new IllegalArgumentException("Email already exists!");
        }

        User user = new User();
        user.setUsername(studentDto.getUsername());
        user.setEmail(studentDto.getEmail());
        user.setPassword(passwordEncoder.encode(studentDto.getPassword()));
        user.setRole(Role.ROLE_STUDENT);
        User savedUser = userRepository.save(user);

        Student student = new Student();
        student.setUser(savedUser);
        student.setFirstName(studentDto.getFirstName());
        student.setLastName(studentDto.getLastName());
        student.setDateOfBirth(studentDto.getDateOfBirth());
        student.setGender(studentDto.getGender());
        student.setPhoneNumber(studentDto.getPhoneNumber());
        student.setAddress(studentDto.getAddress());
        student.setEnrollmentDate(studentDto.getEnrollmentDate());
        student.setGrade(studentDto.getGrade());

        if (studentDto.getProfileImageUrl() != null && !studentDto.getProfileImageUrl().isEmpty()) {
            student.setProfileImageUrl(studentDto.getProfileImageUrl());
        }

        Student savedStudent = studentRepository.save(student);
        return convertToStudentDto(savedStudent);
    }

    public StudentDto getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return convertToStudentDto(student);
    }

    public Page<StudentDto> getAllStudents(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Student> studentsPage = studentRepository.findAll(pageable);
        List<StudentDto> dtoList = studentsPage.getContent().stream()
                .map(this::convertToStudentDto)
                .collect(Collectors.toList());
        return new PageImpl<>(dtoList, pageable, studentsPage.getTotalElements());
    }

    @Transactional
    public StudentDto updateStudent(Long id, StudentDto studentDto) {
        Student existingStudent = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        User user = existingStudent.getUser();
        user.setUsername(studentDto.getUsername());
        user.setEmail(studentDto.getEmail());
        if (studentDto.getPassword() != null && !studentDto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(studentDto.getPassword()));
        }
        userRepository.save(user);

        existingStudent.setFirstName(studentDto.getFirstName());
        existingStudent.setLastName(studentDto.getLastName());
        existingStudent.setDateOfBirth(studentDto.getDateOfBirth());
        existingStudent.setGender(studentDto.getGender());
        existingStudent.setPhoneNumber(studentDto.getPhoneNumber());
        existingStudent.setAddress(studentDto.getAddress());
        existingStudent.setEnrollmentDate(studentDto.getEnrollmentDate());
        existingStudent.setGrade(studentDto.getGrade());

        if (studentDto.getProfileImageUrl() != null && !studentDto.getProfileImageUrl().isEmpty()) {
            existingStudent.setProfileImageUrl(studentDto.getProfileImageUrl());
        }

        Student updatedStudent = studentRepository.save(existingStudent);
        return convertToStudentDto(updatedStudent);
    }

    @Transactional
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        User user = student.getUser();

        // Delete associated image file if exists
        if (student.getProfileImageUrl() != null && !student.getProfileImageUrl().isEmpty()) {
            imageUploadService.deleteFile(student.getProfileImageUrl());
        }

        studentRepository.delete(student);
        userRepository.delete(user);
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
        return dto;
    }
}
