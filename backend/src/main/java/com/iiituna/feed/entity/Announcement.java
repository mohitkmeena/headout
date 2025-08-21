package com.iiituna.feed.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "announcements")
public class Announcement {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 255)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @Column(nullable = false, length = 100)
    private String department;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AnnouncementType type;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;
    
    @Column(length = 500)
    private String attachmentUrl; // For PDF/image attachments
    
    @Column(length = 255)
    private String attachmentName;
    
    @Column(nullable = false, length = 100)
    private String createdBy;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column
    private LocalDateTime expiryDate; // Optional expiry for announcements
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @Column(nullable = false)
    private Boolean isPinned = false;
    
    // Enums
    public enum AnnouncementType {
        ACADEMIC, ADMINISTRATIVE, EVENT, NOTICE, CIRCULAR, EXAM, HOLIDAY, GENERAL
    }
    
    public enum Priority {
        LOW, MEDIUM, HIGH, URGENT
    }
    
    // Constructors
    public Announcement() {}
    
    public Announcement(String title, String content, String department, AnnouncementType type, 
                       Priority priority, String createdBy) {
        this.title = title;
        this.content = content;
        this.department = department;
        this.type = type;
        this.priority = priority;
        this.createdBy = createdBy;
        this.createdAt = LocalDateTime.now();
        this.isActive = true;
        this.isPinned = false;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public String getDepartment() {
        return department;
    }
    
    public void setDepartment(String department) {
        this.department = department;
    }
    
    public AnnouncementType getType() {
        return type;
    }
    
    public void setType(AnnouncementType type) {
        this.type = type;
    }
    
    public Priority getPriority() {
        return priority;
    }
    
    public void setPriority(Priority priority) {
        this.priority = priority;
    }
    
    public String getAttachmentUrl() {
        return attachmentUrl;
    }
    
    public void setAttachmentUrl(String attachmentUrl) {
        this.attachmentUrl = attachmentUrl;
    }
    
    public String getAttachmentName() {
        return attachmentName;
    }
    
    public void setAttachmentName(String attachmentName) {
        this.attachmentName = attachmentName;
    }
    
    public String getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }
    
    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    public Boolean getIsPinned() {
        return isPinned;
    }
    
    public void setIsPinned(Boolean isPinned) {
        this.isPinned = isPinned;
    }
    
    // Helper methods
    public boolean isExpired() {
        return expiryDate != null && LocalDateTime.now().isAfter(expiryDate);
    }
    
    public void deactivate() {
        this.isActive = false;
    }
    
    public void togglePin() {
        this.isPinned = !this.isPinned;
    }
}
