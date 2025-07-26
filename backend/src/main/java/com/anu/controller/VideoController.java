package com.anu.controller;

import com.anu.dto.VideoUploadRequest;
import com.anu.dto.VideoResponseDTO;
import com.anu.entity.Video;
import com.anu.service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/videos")
@CrossOrigin(origins = "*")
public class VideoController {
    
    @Autowired
    private VideoService videoService;
    
    @PostMapping("/upload")
    public ResponseEntity<?> uploadVideo(@Valid @RequestBody VideoUploadRequest request) {
        try {
            Video video = videoService.uploadVideo(request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Video uploaded successfully");
            response.put("video", video);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/department/{department}")
    public ResponseEntity<?> getVideosByDepartment(@PathVariable String department) {
        try {
            List<VideoResponseDTO> videos = videoService.getVideosByDepartmentDTO(department);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("videos", videos);
            response.put("count", videos.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<?> searchVideosBySubject(@RequestParam String subject) {
        try {
            List<Video> videos = videoService.searchVideosBySubject(subject);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("videos", videos);
            response.put("count", videos.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/{videoId}")
    public ResponseEntity<?> getVideoById(@PathVariable Long videoId) {
        try {
            var videoOpt = videoService.getVideoByIdDTO(videoId);
            if (videoOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Video not found");
                return ResponseEntity.notFound().build();
            }
            
            // Increment view count
            videoService.incrementViewCount(videoId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("video", videoOpt.get());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
} 