package com.iiituna.feed.controller;

import com.iiituna.feed.entity.Reaction;
import com.iiituna.feed.entity.Reaction.PostType;
import com.iiituna.feed.entity.Reaction.TargetType;
import com.iiituna.feed.repository.ReactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reactions")
@CrossOrigin(origins = "http://localhost:3000")
public class ReactionController {
    
    @Autowired
    private ReactionRepository reactionRepository;
    
    // Add or update reaction to a post
    @PostMapping("/{postType}/{postId}")
    public ResponseEntity<Map<String, Object>> addPostReaction(
            @PathVariable String postType,
            @PathVariable Long postId,
            @RequestParam String userId,
            @RequestParam String reactionType) {
        
        try {
            PostType type = PostType.valueOf(postType.toUpperCase().replace("-", "_"));
            
            // Check if user already reacted
            Optional<Reaction> existingReaction = reactionRepository
                .findByPostIdAndPostTypeAndCreatedByAndTargetType(postId, type, userId, TargetType.POST);
            
            if (existingReaction.isPresent()) {
                Reaction reaction = existingReaction.get();
                if (reaction.getReactionType().equals(reactionType)) {
                    // Same reaction - remove it
                    reactionRepository.delete(reaction);
                    return ResponseEntity.ok(Map.of("action", "removed", "reactionType", reactionType));
                } else {
                    // Different reaction - update it
                    reaction.setReactionType(reactionType);
                    reaction.setCreatedAt(LocalDateTime.now());
                    reactionRepository.save(reaction);
                    return ResponseEntity.ok(Map.of("action", "updated", "reactionType", reactionType));
                }
            } else {
                // New reaction
                Reaction reaction = new Reaction();
                reaction.setReactionType(reactionType);
                reaction.setCreatedBy(userId);
                reaction.setPostId(postId);
                reaction.setPostType(type);
                reaction.setTargetType(TargetType.POST);
                reaction.setCreatedAt(LocalDateTime.now());
                
                reactionRepository.save(reaction);
                return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("action", "added", "reactionType", reactionType));
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Add or update reaction to a comment
    @PostMapping("/{postType}/{postId}/comment/{commentId}")
    public ResponseEntity<Map<String, Object>> addCommentReaction(
            @PathVariable String postType,
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @RequestParam String userId,
            @RequestParam String reactionType) {
        
        try {
            PostType type = PostType.valueOf(postType.toUpperCase().replace("-", "_"));
            
            // Check if user already reacted to this comment
            Optional<Reaction> existingReaction = reactionRepository
                .findByPostIdAndPostTypeAndCreatedByAndTargetTypeAndTargetId(
                    postId, type, userId, TargetType.COMMENT, commentId);
            
            if (existingReaction.isPresent()) {
                Reaction reaction = existingReaction.get();
                if (reaction.getReactionType().equals(reactionType)) {
                    // Same reaction - remove it
                    reactionRepository.delete(reaction);
                    return ResponseEntity.ok(Map.of("action", "removed", "reactionType", reactionType));
                } else {
                    // Different reaction - update it
                    reaction.setReactionType(reactionType);
                    reaction.setCreatedAt(LocalDateTime.now());
                    reactionRepository.save(reaction);
                    return ResponseEntity.ok(Map.of("action", "updated", "reactionType", reactionType));
                }
            } else {
                // New reaction
                Reaction reaction = new Reaction();
                reaction.setReactionType(reactionType);
                reaction.setCreatedBy(userId);
                reaction.setPostId(postId);
                reaction.setPostType(type);
                reaction.setTargetType(TargetType.COMMENT);
                reaction.setTargetId(commentId);
                reaction.setCreatedAt(LocalDateTime.now());
                
                reactionRepository.save(reaction);
                return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("action", "added", "reactionType", reactionType));
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Get reactions for a post
    @GetMapping("/{postType}/{postId}")
    public ResponseEntity<Map<String, Object>> getPostReactions(
            @PathVariable String postType,
            @PathVariable Long postId,
            @RequestParam(required = false) String userId) {
        
        try {
            PostType type = PostType.valueOf(postType.toUpperCase().replace("-", "_"));
            
            // Get reaction counts
            List<Object[]> reactionCounts = reactionRepository
                .countReactionsByTypeForPost(postId, type, TargetType.POST);
            
            Map<String, Long> counts = new HashMap<>();
            for (Object[] row : reactionCounts) {
                counts.put((String) row[0], (Long) row[1]);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("reactions", counts);
            
            // Get user's reaction if userId provided
            if (userId != null) {
                Optional<Reaction> userReaction = reactionRepository
                    .findByPostIdAndPostTypeAndCreatedByAndTargetType(postId, type, userId, TargetType.POST);
                response.put("userReaction", userReaction.map(Reaction::getReactionType).orElse(null));
            }
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Get reactions for a comment
    @GetMapping("/{postType}/{postId}/comment/{commentId}")
    public ResponseEntity<Map<String, Object>> getCommentReactions(
            @PathVariable String postType,
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @RequestParam(required = false) String userId) {
        
        try {
            PostType type = PostType.valueOf(postType.toUpperCase().replace("-", "_"));
            
            // Get reaction counts
            List<Object[]> reactionCounts = reactionRepository
                .countReactionsByTypeForComment(postId, type, TargetType.COMMENT, commentId);
            
            Map<String, Long> counts = new HashMap<>();
            for (Object[] row : reactionCounts) {
                counts.put((String) row[0], (Long) row[1]);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("reactions", counts);
            
            // Get user's reaction if userId provided
            if (userId != null) {
                Optional<Reaction> userReaction = reactionRepository
                    .findByPostIdAndPostTypeAndCreatedByAndTargetTypeAndTargetId(
                        postId, type, userId, TargetType.COMMENT, commentId);
                response.put("userReaction", userReaction.map(Reaction::getReactionType).orElse(null));
            }
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
