'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface DashboardStats {
  events: {
    total: number;
    upcoming: number;
    past: number;
  };
  lostFound: {
    total: number;
    lost: number;
    found: number;
    resolved: number;
    unresolved: number;
  };
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [todayEvents, setTodayEvents] = useState<any[]>([]);
  const [recentLostFound, setRecentLostFound] = useState<any[]>([]);
  const [healthStatus, setHealthStatus] = useState({ events: false, lostFound: false });

  const userId = api.getUserDeviceId();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load statistics
      const [eventStats, lostFoundStats, todayEventsData, recentLostFoundData] = await Promise.all([
        api.events.getStatistics(),
        api.lostFound.getStatistics(), 
        api.events.getTodayEvents(userId),
        api.lostFound.getRecent()
      ]);

      setStats({
        events: eventStats,
        lostFound: lostFoundStats
      });
      
      setTodayEvents(todayEventsData);
      setRecentLostFound(recentLostFoundData);
      
      // Check API health
      checkApiHealth();
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkApiHealth = async () => {
    try {
      const [eventsHealth, lostFoundHealth] = await Promise.all([
        api.events.healthCheck().then(() => true).catch(() => false),
        api.lostFound.healthCheck().then(() => true).catch(() => false)
      ]);
      
      setHealthStatus({
        events: eventsHealth,
        lostFound: lostFoundHealth
      });
    } catch (error) {
      console.error('Health check failed:', error);
    }
  };

  const refreshDashboard = () => {
    loadDashboardData();
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">API Status:</span>
            <div className={`w-3 h-3 rounded-full ${healthStatus.events ? 'bg-green-500' : 'bg-red-500'}`} 
                 title={`Events API: ${healthStatus.events ? 'Online' : 'Offline'}`}></div>
            <div className={`w-3 h-3 rounded-full ${healthStatus.lostFound ? 'bg-green-500' : 'bg-red-500'}`}
                 title={`Lost&Found API: ${healthStatus.lostFound ? 'Online' : 'Offline'}`}></div>
          </div>
          <Button onClick={refreshDashboard} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats && (
          <>
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Events</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.events.total}</p>
              <p className="text-sm text-gray-500">{stats.events.upcoming} upcoming</p>
            </Card>
            
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Lost & Found</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.lostFound.total}</p>
              <p className="text-sm text-gray-500">{stats.lostFound.unresolved} unresolved</p>
            </Card>
            
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Lost Items</h3>
              <p className="text-3xl font-bold text-red-600">{stats.lostFound.lost}</p>
              <p className="text-sm text-gray-500">Need attention</p>
            </Card>
            
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Found Items</h3>
              <p className="text-3xl font-bold text-green-600">{stats.lostFound.found}</p>
              <p className="text-sm text-gray-500">Available for claim</p>
            </Card>
          </>
        )}
      </div>

      {/* Today's Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Events</h2>
          {todayEvents.length > 0 ? (
            <div className="space-y-3">
              {todayEvents.slice(0, 3).map((event: any) => (
                <div key={event.id} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-medium text-gray-900">{event.title}</h3>
                  <p className="text-sm text-gray-600">{event.location}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(event.eventDate).toLocaleTimeString()}
                  </p>
                </div>
              ))}
              {todayEvents.length > 3 && (
                <p className="text-sm text-gray-500">+{todayEvents.length - 3} more events</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No events scheduled for today</p>
          )}
        </Card>

        {/* Recent Lost & Found */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Lost & Found</h2>
          {recentLostFound.length > 0 ? (
            <div className="space-y-3">
              {recentLostFound.slice(0, 3).map((item: any) => (
                <div key={item.id} className={`border-l-4 ${item.type === 'LOST' ? 'border-red-500' : 'border-green-500'} pl-4`}>
                  <h3 className="font-medium text-gray-900">{item.itemName}</h3>
                  <p className="text-sm text-gray-600">{item.location}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      item.type === 'LOST' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {item.type}
                    </span>
                    {item.isResolved && (
                      <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800">
                        Resolved
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {recentLostFound.length > 3 && (
                <p className="text-sm text-gray-500">+{recentLostFound.length - 3} more items</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No recent lost & found items</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
