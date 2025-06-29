package com.campus.backend.repositories;

import com.campus.backend.entity.Class;
import com.campus.backend.entity.Educator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClassRepository extends JpaRepository<Class, Long> {
    Optional<Class> findByClassCode(String classCode);

    List<Class> findByEducator(Educator educator);
    // You can add more specific queries here
}
