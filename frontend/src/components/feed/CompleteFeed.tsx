'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import CreatePostForm from '@/components/forms/CreatePostForm';
import EnhancedFeedPost from '@/components/feed/EnhancedFeedPost';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface FeedPost {
  id: number;
  type: 'event' | 'lost_found' | 'announcement';
  data: any;
  createdAt: string;
}

type FeedFilter = 'all' | 'events' | 'lost_found' | 'announcements' | 'my_posts';

const CompleteFeed: React.FC = () => {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filter, setFilter] = useState<FeedFilter>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = api.getUserDeviceId();

  useEffect(() => {
    loadFeed();
  }, [filter]);

  const loadFeed = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const feedPosts: FeedPost[] = [];

      // Load data based on filter
      if (filter === 'all' || filter === 'events') {
        try {
          const events = await api.events.getAll(userId);
          events.forEach((event: any) => {
            feedPosts.push({
              id: event.id,
              type: 'event',
              data: event,
              createdAt: event.createdAt
            });
          });
        } catch (err) {
          console.error('Error loading events:', err);
        }
      }

      if (filter === 'all' || filter === 'lost_found') {
        try {
          const lostFoundItems = await api.lostFound.getAll();
          lostFoundItems.forEach((item: any) => {
            feedPosts.push({
              id: item.id,
              type: 'lost_found',
              data: item,
              createdAt: item.createdAt
            });
          });
        } catch (err) {
          console.error('Error loading lost & found:', err);
        }
      }

      if (filter === 'all' || filter === 'announcements') {
        try {
          const announcements = await api.announcements.getAll();
          announcements.forEach((announcement: any) => {
            feedPosts.push({
              id: announcement.id,
              type: 'announcement',
              data: announcement,
              createdAt: announcement.createdAt
            });
          });
        } catch (err) {
          console.error('Error loading announcements:', err);
        }
      }

      if (filter === 'my_posts') {
        try {
          const [userEvents, userLostFound, userAnnouncements] = await Promise.all([
            api.events.getUserEvents(userId, userId),
            api.lostFound.getUserItems(userId),
            api.announcements.getUserAnnouncements(userId)
          ]);

          userEvents.forEach((event: any) => {
            feedPosts.push({
              id: event.id,
              type: 'event',
              data: event,
              createdAt: event.createdAt
            });
          });

          userLostFound.forEach((item: any) => {
            feedPosts.push({
              id: item.id,
              type: 'lost_found',
              data: item,
              createdAt: item.createdAt
            });
          });

          userAnnouncements.forEach((announcement: any) => {
            feedPosts.push({
              id: announcement.id,
              type: 'announcement',
              data: announcement,
              createdAt: announcement.createdAt
            });
          });
        } catch (err) {
          console.error('Error loading user posts:', err);
        }
      }

      // Sort by creation date (newest first)
      feedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setPosts(feedPosts);
    } catch (err: any) {
      setError(err.message || 'Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFeed();
    setRefreshing(false);
  };

  const handlePostCreated = (post: any) => {
    setShowCreateForm(false);
    loadFeed();
  };

  const filterConfig = {
    all: { label: 'All Posts', icon: '📰', color: 'from-slate-500 to-slate-600' },
    events: { label: 'Events', icon: '🎉', color: 'from-blue-500 to-blue-600' },
    lost_found: { label: 'Lost & Found', icon: '🔍', color: 'from-amber-500 to-amber-600' },
    announcements: { label: 'Announcements', icon: '📢', color: 'from-purple-500 to-purple-600' },
    my_posts: { label: 'My Posts', icon: '👤', color: 'from-green-500 to-green-600' }
  };

  if (showCreateForm) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create New Post</h1>
            <p className="text-slate-600">Share something with the campus community</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowCreateForm(false)}
            className="flex items-center gap-2"
          >
            ← Back to Feed
          </Button>
        </div>
        <Card className="p-8 shadow-xl">
          <CreatePostForm
            onPostCreated={handlePostCreated}
            onCancel={() => setShowCreateForm(false)}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Campus Feed</h1>
            <p className="text-lg text-slate-600">Stay updated with campus events, lost & found, and announcements</p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            variant="gradient"
            size="lg"
            className="shrink-0"
          >
            ✨ Create Post
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(filterConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setFilter(key as FeedFilter)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                filter === key
                  ? `bg-gradient-to-r ${config.color} text-white shadow-lg`
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-slate-300'
              }`}
            >
              <span>{config.icon}</span>
              <span>{config.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-slate-500">
          {posts.length} post{posts.length !== 1 ? 's' : ''} found
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          loading={refreshing}
          className="flex items-center gap-2"
        >
          🔄 Refresh
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="p-4 mb-6 border-red-200 bg-red-50">
          <div className="flex items-center gap-2 text-red-800">
            <span>⚠️</span>
            <span className="font-medium">{error}</span>
          </div>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <LoadingSpinner size="lg" variant="primary" />
            <p className="mt-4 text-slate-600">Loading your feed...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && posts.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📭</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No posts found</h3>
          <p className="text-slate-600 mb-6">
            {filter === 'my_posts' 
              ? "You haven't created any posts yet. Start sharing with the campus community!"
              : `No ${filter === 'all' ? '' : filter.replace('_', ' ')} posts available at the moment.`
            }
          </p>
          <Button
            onClick={() => setShowCreateForm(true)}
            variant="gradient"
            size="lg"
          >
            ✨ Create First Post
          </Button>
        </Card>
      )}

      {/* Feed Posts */}
      {!loading && posts.length > 0 && (
        <div className="space-y-6">
          {posts.map((post) => (
            <EnhancedFeedPost
              key={`${post.type}-${post.id}`}
              post={post}
              onPostUpdated={loadFeed}
            />
          ))}
        </div>
      )}

      {/* Load More Button (if needed) */}
      {!loading && posts.length > 0 && (
        <div className="text-center mt-8">
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="px-8"
          >
            Load More Posts
          </Button>
        </div>
      )}
    </div>
  );
};

export default CompleteFeed;
