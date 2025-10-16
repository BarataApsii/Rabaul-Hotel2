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
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Error fetching from WordPress:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, JSON.stringify(params)]);

  return { data, loading, error };
}
