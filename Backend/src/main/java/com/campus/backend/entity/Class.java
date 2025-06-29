package com.campus.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "classes")
public class Class { // Renamed from 'Classes' to 'Class' to follow Java naming conventions
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String className;

    @Column(nullable = false, unique = true)
    private String classCode;

    @Lob // For larger text fields
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "educator_id") // Foreign key to Educator
    private Educator educator;

    @ManyToMany(mappedBy = "classes", fetch = FetchType.LAZY)
    private Set<Student> students = new HashSet<>();
}
