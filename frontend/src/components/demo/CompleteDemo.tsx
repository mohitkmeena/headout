'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Navigation from '@/components/ui/Navigation';
import CreatePostForm from '@/components/forms/CreatePostForm';
import CompleteFeed from '@/components/feed/CompleteFeed';

type DemoView = 'feed' | 'create';

const CompleteDemo: React.FC = () => {
  const [currentView, setCurrentView] = useState<DemoView>('feed');

  const handleCreatePost = () => {
    setCurrentView('create');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'feed':
        return <CompleteFeed />;
      case 'create':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create New Post
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl">
                Share events, lost & found items, or announcements with the campus community using our smart form system.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
              <CreatePostForm
                onPostCreated={(post) => {
                  alert('Post created successfully!');
                  setCurrentView('feed');
                }}
              />
            </div>
          </div>
        );
      default:
        return <CompleteFeed />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Modern Navigation */}
      <Navigation
        currentView={currentView}
        onViewChange={(view) => setCurrentView(view as DemoView)}
        onCreatePost={handleCreatePost}
      />

      {/* Content Area */}
      <div className="pb-8">
        {renderContent()}
      </div>

      {/* Enhanced Feature Overview */}
      {currentView === 'feed' && (
        <div className="max-w-7xl mx-auto px-6 pb-12">
          <Card className="p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">🎉 Hackathon Features Demo</h2>
              <p className="text-slate-600 text-lg">Experience the complete campus feed system</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="font-bold text-slate-800 mb-3 text-lg">Smart Post Creation</h3>
                <p className="text-slate-600 leading-relaxed">
                  Single form handles events, lost & found, and announcements with intelligent validation
                </p>
              </div>
              
              <div className="group p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="font-bold text-slate-800 mb-3 text-lg">Comment System</h3>
                <p className="text-slate-600 leading-relaxed">
                  Nested comments with toxicity detection and seamless reply functionality
                </p>
              </div>
              
              <div className="group p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">👍</span>
                </div>
                <h3 className="font-bold text-slate-800 mb-3 text-lg">Reactions</h3>
                <p className="text-slate-600 leading-relaxed">
                  6 reaction types for posts and comments with real-time counts and animations
                </p>
              </div>
              
              <div className="group p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="font-bold text-slate-800 mb-3 text-lg">Advanced Search</h3>
                <p className="text-slate-600 leading-relaxed">
                  Filter by content, location, user, and type with smart suggestions and filters
                </p>
              </div>
              
              <div className="group p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl border border-indigo-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="font-bold text-slate-800 mb-3 text-lg">Real-time Dashboard</h3>
                <p className="text-slate-600 leading-relaxed">
                  Live statistics, health monitoring, and quick access to recent content
                </p>
              </div>
              
              <div className="group p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl border border-pink-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🧪</span>
                </div>
                <h3 className="font-bold text-slate-800 mb-3 text-lg">API Testing</h3>
                <p className="text-slate-600 leading-relaxed">
                  Comprehensive endpoint testing with performance monitoring and validation
                </p>
              </div>
            </div>
            
            <div className="mt-10 p-8 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-3xl text-white">✅</span>
                </div>
                <h3 className="text-2xl font-bold text-emerald-800">Team Contributions</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="text-center p-4 bg-white rounded-xl border border-emerald-200 shadow-sm">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">M</span>
                  </div>
                  <strong className="text-blue-700 block mb-2">Backend (Mohitkmeena)</strong>
                  <p className="text-slate-600 leading-relaxed">
                    Spring Boot APIs, entities, repositories, controllers, MySQL integration
                  </p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-emerald-200 shadow-sm">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">S</span>
                  </div>
                  <strong className="text-purple-700 block mb-2">Frontend (Siddharth Pundir)</strong>
                  <p className="text-slate-600 leading-relaxed">
                    Next.js components, forms, UI/UX, Tailwind CSS, API integration
                  </p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-emerald-200 shadow-sm">
                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">R</span>
                  </div>
                  <strong className="text-emerald-700 block mb-2">Full Stack (Rituraj)</strong>
                  <p className="text-slate-600 leading-relaxed">
                    System integration, testing suite, documentation, deployment
                  </p>
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
