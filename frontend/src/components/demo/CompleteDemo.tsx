'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import CreatePostForm from '@/components/forms/CreatePostForm';
import CompleteFeed from '@/components/feed/CompleteFeed';
import Dashboard from '@/components/dashboard/Dashboard';
import AdvancedSearch from '@/components/search/AdvancedSearch';
import ApiTestSuite from '@/components/integration/ApiTestSuite';

type DemoView = 'feed' | 'create' | 'dashboard' | 'search' | 'api-test';

const CompleteDemo: React.FC = () => {
  const [currentView, setCurrentView] = useState<DemoView>('feed');

  const views = [
    { 
      key: 'feed', 
      label: 'Complete Feed', 
      icon: '🏠',
      description: 'View all posts with comments and reactions'
    },
    { 
      key: 'create', 
      label: 'Create Posts', 
      icon: '➕',
      description: 'Create events, lost & found, announcements'
    },
    { 
      key: 'dashboard', 
      label: 'Dashboard', 
      icon: '📊',
      description: 'Statistics and health monitoring'
    },
    { 
      key: 'search', 
      label: 'Advanced Search', 
      icon: '🔍',
      description: 'Search and filter content'
    },
    { 
      key: 'api-test', 
      label: 'API Tests', 
      icon: '🧪',
      description: 'Test all backend endpoints'
    }
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'feed':
        return <CompleteFeed />;
      case 'create':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Post</h1>
              <p className="text-gray-600">
                Use the form below to create events, lost & found items, or announcements.
              </p>
            </div>
            <CreatePostForm
              onPostCreated={(post) => {
                alert('Post created successfully!');
                setCurrentView('feed');
              }}
            />
          </div>
        );
      case 'dashboard':
        return <Dashboard />;
      case 'search':
        return <AdvancedSearch />;
      case 'api-test':
        return <ApiTestSuite />;
      default:
        return <CompleteFeed />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <Card className="sticky top-0 z-50 rounded-none border-x-0 border-t-0 bg-white/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">IIIT-Una Feed</h1>
              <p className="text-sm text-gray-600">Complete Hackathon Demo</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default">v1.0</Badge>
              <Badge variant="outline">Demo Mode</Badge>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2">
            {views.map(({ key, label, icon, description }) => (
              <Button
                key={key}
                variant={currentView === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentView(key as DemoView)}
                className="flex items-center gap-2"
                title={description}
              >
                <span>{icon}</span>
                <span className="hidden sm:inline">{label}</span>
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Content Area */}
      <div className="pb-8">
        {renderContent()}
      </div>

      {/* Feature Overview */}
      {currentView === 'feed' && (
        <div className="max-w-6xl mx-auto px-6 pb-8">
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🎉 Hackathon Features Demo</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg border">
                <h3 className="font-semibold text-gray-800 mb-2">📝 Smart Post Creation</h3>
                <p className="text-sm text-gray-600">
                  Single form handles events, lost & found, and announcements with validation
                </p>
              </div>
              
              <div className="p-4 bg-white rounded-lg border">
                <h3 className="font-semibold text-gray-800 mb-2">💬 Comment System</h3>
                <p className="text-sm text-gray-600">
                  Nested comments with toxicity detection and reply functionality
                </p>
              </div>
              
              <div className="p-4 bg-white rounded-lg border">
                <h3 className="font-semibold text-gray-800 mb-2">👍 Reactions</h3>
                <p className="text-sm text-gray-600">
                  6 reaction types for posts and comments with real-time counts
                </p>
              </div>
              
              <div className="p-4 bg-white rounded-lg border">
                <h3 className="font-semibold text-gray-800 mb-2">🔍 Advanced Search</h3>
                <p className="text-sm text-gray-600">
                  Filter by content, location, user, and type with smart suggestions
                </p>
              </div>
              
              <div className="p-4 bg-white rounded-lg border">
                <h3 className="font-semibold text-gray-800 mb-2">📊 Real-time Dashboard</h3>
                <p className="text-sm text-gray-600">
                  Statistics, health monitoring, and quick access to recent content
                </p>
              </div>
              
              <div className="p-4 bg-white rounded-lg border">
                <h3 className="font-semibold text-gray-800 mb-2">🧪 API Testing</h3>
                <p className="text-sm text-gray-600">
                  Comprehensive endpoint testing with performance monitoring
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-white rounded-lg border-2 border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">✅ Team Contributions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong className="text-blue-700">Backend (Mohitkmeena):</strong>
                  <br />Spring Boot APIs, entities, repositories, controllers, MySQL integration
                </div>
                <div>
                  <strong className="text-purple-700">Frontend (Siddharth Pundir):</strong>
                  <br />Next.js components, forms, UI/UX, Tailwind CSS, API integration
                </div>
                <div>
                  <strong className="text-green-700">Full Stack (Rituraj):</strong>
                  <br />System integration, testing suite, documentation, deployment
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CompleteDemo;
