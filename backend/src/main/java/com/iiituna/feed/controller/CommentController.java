package com.iiituna.feed.controller;

import com.iiituna.feed.entity.Comment;
import com.iiituna.feed.entity.Comment.PostType;
import com.iiituna.feed.repository.CommentRepository;
import com.iiituna.feed.service.AiService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:3000")
public class CommentController {
    
    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private AiService aiService;
    
    // Get comments for a post
    @GetMapping("/{postType}/{postId}")
    public ResponseEntity<List<Comment>> getComments(@PathVariable String postType, @PathVariable Long postId) {
        try {
            PostType type = PostType.valueOf(postType.toUpperCase().replace("-", "_"));
            List<Comment> comments = commentRepository.findByPostIdAndPostTypeAndParentIdIsNullOrderByCreatedAtAsc(postId, type);
            
            // Load replies for each comment
            for (Comment comment : comments) {
                List<Comment> replies = commentRepository.findByParentIdOrderByCreatedAtAsc(comment.getId());
                comment.setReplies(replies);
            }
            
            return ResponseEntity.ok(comments);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Add a comment
    @PostMapping("/{postType}/{postId}")
    public ResponseEntity<Comment> addComment(
            @PathVariable String postType, 
            @PathVariable Long postId,
            @RequestParam String userId,
            @RequestBody Map<String, String> request) {
        
        try {
            String content = request.get("content");
            if (content == null || content.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            
            PostType type = PostType.valueOf(postType.toUpperCase().replace("-", "_"));
            
            // Check for toxicity
            AiService.ToxicityResult toxicityResult = aiService.checkToxicity(content);
            
            Comment comment = new Comment();
            comment.setContent(content);
            comment.setCreatedBy(userId);
            comment.setPostId(postId);
            comment.setPostType(type);
            comment.setCreatedAt(LocalDateTime.now());
            comment.setIsToxic(toxicityResult.isToxic());
            comment.setToxicityScore(toxicityResult.getToxicityScore());
            
            // Set parent ID if it's a reply
            String parentIdStr = request.get("parentId");
            if (parentIdStr != null && !parentIdStr.isEmpty()) {
                comment.setParentId(Long.parseLong(parentIdStr));
            }
            
            Comment savedComment = commentRepository.save(comment);
            
            // Return response with toxicity warning if needed
            if (toxicityResult.isToxic() && toxicityResult.getSuggestion() != null) {
                // You could add toxicity warning to response headers or response body
                return ResponseEntity.status(HttpStatus.CREATED).body(savedComment);
            }
            
            return ResponseEntity.status(HttpStatus.CREATED).body(savedComment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Add a reply to a comment
    @PostMapping("/{commentId}/reply")
    public ResponseEntity<Comment> addReply(
            @PathVariable Long commentId,
            @RequestParam String userId,
            @RequestBody Map<String, String> request) {
        
        Optional<Comment> parentComment = commentRepository.findById(commentId);
        if (parentComment.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        String content = request.get("content");
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        // Check for toxicity
        AiService.ToxicityResult toxicityResult = aiService.checkToxicity(content);
        
        Comment reply = new Comment();
        reply.setContent(content);
        reply.setCreatedBy(userId);
        reply.setPostId(parentComment.get().getPostId());
        reply.setPostType(parentComment.get().getPostType());
        reply.setParentId(commentId);
        reply.setCreatedAt(LocalDateTime.now());
        reply.setIsToxic(toxicityResult.isToxic());
        reply.setToxicityScore(toxicityResult.getToxicityScore());
        
        Comment savedReply = commentRepository.save(reply);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedReply);
    }
    
    // Update a comment
    @PutMapping("/{commentId}")
    public ResponseEntity<Comment> updateComment(
            @PathVariable Long commentId,
            @RequestParam String userId,
            @RequestBody Map<String, String> request) {
        
        Optional<Comment> existingComment = commentRepository.findById(commentId);
        if (existingComment.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Comment comment = existingComment.get();
        if (!comment.getCreatedBy().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        String content = request.get("content");
        if (content != null && !content.trim().isEmpty()) {
            // Check for toxicity
            AiService.ToxicityResult toxicityResult = aiService.checkToxicity(content);
            
            comment.setContent(content);
            comment.setIsToxic(toxicityResult.isToxic());
            comment.setToxicityScore(toxicityResult.getToxicityScore());
        }
        
        Comment savedComment = commentRepository.save(comment);
        return ResponseEntity.ok(savedComment);
    }
    
    // Delete a comment
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId, @RequestParam String userId) {
        Optional<Comment> comment = commentRepository.findById(commentId);
        if (comment.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        if (!comment.get().getCreatedBy().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        commentRepository.deleteById(commentId);
        return ResponseEntity.noContent().build();
    }
    
    // Get comment count for a post
    @GetMapping("/{postType}/{postId}/count")
    public ResponseEntity<Map<String, Long>> getCommentCount(@PathVariable String postType, @PathVariable Long postId) {
        try {
            PostType type = PostType.valueOf(postType.toUpperCase().replace("-", "_"));
            long count = commentRepository.countByPostIdAndPostType(postId, type);
            return ResponseEntity.ok(Map.of("count", count));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
