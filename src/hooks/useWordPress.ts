import { useEffect, useState, useCallback } from 'react';
import { WPPost } from '@/lib/wordpress';

interface UseWordPressResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useWordPress<T = WPPost | WPPost[]>(endpoint: string, params: Record<string, any> = {}) {
  const [state, setState] = useState<UseWordPressResult<T>>({ data: null, loading: true, error: null });

  const fetchData = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const url = new URL('/api/wordpress', window.location.origin);
      url.searchParams.set('path', endpoint);
      Object.entries(params).forEach(([k, v]) => v != null && url.searchParams.set(k, String(v)));

      const res = await fetch(url.toString(), {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-cache',
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const json = await res.json();
      setState({ data: json, loading: false, error: null });
    } catch (err) {
      setState({ data: null, loading: false, error: err instanceof Error ? err : new Error('Unknown error') });
    }
  }, [endpoint, JSON.stringify(params)]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return state;
}
