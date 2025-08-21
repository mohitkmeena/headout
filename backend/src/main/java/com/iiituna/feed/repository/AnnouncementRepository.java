package com.iiituna.feed.repository;

import com.iiituna.feed.entity.Announcement;
import com.iiituna.feed.entity.Announcement.AnnouncementType;
import com.iiituna.feed.entity.Announcement.Priority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    
    // Find all active announcements ordered by pinned first, then by creation date
    @Query("SELECT a FROM Announcement a WHERE a.isActive = true ORDER BY a.isPinned DESC, a.createdAt DESC")
    List<Announcement> findAllActiveOrderByPinnedAndCreatedAt();
    
    // Find by department
    List<Announcement> findByDepartmentAndIsActiveOrderByIsPinnedDescCreatedAtDesc(String department, Boolean isActive);
    
    // Find by type
    List<Announcement> findByTypeAndIsActiveOrderByIsPinnedDescCreatedAtDesc(AnnouncementType type, Boolean isActive);
    
    // Find by priority
    List<Announcement> findByPriorityAndIsActiveOrderByCreatedAtDesc(Priority priority, Boolean isActive);
    
    // Find pinned announcements
    List<Announcement> findByIsPinnedAndIsActiveOrderByCreatedAtDesc(Boolean isPinned, Boolean isActive);
    
    // Find announcements created by specific user
    List<Announcement> findByCreatedByAndIsActiveOrderByCreatedAtDesc(String createdBy, Boolean isActive);
    
    // Search by title or content
    @Query("SELECT a FROM Announcement a WHERE a.isActive = true AND " +
           "(LOWER(a.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.content) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "ORDER BY a.isPinned DESC, a.createdAt DESC")
    List<Announcement> findByTitleOrContentContainingIgnoreCase(@Param("keyword") String keyword);
    
    // Find non-expired announcements
    @Query("SELECT a FROM Announcement a WHERE a.isActive = true AND " +
           "(a.expiryDate IS NULL OR a.expiryDate > :currentTime) " +
           "ORDER BY a.isPinned DESC, a.createdAt DESC")
    List<Announcement> findNonExpiredAnnouncements(@Param("currentTime") LocalDateTime currentTime);
    
    // Find expired announcements
    @Query("SELECT a FROM Announcement a WHERE a.isActive = true AND " +
           "a.expiryDate IS NOT NULL AND a.expiryDate <= :currentTime " +
           "ORDER BY a.createdAt DESC")
    List<Announcement> findExpiredAnnouncements(@Param("currentTime") LocalDateTime currentTime);
    
    // Find recent announcements (last N days)
    @Query("SELECT a FROM Announcement a WHERE a.isActive = true AND " +
           "a.createdAt >= :sinceDate ORDER BY a.isPinned DESC, a.createdAt DESC")
    List<Announcement> findRecentAnnouncements(@Param("sinceDate") LocalDateTime sinceDate);
    
    // Count by department
    long countByDepartmentAndIsActive(String department, Boolean isActive);
    
    // Count by type
    long countByTypeAndIsActive(AnnouncementType type, Boolean isActive);
    
    // Count by priority
    long countByPriorityAndIsActive(Priority priority, Boolean isActive);
    
    // Count by creator
    long countByCreatedByAndIsActive(String createdBy, Boolean isActive);
    
    // Count pinned announcements
    long countByIsPinnedAndIsActive(Boolean isPinned, Boolean isActive);
    
    // Count active announcements
    long countByIsActive(Boolean isActive);
    
    // Count expired announcements
    @Query("SELECT COUNT(a) FROM Announcement a WHERE a.isActive = true AND " +
           "a.expiryDate IS NOT NULL AND a.expiryDate <= :currentTime")
    long countExpiredAnnouncements(@Param("currentTime") LocalDateTime currentTime);
}
