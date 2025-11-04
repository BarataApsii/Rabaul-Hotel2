'use client';
import { useEffect, useState } from 'react';
import { getRooms, WPPost } from '@/lib/api';

export default function TestWordPress() {
  const [data, setData] = useState<WPPost[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        setLoading(true);
        // Test the rooms endpoint
        const rooms = await getRooms();
        setData(rooms);
        setError(null);
      } catch (err) {
        console.error('WordPress connection error:', err);
        setError(`Failed to connect to WordPress: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">WordPress Connection Test</h1>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-3"></div>
              <span>Connecting to WordPress...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                  <p className="text-sm text-red-600 mt-2">
                    Make sure your WordPress site is running at: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost/rabaul-hotel</code>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border-l-4 border-green-500 p-4">
              <div className="flex">
                <div className="shrink-0">
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">Successfully connected to WordPress!</p>
                  <p className="text-sm text-green-600 mt-1">
                    Found {Array.isArray(data) ? data.length : 0} room(s).
                  </p>
                </div>
              </div>
            </div>
          )}

          {data && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Raw Response Data:</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-xs">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">WordPress Test Page</h1>
          <p className="mb-6">This page tests the connection to your WordPress backend. If you&apos;re seeing this, the frontend is working!</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Make sure your WordPress site is running at <code className="bg-gray-100 px-1.5 py-0.5 rounded">http://localhost/rabaul-hotel</code></li>
            <li>Verify that the WordPress REST API is enabled</li>
            <li>Check that the WordPress site is using the correct permalink structure (Settings &rarr; Permalinks)</li>
            <li>Make sure any required plugins (like JWT Authentication) are properly installed and configured</li>
            <li>Check your browser&apos;s developer console for any CORS errors</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
