// Corrected Student.java
package com.campus.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode; // Import EqualsAndHashCode

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "students")
@EqualsAndHashCode(exclude = {"user", "classes"}) // EXCLUDE user (OneToOne) and classes (ManyToMany)
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, unique = true)
    private User user; // Exclude this from equals/hashCode

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    private LocalDate dateOfBirth;
    private String gender;
    private String phoneNumber;
    private String address;
    private String profileImageUrl; // Path or URL to the image

    private LocalDate enrollmentDate;
    private String grade;

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "student_classes",
            joinColumns = @JoinColumn(name = "student_id"),
            inverseJoinColumns = @JoinColumn(name = "class_id")
    )
    private Set<Class> classes = new HashSet<>(); // Exclude this from equals/hashCode

    // Helper methods are fine
    public void addClass(Class clazz) {
        if (this.classes == null) {
            this.classes = new HashSet<>();
        }
        this.classes.add(clazz);
        if (clazz.getStudents() == null) {
            clazz.setStudents(new HashSet<>());
        }
        clazz.getStudents().add(this);
    }

    public void removeClass(Class clazz) {
        if (this.classes != null) {
            this.classes.remove(clazz);
        }
        if (clazz.getStudents() != null) {
            clazz.getStudents().remove(this);
        }
    }
}