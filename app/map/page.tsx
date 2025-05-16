"use client";

import {
  ImageOverlay,
  MapContainer,
  Marker,
  Popup,
  Rectangle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import PF from "pathfinding";
import { useEffect, useState } from "react";

const gridMatrix = [
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 1, 0, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 1, 1, 1, 1, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 1, 1, 1, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
];

const buildings: Record<string, string> = {
  "0,4": "Building A",
  "1,0": "Building B",
  "1,1": "Building C",
  "1,4": "Building D",
  "1,6": "Building E",
  "1,7": "Building F",
  "2,7": "Building G",
  "3,1": "Building H",
  "3,2": "Building I",
  "3,3": "Building J",
  "3,4": "Building K",
  "3,5": "Building L",
  "3,7": "Building M",
  "5,2": "Building N",
  "5,3": "Building O",
  "5,4": "Building P",
  "5,5": "Building Q",
  "5,7": "Building R",
  "7,1": "Building S",
  "7,2": "Building T",
  "7,3": "Building U",
  "7,5": "Building V",
  "7,6": "Building W",
  "7,7": "Building X",
  "9,6": "Building Y",
  "9,7": "Building Z",
};

const cellSize = 30; // size of each grid cell in pixels
const origin = [0, 0]; // starting LatLng

function pixelToLatLng(x: number, y: number) {
  return [origin[0] + y * 0.0001, origin[1] + x * 0.0001]; // convert to LatLng
}

const imageBounds = [
  pixelToLatLng(0, 0),
  pixelToLatLng(gridMatrix[0].length, gridMatrix.length),
];

export default function MapPage() {
  const userPos = [0, 0]; // user start grid coordinate
  const [targetPos, setTargetPos] = useState<[number, number]>([9, 9]);
  const [path, setPath] = useState<[number, number][]>([]);

  useEffect(() => {
    const grid = new PF.Grid(gridMatrix);
    const finder = new PF.AStarFinder();
    const rawPath = finder.findPath(
      userPos[0],
      userPos[1],
      targetPos[0],
      targetPos[1],
      grid
    );
    setPath(rawPath);
  }, [targetPos]);

  // Create a Leaflet div icon for building labels
  function createBuildingIcon(name: string) {
    return L.divIcon({
      className: "building-label",
      html: `<div style="
        background: rgba(255,255,255,0.8);
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 10px;
        cursor: pointer;
        border: 1px solid #333;
      ">${name}</div>`,
      iconSize: [100, 24],
      iconAnchor: [50, 12],
    });
  }

  return (
    <>
      <style>{`
        .building-label:hover {
          background: rgba(0, 123, 255, 0.9);
          color: white;
          border-color: #0056b3;
        }
      `}</style>

      <div className="w-full h-screen">
        <MapContainer
          center={pixelToLatLng(2, 2)}
          zoom={20}
          style={{ height: "100%", width: "100%" }}
          crs={L.CRS.Simple}
        >
          <ImageOverlay url="/campus-map-hospital.webp" bounds={imageBounds} />

          {/* Buildings as black rectangles */}
          {gridMatrix.map((row, y) =>
            row.map((cell, x) =>
              cell === 1 ? (
                <Rectangle
                  key={`building-${x}-${y}`}
                  bounds={[pixelToLatLng(x, y), pixelToLatLng(x + 1, y + 1)]}
                  pathOptions={{ color: "black", fillColor: "grey", fillOpacity: 0.7 }}
                />
              ) : null
            )
          )}

          {/* Path */}
          {path.map(([x, y], idx) => (
            <Rectangle
              key={`path-${idx}`}
              bounds={[pixelToLatLng(x, y), pixelToLatLng(x + 1, y + 1)]}
              pathOptions={{ color: "blue", weight: 2 }}
            />
          ))}

          {/* User Marker */}
          <Marker position={pixelToLatLng(userPos[0], userPos[1])}>
            <Popup>User</Popup>
          </Marker>

          {/* Target Marker */}
          <Marker position={pixelToLatLng(targetPos[0], targetPos[1])}>
            <Popup>Destination</Popup>
          </Marker>

          {/* Building labels as clickable divIcons */}
          {Object.entries(buildings).map(([key, name]) => {
            const [x, y] = key.split(",").map(Number);
            return (
              <Marker
                key={`label-${key}`}
                position={pixelToLatLng(x + 0.5, y + 0.5)} // center text in cell
                icon={createBuildingIcon(name)}
                eventHandlers={{
                  click: () => {
                    setTargetPos([x, y]);
                  },
                }}
              />
            );
          })}
        </MapContainer>
      </div>
    </>
  );
}
