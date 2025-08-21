package com.iiituna.feed.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Future;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "events")
public class Event {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Event title is required")
    @Column(nullable = false)
    private String title;
    
    @NotBlank(message = "Event description is required")
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @NotBlank(message = "Event location is required")
    @Column(nullable = false)
    private String location;
    
    @NotNull(message = "Event date is required")
    @Future(message = "Event date must be in the future")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm[:ss]")
    @Column(name = "event_date", nullable = false)
    private LocalDateTime eventDate;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "created_by")
    private String createdBy; // Using device ID as identifier
    
    @Column(name = "image_url")
    private String imageUrl;
    
    // Event-specific fields for interactions
    @ElementCollection
    @CollectionTable(name = "event_responses", joinColumns = @JoinColumn(name = "event_id"))
    @Enumerated(EnumType.STRING)
    private List<EventResponse> responses = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "event_user_responses", joinColumns = @JoinColumn(name = "event_id"))
    private List<UserEventResponse> userResponses = new ArrayList<>();
    
    public enum EventResponse {
        GOING, INTERESTED, NOT_GOING
    }
    
    @Embeddable
    public static class UserEventResponse {
        private String userId; // Device ID
        @Enumerated(EnumType.STRING)
        private EventResponse response;
        private LocalDateTime responseDate;
        
        // Constructors
        public UserEventResponse() {}
        
        public UserEventResponse(String userId, EventResponse response) {
            this.userId = userId;
            this.response = response;
            this.responseDate = LocalDateTime.now();
        }
        
        // Getters and Setters
        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
        
        public EventResponse getResponse() { return response; }
        public void setResponse(EventResponse response) { this.response = response; }
        
        public LocalDateTime getResponseDate() { return responseDate; }
        public void setResponseDate(LocalDateTime responseDate) { this.responseDate = responseDate; }
    }
    
    // Constructors
    public Event() {
        this.createdAt = LocalDateTime.now();
    }
    
    public Event(String title, String description, String location, LocalDateTime eventDate, String createdBy) {
        this();
        this.title = title;
        this.description = description;
        this.location = location;
        this.eventDate = eventDate;
        this.createdBy = createdBy;
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
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public List<EventResponse> getResponses() { return responses; }
    public void setResponses(List<EventResponse> responses) { this.responses = responses; }
    
    public List<UserEventResponse> getUserResponses() { return userResponses; }
    public void setUserResponses(List<UserEventResponse> userResponses) { this.userResponses = userResponses; }
    
    // Helper methods
    public void addUserResponse(String userId, EventResponse response) {
        // Remove existing response from same user
        userResponses.removeIf(ur -> ur.getUserId().equals(userId));
        // Add new response
        userResponses.add(new UserEventResponse(userId, response));
    }
    
    public EventResponse getUserResponse(String userId) {
        return userResponses.stream()
                .filter(ur -> ur.getUserId().equals(userId))
                .map(UserEventResponse::getResponse)
                .findFirst()
                .orElse(null);
    }
    
    public long getGoingCount() {
        return userResponses.stream()
                .filter(ur -> ur.getResponse() == EventResponse.GOING)
                .count();
    }
    
    public long getInterestedCount() {
        return userResponses.stream()
                .filter(ur -> ur.getResponse() == EventResponse.INTERESTED)
                .count();
    }
    
    public long getNotGoingCount() {
        return userResponses.stream()
                .filter(ur -> ur.getResponse() == EventResponse.NOT_GOING)
                .count();
    }
}
