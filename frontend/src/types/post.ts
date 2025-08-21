export interface BasePost {
  id: number;
  title: string;
  description: string;
  location: string;
  imageUrl?: string;
  createdBy: string;
  createdAt: string;
}

export interface EventPost extends BasePost {
  type: 'event';
  eventDate: string;
  goingCount: number;
  interestedCount: number;
  notGoingCount: number;
  userResponse?: string; // 'GOING' | 'INTERESTED' | 'NOT_GOING'
}

export interface LostPost extends BasePost {
  type: 'lost';
  incidentDate: string;
  contactInfo?: string;
  isResolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface FoundPost extends BasePost {
  type: 'found';
  incidentDate: string;
  contactInfo?: string;
  isResolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface AnnouncementPost extends BasePost {
  type: 'announcement';
  department: string;
  attachmentUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

export type Post = EventPost | LostPost | FoundPost | AnnouncementPost;

export interface PostClassificationResult {
  type: 'event' | 'lost' | 'found' | 'announcement';
  confidence: number;
  extractedData: {
    title?: string;
    description?: string;
    location?: string;
    eventDate?: string;
    department?: string;
    itemName?: string;
  };
  suggestions?: string[];
}

export interface PostCreateRequest {
  prompt: string;
  imageFile?: File;
  classification?: PostClassificationResult;
}

export type EventResponse = 'GOING' | 'INTERESTED' | 'NOT_GOING';

export interface Comment {
  id: number;
  content: string;
  createdBy: string;
  createdAt: string;
  parentId?: number;
  replies?: Comment[];
}

export interface Reaction {
  id: number;
  type: string; // emoji
  createdBy: string;
  createdAt: string;
}
