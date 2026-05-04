import { useEffect, useRef, useState } from 'react';
import { LatLng } from '../types/route';

interface ProgressLineProps {
  routeCoordinates: LatLng[];
  currentLocation: LatLng | null;
  nearestPointIndex: number;
}

/**
 * Componente para dibujar la línea de progreso desde el inicio hasta la ubicación actual
 */
export function ProgressLine({
  routeCoordinates,
  currentLocation,
  nearestPointIndex,
}: ProgressLineProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !currentLocation || routeCoordinates.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar ruta completa (gris)
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const getPixelPos = (coord: LatLng, index: number) => {
      const x = (index / routeCoordinates.length) * canvas.width;
      const y = canvas.height * 0.5;
      return { x, y };
    };

    const startPos = getPixelPos(routeCoordinates[0], 0);
    ctx.moveTo(startPos.x, startPos.y);

    routeCoordinates.forEach((coord, index) => {
      const pos = getPixelPos(coord, index);
      ctx.lineTo(pos.x, pos.y);
    });
    ctx.stroke();

    // Dibujar línea de progreso (verde)
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(startPos.x, startPos.y);

    for (let i = 0; i <= Math.min(nearestPointIndex, routeCoordinates.length - 1); i++) {
      const pos = getPixelPos(routeCoordinates[i], i);
      ctx.lineTo(pos.x, pos.y);
    }
    ctx.stroke();

    // Dibujar marcador de ubicación actual
    const currentPos = getPixelPos(routeCoordinates[0], nearestPointIndex / routeCoordinates.length);
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(currentPos.x, currentPos.y, 6, 0, 2 * Math.PI);
    ctx.fill();
  }, [routeCoordinates, currentLocation, nearestPointIndex]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={50}
      className="w-full h-12 bg-slate-800/30 rounded border border-slate-700/50"
    />
  );
}
