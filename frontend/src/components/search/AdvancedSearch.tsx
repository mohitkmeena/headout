'use client';

import React, { useState } from 'react';
import { api } from '@/services/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

interface SearchResults {
  events: any[];
  lostFound: any[];
  loading: boolean;
}

const AdvancedSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [results, setResults] = useState<SearchResults>({
    events: [],
    lostFound: [],
    loading: false
  });
  const [activeTab, setActiveTab] = useState<'events' | 'lostfound'>('events');
  
  const userId = api.getUserDeviceId();

  const performSearch = async () => {
    if (!searchTerm.trim()) return;

    setResults(prev => ({ ...prev, loading: true }));

    try {
      const [eventResults, lostFoundResults] = await Promise.all([
        api.events.search(searchTerm, userId),
        api.lostFound.search(searchTerm)
      ]);

      setResults({
        events: eventResults || [],
        lostFound: lostFoundResults || [],
        loading: false
      });
    } catch (error) {
      console.error('Search failed:', error);
      setResults(prev => ({ ...prev, loading: false }));
    }
  };

  const searchByLocation = async () => {
    if (!locationFilter.trim()) return;

    setResults(prev => ({ ...prev, loading: true }));

    try {
      const eventResults = await api.events.getByLocation(locationFilter, userId);
      setResults({
        events: eventResults || [],
        lostFound: [],
        loading: false
      });
      setActiveTab('events');
    } catch (error) {
      console.error('Location search failed:', error);
      setResults(prev => ({ ...prev, loading: false }));
    }
  };

  const loadUserContent = async (targetUserId: string) => {
    setResults(prev => ({ ...prev, loading: true }));

    try {
      const [userEvents, userLostFound] = await Promise.all([
        api.events.getUserEvents(targetUserId, userId),
        api.lostFound.getUserItems(targetUserId)
      ]);

      setResults({
        events: userEvents || [],
        lostFound: userLostFound || [],
        loading: false
      });
    } catch (error) {
      console.error('User content search failed:', error);
      setResults(prev => ({ ...prev, loading: false }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Advanced Search</h1>

      {/* Search Controls */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Content
            </label>
            <div className="flex gap-2">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search events, lost & found items..."
                className="flex-1"
              />
              <Button 
                onClick={performSearch} 
                disabled={results.loading || !searchTerm.trim()}
              >
                Search
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search by Location
            </label>
            <div className="flex gap-2">
              <Input
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder="CSE Lab, Library, Hostel..."
                className="flex-1"
              />
              <Button 
                onClick={searchByLocation}
                disabled={results.loading || !locationFilter.trim()}
                variant="outline"
              >
                Find
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => loadUserContent(userId)}
          >
            My Posts
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={async () => {
              const upcoming = await api.events.getUpcoming(userId);
              setResults({ events: upcoming, lostFound: [], loading: false });
              setActiveTab('events');
            }}
          >
            Upcoming Events
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={async () => {
              const unresolved = await api.lostFound.getUnresolved();
              setResults({ events: [], lostFound: unresolved, loading: false });
              setActiveTab('lostfound');
            }}
          >
            Unresolved Items
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={async () => {
              const todayEvents = await api.events.getTodayEvents(userId);
              setResults({ events: todayEvents, lostFound: [], loading: false });
              setActiveTab('events');
            }}
          >
            Today's Events
          </Button>
        </div>
      </Card>

      {/* Results */}
      {(results.events.length > 0 || results.lostFound.length > 0 || results.loading) && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Search Results</h2>
            
            {/* Tab Navigation */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={activeTab === 'events' ? 'default' : 'outline'}
                onClick={() => setActiveTab('events')}
              >
                Events ({results.events.length})
              </Button>
              <Button
                size="sm"
                variant={activeTab === 'lostfound' ? 'default' : 'outline'}
                onClick={() => setActiveTab('lostfound')}
              >
                Lost & Found ({results.lostFound.length})
              </Button>
            </div>
          </div>

          {results.loading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full mx-auto"></div>
              <p className="text-gray-600 mt-4">Searching...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Events Results */}
              {activeTab === 'events' && (
                <>
                  {results.events.length > 0 ? (
                    results.events.map((event: any) => (
                      <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900">{event.title}</h3>
                          <Badge variant="outline">Event</Badge>
                        </div>
                        <p className="text-gray-600 mb-2">{event.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>📍 {event.location}</span>
                          <span>📅 {new Date(event.eventDate).toLocaleDateString()}</span>
                          <span>👤 {event.createdBy}</span>
                        </div>
                        {event.userResponse && (
                          <div className="mt-2">
                            <Badge variant="secondary">You: {event.userResponse}</Badge>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No events found</p>
                  )}
                </>
              )}

              {/* Lost & Found Results */}
              {activeTab === 'lostfound' && (
                <>
                  {results.lostFound.length > 0 ? (
                    results.lostFound.map((item: any) => (
                      <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900">{item.itemName}</h3>
                          <div className="flex gap-2">
                            <Badge 
                              variant={item.type === 'LOST' ? 'destructive' : 'default'}
                            >
                              {item.type}
                            </Badge>
                            {item.isResolved && (
                              <Badge variant="outline">Resolved</Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 mb-2">{item.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>📍 {item.location}</span>
                          <span>📅 {new Date(item.createdAt).toLocaleDateString()}</span>
                          <span>👤 {item.createdBy}</span>
                        </div>
                        {item.contactInfo && (
                          <div className="mt-2">
                            <span className="text-sm text-blue-600">📞 {item.contactInfo}</span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No lost & found items found</p>
                  )}
                </>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default AdvancedSearch;
