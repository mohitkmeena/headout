package com.iiituna.feed.repository;

import com.iiituna.feed.entity.Reaction;
import com.iiituna.feed.entity.Reaction.PostType;
import com.iiituna.feed.entity.Reaction.TargetType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    
    // Find user's reaction to a post
    Optional<Reaction> findByPostIdAndPostTypeAndCreatedByAndTargetType(
        Long postId, PostType postType, String createdBy, TargetType targetType);
    
    // Find user's reaction to a comment
    Optional<Reaction> findByPostIdAndPostTypeAndCreatedByAndTargetTypeAndTargetId(
        Long postId, PostType postType, String createdBy, TargetType targetType, Long targetId);
    
    // Get all reactions for a post
    List<Reaction> findByPostIdAndPostTypeAndTargetType(Long postId, PostType postType, TargetType targetType);
    
    // Get all reactions for a comment
    List<Reaction> findByPostIdAndPostTypeAndTargetTypeAndTargetId(
        Long postId, PostType postType, TargetType targetType, Long targetId);
    
    // Count reactions by type for a post
    @Query("SELECT r.reactionType, COUNT(r) FROM Reaction r WHERE r.postId = :postId " +
           "AND r.postType = :postType AND r.targetType = :targetType GROUP BY r.reactionType")
    List<Object[]> countReactionsByTypeForPost(@Param("postId") Long postId, 
                                               @Param("postType") PostType postType,
                                               @Param("targetType") TargetType targetType);
    
    // Count reactions by type for a comment
    @Query("SELECT r.reactionType, COUNT(r) FROM Reaction r WHERE r.postId = :postId " +
           "AND r.postType = :postType AND r.targetType = :targetType AND r.targetId = :targetId " +
           "GROUP BY r.reactionType")
    List<Object[]> countReactionsByTypeForComment(@Param("postId") Long postId, 
                                                  @Param("postType") PostType postType,
                                                  @Param("targetType") TargetType targetType,
                                                  @Param("targetId") Long targetId);
    
    // Find reactions by user
    List<Reaction> findByCreatedByOrderByCreatedAtDesc(String createdBy);
    
    // Delete user's reaction
    void deleteByPostIdAndPostTypeAndCreatedByAndTargetTypeAndTargetId(
        Long postId, PostType postType, String createdBy, TargetType targetType, Long targetId);
    
    void deleteByPostIdAndPostTypeAndCreatedByAndTargetType(
        Long postId, PostType postType, String createdBy, TargetType targetType);
}
