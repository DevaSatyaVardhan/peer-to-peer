package com.anu.service;

import com.anu.dto.StudentRegistrationRequest;
import com.anu.entity.Student;
import com.anu.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StudentService {
    
    @Autowired
    private StudentRepository studentRepository;
    
    public Student registerStudent(StudentRegistrationRequest request) {
        // Check if student already exists
        if (studentRepository.existsByRollNumber(request.getRollNumber())) {
            throw new RuntimeException("Student with roll number " + request.getRollNumber() + " already exists");
        }
        
        Student student = new Student(
            request.getFullName(),
            request.getDepartment(),
            request.getRollNumber(),
            request.getEmail()
        );
        
        return studentRepository.save(student);
    }
    
    public Optional<Student> getStudentByRollNumber(String rollNumber) {
        return studentRepository.findByRollNumber(rollNumber);
    }
    
    public boolean studentExists(String rollNumber) {
        return studentRepository.existsByRollNumber(rollNumber);
    }
    
    public long getStudentCount() {
        return studentRepository.count();
    }
} 