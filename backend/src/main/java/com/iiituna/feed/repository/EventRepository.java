package com.iiituna.feed.repository;

import com.iiituna.feed.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    // Find events by date range
    List<Event> findByEventDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Find upcoming events
    List<Event> findByEventDateAfterOrderByEventDateAsc(LocalDateTime currentDate);
    
    // Find events created by specific user
    List<Event> findByCreatedByOrderByCreatedAtDesc(String createdBy);
    
    // Find events by location (case insensitive)
    @Query("SELECT e FROM Event e WHERE LOWER(e.location) LIKE LOWER(CONCAT('%', :location, '%')) ORDER BY e.eventDate ASC")
    List<Event> findByLocationContainingIgnoreCase(@Param("location") String location);
    
    // Find events by title or description (search functionality)
    @Query("SELECT e FROM Event e WHERE LOWER(e.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(e.description) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY e.eventDate ASC")
    List<Event> findByTitleOrDescriptionContainingIgnoreCase(@Param("keyword") String keyword);
    
    // Get all events ordered by creation date (for feed)
    List<Event> findAllByOrderByCreatedAtDesc();
    
    // Count events created by user
    long countByCreatedBy(String createdBy);
    
    // Find events between dates with ordered results
    List<Event> findByEventDateBetweenOrderByEventDateAsc(LocalDateTime startDate, LocalDateTime endDate);
    
    // Count upcoming events
    long countByEventDateAfter(LocalDateTime currentDate);
}
