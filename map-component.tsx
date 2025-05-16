"use client";

import {
	ImageOverlay,
	MapContainer,
	Marker,
	Polyline,
	Popup,
	Rectangle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import PF from "pathfinding";
import { useEffect, useState } from "react";

// Hospital building coordinates mapped to names
const buildingMapObject: Record<string, string> = {
	"4,0": "Emergency Room",
	"6,1": "Surgery Center",
	"7,2": "Radiology",
	"1,3": "Cardiology",
	"2,3": "Pediatrics",
	"3,3": "Oncology",
	"4,3": "Neurology",
	"5,3": "Orthopedics",
	"6,3": "Maternity Ward",
	"7,3": "Intensive Care Unit",
	"2,5": "Laboratory",
	"3,5": "Pharmacy",
	"4,5": "Cafeteria",
	"5,5": "Administration",
	"7,7": "Outpatient Clinic",
	"4,8": "Physical Therapy",
	"6,9": "Mental Health",
	"7,9": "Urology",
	"2,7": "Dermatology",
	"8,4": "Ophthalmology",
};

// Generate grid size dynamically based on buildingMapObject keys
const allCoords = Object.keys(buildingMapObject).map((key) =>
	key.split(",").map(Number),
);
const maxX = Math.max(...allCoords.map(([x]) => x)) + 1;
const maxY = Math.max(...allCoords.map(([, y]) => y)) + 1;

// Build gridMatrix from buildingMapObject
const gridMatrix = Array.from({ length: maxY }, (_, y) =>
	Array.from({ length: maxX }, (_, x) => {
		return buildingMapObject[`${x},${y}`] ? 1 : 0;
	}),
);

const origin = [0, 0]; // starting LatLng

function pixelToLatLng(x: number, y: number) {
	return [origin[0] + y * 0.0001, origin[1] + x * 0.0001]; // convert to LatLng
}

const imageBounds = [pixelToLatLng(0, 0), pixelToLatLng(maxX, maxY)];

function findAdjacentWalkableCell(
	x: number,
	y: number,
): [number, number] | null {
	const directions = [
		[0, -1],
		[0, 1],
		[-1, 0],
		[1, 0],
	];

	for (const [dx, dy] of directions) {
		const nx = x + dx;
		const ny = y + dy;
		if (
			ny >= 0 &&
			ny < gridMatrix.length &&
			nx >= 0 &&
			nx < gridMatrix[0].length &&
			gridMatrix[ny][nx] === 0
		) {
			return [nx, ny];
		}
	}

	return null;
}

export function MapComponent() {
	const userPos: [number, number] = [0, 0]; // start position
	const [targetPos, setTargetPos] = useState<[number, number]>([
		maxX - 1,
		maxY - 1,
	]);
	const [path, setPath] = useState<[number, number][]>([]);

	// Extract buildings from buildingMapObject for rendering
	const buildings = Object.entries(buildingMapObject).map(([key, label]) => {
		const [x, y] = key.split(",").map(Number);
		return { x, y, label };
	});

	useEffect(() => {
		const grid = new PF.Grid(gridMatrix);
		const finder = new PF.AStarFinder();
		const rawPath = finder.findPath(
			userPos[0],
			userPos[1],
			targetPos[0],
			targetPos[1],
			grid,
		);
		setPath(rawPath);
	}, [targetPos]);

	function createBuildingIcon(name: string) {
		return L.divIcon({
			className: "building-label",
			html: `<div style="
        background: rgba(255,255,255,0.8);
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 10px;
        color: #000;
        cursor: pointer;
        border: 1px solid #333;
      ">${name}</div>`,
			iconSize: [100, 24],
			iconAnchor: [0, 0],
		});
	}

	function onBuildingClick(x: number, y: number) {
		const walkableNeighbor = findAdjacentWalkableCell(x, y);
		if (walkableNeighbor) {
			setTargetPos(walkableNeighbor);
		} else {
			console.log("No adjacent walkable cell found for building", x, y);
		}
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
					<ImageOverlay url="" bounds={imageBounds} />

					{/* Render buildings */}
					{buildings.map(({ x, y }) => (
						<Rectangle
							key={`building-${x}-${y}`}
							bounds={[pixelToLatLng(x, y), pixelToLatLng(x + 1, y + 1)]}
							pathOptions={{
								color: "black",
								fillColor: "grey",
								fillOpacity: 0.7,
							}}
							eventHandlers={{ click: () => onBuildingClick(x, y) }}
						/>
					))}

					{/* Render path */}
					{/* {path.map(([x, y], idx) => ( */}
					{/*   <Rectangle key={`path-${idx}`} bounds={[pixelToLatLng(x, y), pixelToLatLng(x + 1, y + 1)]} pathOptions={{ color: "blue", weight: 2 }} /> */}
					{/* ))} */}
					<Polyline
						positions={path.map(([x, y]) => pixelToLatLng(x + 0.5, y + 0.5))}
						pathOptions={{ color: "blue", weight: 4 }}
					/>

					{/* User marker */}
					<Marker position={pixelToLatLng(userPos[0], userPos[1])}>
						<Popup>User</Popup>
					</Marker>

					{/* Target marker */}
					<Marker position={pixelToLatLng(targetPos[0], targetPos[1])}>
						<Popup>Destination</Popup>
					</Marker>

					{/* Building labels */}
					{buildings.map(({ x, y, label }) => (
						<Marker
							key={`label-${x}-${y}`}
							position={pixelToLatLng(x + 0.5, y + 0.5)}
							icon={createBuildingIcon(label)}
							eventHandlers={{ click: () => onBuildingClick(x, y) }}
						/>
					))}
				</MapContainer>
			</div>
		</>
	);
}
