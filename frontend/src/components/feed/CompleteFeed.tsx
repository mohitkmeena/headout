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
    } catch (error: any) {
      setError('Failed to load feed. Please try again.');
      console.error('Error loading feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFeed();
    setRefreshing(false);
  };

  const handlePostCreated = (newPost: any) => {
    setShowCreateForm(false);
    handleRefresh(); // Reload the feed
  };

  const handleDeletePost = async (postId: number, postType: 'event' | 'lost_found' | 'announcement') => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      switch (postType) {
        case 'event':
          await api.events.delete(postId, userId);
          break;
        case 'lost_found':
          await api.lostFound.delete(postId, userId);
          break;
        case 'announcement':
          await api.announcements.delete(postId, userId);
          break;
      }
      
      // Remove from local state
      setPosts(posts => posts.filter(post => !(post.id === postId && post.type === postType)));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  const getFilterCount = (filterType: FeedFilter) => {
    if (filterType === 'all') return posts.length;
    if (filterType === 'my_posts') {
      return posts.filter(post => post.data.createdBy === userId).length;
    }
    return posts.filter(post => post.type === filterType.replace('_', '_')).length;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <LoadingSpinner />
        <div className="text-center mt-4">
          <p className="text-gray-600">Loading your feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">IIIT-Una Feed</h1>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? 'Refreshing...' : '🔄 Refresh'}
          </Button>
          <Button
            onClick={() => setShowCreateForm(true)}
          >
            ➕ Create Post
          </Button>
        </div>
      </div>

      {error && (
        <Card className="p-4 mb-6 bg-red-50 border-red-200">
          <p className="text-red-700">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="mt-2"
          >
            Try Again
          </Button>
        </Card>
      )}

      {/* Create Post Form */}
      {showCreateForm && (
        <div className="mb-6">
          <CreatePostForm
            onPostCreated={handlePostCreated}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'all', label: 'All Posts', icon: '🏠' },
          { key: 'events', label: 'Events', icon: '📅' },
          { key: 'lost_found', label: 'Lost & Found', icon: '🔍' },
          { key: 'announcements', label: 'Announcements', icon: '📢' },
          { key: 'my_posts', label: 'My Posts', icon: '👤' },
        ].map(({ key, label, icon }) => (
          <Button
            key={key}
            variant={filter === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(key as FeedFilter)}
            className="flex items-center gap-2"
          >
            <span>{icon}</span>
            <span>{label}</span>
            <Badge variant="secondary" className="ml-1">
              {getFilterCount(key as FeedFilter)}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Feed Posts */}
      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <EnhancedFeedPost
              key={`${post.type}-${post.id}`}
              post={post.data}
              postType={post.type}
              onDelete={(id) => handleDeletePost(id, post.type)}
              className="transition-all duration-200 hover:shadow-lg"
            />
          ))
        ) : (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">
              {filter === 'events' ? '📅' : 
               filter === 'lost_found' ? '🔍' : 
               filter === 'announcements' ? '📢' : 
               filter === 'my_posts' ? '👤' : '🏠'}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {filter === 'my_posts' ? 'No posts by you yet' : `No ${filter === 'all' ? 'posts' : filter.replace('_', ' & ')} available`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'my_posts' 
                ? 'Create your first post to get started!'
                : `Be the first to create a ${filter === 'all' ? 'post' : filter.replace('_', ' & ').toLowerCase()}!`}
            </p>
            <Button
              onClick={() => setShowCreateForm(true)}
            >
              Create {filter === 'all' ? 'Post' : filter === 'lost_found' ? 'Lost & Found' : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Button>
          </Card>
        )}
      </div>

      {/* Load More Button (for future pagination) */}
      {posts.length > 0 && (
        <div className="text-center mt-8">
          <Button variant="outline" disabled>
            That's all for now! 🎉
          </Button>
        </div>
      )}
    </div>
  );
};

export default CompleteFeed;
