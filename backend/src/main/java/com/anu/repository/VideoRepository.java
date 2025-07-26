package com.anu.repository;

import com.anu.entity.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {
    
    List<Video> findByDepartmentOrderByUploadDateDesc(String department);
    
    List<Video> findBySubjectContainingIgnoreCaseOrderByUploadDateDesc(String subject);
    
    @Modifying
    @Query("UPDATE Video v SET v.viewCount = v.viewCount + 1 WHERE v.id = ?1")
    void incrementViewCount(Long videoId);
} 