"use client";

import {
	type Building,
	MapComponent,
	hospitalBuildings,
} from "@/components/map-component";
import { NavigationControls } from "@/components/navigation-controls";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { useState } from "react";

export function HospitalNavigation() {
	const [currentFloor, setCurrentFloor] = useState(1);
	const [startBuilding, setStartBuilding] = useState<Building | null>(
		hospitalBuildings.find((b) => b.id === "entrance"),
	);
	const [destinationBuilding, setDestinationBuilding] =
		useState<Building | null>(null);
	const [searchQuery, setSearchQuery] = useState("");

	// Filter buildings by floor
	const buildingsOnCurrentFloor = hospitalBuildings.filter(
		(b) => b.floor === currentFloor,
	);

	return (
		<div className="min-h-screen bg-gray-50">

			{/* Main Content */}
			<main className="container mx-auto px-4 py-8">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-bold">Hospital Navigation System</h1>
					<Button variant="outline">Back to Clinic</Button>
				</div>

				<div className="flex flex-col lg:flex-row gap-6">
					{/* Floor Selection */}
					<div className="lg:w-1/4">
						<div className="bg-white p-4 rounded-lg shadow-md mb-6">
							<h2 className="text-lg font-semibold mb-3">
								Hospital Navigation
							</h2>
							<div className="flex mb-4">
								<select
									className="p-2 border rounded-md w-full"
									value={currentFloor}
									onChange={(e) => setCurrentFloor(Number(e.target.value))}
								>
									<option value={1}>Floor 1</option>
									<option value={2}>Floor 2</option>
								</select>
							</div>

							<div className="flex space-x-2">
								<Button
									variant="outline"
									className="flex-1"
									onClick={() =>
										setStartBuilding(
											hospitalBuildings.find((b) => b.id === "entrance"),
										)
									}
								>
									Set Start Point
								</Button>
								<Button
									variant="outline"
									className="flex-1"
									onClick={() => setDestinationBuilding(null)}
								>
									Set Destination
								</Button>
							</div>
						</div>

						{/* Navigation Controls */}
						<NavigationControls
							buildings={hospitalBuildings}
							onStartChange={setStartBuilding}
							onDestinationChange={setDestinationBuilding}
							onSearch={setSearchQuery}
						/>
					</div>

					{/* Map */}
					<div className="lg:w-3/4">
						<MapComponent
							startBuilding={startBuilding}
							destinationBuilding={destinationBuilding}
							searchQuery={searchQuery}
							currentFloor={currentFloor}
						/>
					</div>
				</div>
			</main>
		</div>
	);
}
