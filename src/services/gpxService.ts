import { LatLng } from '../types/route';

export function exportGPX(coordinates: LatLng[], name: string) {
  const now = new Date().toISOString();
  const points = coordinates
    .map(
      (coord) =>
        `    <trkpt lat="${coord.lat}" lon="${coord.lng}">
      <time>${now}</time>
    </trkpt>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="BikeRoute Builder" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${name}</name>
    <time>${now}</time>
  </metadata>
  <trk>
    <name>${name}</name>
    <trkseg>
${points}
    </trkseg>
  </trk>
</gpx>`;
}

export function parseGPX(text: string): LatLng[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'application/xml');
  const pts = Array.from(doc.querySelectorAll('trkpt'));
  return pts
    .map((pt) => {
      const lat = Number(pt.getAttribute('lat'));
      const lng = Number(pt.getAttribute('lon'));
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        return { lat, lng };
      }
      return null;
    })
    .filter((item): item is LatLng => item !== null);
}
