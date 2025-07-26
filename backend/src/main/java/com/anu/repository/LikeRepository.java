package com.anu.repository;

import com.anu.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    
    List<Like> findByVideoId(Long videoId);
    
    Optional<Like> findByVideoIdAndStudentId(Long videoId, Long studentId);
    
    boolean existsByVideoIdAndStudentId(Long videoId, Long studentId);
    
    long countByVideoId(Long videoId);
} 