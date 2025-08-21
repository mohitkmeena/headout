'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Button } from '@/components/ui/Button';

interface ReactionButtonProps {
  postType: 'event' | 'lost_found' | 'announcement';
  postId: number;
  commentId?: number;
  className?: string;
}

interface ReactionData {
  [key: string]: {
    count: number;
    userReacted: boolean;
  };
}

const ReactionButton: React.FC<ReactionButtonProps> = ({ 
  postType, 
  postId, 
  commentId,
  className = '' 
}) => {
  const [reactions, setReactions] = useState<ReactionData>({});
  const [loading, setLoading] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const userId = api.getUserDeviceId();
  
  const reactionEmojis = {
    'LIKE': '👍',
    'LOVE': '❤️',
    'LAUGH': '😂',
    'WOW': '😮',
    'SAD': '😢',
    'ANGRY': '😠'
  };

  useEffect(() => {
    loadReactions();
  }, [postType, postId, commentId]);

  const loadReactions = async () => {
    try {
      const response = commentId 
        ? await api.reactions.getCommentReactions(postType, postId, commentId, userId)
        : await api.reactions.getPostReactions(postType, postId, userId);
      
      setReactions(response || {});
    } catch (error) {
      console.error('Error loading reactions:', error);
    }
  };

  const handleReaction = async (reactionType: string) => {
    if (loading) return;
    
    try {
      setLoading(true);
      
      if (commentId) {
        await api.reactions.addCommentReaction(postType, postId, commentId, userId, reactionType);
      } else {
        await api.reactions.addPostReaction(postType, postId, userId, reactionType);
      }
      
      await loadReactions(); // Reload reactions
      setShowReactions(false);
    } catch (error) {
      console.error('Error adding reaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalReactions = () => {
    if (!reactions || typeof reactions !== 'object') return 0;
    return Object.values(reactions).reduce((total, reaction) => total + (reaction?.count || 0), 0);
  };

  const getUserReaction = () => {
    if (!reactions || typeof reactions !== 'object') return undefined;
    return Object.entries(reactions).find(([_, data]) => data?.userReacted)?.[0];
  };

  const getMostPopularReactions = () => {
    if (!reactions || typeof reactions !== 'object') return [];
    return Object.entries(reactions)
      .sort(([,a], [,b]) => (b?.count || 0) - (a?.count || 0))
      .slice(0, 3)
      .filter(([_, data]) => (data?.count || 0) > 0);
  };

  const totalReactions = getTotalReactions();
  const userReaction = getUserReaction();
  const popularReactions = getMostPopularReactions();

  return (
    <div className={`relative ${className}`}>
      {/* Main reaction button */}
      <Button
        variant={userReaction ? 'default' : 'outline'}
        size="sm"
        onClick={() => setShowReactions(!showReactions)}
        className="flex items-center gap-2"
        disabled={loading}
      >
        {userReaction ? (
          <>
            <span>{reactionEmojis[userReaction as keyof typeof reactionEmojis]}</span>
            <span>{userReaction.toLowerCase()}</span>
          </>
        ) : (
          <>
            <span>👍</span>
            <span>React</span>
          </>
        )}
        {totalReactions > 0 && (
          <span className="text-sm">({totalReactions})</span>
        )}
      </Button>

      {/* Reaction picker */}
      {showReactions && (
        <div className="absolute bottom-full left-0 mb-2 bg-white border rounded-lg shadow-lg p-2 flex gap-1 z-10">
          {Object.entries(reactionEmojis).map(([type, emoji]) => (
            <button
              key={type}
              onClick={() => handleReaction(type)}
              className="p-2 hover:bg-gray-100 rounded transition-colors text-xl"
              title={type.toLowerCase()}
              disabled={loading}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Reaction summary */}
      {popularReactions.length > 0 && (
        <div className="mt-1 flex items-center gap-1 text-sm text-gray-600">
          {popularReactions.map(([type, data]) => (
            <span key={type} className="flex items-center gap-1">
              <span>{reactionEmojis[type as keyof typeof reactionEmojis]}</span>
              <span>{data.count}</span>
            </span>
          ))}
        </div>
      )}

      {/* Click outside to close */}
      {showReactions && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowReactions(false)}
        />
      )}
    </div>
  );
};

export default ReactionButton;
