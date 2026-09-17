import { useState, useEffect } from 'react';
import { API_PREFIX } from '../config/api';

export function useFilterMetadata() {
  const [metadata, setMetadata] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_PREFIX}/dishes/filters/metadata`)
      .then((res) => {
        if (!res.ok) throw new Error('Không tải được bộ lọc');
        return res.json();
      })
      .then((data) => setMetadata(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  return { metadata, isLoading, error };
}