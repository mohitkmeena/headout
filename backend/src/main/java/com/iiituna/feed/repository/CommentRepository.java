package com.iiituna.feed.repository;

import com.iiituna.feed.entity.Comment;
import com.iiituna.feed.entity.Comment.PostType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    // Find comments by post
    List<Comment> findByPostIdAndPostTypeOrderByCreatedAtAsc(Long postId, PostType postType);
    
    // Find top-level comments (no parent)
    List<Comment> findByPostIdAndPostTypeAndParentIdIsNullOrderByCreatedAtAsc(Long postId, PostType postType);
    
    // Find replies to a comment
    List<Comment> findByParentIdOrderByCreatedAtAsc(Long parentId);
    
    // Find comments by user
    List<Comment> findByCreatedByOrderByCreatedAtDesc(String createdBy);
    
    // Count comments for a post
    long countByPostIdAndPostType(Long postId, PostType postType);
    
    // Find recent comments
    @Query("SELECT c FROM Comment c WHERE c.postId = :postId AND c.postType = :postType " +
           "ORDER BY c.createdAt DESC")
    List<Comment> findRecentComments(@Param("postId") Long postId, @Param("postType") PostType postType);
    
    // Search comments by content
    @Query("SELECT c FROM Comment c WHERE LOWER(c.content) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "ORDER BY c.createdAt DESC")
    List<Comment> searchByContent(@Param("keyword") String keyword);
}
