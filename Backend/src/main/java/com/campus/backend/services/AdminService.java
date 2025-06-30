package com.campus.backend.services;

import com.campus.backend.dtos.ClassDto;
import com.campus.backend.dtos.EducatorDto;
import com.campus.backend.dtos.StudentDto;
import com.campus.backend.entity.Class; // Import Class
import com.campus.backend.entity.Educator;
import com.campus.backend.entity.Student;
import com.campus.backend.entity.User;
import com.campus.backend.entity.enums.Role;
import com.campus.backend.exceptions.ResourceNotFoundException;
import com.campus.backend.repositories.ClassRepository; // New import
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

import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final EducatorRepository educatorRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final ImageUploadService imageUploadService;
    private final ClassRepository classRepository; // Inject ClassRepository

    public AdminService(UserRepository userRepository, EducatorRepository educatorRepository,
                        StudentRepository studentRepository, PasswordEncoder passwordEncoder,
                        ImageUploadService imageUploadService, ClassRepository classRepository) { // Add ClassRepository
        this.userRepository = userRepository;
        this.educatorRepository = educatorRepository;
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.imageUploadService = imageUploadService;
        this.classRepository = classRepository; // Initialize
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
            educator.setProfileImageUrl(educatorDto.getProfileImageUrl());
        }

        // Handle class associations for new educator
        if (educatorDto.getClassIds() != null && !educatorDto.getClassIds().isEmpty()) {
            Set<Class> classes = new HashSet<>(classRepository.findAllById(educatorDto.getClassIds()));
            if (classes.size() != educatorDto.getClassIds().size()) {
                throw new ResourceNotFoundException("One or more classes not found.");
            }
            classes.forEach(educator::addClass); // Use helper method to maintain bidirectional relationship
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

        // Handle class associations for existing educator
        if (educatorDto.getClassIds() != null) { // If classIds is provided, update associations
            Set<Class> newClasses = new HashSet<>(classRepository.findAllById(educatorDto.getClassIds()));
            if (newClasses.size() != educatorDto.getClassIds().size()) {
                throw new ResourceNotFoundException("One or more classes not found.");
            }

            // Remove classes that are no longer associated
            existingEducator.getClasses().removeIf(clazz -> !newClasses.contains(clazz));

            // Add new classes
            newClasses.forEach(clazz -> {
                if (!existingEducator.getClasses().contains(clazz)) {
                    existingEducator.addClass(clazz);
                }
            });
        }

        Educator updatedEducator = educatorRepository.save(existingEducator);
        return convertToEducatorDto(updatedEducator);
    }

    @Transactional
    public void deleteEducator(Long id) {
        Educator educator = educatorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Educator not found with id: " + id));
        User user = educator.getUser();

        // Disassociate educator from classes before deleting
        new HashSet<>(educator.getClasses()).forEach(educator::removeClass);

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

        // Handle class associations for new student
        if (studentDto.getClassIds() != null && !studentDto.getClassIds().isEmpty()) {
            Set<Class> classes = new HashSet<>(classRepository.findAllById(studentDto.getClassIds()));
            if (classes.size() != studentDto.getClassIds().size()) {
                throw new ResourceNotFoundException("One or more classes not found.");
            }
            classes.forEach(student::addClass); // Use helper method to maintain bidirectional relationship
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

        // Handle class associations for existing student
        if (studentDto.getClassIds() != null) { // If classIds is provided, update associations
            Set<Class> newClasses = new HashSet<>(classRepository.findAllById(studentDto.getClassIds()));
            if (newClasses.size() != studentDto.getClassIds().size()) {
                throw new ResourceNotFoundException("One or more classes not found.");
            }

            // Remove classes that are no longer associated
            existingStudent.getClasses().removeIf(clazz -> !newClasses.contains(clazz));

            // Add new classes
            newClasses.forEach(clazz -> {
                if (!existingStudent.getClasses().contains(clazz)) {
                    existingStudent.addClass(clazz);
                }
            });
        }

        Student updatedStudent = studentRepository.save(existingStudent);
        return convertToStudentDto(updatedStudent);
    }

    @Transactional
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        User user = student.getUser();

        // Disassociate student from classes before deleting
        new HashSet<>(student.getClasses()).forEach(student::removeClass);

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
        // Populate classIds
        dto.setClassIds(educator.getClasses().stream()
                .map(Class::getId)
                .collect(Collectors.toList()));
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
        // Populate classIds
        dto.setClassIds(student.getClasses().stream()
                .map(Class::getId)
                .collect(Collectors.toList()));
        return dto;
    }

    @Transactional
    public ClassDto createClass(ClassDto classDto) {
        if (classRepository.existsByClassCode(classDto.getClassCode())) {
            throw new IllegalArgumentException("Class with this code already exists!");
        }

        Class newClass = new Class();
        newClass.setClassName(classDto.getClassName());
        newClass.setClassCode(classDto.getClassCode());
        newClass.setDescription(classDto.getDescription());

        // Handle educator associations for new class
        if (classDto.getEducators() != null && !classDto.getEducators().isEmpty()) {
            Set<Educator> educators = new HashSet<>();
            for (ClassDto.EducatorInfo educatorInfo : classDto.getEducators()) {
                Educator educator = educatorRepository.findById(educatorInfo.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Educator not found with id: " + educatorInfo.getId()));
                educators.add(educator);
            }
            educators.forEach(newClass::addEducator); // Use helper method to maintain bidirectional relationship
        }

        Class savedClass = classRepository.save(newClass);
        return convertToClassDto(savedClass);
    }

    public ClassDto getClassById(Long id) {
        Class clazz = classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + id));
        return convertToClassDto(clazz);
    }

    public Page<ClassDto> getAllClasses(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Class> classesPage = classRepository.findAll(pageable);
        List<ClassDto> dtoList = classesPage.getContent().stream()
                .map(this::convertToClassDto)
                .collect(Collectors.toList());
        return new PageImpl<>(dtoList, pageable, classesPage.getTotalElements());
    }

    @Transactional
    public ClassDto updateClass(Long id, ClassDto classDto) {
        Class existingClass = classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + id));

        // Check for unique class code, but allow the current class to keep its code
        if (!existingClass.getClassCode().equals(classDto.getClassCode()) &&
            classRepository.existsByClassCode(classDto.getClassCode())) {
            throw new IllegalArgumentException("Class with this code already exists!");
        }

        existingClass.setClassName(classDto.getClassName());
        existingClass.setClassCode(classDto.getClassCode());
        existingClass.setDescription(classDto.getDescription());

        // Handle educator associations for existing class
        if (classDto.getEducators() != null) { // If educators list is provided, update associations
            Set<Educator> newEducators = new HashSet<>();
            for (ClassDto.EducatorInfo educatorInfo : classDto.getEducators()) {
                Educator educator = educatorRepository.findById(educatorInfo.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Educator not found with id: " + educatorInfo.getId()));
                newEducators.add(educator);
            }

            // Remove educators that are no longer associated
            new HashSet<>(existingClass.getEducators()).forEach(educator -> {
                if (!newEducators.contains(educator)) {
                    existingClass.removeEducator(educator);
                }
            });

            // Add new educators
            newEducators.forEach(educator -> {
                if (!existingClass.getEducators().contains(educator)) {
                    existingClass.addEducator(educator);
                }
            });
        }

        Class updatedClass = classRepository.save(existingClass);
        return convertToClassDto(updatedClass);
    }

    @Transactional
    public void deleteClass(Long id) {
        Class clazz = classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + id));

        // Disassociate educators from this class before deleting
        new HashSet<>(clazz.getEducators()).forEach(clazz::removeEducator);

        // Disassociate students from this class before deleting
        new HashSet<>(clazz.getStudents()).forEach(clazz::removeStudent);

        classRepository.delete(clazz);
    }

    // --- Helper methods to convert Entity to DTO ---
    // (Ensure convertToClassDto handles multiple educators as discussed previously)
    private ClassDto convertToClassDto(Class clazz) {
        ClassDto dto = new ClassDto();
        dto.setId(clazz.getId());
        dto.setClassName(clazz.getClassName());
        dto.setClassCode(clazz.getClassCode());
        dto.setDescription(clazz.getDescription());

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
}