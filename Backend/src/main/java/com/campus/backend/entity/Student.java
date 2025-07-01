package com.campus.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.util.Set; // Import Set for the feedback collection

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "students")
@EqualsAndHashCode(exclude = {"user", "clazz", "feedback"}) // EXCLUDE 'feedback' as well
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

    // --- ADD THIS RELATIONSHIP FOR FEEDBACK ---
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Feedback> feedback; // A student can have multiple feedback entries
    // --- END ADDITION ---
}