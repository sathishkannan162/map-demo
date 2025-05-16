"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

// Define types for our props and building data
interface Building {
	id: string;
	name: string;
	x: number;
	y: number;
	floor: number;
	category: string;
	color: string;
}

interface NavigationControlsProps {
	buildings: Building[];
	onStartChange: (building: Building | null) => void;
	onDestinationChange: (building: Building | null) => void;
	onSearch: (query: string) => void;
}

export function NavigationControls({
	buildings,
	onStartChange,
	onDestinationChange,
	onSearch,
}: NavigationControlsProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [startPoint, setStartPoint] = useState<string>("entrance");
	const [destination, setDestination] = useState<string>("");

	// Quick access departments
	const quickAccessDepartments = [
		"Emergency Room",
		"Radiology",
		"Pharmacy",
		"ICU",
	];

	// Handle start point change
	const handleStartChange = (value: string) => {
		setStartPoint(value);
		const selectedBuilding = buildings.find((b) => b.id === value) || null;
		onStartChange(selectedBuilding);
	};

	// Handle destination change
	const handleDestinationChange = (value: string) => {
		setDestination(value);
		const selectedBuilding = buildings.find((b) => b.id === value) || null;
		onDestinationChange(selectedBuilding);
	};

	// Handle search
	const handleSearch = () => {
		onSearch(searchQuery);
	};

	// Handle quick access selection
	const handleQuickAccess = (departmentName: string) => {
		const department = buildings.find((b) => b.name === departmentName);
		if (department) {
			setDestination(department.id);
			onDestinationChange(department);
		}
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<h2 className="text-xl font-semibold mb-4">Navigation Controls</h2>
			<p className="text-sm text-gray-600 mb-4">
				Select your starting point and destination
			</p>

			{/* Search */}
			<div className="flex mb-4">
				<Input
					placeholder="Search locations..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="flex-1"
				/>
				<Button onClick={handleSearch} className="ml-2">
					<Search className="h-4 w-4 mr-2" />
					Navigate
				</Button>
			</div>

			{/* Starting Point */}
			<div className="mb-4">
				<label className="block text-sm font-medium mb-1">Starting Point</label>
				<select
					className="w-full p-2 border rounded-md"
					value={startPoint}
					onChange={(e) => handleStartChange(e.target.value)}
				>
					<option value="entrance">Main Entrance (Floor 1)</option>
					{buildings.map((building) => (
						<option key={`start-${building.id}`} value={building.id}>
							{building.name} (Floor {building.floor})
						</option>
					))}
				</select>
			</div>

			{/* Destination */}
			<div className="mb-6">
				<label className="block text-sm font-medium mb-1">Destination</label>
				<select
					className="w-full p-2 border rounded-md"
					value={destination}
					onChange={(e) => handleDestinationChange(e.target.value)}
				>
					<option value="">Select destination</option>
					{buildings.map((building) => (
						<option key={`dest-${building.id}`} value={building.id}>
							{building.name} (Floor {building.floor})
						</option>
					))}
				</select>
			</div>

			{/* Quick Access */}
			<div>
				<h3 className="text-sm font-medium mb-2">Quick Access</h3>
				<div className="grid grid-cols-2 gap-2">
					{quickAccessDepartments.map((dept) => (
						<Button
							key={dept}
							variant="outline"
							className="justify-start"
							onClick={() => handleQuickAccess(dept)}
						>
							<div className="flex items-center">
								<div
									className={`w-3 h-3 rounded-full mr-2 ${
										dept === "Emergency Room"
											? "bg-red-300"
											: dept === "Radiology"
												? "bg-purple-300"
												: dept === "Pharmacy"
													? "bg-green-300"
													: "bg-yellow-300"
									}`}
								></div>
								{dept}
							</div>
						</Button>
					))}
				</div>
			</div>

			{/* Map Legend */}
			<div className="mt-6">
				<h3 className="text-sm font-medium mb-2">Map Legend</h3>
				<div className="grid grid-cols-2 gap-y-2 text-sm">
					<div className="flex items-center">
						<div className="w-3 h-3 rounded-full bg-red-300 mr-2"></div>
						<span>Emergency</span>
					</div>
					<div className="flex items-center">
						<div className="w-3 h-3 rounded-full bg-purple-300 mr-2"></div>
						<span>Radiology</span>
					</div>
					<div className="flex items-center">
						<div className="w-3 h-3 rounded-full bg-yellow-300 mr-2"></div>
						<span>Surgery</span>
					</div>
					<div className="flex items-center">
						<div className="w-3 h-3 rounded-full bg-yellow-200 mr-2"></div>
						<span>ICU</span>
					</div>
					<div className="flex items-center">
						<div className="w-3 h-3 rounded-full bg-green-300 mr-2"></div>
						<span>Pharmacy</span>
					</div>
					<div className="flex items-center">
						<div className="w-3 h-3 rounded-full bg-yellow-100 mr-2"></div>
						<span>Laboratory</span>
					</div>
				</div>
			</div>
		</div>
	);
}
