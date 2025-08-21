"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import PostPreview from './PostPreview';
import { PostClassificationResult } from '@/types/post';
import { getDeviceId } from '@/lib/utils';

interface PostInputProps {
  onPostCreated: () => void;
}

const PostInput = ({ onPostCreated }: PostInputProps) => {
  const [prompt, setPrompt] = useState('');
  const [isClassifying, setIsClassifying] = useState(false);
  const [classification, setClassification] = useState<PostClassificationResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const classifyPost = async () => {
    if (!prompt.trim()) return;

    setIsClassifying(true);
    try {
      // Mock AI classification for now - will be replaced with actual AI integration
      const mockClassification: PostClassificationResult = {
        type: detectPostType(prompt),
        confidence: 0.85,
        extractedData: extractDataFromPrompt(prompt),
        suggestions: []
      };

      setClassification(mockClassification);
      setShowPreview(true);
    } catch (error) {
      console.error('Error classifying post:', error);
    } finally {
      setIsClassifying(false);
    }
  };

  const detectPostType = (text: string): 'event' | 'lost' | 'found' | 'announcement' => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('lost') || lowerText.includes('missing')) {
      return 'lost';
    } else if (lowerText.includes('found') || lowerText.includes('discovered')) {
      return 'found';
    } else if (lowerText.includes('event') || lowerText.includes('workshop') || 
               lowerText.includes('seminar') || lowerText.includes('fest') ||
               lowerText.includes('meeting') || lowerText.includes('conference')) {
      return 'event';
    } else {
      return 'announcement';
    }
  };

  const extractDataFromPrompt = (text: string) => {
    // Simple regex-based extraction - will be enhanced with AI
    const data: any = {};
    
    // Extract potential dates
    const dateRegex = /(?:tomorrow|today|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2}|\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i;
    const dateMatch = text.match(dateRegex);
    if (dateMatch) {
      data.eventDate = dateMatch[0];
    }

    // Extract potential locations
    const locationKeywords = ['at', 'in', 'near', 'room', 'hall', 'lab', 'library', 'canteen', 'hostel'];
    for (const keyword of locationKeywords) {
      const regex = new RegExp(`${keyword}\\s+([a-zA-Z0-9\\s,]+?)(?:\\s|$|\\.|,)`, 'i');
      const match = text.match(regex);
      if (match) {
        data.location = match[1].trim();
        break;
      }
    }

    // Generate title from first part of text
    data.title = text.split('.')[0].slice(0, 50);
    data.description = text;

    return data;
  };

  const handleReset = () => {
    setShowPreview(false);
    setClassification(null);
    setPrompt('');
  };

  const handlePostCreated = () => {
    handleReset();
    onPostCreated();
  };

  if (showPreview && classification) {
    return (
      <PostPreview
        classification={classification}
        originalPrompt={prompt}
        onBack={() => setShowPreview(false)}
        onPostCreated={handlePostCreated}
      />
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="post-input" className="block text-sm font-medium text-slate-700 mb-2">
              What&apos;s happening on campus?
            </label>
            <Textarea
              id="post-input"
              placeholder="Type naturally... e.g., 'Lost my black wallet near the library yesterday evening' or 'Workshop on Docker tomorrow at 5pm in CSE Lab'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px] text-base"
              rows={4}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>AI will help classify your post automatically</span>
            </div>
            
            <Button
              onClick={classifyPost}
              disabled={!prompt.trim() || isClassifying}
              isLoading={isClassifying}
            >
              {isClassifying ? 'Analyzing...' : 'Create Post'}
            </Button>
          </div>

          {/* Example prompts */}
          <div className="border-t border-slate-200 pt-4">
            <p className="text-xs text-slate-500 mb-2">Example prompts:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "Lost my phone in library",
                "AI workshop tomorrow 5pm",
                "Found a wallet near cafeteria"
              ].map((example) => (
                <button
                  key={example}
                  onClick={() => setPrompt(example)}
                  className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-full transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostInput;
