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

const cellSize = 30; // size of each grid cell in pixels
const origin = [0, 0]; // starting LatLng

function pixelToLatLng(x: number, y: number) {
	return [origin[0] + y * 0.0001, origin[1] + x * 0.0001]; // convert to LatLng
}

const imageBounds = [
	pixelToLatLng(0, 0),
	pixelToLatLng(gridMatrix[0].length, gridMatrix.length),
];

// Find adjacent walkable cell (up, down, left, right) next to a building cell
function findAdjacentWalkableCell(x: number, y: number): [number, number] | null {
	const directions = [
		[0, -1], // up
		[0, 1], // down
		[-1, 0], // left
		[1, 0], // right
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
			grid,
		);
		console.log(rawPath, "rawpath");
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
        color: #000;
        cursor: pointer;
        border: 1px solid #333;
      ">${name}</div>`,
			iconSize: [100, 24],
			iconAnchor: [0, 0],
		});
	}

	// Helper to handle building clicks: set target to adjacent walkable cell if available
	function onBuildingClick(x: number, y: number) {
		const walkableNeighbor = findAdjacentWalkableCell(x, y);
		if (walkableNeighbor) {
			setTargetPos(walkableNeighbor);
		} else {
			// fallback: maybe keep current target or ignore
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

					{/* Buildings as black rectangles */}
					{gridMatrix.map((row, y) =>
						row.map((cell, x) =>
							cell === 1 ? (
								<Rectangle
									key={`building-${x}-${y}`}
									bounds={[pixelToLatLng(x, y), pixelToLatLng(x + 1, y + 1)]}
									pathOptions={{
										color: "black",
										fillColor: "grey",
										fillOpacity: 0.7,
									}}
									eventHandlers={{
										click: () => onBuildingClick(x, y),
									}}
								/>
							) : null,
						),
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

					{/* Building labels as clickable divIcons with coordinate names */}
					{gridMatrix.map((row, y) =>
						row.map((cell, x) =>
							cell === 1 ? (
								<Marker
									key={`label-${x}-${y}`}
									position={pixelToLatLng(x + 0.5, y + 0.5)} // center text in cell
									icon={createBuildingIcon(`building-${x}-${y}`)}
									eventHandlers={{
										click: () => onBuildingClick(x, y),
									}}
								/>
							) : null,
						),
					)}
				</MapContainer>
			</div>
		</>
	);
}
