package com.iiituna.feed.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

@Entity
@Table(name = "reactions", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"post_id", "post_type", "created_by", "target_type"})
})
public class Reaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Reaction type is required")
    @Column(name = "reaction_type", nullable = false)
    private String reactionType; // Emoji like "👍", "❤️", "😂", etc.
    
    @Column(name = "created_by", nullable = false)
    private String createdBy; // Device ID
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm[:ss]")
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "post_id", nullable = false)
    private Long postId;
    
    @Column(name = "post_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private PostType postType;
    
    @Column(name = "target_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private TargetType targetType; // POST or COMMENT
    
    @Column(name = "target_id") // comment ID if reacting to comment
    private Long targetId;
    
    public enum PostType {
        EVENT, LOST_FOUND, ANNOUNCEMENT
    }
    
    public enum TargetType {
        POST, COMMENT
    }
    
    // Constructors
    public Reaction() {
        this.createdAt = LocalDateTime.now();
    }
    
    public Reaction(String reactionType, String createdBy, Long postId, PostType postType, TargetType targetType) {
        this();
        this.reactionType = reactionType;
        this.createdBy = createdBy;
        this.postId = postId;
        this.postType = postType;
        this.targetType = targetType;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getReactionType() { return reactionType; }
    public void setReactionType(String reactionType) { this.reactionType = reactionType; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public Long getPostId() { return postId; }
    public void setPostId(Long postId) { this.postId = postId; }
    
    public PostType getPostType() { return postType; }
    public void setPostType(PostType postType) { this.postType = postType; }
    
    public TargetType getTargetType() { return targetType; }
    public void setTargetType(TargetType targetType) { this.targetType = targetType; }
    
    public Long getTargetId() { return targetId; }
    public void setTargetId(Long targetId) { this.targetId = targetId; }
}
