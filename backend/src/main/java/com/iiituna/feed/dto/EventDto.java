package com.iiituna.feed.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Future;

import java.time.LocalDateTime;

public class EventDto {
    
    private Long id;
    
    @NotBlank(message = "Event title is required")
    private String title;
    
    @NotBlank(message = "Event description is required")
    private String description;
    
    @NotBlank(message = "Event location is required")
    private String location;
    
    @NotNull(message = "Event date is required")
    @Future(message = "Event date must be in the future")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime eventDate;
    
    private String imageUrl;
    private String createdBy;
    private LocalDateTime createdAt;
    
    // Response counts
    private long goingCount;
    private long interestedCount;
    private long notGoingCount;
    private String userResponse; // Current user's response
    
    // Constructors
    public EventDto() {}
    
    public EventDto(String title, String description, String location, LocalDateTime eventDate) {
        this.title = title;
        this.description = description;
        this.location = location;
        this.eventDate = eventDate;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public LocalDateTime getEventDate() { return eventDate; }
    public void setEventDate(LocalDateTime eventDate) { this.eventDate = eventDate; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public long getGoingCount() { return goingCount; }
    public void setGoingCount(long goingCount) { this.goingCount = goingCount; }
    
    public long getInterestedCount() { return interestedCount; }
    public void setInterestedCount(long interestedCount) { this.interestedCount = interestedCount; }
    
    public long getNotGoingCount() { return notGoingCount; }
    public void setNotGoingCount(long notGoingCount) { this.notGoingCount = notGoingCount; }
    
    public String getUserResponse() { return userResponse; }
    public void setUserResponse(String userResponse) { this.userResponse = userResponse; }
}
