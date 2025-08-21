package com.iiituna.feed.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

@Entity
@Table(name = "lost_found")
public class LostFound {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Item name is required")
    @Column(nullable = false)
    private String itemName;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @NotNull(message = "Type is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LostFoundType type;
    
    @NotBlank(message = "Location is required")
    @Column(nullable = false)
    private String location;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "incident_date")
    private LocalDateTime incidentDate; // When item was lost/found
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "created_by")
    private String createdBy; // Using device ID as identifier
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(name = "contact_info")
    private String contactInfo; // Phone number or email
    
    @Column(name = "is_resolved")
    private Boolean isResolved = false;
    
    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
    
    @Column(name = "resolved_by")
    private String resolvedBy;
    
    public enum LostFoundType {
        LOST, FOUND
    }
    
    // Constructors
    public LostFound() {
        this.createdAt = LocalDateTime.now();
    }
    
    public LostFound(String itemName, String description, LostFoundType type, 
                     String location, String createdBy) {
        this();
        this.itemName = itemName;
        this.description = description;
        this.type = type;
        this.location = location;
        this.createdBy = createdBy;
        this.incidentDate = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public LostFoundType getType() { return type; }
    public void setType(LostFoundType type) { this.type = type; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public LocalDateTime getIncidentDate() { return incidentDate; }
    public void setIncidentDate(LocalDateTime incidentDate) { this.incidentDate = incidentDate; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }
    
    public Boolean getIsResolved() { return isResolved; }
    public void setIsResolved(Boolean isResolved) { this.isResolved = isResolved; }
    
    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
    
    public String getResolvedBy() { return resolvedBy; }
    public void setResolvedBy(String resolvedBy) { this.resolvedBy = resolvedBy; }
    
    // Helper methods
    public void markAsResolved(String resolvedBy) {
        this.isResolved = true;
        this.resolvedAt = LocalDateTime.now();
        this.resolvedBy = resolvedBy;
    }
    
    public String getDisplayTitle() {
        return (type == LostFoundType.LOST ? "Lost: " : "Found: ") + itemName;
    }
    
    public String getFormattedLocation() {
        if (type == LostFoundType.LOST) {
            return "Last seen at: " + location;
        } else {
            return "Found at: " + location;
        }
    }
}
