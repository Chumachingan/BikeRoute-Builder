import { useEffect, useState } from 'react';
import { getUserRoutes, deleteRoute } from '../services/routesService';
import { RouteRecord } from '../types/route';

export function useRoutes(userId: string | undefined) {
  const [routes, setRoutes] = useState<RouteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await getUserRoutes(userId);
      setRoutes(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (routeId: string) => {
    try {
      await deleteRoute(routeId);
      setRoutes((prev) => prev.filter((route) => route.id !== routeId));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    refresh();
  }, [userId]);

  return { routes, loading, error, refresh, remove };
}
