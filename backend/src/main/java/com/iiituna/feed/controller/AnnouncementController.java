package com.iiituna.feed.controller;

import com.iiituna.feed.dto.AnnouncementDto;
import com.iiituna.feed.entity.Announcement;
import com.iiituna.feed.entity.Announcement.AnnouncementType;
import com.iiituna.feed.entity.Announcement.Priority;
import com.iiituna.feed.repository.AnnouncementRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin(origins = "*")
public class AnnouncementController {
    
    @Autowired
    private AnnouncementRepository announcementRepository;
    
    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Announcements API is working!");
    }
    
    // Get all active announcements
    @GetMapping
    public ResponseEntity<List<AnnouncementDto>> getAllAnnouncements() {
        try {
            List<Announcement> announcements = announcementRepository.findAllActiveOrderByPinnedAndCreatedAt();
            List<AnnouncementDto> announcementDtos = announcements.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(announcementDtos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get announcement by ID
    @GetMapping("/{id}")
    public ResponseEntity<AnnouncementDto> getAnnouncementById(@PathVariable Long id) {
        Optional<Announcement> announcement = announcementRepository.findById(id);
        if (announcement.isPresent() && announcement.get().getIsActive()) {
            return ResponseEntity.ok(convertToDto(announcement.get()));
        }
        return ResponseEntity.notFound().build();
    }
    
    // Create new announcement
    @PostMapping
    public ResponseEntity<?> createAnnouncement(@Valid @RequestBody AnnouncementDto announcementDto, 
                                                             @RequestParam String userId) {
        try {
            System.out.println("Creating announcement with data: " + announcementDto.toString());
            System.out.println("UserId: " + userId);
            
            Announcement announcement = convertToEntity(announcementDto);
            announcement.setCreatedBy(userId);
            announcement.setCreatedAt(LocalDateTime.now());
            
            Announcement savedAnnouncement = announcementRepository.save(announcement);
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(savedAnnouncement));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Error creating announcement: " + e.getMessage());
        }
    }
    
    // Update announcement
    @PutMapping("/{id}")
    public ResponseEntity<AnnouncementDto> updateAnnouncement(@PathVariable Long id, 
                                                             @Valid @RequestBody AnnouncementDto announcementDto, 
                                                             @RequestParam String userId) {
        Optional<Announcement> existingAnnouncement = announcementRepository.findById(id);
        if (existingAnnouncement.isPresent()) {
            Announcement announcement = existingAnnouncement.get();
            
            // Check if user is the creator
            if (!announcement.getCreatedBy().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            // Update fields
            announcement.setTitle(announcementDto.getTitle());
            announcement.setContent(announcementDto.getContent());
            announcement.setDepartment(announcementDto.getDepartment());
            announcement.setType(AnnouncementType.valueOf(announcementDto.getType().toUpperCase()));
            announcement.setPriority(Priority.valueOf(announcementDto.getPriority().toUpperCase()));
            announcement.setAttachmentUrl(announcementDto.getAttachmentUrl());
            announcement.setAttachmentName(announcementDto.getAttachmentName());
            announcement.setExpiryDate(announcementDto.getExpiryDate());
            
            Announcement savedAnnouncement = announcementRepository.save(announcement);
            return ResponseEntity.ok(convertToDto(savedAnnouncement));
        }
        return ResponseEntity.notFound().build();
    }
    
    // Delete announcement (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable Long id, @RequestParam String userId) {
        Optional<Announcement> announcement = announcementRepository.findById(id);
        if (announcement.isPresent()) {
            // Check if user is the creator
            if (!announcement.get().getCreatedBy().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            announcement.get().deactivate();
            announcementRepository.save(announcement.get());
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    // Toggle pin status
    @PostMapping("/{id}/toggle-pin")
    public ResponseEntity<AnnouncementDto> togglePin(@PathVariable Long id, @RequestParam String userId) {
        Optional<Announcement> announcementOpt = announcementRepository.findById(id);
        if (announcementOpt.isPresent()) {
            Announcement announcement = announcementOpt.get();
            
            // Check if user is the creator
            if (!announcement.getCreatedBy().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            announcement.togglePin();
            Announcement savedAnnouncement = announcementRepository.save(announcement);
            return ResponseEntity.ok(convertToDto(savedAnnouncement));
        }
        return ResponseEntity.notFound().build();
    }
    
    // Get announcements by department
    @GetMapping("/department/{department}")
    public ResponseEntity<List<AnnouncementDto>> getAnnouncementsByDepartment(@PathVariable String department) {
        List<Announcement> announcements = announcementRepository
                .findByDepartmentAndIsActiveOrderByIsPinnedDescCreatedAtDesc(department, true);
        List<AnnouncementDto> announcementDtos = announcements.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(announcementDtos);
    }
    
    // Get announcements by type
    @GetMapping("/type/{type}")
    public ResponseEntity<List<AnnouncementDto>> getAnnouncementsByType(@PathVariable String type) {
        try {
            AnnouncementType announcementType = AnnouncementType.valueOf(type.toUpperCase());
            List<Announcement> announcements = announcementRepository
                    .findByTypeAndIsActiveOrderByIsPinnedDescCreatedAtDesc(announcementType, true);
            List<AnnouncementDto> announcementDtos = announcements.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(announcementDtos);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Get announcements by priority
    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<AnnouncementDto>> getAnnouncementsByPriority(@PathVariable String priority) {
        try {
            Priority priorityLevel = Priority.valueOf(priority.toUpperCase());
            List<Announcement> announcements = announcementRepository
                    .findByPriorityAndIsActiveOrderByCreatedAtDesc(priorityLevel, true);
            List<AnnouncementDto> announcementDtos = announcements.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(announcementDtos);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Get pinned announcements
    @GetMapping("/pinned")
    public ResponseEntity<List<AnnouncementDto>> getPinnedAnnouncements() {
        List<Announcement> announcements = announcementRepository
                .findByIsPinnedAndIsActiveOrderByCreatedAtDesc(true, true);
        List<AnnouncementDto> announcementDtos = announcements.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(announcementDtos);
    }
    
    // Get user's announcements
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AnnouncementDto>> getUserAnnouncements(@PathVariable String userId) {
        List<Announcement> announcements = announcementRepository
                .findByCreatedByAndIsActiveOrderByCreatedAtDesc(userId, true);
        List<AnnouncementDto> announcementDtos = announcements.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(announcementDtos);
    }
    
    // Search announcements
    @GetMapping("/search")
    public ResponseEntity<List<AnnouncementDto>> searchAnnouncements(@RequestParam String keyword) {
        List<Announcement> announcements = announcementRepository
                .findByTitleOrContentContainingIgnoreCase(keyword);
        List<AnnouncementDto> announcementDtos = announcements.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(announcementDtos);
    }
    
    // Get recent announcements (last 7 days)
    @GetMapping("/recent")
    public ResponseEntity<List<AnnouncementDto>> getRecentAnnouncements() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<Announcement> announcements = announcementRepository.findRecentAnnouncements(sevenDaysAgo);
        List<AnnouncementDto> announcementDtos = announcements.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(announcementDtos);
    }
    
    // Get non-expired announcements
    @GetMapping("/active")
    public ResponseEntity<List<AnnouncementDto>> getNonExpiredAnnouncements() {
        List<Announcement> announcements = announcementRepository
                .findNonExpiredAnnouncements(LocalDateTime.now());
        List<AnnouncementDto> announcementDtos = announcements.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(announcementDtos);
    }
    
    // Get announcement statistics
    @GetMapping("/stats")
    public ResponseEntity<Object> getAnnouncementStatistics() {
        long totalActive = announcementRepository.countByIsActive(true);
        long pinnedCount = announcementRepository.countByIsPinnedAndIsActive(true, true);
        long expiredCount = announcementRepository.countExpiredAnnouncements(LocalDateTime.now());
        
        long academicCount = announcementRepository.countByTypeAndIsActive(AnnouncementType.ACADEMIC, true);
        long administrativeCount = announcementRepository.countByTypeAndIsActive(AnnouncementType.ADMINISTRATIVE, true);
        long eventCount = announcementRepository.countByTypeAndIsActive(AnnouncementType.EVENT, true);
        
        long urgentCount = announcementRepository.countByPriorityAndIsActive(Priority.URGENT, true);
        long highCount = announcementRepository.countByPriorityAndIsActive(Priority.HIGH, true);
        
        return ResponseEntity.ok(new Object() {
            public final long total = totalActive;
            public final long pinned = pinnedCount;
            public final long expired = expiredCount;
            public final long academic = academicCount;
            public final long administrative = administrativeCount;
            public final long events = eventCount;
            public final long urgent = urgentCount;
            public final long high = highCount;
        });
    }
    
    // Helper methods
    private AnnouncementDto convertToDto(Announcement announcement) {
        AnnouncementDto dto = new AnnouncementDto();
        dto.setId(announcement.getId());
        dto.setTitle(announcement.getTitle());
        dto.setContent(announcement.getContent());
        dto.setDepartment(announcement.getDepartment());
        dto.setType(announcement.getType().toString());
        dto.setPriority(announcement.getPriority().toString());
        dto.setAttachmentUrl(announcement.getAttachmentUrl());
        dto.setAttachmentName(announcement.getAttachmentName());
        dto.setCreatedBy(announcement.getCreatedBy());
        dto.setCreatedAt(announcement.getCreatedAt());
        dto.setExpiryDate(announcement.getExpiryDate());
        dto.setIsActive(announcement.getIsActive());
        dto.setIsPinned(announcement.getIsPinned());
        dto.setIsExpired(announcement.isExpired());
        return dto;
    }
    
    private Announcement convertToEntity(AnnouncementDto dto) {
        Announcement announcement = new Announcement();
        announcement.setTitle(dto.getTitle());
        announcement.setContent(dto.getContent());
        announcement.setDepartment(dto.getDepartment());
        announcement.setType(AnnouncementType.valueOf(dto.getType().toUpperCase()));
        announcement.setPriority(Priority.valueOf(dto.getPriority().toUpperCase()));
        announcement.setAttachmentUrl(dto.getAttachmentUrl());
        announcement.setAttachmentName(dto.getAttachmentName());
        announcement.setExpiryDate(dto.getExpiryDate());
        return announcement;
    }
}
