// Corrected Class.java
package com.campus.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode; // Import EqualsAndHashCode

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "classes")
@EqualsAndHashCode(exclude = {"students", "educators"}) // EXCLUDE bidirectional collections
public class Class {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String className;

    @Column(nullable = false, unique = true)
    private String classCode;

    @Lob // For larger text fields
    private String description;

    @ManyToMany(mappedBy = "classes", fetch = FetchType.LAZY)
    private Set<Student> students = new HashSet<>();

    @ManyToMany(mappedBy = "classes", fetch = FetchType.LAZY)
    private Set<Educator> educators = new HashSet<>();

    // Helper methods are fine and do not cause the StackOverflowError
    public void addStudent(Student student) {
        if (this.students == null) {
            this.students = new HashSet<>();
        }
        this.students.add(student);
        if (student.getClasses() == null) {
            student.setClasses(new HashSet<>());
        }
        student.getClasses().add(this);
    }

    public void removeStudent(Student student) {
        if (this.students != null) {
            this.students.remove(student);
        }
        if (student.getClasses() != null) {
            student.getClasses().remove(this);
        }
    }

    public void addEducator(Educator educator) {
        if (this.educators == null) {
            this.educators = new HashSet<>();
        }
        this.educators.add(educator);
        if (educator.getClasses() == null) {
            educator.setClasses(new HashSet<>());
        }
        educator.getClasses().add(this);
    }

    public void removeEducator(Educator educator) {
        if (this.educators != null) {
            this.educators.remove(educator);
        }
        if (educator.getClasses() != null) {
            educator.getClasses().remove(this);
        }
    }
}