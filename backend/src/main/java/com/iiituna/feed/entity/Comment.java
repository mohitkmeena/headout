package com.iiituna.feed.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "comments")
public class Comment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Comment content is required")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;
    
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
    
    @Column(name = "parent_id")
    private Long parentId; // For nested comments
    
    @OneToMany(mappedBy = "parentId", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Comment> replies = new ArrayList<>();
    
    @Column(name = "is_toxic")
    private Boolean isToxic = false;
    
    @Column(name = "toxicity_score")
    private Double toxicityScore = 0.0;
    
    public enum PostType {
        EVENT, LOST_FOUND, ANNOUNCEMENT
    }
    
    // Constructors
    public Comment() {
        this.createdAt = LocalDateTime.now();
    }
    
    public Comment(String content, String createdBy, Long postId, PostType postType) {
        this();
        this.content = content;
        this.createdBy = createdBy;
        this.postId = postId;
        this.postType = postType;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public Long getPostId() { return postId; }
    public void setPostId(Long postId) { this.postId = postId; }
    
    public PostType getPostType() { return postType; }
    public void setPostType(PostType postType) { this.postType = postType; }
    
    public Long getParentId() { return parentId; }
    public void setParentId(Long parentId) { this.parentId = parentId; }
    
    public List<Comment> getReplies() { return replies; }
    public void setReplies(List<Comment> replies) { this.replies = replies; }
    
    public Boolean getIsToxic() { return isToxic; }
    public void setIsToxic(Boolean isToxic) { this.isToxic = isToxic; }
    
    public Double getToxicityScore() { return toxicityScore; }
    public void setToxicityScore(Double toxicityScore) { this.toxicityScore = toxicityScore; }
}
