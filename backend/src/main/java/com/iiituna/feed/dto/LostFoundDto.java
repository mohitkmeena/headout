package com.iiituna.feed.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class LostFoundDto {
    
    private Long id;
    
    @NotBlank(message = "Item name is required")
    private String itemName;
    
    private String description;
    
    @NotNull(message = "Type is required")
    private String type; // "LOST" or "FOUND"
    
    @NotBlank(message = "Location is required")
    private String location;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm[:ss]")
    private LocalDateTime incidentDate;
    
    private String imageUrl;
    private String contactInfo;
    private String createdBy;
    private LocalDateTime createdAt;
    private Boolean isResolved;
    private LocalDateTime resolvedAt;
    private String resolvedBy;
    
    // Constructors
    public LostFoundDto() {}
    
    public LostFoundDto(String itemName, String description, String type, String location) {
        this.itemName = itemName;
        this.description = description;
        this.type = type;
        this.location = location;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public LocalDateTime getIncidentDate() { return incidentDate; }
    public void setIncidentDate(LocalDateTime incidentDate) { this.incidentDate = incidentDate; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public Boolean getIsResolved() { return isResolved; }
    public void setIsResolved(Boolean isResolved) { this.isResolved = isResolved; }
    
    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
    
    public String getResolvedBy() { return resolvedBy; }
    public void setResolvedBy(String resolvedBy) { this.resolvedBy = resolvedBy; }
    
    // Helper methods
    public String getDisplayTitle() {
        return ("LOST".equals(type) ? "Lost: " : "Found: ") + itemName;
    }
    
    public String getFormattedLocation() {
        if ("LOST".equals(type)) {
            return "Last seen at: " + location;
        } else {
            return "Found at: " + location;
        }
    }
}
