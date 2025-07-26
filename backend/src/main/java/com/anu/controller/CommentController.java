package com.anu.controller;

import com.anu.entity.Comment;
import com.anu.service.CommentService;
import com.anu.dto.CommentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/videos/{videoId}/comments")
@CrossOrigin(origins = "*")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping
    public ResponseEntity<?> addComment(@PathVariable Long videoId, @RequestBody Map<String, String> payload) {
        try {
            String studentRollNumber = payload.get("studentRollNumber");
            String commentText = payload.get("commentText");
            CommentRequest request = new CommentRequest();
            request.setStudentRollNumber(studentRollNumber);
            request.setCommentText(commentText);
            Comment comment = commentService.addComment(videoId, request);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Comment added successfully");
            response.put("comment", comment);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping
    public ResponseEntity<?> getComments(@PathVariable Long videoId) {
        try {
            List<Comment> comments = commentService.getCommentsByVideoId(videoId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("comments", comments);
            response.put("count", comments.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
} 