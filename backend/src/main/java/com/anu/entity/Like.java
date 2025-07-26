package com.anu.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "likes")
public class Like {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "video_id", nullable = false)
    private Video video;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    
    @Column(name = "like_date")
    private LocalDateTime likeDate;
    
    // Constructors
    public Like() {
        this.likeDate = LocalDateTime.now();
    }
    
    public Like(Video video, Student student) {
        this();
        this.video = video;
        this.student = student;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Video getVideo() {
        return video;
    }
    
    public void setVideo(Video video) {
        this.video = video;
    }
    
    public Student getStudent() {
        return student;
    }
    
    public void setStudent(Student student) {
        this.student = student;
    }
    
    public LocalDateTime getLikeDate() {
        return likeDate;
    }
    
    public void setLikeDate(LocalDateTime likeDate) {
        this.likeDate = likeDate;
    }
} 