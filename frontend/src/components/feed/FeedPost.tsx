"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Post, EventResponse } from '@/types/post';
import { formatRelativeTime, getDeviceId } from '@/lib/utils';

interface FeedPostProps {
  post: Post;
  onUpdate: () => void;
}

const FeedPost = ({ post, onUpdate }: FeedPostProps) => {
  const [isResponding, setIsResponding] = useState(false);

  const getPostVariant = () => {
    switch (post.type) {
      case 'event': return 'event';
      case 'lost': return 'lost';
      case 'found': return 'found';
      case 'announcement': return 'announcement';
      default: return 'default';
    }
  };

  const getPostIcon = () => {
    switch (post.type) {
      case 'event':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'lost':
        return (
          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20.5a7.962 7.962 0 01-5-1.791M15 11V9a6 6 0 10-12 0v2" />
          </svg>
        );
      case 'found':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'announcement':
        return (
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        );
    }
  };

  const handleEventResponse = async (response: EventResponse) => {
    if (post.type !== 'event') return;
    
    setIsResponding(true);
    try {
      const deviceId = getDeviceId();
      const res = await fetch(`http://localhost:8080/api/events/${post.id}/response?userId=${deviceId}&response=${response}`, {
        method: 'POST',
      });
      
      if (res.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error responding to event:', error);
    } finally {
      setIsResponding(false);
    }
  };

  const handleMarkResolved = async () => {
    if (post.type !== 'lost' && post.type !== 'found') return;
    
    try {
      const deviceId = getDeviceId();
      const res = await fetch(`http://localhost:8080/api/lost-found/${post.id}/resolve?userId=${deviceId}`, {
        method: 'POST',
      });
      
      if (res.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error resolving item:', error);
    }
  };

  const renderEventDetails = () => {
    if (post.type !== 'event') return null;
    
    return (
      <div className="space-y-3">
        <div className="flex items-center text-sm text-slate-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {new Date(post.eventDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
        
        <div className="flex items-center text-sm text-slate-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {post.location}
        </div>

        {/* Event response buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <div className="flex space-x-1">
            <Button
              size="sm"
              variant={post.userResponse === 'GOING' ? 'default' : 'outline'}
              onClick={() => handleEventResponse('GOING')}
              disabled={isResponding}
            >
              👍 Going ({post.goingCount})
            </Button>
            <Button
              size="sm"
              variant={post.userResponse === 'INTERESTED' ? 'default' : 'outline'}
              onClick={() => handleEventResponse('INTERESTED')}
              disabled={isResponding}
            >
              ⭐ Interested ({post.interestedCount})
            </Button>
            <Button
              size="sm"
              variant={post.userResponse === 'NOT_GOING' ? 'destructive' : 'outline'}
              onClick={() => handleEventResponse('NOT_GOING')}
              disabled={isResponding}
            >
              ❌ Can't Go ({post.notGoingCount})
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderLostFoundDetails = () => {
    if (post.type !== 'lost' && post.type !== 'found') return null;
    
    return (
      <div className="space-y-3">
        <div className="flex items-center text-sm text-slate-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {post.type === 'lost' ? 'Last seen: ' : 'Found at: '}{post.location}
        </div>

        {post.contactInfo && (
          <div className="flex items-center text-sm text-slate-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact: {post.contactInfo}
          </div>
        )}

        {post.isResolved ? (
          <Badge variant="success">
            ✅ Resolved {post.resolvedAt && `on ${formatRelativeTime(post.resolvedAt)}`}
          </Badge>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={handleMarkResolved}
            className="w-full"
          >
            Mark as Resolved
          </Button>
        )}
      </div>
    );
  };

  return (
    <Card variant={getPostVariant()}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {getPostIcon()}
            <div>
              <CardTitle className="text-lg">{post.title}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant={post.type === 'event' ? 'default' : post.type === 'lost' ? 'warning' : post.type === 'found' ? 'success' : 'secondary'}>
                  {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                </Badge>
                <span className="text-sm text-slate-500">
                  {formatRelativeTime(post.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-slate-700 mb-4">{post.description}</p>
        
        {post.imageUrl && (
          <div className="mb-4">
            <img
              src={post.imageUrl}
              alt="Post attachment"
              className="rounded-lg max-w-full h-auto"
            />
          </div>
        )}

        {renderEventDetails()}
        {renderLostFoundDetails()}
      </CardContent>
    </Card>
  );
};

export default FeedPost;
