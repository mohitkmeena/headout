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

      if (response && onPostCreated) {
        onPostCreated(response);
      }
      
      // Reset form
      resetForm();
      
    } catch (error: any) {
      setError(error.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCommonData({ title: '', description: '', imageUrl: '' });
    setEventData({ location: '', eventDate: '' });
    setLostFoundData({ itemName: '', type: 'LOST', location: '', incidentDate: '', contactInfo: '' });
    setAnnouncementData({ content: '', department: '', type: 'GENERAL', priority: 'MEDIUM', attachmentUrl: '', attachmentName: '', expiryDate: '' });
  };

  const renderEventFields = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Event Title *
        </label>
        <Input
          value={commonData.title}
          onChange={(e) => setCommonData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="e.g., Docker Workshop"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <Textarea
          value={commonData.description}
          onChange={(e) => setCommonData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe your event..."
          rows={3}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <Input
            value={eventData.location}
            onChange={(e) => setEventData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="e.g., CSE Lab"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date & Time *
          </label>
          <Input
            type="datetime-local"
            value={eventData.eventDate}
            onChange={(e) => setEventData(prev => ({ ...prev, eventDate: e.target.value }))}
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image URL (Optional)
        </label>
        <Input
          value={commonData.imageUrl}
          onChange={(e) => setCommonData(prev => ({ ...prev, imageUrl: e.target.value }))}
          placeholder="https://example.com/image.jpg"
        />
      </div>
    </>
  );

  const renderLostFoundFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Item Name *
          </label>
          <Input
            value={lostFoundData.itemName}
            onChange={(e) => setLostFoundData(prev => ({ ...prev, itemName: e.target.value }))}
            placeholder="e.g., Black Wallet"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type *
          </label>
          <select
            value={lostFoundData.type}
            onChange={(e) => setLostFoundData(prev => ({ ...prev, type: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="LOST">Lost</option>
            <option value="FOUND">Found</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <Textarea
          value={commonData.description}
          onChange={(e) => setCommonData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe the item and circumstances..."
          rows={3}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <Input
            value={lostFoundData.location}
            onChange={(e) => setLostFoundData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="e.g., Library, Hostel"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Info *
          </label>
          <Input
            value={lostFoundData.contactInfo}
            onChange={(e) => setLostFoundData(prev => ({ ...prev, contactInfo: e.target.value }))}
            placeholder="Phone/Email"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image URL (Optional)
        </label>
        <Input
          value={commonData.imageUrl}
          onChange={(e) => setCommonData(prev => ({ ...prev, imageUrl: e.target.value }))}
          placeholder="https://example.com/image.jpg"
        />
      </div>
    </>
  );

  const renderAnnouncementFields = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Announcement Title *
        </label>
        <Input
          value={commonData.title}
          onChange={(e) => setCommonData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="e.g., Mid-Semester Exam Schedule"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content *
        </label>
        <Textarea
          value={announcementData.content}
          onChange={(e) => setAnnouncementData(prev => ({ ...prev, content: e.target.value }))}
          placeholder="Announcement content..."
          rows={4}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department *
          </label>
          <select
            value={announcementData.department}
            onChange={(e) => setAnnouncementData(prev => ({ ...prev, department: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Department</option>
            <option value="CSE">Computer Science</option>
            <option value="ECE">Electronics</option>
            <option value="ME">Mechanical</option>
            <option value="CE">Civil</option>
            <option value="Administration">Administration</option>
            <option value="Academic">Academic</option>
            <option value="General">General</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type *
          </label>
          <select
            value={announcementData.type}
            onChange={(e) => setAnnouncementData(prev => ({ ...prev, type: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="GENERAL">General</option>
            <option value="ACADEMIC">Academic</option>
            <option value="ADMINISTRATIVE">Administrative</option>
            <option value="EVENT">Event</option>
            <option value="NOTICE">Notice</option>
            <option value="CIRCULAR">Circular</option>
            <option value="EXAM">Exam</option>
            <option value="HOLIDAY">Holiday</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority *
          </label>
          <select
            value={announcementData.priority}
            onChange={(e) => setAnnouncementData(prev => ({ ...prev, priority: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attachment URL (Optional)
          </label>
          <Input
            value={announcementData.attachmentUrl}
            onChange={(e) => setAnnouncementData(prev => ({ ...prev, attachmentUrl: e.target.value }))}
            placeholder="https://example.com/document.pdf"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiry Date (Optional)
          </label>
          <Input
            type="datetime-local"
            value={announcementData.expiryDate}
            onChange={(e) => setAnnouncementData(prev => ({ ...prev, expiryDate: e.target.value }))}
          />
        </div>
      </div>
    </>
  );

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Post</h2>
        
        {/* Post Type Selection */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={postType === 'event' ? 'default' : 'outline'}
            onClick={() => setPostType('event')}
            size="sm"
          >
            📅 Event
          </Button>
          <Button
            variant={postType === 'lostfound' ? 'default' : 'outline'}
            onClick={() => setPostType('lostfound')}
            size="sm"
          >
            🔍 Lost & Found
          </Button>
          <Button
            variant={postType === 'announcement' ? 'default' : 'outline'}
            onClick={() => setPostType('announcement')}
            size="sm"
          >
            📢 Announcement
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {postType === 'event' && renderEventFields()}
        {postType === 'lostfound' && renderLostFoundFields()}
        {postType === 'announcement' && renderAnnouncementFields()}

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Creating...' : `Create ${postType === 'lostfound' ? 'Lost & Found' : postType.charAt(0).toUpperCase() + postType.slice(1)}`}
          </Button>
          
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};

export default CreatePostForm;
