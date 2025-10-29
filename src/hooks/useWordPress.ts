import { useEffect, useState } from 'react';
import { WPPost } from '@/lib/wordpress';

interface UseWordPressResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useWordPress<T = WPPost | WPPost[]>(
  endpoint: string,
  params: Record<string, any> = {}
): UseWordPressResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Always go through our API route, which will handle the WordPress API call
        const queryString = new URLSearchParams({
          path: endpoint,
          ...params,
        }).toString();

        const response = await fetch(`/api/wordpress?${queryString}`, {
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          // Try to get error details without exposing them in production
          let errorMessage = `Request failed with status ${response.status}`;
          
          if (process.env.NODE_ENV === 'development') {
            try {
              const errorData = await response.json();
              console.error('API Error:', {
                status: response.status,
                statusText: response.statusText,
                endpoint,
                error: errorData
              });
            } catch (e) {
              const errorText = await response.text();
              console.error('API Error:', {
                status: response.status,
                statusText: response.statusText,
                endpoint,
                error: errorText || 'Unknown error occurred'
              });
            }
          }
          
          throw new Error(errorMessage);
        }
        
        const result = await response.json();
        console.log('WordPress API Response:', { url: response.url, data: result });
        setData(result);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An unknown error occurred');
        console.error('Error in useWordPress:', {
          message: error.message,
          stack: error.stack,
          endpoint,
          params
        });
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, JSON.stringify(params)]);

  return { data, loading, error };
}
