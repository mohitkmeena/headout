"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Badge from '@/components/ui/Badge';
import { PostClassificationResult } from '@/types/post';
import { getDeviceId } from '@/lib/utils';

interface PostPreviewProps {
  classification: PostClassificationResult;
  originalPrompt: string;
  onBack: () => void;
  onPostCreated: () => void;
}

const PostPreview = ({ classification, originalPrompt, onBack, onPostCreated }: PostPreviewProps) => {
  const [formData, setFormData] = useState({
    title: classification.extractedData.title || '',
    description: classification.extractedData.description || originalPrompt,
    location: classification.extractedData.location || '',
    eventDate: classification.extractedData.eventDate || '',
    department: classification.extractedData.department || '',
    itemName: classification.extractedData.itemName || '',
    contactInfo: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const postTypeConfig = {
    event: {
      title: 'Event',
      color: 'bg-blue-500',
      variant: 'event' as const,
      badge: 'default' as const
    },
    lost: {
      title: 'Lost Item',
      color: 'bg-amber-500',
      variant: 'lost' as const,
      badge: 'warning' as const
    },
    found: {
      title: 'Found Item',
      color: 'bg-green-500',
      variant: 'found' as const,
      badge: 'success' as const
    },
    announcement: {
      title: 'Announcement',
      color: 'bg-purple-500',
      variant: 'announcement' as const,
      badge: 'secondary' as const
    }
  };

  const config = postTypeConfig[classification.type];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (classification.type === 'event' && !formData.eventDate.trim()) {
      newErrors.eventDate = 'Event date is required';
    }

    if (classification.type === 'announcement' && !formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if ((classification.type === 'lost' || classification.type === 'found') && !formData.itemName.trim()) {
      newErrors.itemName = 'Item name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const deviceId = getDeviceId();
      let endpoint = '';
      let payload: any = {
        ...formData,
        createdBy: deviceId
      };

      if (classification.type === 'event') {
        endpoint = 'http://localhost:8080/api/events';
        // Convert eventDate to proper format if needed
        if (formData.eventDate) {
          payload.eventDate = new Date(formData.eventDate).toISOString();
        }
      } else if (classification.type === 'lost' || classification.type === 'found') {
        endpoint = 'http://localhost:8080/api/lost-found';
        payload = {
          itemName: formData.itemName,
          description: formData.description,
          type: classification.type.toUpperCase(),
          location: formData.location,
          contactInfo: formData.contactInfo,
          createdBy: deviceId
        };
      }

      const response = await fetch(`${endpoint}?userId=${deviceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onPostCreated();
      } else {
        console.error('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card variant={config.variant}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
            <CardTitle>Preview: {config.title}</CardTitle>
            <Badge variant={config.badge}>
              {Math.round(classification.confidence * 100)}% confidence
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onBack}>
            ← Edit
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {classification.type === 'lost' || classification.type === 'found' ? 'Item Name' : 'Title'}
          </label>
          <Input
            value={classification.type === 'lost' || classification.type === 'found' ? formData.itemName : formData.title}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              [classification.type === 'lost' || classification.type === 'found' ? 'itemName' : 'title']: e.target.value
            }))}
            error={errors.title || errors.itemName}
            placeholder={`Enter ${classification.type === 'lost' || classification.type === 'found' ? 'item name' : 'title'}`}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            error={errors.description}
            placeholder="Provide more details..."
            rows={3}
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {classification.type === 'lost' ? 'Last seen location' : 
             classification.type === 'found' ? 'Found location' : 'Location'}
          </label>
          <Input
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            error={errors.location}
            placeholder="Where did this happen?"
          />
        </div>

        {/* Event-specific fields */}
        {classification.type === 'event' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Event Date & Time</label>
            <Input
              type="datetime-local"
              value={formData.eventDate}
              onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
              error={errors.eventDate}
            />
          </div>
        )}

        {/* Lost/Found specific fields */}
        {(classification.type === 'lost' || classification.type === 'found') && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Info (Optional)</label>
            <Input
              value={formData.contactInfo}
              onChange={(e) => setFormData(prev => ({ ...prev, contactInfo: e.target.value }))}
              placeholder="Phone number or email"
            />
          </div>
        )}

        {/* Announcement specific fields */}
        {classification.type === 'announcement' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
            <Input
              value={formData.department}
              onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
              error={errors.department}
              placeholder="Which department is this from?"
            />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
          <Button variant="outline" onClick={onBack}>
            Back to Edit
          </Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting}>
            {isSubmitting ? 'Posting...' : 'Post to Feed'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostPreview;
