import { supabase } from './supabaseClient';
import { RouteRecord, SurfaceStats } from '../types/route';

export async function getUserRoutes(userId: string): Promise<RouteRecord[]> {
  const { data, error } = await supabase
    .from('routes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as RouteRecord[];
}

export async function getRouteById(routeId: string) {
  const { data, error } = await supabase.from('routes').select('*').eq('id', routeId).single();
  if (error) throw error;
  return data as RouteRecord;
}

export async function createRoute(route: Omit<RouteRecord, 'id' | 'created_at'>) {
  const { data, error } = await supabase.from('routes').insert([route]).select().single();
  if (error) throw error;
  return data as RouteRecord;
}

export async function updateRoute(routeId: string, updates: Partial<RouteRecord>) {
  const { data, error } = await supabase.from('routes').update(updates).eq('id', routeId).select().single();
  if (error) throw error;
  return data as RouteRecord;
}

export async function deleteRoute(routeId: string) {
  const { error } = await supabase.from('routes').delete().eq('id', routeId);
  if (error) throw error;
}

export async function saveSurfaceStats(routeId: string, surface_stats: SurfaceStats) {
  return updateRoute(routeId, { surface_stats });
}

export async function saveElevationGain(routeId: string, elevation_gain_m: number) {
  return updateRoute(routeId, { elevation_gain_m });
}
