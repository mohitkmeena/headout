"use client";

import { useState, useEffect } from 'react';
import PostInput from '@/components/post/PostInput';
import FeedPost from '@/components/feed/FeedPost';
import FeedSkeleton from '@/components/feed/FeedSkeleton';
import { Post } from '@/types/post';
import { api } from '@/services/api';

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const deviceId = api.getUserDeviceId();
      
      // Fetch both events and lost/found items using the API service
      const [events, lostFoundItems] = await Promise.all([
        api.events.getAll(deviceId),
        api.lostFound.getAll()
      ]);

      // Combine and sort by creation date
      const allPosts: Post[] = [
        ...events.map((event: any) => ({
          id: event.id,
          type: 'event' as const,
          title: event.title,
          description: event.description,
          location: event.location,
          eventDate: event.eventDate,
          imageUrl: event.imageUrl,
          createdBy: event.createdBy,
          createdAt: event.createdAt,
          goingCount: event.goingCount,
          interestedCount: event.interestedCount,
          notGoingCount: event.notGoingCount,
          userResponse: event.userResponse
        })),
        ...lostFoundItems.map((item: any) => ({
          id: item.id,
          type: item.type.toLowerCase() === 'lost' ? 'lost' as const : 'found' as const,
          title: item.itemName,
          description: item.description,
          location: item.location,
          incidentDate: item.incidentDate,
          imageUrl: item.imageUrl,
          contactInfo: item.contactInfo,
          createdBy: item.createdBy,
          createdAt: item.createdAt,
          isResolved: item.isResolved,
          resolvedAt: item.resolvedAt,
          resolvedBy: item.resolvedBy
        }))
      ];

      // Sort by creation date (newest first)
      allPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setPosts(allPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = () => {
    fetchPosts(); // Refresh posts after creating a new one
  };

  if (loading) {
    return <FeedSkeleton />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Post Input */}
      <PostInput onPostCreated={handlePostCreated} />

      {/* Feed */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No posts yet</h3>
            <p className="text-slate-600">Be the first to share something with the campus!</p>
          </div>
        ) : (
          posts.map((post) => (
            <FeedPost key={`${post.type}-${post.id}`} post={post} onUpdate={fetchPosts} />
          ))
        )}
      </div>
    </div>
  );
}