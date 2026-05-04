interface CompassProps {
  heading: number | null;
}

/**
 * Componente de brújula para mostrar la dirección de viaje
 */
export function Compass({ heading }: CompassProps) {
  if (heading === null) return null;

  const getDirectionLabel = (heading: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(heading / 22.5) % 16;
    return directions[index];
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-24 h-24 rounded-full bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-slate-700 shadow-lg flex items-center justify-center">
        {/* Marcas de dirección */}
        <div className="absolute inset-0 rounded-full">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <div
              key={angle}
              className="absolute w-1 h-2 bg-slate-500 left-1/2 top-1 origin-bottom"
              style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
            />
          ))}
        </div>

        {/* Aguja de dirección */}
        <div
          className="absolute w-1 h-10 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full origin-bottom transition-transform"
          style={{ transform: `rotate(${heading}deg)` }}
        />

        {/* Centro */}
        <div className="absolute w-3 h-3 rounded-full bg-white" />
      </div>

      {/* Etiqueta de dirección */}
      <div className="text-center">
        <p className="text-xs text-slate-400">Dirección</p>
        <p className="text-lg font-bold text-emerald-400">{getDirectionLabel(heading)}</p>
        <p className="text-xs text-slate-400 font-mono">{heading.toFixed(0)}°</p>
      </div>
    </div>
  );
}
