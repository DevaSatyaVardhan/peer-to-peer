package com.anu.service;

import com.anu.dto.VideoUploadRequest;
import com.anu.entity.Student;
import com.anu.entity.Video;
import com.anu.repository.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.anu.dto.VideoResponseDTO;
import java.util.stream.Collectors;

import java.util.List;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VideoService {
    
    @Autowired
    private VideoRepository videoRepository;
    
    @Autowired
    private StudentService studentService;
    
    public Video uploadVideo(VideoUploadRequest request) {
        // Find student by roll number
        Optional<Student> studentOpt = studentService.getStudentByRollNumber(request.getStudentRollNumber());
        if (studentOpt.isEmpty()) {
            throw new RuntimeException("Student with roll number " + request.getStudentRollNumber() + " not found");
        }
        
        Student student = studentOpt.get();
        
        Video video = new Video(
            request.getTitle(),
            request.getDescription(),
            request.getDepartment(),
            request.getSubject(),
            request.getVideoUrl(),
            student
        );
        
        return videoRepository.save(video);
    }
    
    public List<Video> getVideosByDepartment(String department) {
        return videoRepository.findByDepartmentOrderByUploadDateDesc(department);
    }
    
    public List<Video> searchVideosBySubject(String subject) {
        return videoRepository.findBySubjectContainingIgnoreCaseOrderByUploadDateDesc(subject);
    }
    
    public Optional<Video> getVideoById(Long videoId) {
        return videoRepository.findById(videoId);
    }
    
    @Transactional
    public void incrementViewCount(Long videoId) {
        videoRepository.findById(videoId).ifPresent(video -> {
            video.setViewCount(video.getViewCount() + 1);
            videoRepository.save(video);
        });
    }

    public List<VideoResponseDTO> getVideosByDepartmentDTO(String department) {
        return videoRepository.findByDepartmentOrderByUploadDateDesc(department)
            .stream()
            .map(this::toVideoResponseDTO)
            .collect(Collectors.toList());
    }

    private VideoResponseDTO toVideoResponseDTO(Video video) {
        return new VideoResponseDTO(
            video.getId(),
            video.getTitle(),
            video.getDescription(),
            video.getDepartment(),
            video.getSubject(),
            video.getVideoUrl(),
            video.getUploadDate(),
            video.getViewCount(),
            video.getStudent() != null ? video.getStudent().getFullName() : null,
            video.getStudent() != null ? video.getStudent().getRollNumber() : null
        );
    }

    public Optional<VideoResponseDTO> getVideoByIdDTO(Long videoId) {
        return videoRepository.findById(videoId)
            .map(this::toVideoResponseDTO);
    }
} 