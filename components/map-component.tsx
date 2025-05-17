"use client";

import {
	ImageOverlay,
	MapContainer,
	Marker,
	Polyline,
	Popup,
	Rectangle,
	useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import PF from "pathfinding";
import { useCallback, useEffect, useState } from "react";

// Define building data structure
export interface Building {
	id: string;
	name: string;
	x: number;
	y: number;
	floor: number;
	category: string;
	color: string;
}

// Hospital building data with categories and colors
export const hospitalBuildings: Building[] = [
	{
		id: "emergency",
		name: "Emergency Room",
		x: 4,
		y: 0,
		floor: 1,
		category: "emergency",
		color: "rgb(254, 202, 202)",
	},
	{
		id: "surgery",
		name: "Surgery Center",
		x: 6,
		y: 1,
		floor: 1,
		category: "surgery",
		color: "rgb(254, 240, 138)",
	},
	{
		id: "radiology",
		name: "Radiology",
		x: 7,
		y: 2,
		floor: 1,
		category: "radiology",
		color: "rgb(216, 180, 254)",
	},
	{
		id: "cardiology",
		name: "Cardiology",
		x: 1,
		y: 3,
		floor: 1,
		category: "specialty",
		color: "rgb(186, 230, 253)",
	},
	{
		id: "pediatrics",
		name: "Pediatrics",
		x: 2,
		y: 3,
		floor: 1,
		category: "specialty",
		color: "rgb(187, 247, 208)",
	},
	{
		id: "oncology",
		name: "Oncology",
		x: 3,
		y: 3,
		floor: 1,
		category: "specialty",
		color: "rgb(254, 215, 170)",
	},
	{
		id: "neurology",
		name: "Neurology",
		x: 4,
		y: 3,
		floor: 1,
		category: "specialty",
		color: "rgb(254, 202, 202)",
	},
	{
		id: "orthopedics",
		name: "Orthopedics",
		x: 5,
		y: 3,
		floor: 1,
		category: "specialty",
		color: "rgb(186, 230, 253)",
	},
	{
		id: "maternity",
		name: "Maternity Ward",
		x: 6,
		y: 3,
		floor: 2,
		category: "inpatient",
		color: "rgb(254, 240, 138)",
	},
	{
		id: "icu",
		name: "ICU",
		x: 7,
		y: 3,
		floor: 2,
		category: "critical",
		color: "rgb(254, 240, 138)",
	},
	{
		id: "laboratory",
		name: "Laboratory",
		x: 2,
		y: 5,
		floor: 1,
		category: "services",
		color: "rgb(254, 249, 195)",
	},
	{
		id: "pharmacy",
		name: "Pharmacy",
		x: 3,
		y: 5,
		floor: 1,
		category: "services",
		color: "rgb(187, 247, 208)",
	},
	{
		id: "cafeteria",
		name: "Cafeteria",
		x: 4,
		y: 5,
		floor: 1,
		category: "amenities",
		color: "rgb(254, 215, 170)",
	},
	{
		id: "admin",
		name: "Administration",
		x: 5,
		y: 5,
		floor: 1,
		category: "admin",
		color: "rgb(254, 202, 202)",
	},
	{
		id: "outpatient",
		name: "Outpatient Clinic",
		x: 7,
		y: 7,
		floor: 1,
		category: "outpatient",
		color: "rgb(186, 230, 253)",
	},
	{
		id: "physicalTherapy",
		name: "Physical Therapy",
		x: 4,
		y: 8,
		floor: 2,
		category: "rehabilitation",
		color: "rgb(187, 247, 208)",
	},
	{
		id: "mentalHealth",
		name: "Mental Health",
		x: 6,
		y: 9,
		floor: 2,
		category: "specialty",
		color: "rgb(254, 215, 170)",
	},
	{
		id: "urology",
		name: "Urology",
		x: 7,
		y: 9,
		floor: 2,
		category: "specialty",
		color: "rgb(254, 202, 202)",
	},
	{
		id: "dermatology",
		name: "Dermatology",
		x: 2,
		y: 7,
		floor: 2,
		category: "specialty",
		color: "rgb(186, 230, 253)",
	},
	{
		id: "ophthalmology",
		name: "Ophthalmology",
		x: 8,
		y: 4,
		floor: 2,
		category: "specialty",
		color: "rgb(187, 247, 208)",
	},
	{
		id: "entrance",
		name: "Main Entrance",
		x: 3,
		y: 0,
		floor: 1,
		category: "entrance",
		color: "rgb(209, 213, 219)",
	},
	{
		id: "elevator",
		name: "Elevator",
		x: 3,
		y: 6,
		floor: 1,
		category: "transport",
		color: "rgb(209, 213, 219)",
	},
	{
		id: "stairs",
		name: "Stairs",
		x: 5,
		y: 6,
		floor: 1,
		category: "transport",
		color: "rgb(209, 213, 219)",
	},
	{
		id: "reception",
		name: "Reception",
		x: 1,
		y: 1,
		floor: 1,
		category: "admin",
		color: "rgb(186, 230, 253)",
	},
];

// Generate grid matrix from building data
const generateGridMatrix = (buildings: Building[], currentFloor: number) => {
	// Find max dimensions
	const maxX = Math.max(...buildings.map((b) => b.x)) + 1;
	const maxY = Math.max(...buildings.map((b) => b.y)) + 1;

	// Create empty grid
	const grid = Array.from({ length: maxY }, () => Array(maxX).fill(0));

	// Mark buildings as obstacles (1)
	buildings.forEach((building) => {
		if (building.floor === currentFloor) {
			grid[building.y][building.x] = 1;
		}
	});

	return grid;
};

// Helper function to find adjacent walkable cell
function findAdjacentWalkableCell(
	x: number,
	y: number,
	gridMatrix: number[][],
): [number, number] | null {
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

// Convert pixel coordinates to map coordinates
function pixelToLatLng(x: number, y: number) {
	const origin = [0, 0]; // starting LatLng
	return [origin[0] + y * 0.0001, origin[1] + x * 0.0001]; // convert to LatLng
}

// Map view controller component
function MapViewController({
	center,
	zoom,
}: {
	center: [number, number];
	zoom: number;
}) {
	const map = useMap();

	useEffect(() => {
		map.setView(center, zoom);
	}, [center, zoom, map]);

	return null;
}

interface MapComponentProps {
	startBuilding?: Building | null;
	destinationBuilding?: Building | null;
	searchQuery?: string;
	currentFloor?: number;
}

export function MapComponent({
	startBuilding = null,
	destinationBuilding = null,
	searchQuery = "",
	currentFloor = 1,
}: MapComponentProps) {
	// Default to entrance if no start building provided
	const defaultStart =
		hospitalBuildings.find((b) => b.id === "entrance") || hospitalBuildings[0];

	// State
	const [gridMatrix, setGridMatrix] = useState<number[][]>([]);
	const [userPos, setUserPos] = useState<[number, number]>([
		defaultStart.x,
		defaultStart.y,
	]);
	const [targetPos, setTargetPos] = useState<[number, number] | null>(null);
	const [path, setPath] = useState<[number, number][]>([]);
	const [filteredBuildings, setFilteredBuildings] = useState<Building[]>([]);
	const [mapCenter, setMapCenter] = useState<[number, number]>(
		pixelToLatLng(5, 5),
	);
	const [mapZoom, setMapZoom] = useState(20);

	// Initialize grid matrix
	useEffect(() => {
		const matrix = generateGridMatrix(hospitalBuildings, currentFloor);
		setGridMatrix(matrix);

		// Filter buildings by current floor
		setFilteredBuildings(
			hospitalBuildings.filter((b) => b.floor === currentFloor),
		);
	}, [currentFloor]);

	// Update path when start or destination changes
	useEffect(() => {
		if (startBuilding) {
			setUserPos([startBuilding.x, startBuilding.y]);
		}

		if (destinationBuilding) {
			// Find walkable cell adjacent to destination
			const walkableCell = findAdjacentWalkableCell(
				destinationBuilding.x,
				destinationBuilding.y,
				gridMatrix,
			);
			if (walkableCell) {
				setTargetPos(walkableCell);
			}
		}
	}, [startBuilding, destinationBuilding, gridMatrix]);

	// Search functionality
	useEffect(() => {
		if (searchQuery) {
			const matchedBuilding = hospitalBuildings.find((b) =>
				b.name.toLowerCase().includes(searchQuery.toLowerCase()),
			);

			if (matchedBuilding) {
				// Find walkable cell adjacent to matched building
				const walkableCell = findAdjacentWalkableCell(
					matchedBuilding.x,
					matchedBuilding.y,
					gridMatrix,
				);
				if (walkableCell) {
					setTargetPos(walkableCell);
					// Center map on destination
					setMapCenter(pixelToLatLng(matchedBuilding.x, matchedBuilding.y));
				}
			}
		}
	}, [searchQuery, gridMatrix]);

	// Calculate path
	useEffect(() => {
		if (!targetPos || !userPos || gridMatrix.length === 0) return;

		try {
			const grid = new PF.Grid(gridMatrix);
			const finder = new PF.AStarFinder();
			const rawPath = finder.findPath(
				userPos[0],
				userPos[1],
				targetPos[0],
				targetPos[1],
				grid,
			);
			setPath(rawPath as [number, number][]);

			// Center map on middle of path
			if (rawPath.length > 0) {
				const midPoint = rawPath[Math.floor(rawPath.length / 2)];
				setMapCenter(pixelToLatLng(midPoint[0], midPoint[1]));
			}
		} catch (error) {
			console.error("Pathfinding error:", error);
		}
	}, [userPos, targetPos, gridMatrix]);

	// Create building icon
	const createBuildingIcon = useCallback((name: string, category: string) => {
		const bgColor =
			category === "emergency"
				? "rgba(254, 202, 202, 0.8)"
				: category === "radiology"
					? "rgba(216, 180, 254, 0.8)"
					: category === "pharmacy"
						? "rgba(187, 247, 208, 0.8)"
						: category === "critical"
							? "rgba(254, 240, 138, 0.8)"
							: "rgba(255, 255, 255, 0.8)";

		return L.divIcon({
			className: "building-label",
			html: `<div style="
        background: ${bgColor};
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
	}, []);

	// Handle building click
	const onBuildingClick = useCallback(
		(building: Building) => {
			const walkableNeighbor = findAdjacentWalkableCell(
				building.x,
				building.y,
				gridMatrix,
			);
			if (walkableNeighbor) {
				setTargetPos(walkableNeighbor);
			} else {
				console.log(
					"No adjacent walkable cell found for building",
					building.name,
				);
			}
		},
		[gridMatrix],
	);

	// Calculate map bounds
	const maxX = Math.max(...filteredBuildings.map((b) => b.x)) + 1;
	const maxY = Math.max(...filteredBuildings.map((b) => b.y)) + 1;
	const imageBounds = [pixelToLatLng(0, 0), pixelToLatLng(maxX, maxY)];

	return (
		<>
<style>{`
        .building-label:hover {
          background: rgba(0, 123, 255, 0.9) !important;
          color: white !important;
          border-color: #0056b3 !important;
        }
        .custom-marker {
          background: transparent;
        }
        .marker-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
        }
        .marker-icon {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          border: 2px solid #333;
        }
        .user-marker .marker-icon {
          background: #3b82f6;
          color: white;
        }
        .destination-marker .marker-icon {
          background: #ef4444;
          color: white;
        }
      `}</style>

			<div className="w-full h-[600px] rounded-lg overflow-hidden border border-gray-200">
				<MapContainer
					center={mapCenter}
					zoom={mapZoom}
					style={{ height: "100%", width: "100%" }}
					crs={L.CRS.Simple}
					zoomControl={false}
				>
					<MapViewController center={mapCenter} zoom={mapZoom} />

					{/* Background */}
					<ImageOverlay url="/test1.webp" bounds={imageBounds} />

					{/* Buildings */}
					{filteredBuildings.map((building) => (
						<Rectangle
							key={`building-${building.id}`}
							bounds={[
								pixelToLatLng(building.x, building.y),
								pixelToLatLng(building.x + 1, building.y + 1),
							]}
							pathOptions={{
								color: "black",
								fillColor: building.color,
								fillOpacity: 0.7,
							}}
							eventHandlers={{
								click: () => onBuildingClick(building),
							}}
						/>
					))}

					{/* Path */}
					<Polyline
						positions={path.map(([x, y]) => pixelToLatLng(x + 0.5, y + 0.5))}
						pathOptions={{ color: "blue", weight: 4 }}
					/>

					{/* User Marker */}
					<Marker
						position={pixelToLatLng(userPos[0], userPos[1])}
						icon={L.divIcon({
							className: "custom-marker user-marker",
							html: `<div class="marker-container">
                <div class="marker-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-navigation"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                </div>
              </div>`,
							iconSize: [30, 30],
							iconAnchor: [15, 15],
						})}
					>
						<Popup>You are here</Popup>
					</Marker>

					{/* Target Marker */}
					{targetPos && (
            <Marker
              position={pixelToLatLng(targetPos[0], targetPos[1])}
              icon={L.divIcon({
                className: "custom-marker destination-marker",
                html: `<div class="marker-container">
                  <div class="marker-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-flag"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>
                  </div>
                </div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15],
              })}
            >
              <Popup>Destination</Popup>
            </Marker>
					)}

					{/* Building labels */}
					{filteredBuildings.map((building) => (
						<Marker
							key={`label-${building.id}`}
							position={pixelToLatLng(building.x + 0.5, building.y + 0.5)}
							icon={createBuildingIcon(building.name, building.category)}
							eventHandlers={{
								click: () => onBuildingClick(building),
							}}
						/>
					))}
				</MapContainer>
			</div>
		</>
	);
}
