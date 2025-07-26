package com.anu.repository;

import com.anu.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    
    Optional<Student> findByRollNumber(String rollNumber);
    
    boolean existsByRollNumber(String rollNumber);
    
    Optional<Student> findByDepartment(String department);
} 