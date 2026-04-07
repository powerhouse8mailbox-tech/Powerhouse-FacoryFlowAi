import { useState, useEffect } from 'react';

export function useApi<T>(endpoint: string, mockData?: T) {
  const [data, setData] = useState<T | null>(mockData || null);
  const [loading, setLoading] = useState(!mockData);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api${endpoint}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          if (json && (Array.isArray(json) ? json.length > 0 : Object.keys(json).length > 0)) {
            setData(json);
          }
        }
      } catch (e) {
        console.error(e);
        setError(e instanceof Error ? e : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    
    // Initial fetch
    fetchData();
    
    // Mock WebSocket real-time updates via polling for the demo
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [endpoint]);

  return { data, loading, error };
}
