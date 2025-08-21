'use client';

import React, { useState } from 'react';
import { api } from '@/services/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';

interface CreatePostFormProps {
  onPostCreated?: (post: any) => void;
  onCancel?: () => void;
}

type PostType = 'event' | 'lostfound' | 'announcement';

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onPostCreated, onCancel }) => {
  const [postType, setPostType] = useState<PostType>('event');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Common fields
  const [commonData, setCommonData] = useState({
    title: '',
    description: '',
    imageUrl: '',
  });
  
  // Event specific fields
  const [eventData, setEventData] = useState({
    location: '',
    eventDate: '',
  });
  
  // Lost & Found specific fields
  const [lostFoundData, setLostFoundData] = useState({
    itemName: '',
    type: 'LOST',
    location: '',
    incidentDate: '',
    contactInfo: '',
  });
  
  // Announcement specific fields
  const [announcementData, setAnnouncementData] = useState({
    content: '',
    department: '',
    type: 'GENERAL',
    priority: 'MEDIUM',
    attachmentUrl: '',
    attachmentName: '',
    expiryDate: '',
  });

  const userId = api.getUserDeviceId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;
      
      if (postType === 'event') {
        const eventPayload = {
          title: commonData.title,
          description: commonData.description,
          location: eventData.location,
          eventDate: eventData.eventDate,
          imageUrl: commonData.imageUrl,
        };
        response = await api.events.create(eventPayload, userId);
      } 
      else if (postType === 'lostfound') {
        const lostFoundPayload = {
          itemName: lostFoundData.itemName,
          description: commonData.description,
          type: lostFoundData.type,
          location: lostFoundData.location,
          incidentDate: lostFoundData.incidentDate || new Date().toISOString(),
          contactInfo: lostFoundData.contactInfo,
          imageUrl: commonData.imageUrl,
        };
        response = await api.lostFound.create(lostFoundPayload, userId);
      } 
      else if (postType === 'announcement') {
        const announcementPayload = {
          title: commonData.title,
          content: announcementData.content,
          department: announcementData.department,
          type: announcementData.type,
          priority: announcementData.priority,
          attachmentUrl: announcementData.attachmentUrl,
          attachmentName: announcementData.attachmentName,
          expiryDate: announcementData.expiryDate || null,
        };
        response = await api.announcements.create(announcementPayload, userId);
      }

      if (response) {
        setError(null);
        if (onPostCreated) {
          onPostCreated(response);
        }
        // Reset form
        setCommonData({ title: '', description: '', imageUrl: '' });
        setEventData({ location: '', eventDate: '' });
        setLostFoundData({ itemName: '', type: 'LOST', location: '', incidentDate: '', contactInfo: '' });
        setAnnouncementData({ content: '', department: '', type: 'GENERAL', priority: 'MEDIUM', attachmentUrl: '', attachmentName: '', expiryDate: '' });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const postTypeConfig = {
    event: {
      icon: '🎉',
      label: 'Event',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    lostfound: {
      icon: '🔍',
      label: 'Lost & Found',
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    announcement: {
      icon: '📢',
      label: 'Announcement',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  };

  const currentConfig = postTypeConfig[postType];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Post Type Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">Select Post Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(postTypeConfig).map(([type, config]) => (
            <button
              key={type}
              type="button"
              onClick={() => setPostType(type as PostType)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                postType === type
                  ? `${config.bgColor} ${config.borderColor} border-2 shadow-md`
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${config.color} flex items-center justify-center text-white text-xl`}>
                  {config.icon}
                </div>
                <div>
                  <div className="font-medium text-slate-900">{config.label}</div>
                  <div className="text-sm text-slate-500">
                    {type === 'event' && 'Share campus events and activities'}
                    {type === 'lostfound' && 'Report lost items or found belongings'}
                    {type === 'announcement' && 'Post official notices and updates'}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Common Fields */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-800">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Title"
            placeholder="Enter a descriptive title"
            value={commonData.title}
            onChange={(e) => setCommonData({ ...commonData, title: e.target.value })}
            required
            icon="📝"
          />
          <Input
            label="Image URL (Optional)"
            placeholder="https://example.com/image.jpg"
            value={commonData.imageUrl}
            onChange={(e) => setCommonData({ ...commonData, imageUrl: e.target.value })}
            icon="🖼️"
          />
        </div>
        <Textarea
          label="Description"
          placeholder="Provide detailed information about your post..."
          value={commonData.description}
          onChange={(e) => setCommonData({ ...commonData, description: e.target.value })}
          rows={4}
          required
        />
      </div>

      {/* Type-specific Fields */}
      {postType === 'event' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-800">Event Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Location"
              placeholder="Where is the event taking place?"
              value={eventData.location}
              onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
              required
              icon="📍"
            />
            <Input
              label="Event Date & Time"
              type="datetime-local"
              value={eventData.eventDate}
              onChange={(e) => setEventData({ ...eventData, eventDate: e.target.value })}
              required
              icon="📅"
            />
          </div>
        </div>
      )}

      {postType === 'lostfound' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-800">Item Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Item Name"
              placeholder="What item was lost/found?"
              value={lostFoundData.itemName}
              onChange={(e) => setLostFoundData({ ...lostFoundData, itemName: e.target.value })}
              required
              icon="🔍"
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
              <select
                value={lostFoundData.type}
                onChange={(e) => setLostFoundData({ ...lostFoundData, type: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              >
                <option value="LOST">Lost</option>
                <option value="FOUND">Found</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Location"
              placeholder="Where was it lost/found?"
              value={lostFoundData.location}
              onChange={(e) => setLostFoundData({ ...lostFoundData, location: e.target.value })}
              required
              icon="📍"
            />
            <Input
              label="Incident Date"
              type="date"
              value={lostFoundData.incidentDate}
              onChange={(e) => setLostFoundData({ ...lostFoundData, incidentDate: e.target.value })}
              icon="📅"
            />
          </div>
          <Input
            label="Contact Information"
            placeholder="How can people reach you?"
            value={lostFoundData.contactInfo}
            onChange={(e) => setLostFoundData({ ...lostFoundData, contactInfo: e.target.value })}
            icon="📞"
          />
        </div>
      )}

      {postType === 'announcement' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-800">Announcement Details</h3>
          <Textarea
            label="Content"
            placeholder="Enter the full announcement content..."
            value={announcementData.content}
            onChange={(e) => setAnnouncementData({ ...announcementData, content: e.target.value })}
            rows={4}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
              <select
                value={announcementData.department}
                onChange={(e) => setAnnouncementData({ ...announcementData, department: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                required
              >
                <option value="">Select Department</option>
                <option value="CSE">Computer Science</option>
                <option value="ECE">Electronics</option>
                <option value="ME">Mechanical</option>
                <option value="ADMIN">Administration</option>
                <option value="ACADEMIC">Academic</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
              <select
                value={announcementData.type}
                onChange={(e) => setAnnouncementData({ ...announcementData, type: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              >
                <option value="GENERAL">General</option>
                <option value="ACADEMIC">Academic</option>
                <option value="EVENT">Event</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
              <select
                value={announcementData.priority}
                onChange={(e) => setAnnouncementData({ ...announcementData, priority: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Attachment URL (Optional)"
              placeholder="https://example.com/document.pdf"
              value={announcementData.attachmentUrl}
              onChange={(e) => setAnnouncementData({ ...announcementData, attachmentUrl: e.target.value })}
              icon="📎"
            />
            <Input
              label="Expiry Date (Optional)"
              type="date"
              value={announcementData.expiryDate}
              onChange={(e) => setAnnouncementData({ ...announcementData, expiryDate: e.target.value })}
              icon="⏰"
            />
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-red-600">⚠️</span>
            <span className="text-red-800 font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
        <Button
          type="submit"
          variant="gradient"
          size="lg"
          loading={loading}
          className="flex-1"
        >
          {loading ? 'Creating...' : `Create ${currentConfig.label}`}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default CreatePostForm;
