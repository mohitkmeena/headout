'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import CommentSection from '@/components/comments/CommentSection';
import ReactionButton from '@/components/reactions/ReactionButton';

interface PostData {
  id: number;
  title?: string;
  description?: string;
  content?: string;
  itemName?: string;
  department?: string;
  type?: string;
  priority?: string;
  location?: string;
  eventDate?: string;
  expiryDate?: string;
  createdBy: string;
  createdAt: string;
  imageUrl?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  contactInfo?: string;
  isResolved?: boolean;
  isPinned?: boolean;
  isExpired?: boolean;
  // Event specific
  goingCount?: number;
  interestedCount?: number;
  notGoingCount?: number;
  userResponse?: string;
}

interface EnhancedFeedPostProps {
  post: PostData;
  postType: 'event' | 'lost_found' | 'announcement';
  onEdit?: (post: PostData) => void;
  onDelete?: (id: number) => void;
  className?: string;
}

const EnhancedFeedPost: React.FC<EnhancedFeedPostProps> = ({ 
  post, 
  postType, 
  onEdit, 
  onDelete, 
  className = '' 
}) => {
  const [showComments, setShowComments] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPostTitle = () => {
    switch (postType) {
      case 'event':
        return post.title;
      case 'lost_found':
        return post.itemName;
      case 'announcement':
        return post.title;
      default:
        return 'Unknown Post';
    }
  };

  const getPostContent = () => {
    switch (postType) {
      case 'event':
        return post.description;
      case 'lost_found':
        return post.description;
      case 'announcement':
        return post.content;
      default:
        return '';
    }
  };

  const getPostTypeIcon = () => {
    switch (postType) {
      case 'event':
        return '📅';
      case 'lost_found':
        return post.type === 'LOST' ? '🔍' : '✅';
      case 'announcement':
        return '📢';
      default:
        return '📝';
    }
  };

  const getPostTypeBadge = () => {
    switch (postType) {
      case 'event':
        return <Badge variant="default">Event</Badge>;
      case 'lost_found':
        return (
          <Badge variant={post.type === 'LOST' ? 'destructive' : 'default'}>
            {post.type}
          </Badge>
        );
      case 'announcement':
        return <Badge variant="secondary">Announcement</Badge>;
      default:
        return null;
    }
  };

  const getPriorityBadge = () => {
    if (!post.priority) return null;
    
    const variants = {
      'URGENT': 'destructive',
      'HIGH': 'destructive',
      'MEDIUM': 'secondary',
      'LOW': 'outline'
    } as const;
    
    return (
      <Badge variant={variants[post.priority as keyof typeof variants] || 'outline'}>
        {post.priority}
      </Badge>
    );
  };

  const renderEventDetails = () => (
    <div className="mt-3 space-y-2">
      {post.location && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>📍</span>
          <span>{post.location}</span>
        </div>
      )}
      {post.eventDate && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>🕒</span>
          <span>{formatDate(post.eventDate)}</span>
        </div>
      )}
      {(post.goingCount || post.interestedCount || post.notGoingCount) && (
        <div className="flex items-center gap-4 text-sm">
          {post.goingCount && (
            <span className="text-green-600">✅ {post.goingCount} Going</span>
          )}
          {post.interestedCount && (
            <span className="text-yellow-600">⭐ {post.interestedCount} Interested</span>
          )}
          {post.notGoingCount && (
            <span className="text-red-600">❌ {post.notGoingCount} Not Going</span>
          )}
        </div>
      )}
    </div>
  );

  const renderLostFoundDetails = () => (
    <div className="mt-3 space-y-2">
      {post.location && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>📍</span>
          <span>{post.location}</span>
        </div>
      )}
      {post.contactInfo && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>📞</span>
          <span>{post.contactInfo}</span>
        </div>
      )}
      {post.isResolved && (
        <Badge variant="default" className="text-green-700 bg-green-100">
          ✅ Resolved
        </Badge>
      )}
    </div>
  );

  const renderAnnouncementDetails = () => (
    <div className="mt-3 space-y-2">
      {post.department && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>🏢</span>
          <span>{post.department}</span>
        </div>
      )}
      {post.expiryDate && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>⏰</span>
          <span>Expires: {formatDate(post.expiryDate)}</span>
        </div>
      )}
      {post.attachmentUrl && (
        <div className="mt-2">
          <a
            href={post.attachmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-2"
          >
            <span>📎</span>
            <span>{post.attachmentName || 'View Attachment'}</span>
          </a>
        </div>
      )}
    </div>
  );

  const content = getPostContent();
  const shouldTruncate = content && content.length > 200;
  const displayContent = shouldTruncate && !showFullContent 
    ? content.substring(0, 200) + '...' 
    : content;

  return (
    <div className={className}>
      <Card className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getPostTypeIcon()}</span>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {getPostTitle()}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500">
                  by {post.createdBy.startsWith('device_') 
                    ? `User ${post.createdBy.slice(-4)}` 
                    : post.createdBy}
                </span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-500">
                  {formatDate(post.createdAt)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {getPostTypeBadge()}
            {getPriorityBadge()}
            {post.isPinned && <Badge variant="outline">📌 Pinned</Badge>}
            {post.isExpired && <Badge variant="destructive">Expired</Badge>}
          </div>
        </div>

        {/* Content */}
        {content && (
          <div className="mb-4">
            <p className="text-gray-700 whitespace-pre-wrap">
              {displayContent}
            </p>
            {shouldTruncate && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFullContent(!showFullContent)}
                className="mt-2"
              >
                {showFullContent ? 'Show Less' : 'Read More'}
              </Button>
            )}
          </div>
        )}

        {/* Image */}
        {post.imageUrl && (
          <div className="mb-4">
            <img
              src={post.imageUrl}
              alt="Post image"
              className="rounded-lg max-w-full h-auto max-h-64 object-cover"
            />
          </div>
        )}

        {/* Post-specific details */}
        {postType === 'event' && renderEventDetails()}
        {postType === 'lost_found' && renderLostFoundDetails()}
        {postType === 'announcement' && renderAnnouncementDetails()}

        {/* Actions */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          <div className="flex items-center gap-4">
            <ReactionButton
              postType={postType}
              postId={post.id}
            />
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowComments(!showComments)}
            >
              💬 Comments
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(post)}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(post.id)}
              >
                Delete
              </Button>
            )}
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-6 pt-6 border-t">
            <CommentSection
              postType={postType}
              postId={post.id}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default EnhancedFeedPost;
