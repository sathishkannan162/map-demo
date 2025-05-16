'use client'
 
'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { MapContainer } from 'react-leaflet';
import PF from 'pathfinding';

// Dynamic import due to leaflet SSR issues
const DynamicMapGrid = dynamic(() => import('../components/MapGrid'), { ssr: false });


function findPath(map: number[][], start: [number, number], end: [number, number]) {
  const grid = new PF.Grid(map);
  const finder = new PF.AStarFinder();
  const path = finder.findPath(start[0], start[1], end[0], end[1], grid);
  return path;
}

export default function HomePage() {
  const hospitalMap = [
    [0, 0, 0, 1, 0],
    [1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
  ];

  const [path, setPath] = useState<[number, number][]>([]);

  useEffect(() => {
    const grid = new PF.Grid(hospitalMap);
    const finder = new PF.AStarFinder();
    const newPath = finder.findPath(0, 0, 4, 4, grid);
    setPath(newPath);
  }, []);

  return (
    <MapContainer center={[50, 50]} zoom={2} style={{ height: '100vh', width: '100%' }}>
      <DynamicMapGrid map={hospitalMap} path={path} />
    </MapContainer>
  );
}
