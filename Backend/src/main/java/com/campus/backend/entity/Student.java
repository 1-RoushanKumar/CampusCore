package com.campus.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode; // Import EqualsAndHashCode

import java.time.LocalDate;
// No longer need Set<Class> for a single class, so remove HashSet and Set imports for classes
// import java.util.HashSet;
// import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "students")
@EqualsAndHashCode(exclude = {"user", "clazz"}) // EXCLUDE user (OneToOne) and now 'clazz' (ManyToOne)
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

    // --- CHANGE STARTS HERE ---
    @ManyToOne(fetch = FetchType.LAZY) // Student is on the Many side
    @JoinColumn(name = "class_id") // Foreign key column in students table
    private Class clazz; // Renamed to 'clazz' to avoid keyword conflict, if not already
    // --- CHANGE ENDS HERE ---

    // Removed addClass/removeClass helper methods as relationship is no longer ManyToMany
}