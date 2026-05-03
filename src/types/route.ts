export type LatLng = { lat: number; lng: number };

export type RouteRecord = {
  id: string;
  user_id: string;
  name: string;
  coordinates: LatLng[];
  distance_km: number;
  elevation_gain_m: number;
  difficulty: string;
  surface_stats: SurfaceStats;
  created_at: string;
};

export type SurfaceStats = {
  asphalt: number;
  gravel: number;
  dirt: number;
  unknown: number;
};
