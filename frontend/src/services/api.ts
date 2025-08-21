// API Service Layer for IIIT-Una Feed Frontend

const API_BASE_URL = 'http://localhost:8080/api';

// Generic API helper
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Events API
export const eventsApi = {
  getAll: (userId?: string) => 
    apiCall(`/events${userId ? `?userId=${userId}` : ''}`),
  
  getById: (id: number, userId?: string) => 
    apiCall(`/events/${id}${userId ? `?userId=${userId}` : ''}`),
  
  create: (eventData: any, userId: string) => 
    apiCall(`/events?userId=${userId}`, {
      method: 'POST',
      body: JSON.stringify(eventData),
    }),
  
  update: (id: number, eventData: any, userId: string) => 
    apiCall(`/events/${id}?userId=${userId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    }),
  
  delete: (id: number, userId: string) => 
    apiCall(`/events/${id}?userId=${userId}`, {
      method: 'DELETE',
    }),
  
  addResponse: (id: number, userId: string, response: string) => 
    apiCall(`/events/${id}/response?userId=${userId}&response=${response}`, {
      method: 'POST',
    }),
  
  getUpcoming: (userId?: string) => 
    apiCall(`/events/upcoming${userId ? `?userId=${userId}` : ''}`),
  
  search: (keyword: string, userId?: string) => 
    apiCall(`/events/search?keyword=${encodeURIComponent(keyword)}${userId ? `&userId=${userId}` : ''}`),
  
  // New specific endpoints
  healthCheck: () => apiCall('/events/health'),
  
  getByLocation: (location: string, userId?: string) => 
    apiCall(`/events/location/${encodeURIComponent(location)}${userId ? `?userId=${userId}` : ''}`),
  
  getUserEvents: (userId: string, currentUserId?: string) => 
    apiCall(`/events/user/${userId}${currentUserId ? `?currentUserId=${currentUserId}` : ''}`),
  
  getTodayEvents: (userId?: string) => 
    apiCall(`/events/today${userId ? `?userId=${userId}` : ''}`),
  
  getStatistics: () => apiCall('/events/stats'),
};

// Lost & Found API
export const lostFoundApi = {
  getAll: () => apiCall('/lost-found'),
  
  getById: (id: number) => apiCall(`/lost-found/${id}`),
  
  create: (itemData: any, userId: string) => 
    apiCall(`/lost-found?userId=${userId}`, {
      method: 'POST',
      body: JSON.stringify(itemData),
    }),
  
  update: (id: number, itemData: any, userId: string) => 
    apiCall(`/lost-found/${id}?userId=${userId}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    }),
  
  delete: (id: number, userId: string) => 
    apiCall(`/lost-found/${id}?userId=${userId}`, {
      method: 'DELETE',
    }),
  
  resolve: (id: number, userId: string) => 
    apiCall(`/lost-found/${id}/resolve?userId=${userId}`, {
      method: 'POST',
    }),
  
  getByType: (type: string) => apiCall(`/lost-found/type/${type}`),
  
  getUnresolved: () => apiCall('/lost-found/unresolved'),
  
  search: (keyword: string) => 
    apiCall(`/lost-found/search?keyword=${encodeURIComponent(keyword)}`),
  
  // New specific endpoints
  healthCheck: () => apiCall('/lost-found/health'),
  
  getStatistics: () => apiCall('/lost-found/stats'),
  
  getUserItems: (userId: string) => 
    apiCall(`/lost-found/user/${userId}`),
  
  getRecent: () => apiCall('/lost-found/recent'),
};

// Comments API
export const commentsApi = {
  getForPost: (postType: string, postId: number) => 
    apiCall(`/comments/${postType}/${postId}`),
  
  add: (postType: string, postId: number, content: string, userId: string, parentId?: number) => 
    apiCall(`/comments/${postType}/${postId}?userId=${userId}`, {
      method: 'POST',
      body: JSON.stringify({
        content,
        ...(parentId && { parentId: parentId.toString() }),
      }),
    }),
  
  addReply: (commentId: number, content: string, userId: string) => 
    apiCall(`/comments/${commentId}/reply?userId=${userId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
  
  update: (commentId: number, content: string, userId: string) => 
    apiCall(`/comments/${commentId}?userId=${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    }),
  
  delete: (commentId: number, userId: string) => 
    apiCall(`/comments/${commentId}?userId=${userId}`, {
      method: 'DELETE',
    }),
  
  getCount: (postType: string, postId: number) => 
    apiCall(`/comments/${postType}/${postId}/count`),
};

// Reactions API
export const reactionsApi = {
  addPostReaction: (postType: string, postId: number, userId: string, reactionType: string) => 
    apiCall(`/reactions/${postType}/${postId}?userId=${userId}&reactionType=${reactionType}`, {
      method: 'POST',
    }),
  
  addCommentReaction: (postType: string, postId: number, commentId: number, userId: string, reactionType: string) => 
    apiCall(`/reactions/${postType}/${postId}/comment/${commentId}?userId=${userId}&reactionType=${reactionType}`, {
      method: 'POST',
    }),
  
  getPostReactions: (postType: string, postId: number, userId?: string) => 
    apiCall(`/reactions/${postType}/${postId}${userId ? `?userId=${userId}` : ''}`),
  
  getCommentReactions: (postType: string, postId: number, commentId: number, userId?: string) => 
    apiCall(`/reactions/${postType}/${postId}/comment/${commentId}${userId ? `?userId=${userId}` : ''}`),
};

// AI Services API
export const aiApi = {
  classifyPost: (prompt: string) => 
    apiCall('/ai/classify', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    }),
  
  checkToxicity: (content: string) => 
    apiCall('/ai/check-toxicity', {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
  
  generateMeme: (prompt: string) => 
    apiCall('/ai/generate-meme', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    }),
};

// User management
export const getUserDeviceId = (): string => {
  if (typeof window !== 'undefined') {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  }
  return 'device_default';
};

// Export all APIs
export const api = {
  events: eventsApi,
  lostFound: lostFoundApi,
  comments: commentsApi,
  reactions: reactionsApi,
  ai: aiApi,
  getUserDeviceId,
};
