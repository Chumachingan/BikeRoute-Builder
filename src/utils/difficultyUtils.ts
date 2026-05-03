import { SurfaceStats } from '../types/route';

export function computeDifficulty(distanceKm: number, elevationGain: number, surface: SurfaceStats) {
  const gravelDirtShare = surface.gravel + surface.dirt;
  const hasLong = distanceKm > 50;
  const hasHardClimb = elevationGain > 800;
  const mixedSurface = gravelDirtShare > 25;

  if (hasLong && hasHardClimb) return 'Difícil';
  if (distanceKm > 30 || elevationGain > 500 || mixedSurface) return 'Moderada';
  return 'Fácil';
}

export function difficultyColor(difficulty: string) {
  if (difficulty === 'Difícil') return 'bg-red-500/15 text-red-300 border border-red-500/20';
  if (difficulty === 'Moderada') return 'bg-orange-500/15 text-orange-300 border border-orange-500/20';
  return 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20';
}
