// Corrected User.java
package com.campus.backend.entity;

import com.campus.backend.entity.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode; // Import EqualsAndHashCode
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
// If User had a direct @OneToOne mappedBy to Educator or Student,
// you would exclude that field here.
// In your current User entity, there are no relationships directly declared.
// However, the stack trace indicated User.hashCode().
// This means some operation is causing traversal where User's hash is needed.
// It's possible for lombok's @Data to still cause issues with transient
// fields or if you later add an Educator field to User.
// For now, if there's no direct collection or @OneToOne(mappedBy),
// you might not need to exclude anything here, but keep it in mind.
// The primary culprits are the ManyToMany relationships.
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role; // ADMIN, EDUCATOR, STUDENT

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}