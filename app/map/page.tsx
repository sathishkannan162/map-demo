"use client";

import {
	ImageOverlay,
	MapContainer,
	Marker,
	Popup,
	Rectangle,
	TileLayer,
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
	pixelToLatLng(gridMatrix[0].length, gridMatrix.length), // bottom-right corner of image
];

export default function MapPage() {
	const userPos = [0, 0]; // grid coordinate
	const targetPos = [9, 9]; // destination coordinate

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
		console.log("raw path", rawPath);
		setPath(rawPath);
	}, []);

	return (
		<div className="w-full h-screen">
			<MapContainer
				center={pixelToLatLng(2, 2)}
				zoom={20}
				style={{ height: "100%", width: "100%" }}
				crs={L.CRS.Simple}
			>
				{/* Replace TileLayer with ImageOverlay */}
				<ImageOverlay url="/campus-map-hospital.webp" bounds={imageBounds} />

				{/* Walls */}
				{gridMatrix.map((row, y) =>
					row.map((cell, x) =>
						cell === 1 ? (
							<Rectangle
								key={`wall-${x}-${y}`}
								bounds={[pixelToLatLng(x, y), pixelToLatLng(x + 1, y + 1)]}
								pathOptions={{ color: "black" }}
							/>
						) : null,
					),
				)}

				{/* Path */}
				{path.map(([x, y], idx) => (
					<Rectangle
						key={`path-${idx}`}
						bounds={[pixelToLatLng(x, y), pixelToLatLng(x + 1, y + 1)]}
						pathOptions={{ color: "blue", weight: 1 }}
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
