package com.iiituna.feed.repository;

import com.iiituna.feed.entity.LostFound;
import com.iiituna.feed.entity.LostFound.LostFoundType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LostFoundRepository extends JpaRepository<LostFound, Long> {
    
    // Find by type (LOST or FOUND)
    List<LostFound> findByTypeOrderByCreatedAtDesc(LostFoundType type);
    
    // Find by resolution status
    List<LostFound> findByIsResolvedOrderByCreatedAtDesc(Boolean isResolved);
    
    // Find by type and resolution status
    List<LostFound> findByTypeAndIsResolvedOrderByCreatedAtDesc(LostFoundType type, Boolean isResolved);
    
    // Find items created by specific user
    List<LostFound> findByCreatedByOrderByCreatedAtDesc(String createdBy);
    
    // Find by location (case insensitive)
    @Query("SELECT lf FROM LostFound lf WHERE LOWER(lf.location) LIKE LOWER(CONCAT('%', :location, '%')) ORDER BY lf.createdAt DESC")
    List<LostFound> findByLocationContainingIgnoreCase(@Param("location") String location);
    
    // Search by item name or description
    @Query("SELECT lf FROM LostFound lf WHERE LOWER(lf.itemName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(lf.description) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY lf.createdAt DESC")
    List<LostFound> findByItemNameOrDescriptionContainingIgnoreCase(@Param("keyword") String keyword);
    
    // Get all items ordered by creation date (for feed)
    List<LostFound> findAllByOrderByCreatedAtDesc();
    
    // Find recent unresolved items
    @Query("SELECT lf FROM LostFound lf WHERE lf.isResolved = false AND lf.createdAt >= :date ORDER BY lf.createdAt DESC")
    List<LostFound> findRecentUnresolvedItems(@Param("date") LocalDateTime date);
    
    // Count items by type and user
    long countByTypeAndCreatedBy(LostFoundType type, String createdBy);
    
    // Count unresolved items
    long countByIsResolved(Boolean isResolved);
    
    // Count items by type
    long countByType(LostFoundType type);
    
    // Find items created after a specific date
    List<LostFound> findByCreatedAtAfterOrderByCreatedAtDesc(LocalDateTime date);
}
