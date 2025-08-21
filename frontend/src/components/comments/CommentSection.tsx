'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';

interface Comment {
  id: number;
  content: string;
  createdBy: string;
  createdAt: string;
  postId: number;
  postType: string;
  parentId?: number;
  replies?: Comment[];
  isToxic?: boolean;
  toxicityScore?: number;
}

interface CommentSectionProps {
  postType: 'event' | 'lost_found' | 'announcement';
  postId: number;
  className?: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postType, postId, className = '' }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const userId = api.getUserDeviceId();

  useEffect(() => {
    loadComments();
  }, [postType, postId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const response = await api.comments.getForPost(postType, postId);
      setComments(response || []);
    } catch (error: any) {
      setError('Failed to load comments');
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      await api.comments.add(postType, postId, newComment, userId);
      setNewComment('');
      await loadComments(); // Reload comments
    } catch (error: any) {
      setError('Failed to add comment');
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddReply = async (parentId: number) => {
    if (!replyContent.trim()) return;

    try {
      setSubmitting(true);
      await api.comments.addReply(parentId, replyContent, userId);
      setReplyContent('');
      setReplyingTo(null);
      await loadComments(); // Reload comments
    } catch (error: any) {
      setError('Failed to add reply');
      console.error('Error adding reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 3600);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? 'ml-8 mt-3' : 'mb-4'}`}>
      <Card className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">
              {comment.createdBy.startsWith('device_') 
                ? `User ${comment.createdBy.slice(-4)}` 
                : comment.createdBy}
            </span>
            <span className="text-sm text-gray-500">
              {formatDate(comment.createdAt)}
            </span>
            {comment.isToxic && (
              <Badge variant="destructive" className="text-xs">
                Flagged
              </Badge>
            )}
          </div>
          
          {!isReply && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
            >
              Reply
            </Button>
          )}
        </div>
        
        <p className="text-gray-700 mb-3">{comment.content}</p>
        
        {/* Reply form */}
        {replyingTo === comment.id && (
          <div className="mt-3 p-3 bg-gray-50 rounded-md">
            <form onSubmit={(e) => { e.preventDefault(); handleAddReply(comment.id); }}>
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                rows={2}
                className="mb-2"
              />
              <div className="flex gap-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={submitting || !replyContent.trim()}
                >
                  {submitting ? 'Posting...' : 'Reply'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
        
        {/* Render replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3">
            {comment.replies.map(reply => renderComment(reply, true))}
          </div>
        )}
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Comments ({comments.length})
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={loadComments}
        >
          Refresh
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Add comment form */}
      <Card className="p-4 mb-6">
        <form onSubmit={handleAddComment}>
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            className="mb-3"
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              Be respectful and constructive in your comments
            </span>
            <Button
              type="submit"
              disabled={submitting || !newComment.trim()}
            >
              {submitting ? 'Posting...' : 'Add Comment'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Comments list */}
      <div className="space-y-0">
        {comments.length > 0 ? (
          comments.map(comment => renderComment(comment))
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-500 mb-4">No comments yet</p>
            <p className="text-sm text-gray-400">Be the first to share your thoughts!</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
