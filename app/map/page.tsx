
'use client';

import { MapContainer, TileLayer, Marker, Popup, Rectangle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import * as L from 'leaflet';
import PF from 'pathfinding';
import { gridMatrix } from '@/lib/grid';

const cellSize = 20; // size of each grid cell in pixels
const origin = [0, 0]; // starting LatLng

function pixelToLatLng(x: number, y: number) {
  return [origin[0] + y * 0.0001, origin[1] + x * 0.0001]; // convert to LatLng
}

export default function MapPage() {
  const userPos = [0, 0]; // grid coordinate
  const targetPos = [4, 4]; // destination coordinate

  const [path, setPath] = useState<[number, number][]>([]);

  useEffect(() => {
    const grid = new PF.Grid(gridMatrix);
    const finder = new PF.AStarFinder();
    const rawPath = finder.findPath(userPos[0], userPos[1], targetPos[0], targetPos[1], grid);
    setPath(rawPath);
  }, []);

  return (
    <div className="w-full h-screen">
      <MapContainer
        center={pixelToLatLng(2, 2)}
        zoom={20}
        style={{ height: '100%', width: '100%' }}
        crs={L.CRS.Simple}
      >
        <TileLayer
          url="./"
        />

        {/* Walls */}
        {gridMatrix.map((row, y) =>
          row.map((cell, x) =>
            cell === 1 ? (
              <Rectangle
                key={`wall-${x}-${y}`}
                bounds={[pixelToLatLng(x, y), pixelToLatLng(x + 1, y + 1)]}
                pathOptions={{ color: 'black' }}
              />
            ) : null
          )
        )}

        {/* Path */}
        {path.map(([x, y], idx) => (
          <Rectangle
            key={`path-${idx}`}
            bounds={[pixelToLatLng(x, y), pixelToLatLng(x + 1, y + 1)]}
            pathOptions={{ color: 'blue', weight: 1 }}
          />
        ))}

        {/* User Marker */}
        <Marker position={pixelToLatLng(userPos[0], userPos[1])}>
          <Popup>User</Popup>
        </Marker>

        {/* Destination */}
        <Marker position={pixelToLatLng(targetPos[0], targetPos[1])}>
          <Popup>Destination</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
