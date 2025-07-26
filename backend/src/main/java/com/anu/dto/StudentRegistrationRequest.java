package com.anu.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Email;

public class StudentRegistrationRequest {
    
    @NotBlank(message = "Full name is required")
    private String fullName;
    
    @NotBlank(message = "Department is required")
    private String department;
    
    @NotBlank(message = "Roll number is required")
    private String rollNumber;
    
    @Email(message = "Email should be valid")
    private String email;
    
    // Constructors
    public StudentRegistrationRequest() {}
    
    public StudentRegistrationRequest(String fullName, String department, String rollNumber, String email) {
        this.fullName = fullName;
        this.department = department;
        this.rollNumber = rollNumber;
        this.email = email;
    }
    
    // Getters and Setters
    public String getFullName() {
        return fullName;
    }
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    public String getDepartment() {
        return department;
    }
    
    public void setDepartment(String department) {
        this.department = department;
    }
    
    public String getRollNumber() {
        return rollNumber;
    }
    
    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
} 