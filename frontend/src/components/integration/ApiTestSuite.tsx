'use client';

import React, { useState } from 'react';
import { api } from '@/services/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface TestResult {
  endpoint: string;
  status: 'pending' | 'success' | 'error';
  response?: any;
  error?: string;
  duration?: number;
}

const ApiTestSuite: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'events' | 'lostfound' | 'health'>('all');

  const userId = api.getUserDeviceId();

  const testEndpoints = [
    // Health checks
    { category: 'health', name: 'Events API Health', test: () => api.events.healthCheck() },
    { category: 'health', name: 'Lost&Found API Health', test: () => api.lostFound.healthCheck() },
    
    // Events endpoints
    { category: 'events', name: 'Get All Events', test: () => api.events.getAll(userId) },
    { category: 'events', name: 'Get Upcoming Events', test: () => api.events.getUpcoming(userId) },
    { category: 'events', name: "Today's Events", test: () => api.events.getTodayEvents(userId) },
    { category: 'events', name: 'Events Statistics', test: () => api.events.getStatistics() },
    { category: 'events', name: 'Search Events', test: () => api.events.search('workshop', userId) },
    { category: 'events', name: 'Events by Location', test: () => api.events.getByLocation('CSE Lab', userId) },
    { category: 'events', name: 'User Events', test: () => api.events.getUserEvents(userId, userId) },
    
    // Lost & Found endpoints
    { category: 'lostfound', name: 'Get All Lost&Found', test: () => api.lostFound.getAll() },
    { category: 'lostfound', name: 'Lost&Found Statistics', test: () => api.lostFound.getStatistics() },
    { category: 'lostfound', name: 'Recent Items', test: () => api.lostFound.getRecent() },
    { category: 'lostfound', name: 'Unresolved Items', test: () => api.lostFound.getUnresolved() },
    { category: 'lostfound', name: 'Lost Items Only', test: () => api.lostFound.getByType('lost') },
    { category: 'lostfound', name: 'Found Items Only', test: () => api.lostFound.getByType('found') },
    { category: 'lostfound', name: 'Search Lost&Found', test: () => api.lostFound.search('wallet') },
    { category: 'lostfound', name: 'User Lost&Found', test: () => api.lostFound.getUserItems(userId) },
  ];

  const runSingleTest = async (endpoint: any): Promise<TestResult> => {
    const startTime = Date.now();
    try {
      const response = await endpoint.test();
      const duration = Date.now() - startTime;
      return {
        endpoint: endpoint.name,
        status: 'success',
        response,
        duration
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      return {
        endpoint: endpoint.name,
        status: 'error',
        error: error.message || 'Unknown error',
        duration
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTests([]);

    const filteredEndpoints = selectedCategory === 'all' 
      ? testEndpoints 
      : testEndpoints.filter(e => e.category === selectedCategory);

    // Initialize tests as pending
    const pendingTests: TestResult[] = filteredEndpoints.map(endpoint => ({
      endpoint: endpoint.name,
      status: 'pending'
    }));
    setTests(pendingTests);

    // Run tests sequentially to avoid overwhelming the server
    const results: TestResult[] = [];
    for (let i = 0; i < filteredEndpoints.length; i++) {
      const result = await runSingleTest(filteredEndpoints[i]);
      results.push(result);
      
      // Update UI with current result
      setTests(prevTests => 
        prevTests.map((test, index) => 
          index === i ? result : test
        )
      );
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setIsRunning(false);
  };

  const clearResults = () => {
    setTests([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success': return 'PASS';
      case 'error': return 'FAIL';
      case 'pending': return 'RUNNING';
      default: return 'UNKNOWN';
    }
  };

  const successCount = tests.filter(t => t.status === 'success').length;
  const errorCount = tests.filter(t => t.status === 'error').length;
  const pendingCount = tests.filter(t => t.status === 'pending').length;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">API Test Suite</h1>
        <div className="flex items-center gap-4">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            disabled={isRunning}
          >
            <option value="all">All Endpoints</option>
            <option value="health">Health Checks</option>
            <option value="events">Events API</option>
            <option value="lostfound">Lost & Found API</option>
          </select>
          <Button 
            onClick={runAllTests} 
            disabled={isRunning}
            className="min-w-24"
          >
            {isRunning ? 'Running...' : 'Run Tests'}
          </Button>
          <Button 
            onClick={clearResults} 
            variant="outline"
            disabled={isRunning}
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Test Summary */}
      {tests.length > 0 && (
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Test Summary</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Pass: {successCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">Fail: {errorCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Running: {pendingCount}</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Test Results */}
      {tests.length > 0 && (
        <div className="space-y-3">
          {tests.map((test, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(test.status)}`}></div>
                  <h3 className="font-medium text-gray-900">{test.endpoint}</h3>
                  <Badge 
                    variant={test.status === 'success' ? 'default' : test.status === 'error' ? 'destructive' : 'secondary'}
                  >
                    {getStatusText(test.status)}
                  </Badge>
                </div>
                {test.duration && (
                  <span className="text-sm text-gray-500">{test.duration}ms</span>
                )}
              </div>

              {test.status === 'success' && test.response && (
                <div className="mt-3">
                  <details className="cursor-pointer">
                    <summary className="text-sm text-gray-600 hover:text-gray-800">
                      View Response {Array.isArray(test.response) ? `(${test.response.length} items)` : ''}
                    </summary>
                    <pre className="mt-2 p-3 bg-gray-50 border rounded text-xs overflow-x-auto max-h-40">
                      {JSON.stringify(test.response, null, 2)}
                    </pre>
                  </details>
                </div>
              )}

              {test.status === 'error' && test.error && (
                <div className="mt-3">
                  <p className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                    Error: {test.error}
                  </p>
                </div>
              )}

              {test.status === 'pending' && (
                <div className="mt-3">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-b-2 border-yellow-600 rounded-full"></div>
                    <span className="text-sm text-gray-600">Testing endpoint...</span>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Instructions */}
      {tests.length === 0 && (
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">API Test Suite</h2>
          <p className="text-gray-600 mb-6">
            Test all the new specific API endpoints to ensure they're working correctly.
            This suite will test health checks, CRUD operations, filtering, search, and statistics endpoints.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Health Checks</h3>
              <p className="text-blue-700">Verify API endpoints are responsive</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2">Events API</h3>
              <p className="text-green-700">Test events, search, and filtering</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-purple-900 mb-2">Lost & Found API</h3>
              <p className="text-purple-700">Test items, types, and resolution</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ApiTestSuite;
