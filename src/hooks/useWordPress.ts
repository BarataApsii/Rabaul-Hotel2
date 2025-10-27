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
        const queryString = new URLSearchParams({
          path: endpoint,
          ...params,
        }).toString();

        const response = await fetch(`/api/wordpress?${queryString}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('WordPress API Error:', {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
            error: errorText
          });
          throw new Error(`HTTP error! status: ${response.status}: ${response.statusText}`);
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
