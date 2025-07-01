package com.campus.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set; // Import Set for the feedback collection

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "students")
@EqualsAndHashCode(exclude = {"user", "clazz", "feedback", "subjects"}) // EXCLUDE 'feedback' AND 'subjects' as well
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    private LocalDate dateOfBirth;
    private String gender;
    private String phoneNumber;
    private String address;
    private String profileImageUrl;

    private LocalDate enrollmentDate;
    private String grade;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private Class clazz;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Feedback> feedback; // A student can have multiple feedback entries

    // --- NEW: Many-to-Many with Subject ---
    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "student_subjects",
            joinColumns = @JoinColumn(name = "student_id"),
            inverseJoinColumns = @JoinColumn(name = "subject_id")
    )
    private Set<Subject> subjects = new HashSet<>();

    // Helper methods for Many-to-Many
    public void addSubject(Subject subject) {
        if (this.subjects == null) {
            this.subjects = new HashSet<>();
        }
        this.subjects.add(subject);
        if (subject.getStudents() == null) {
            subject.setStudents(new HashSet<>());
        }
        subject.getStudents().add(this);
    }

    public void removeSubject(Subject subject) {
        if (this.subjects != null) {
            this.subjects.remove(subject);
        }
        if (subject.getStudents() != null) {
            subject.getStudents().remove(this);
        }
    }
}