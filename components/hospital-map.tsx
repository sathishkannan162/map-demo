"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Compass, Navigation, Search, CuboidIcon as Cube } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import HospitalMap3D from "@/components/hospital-map-3d"
import type { Room, Hallway, NavigationPoint } from "@/types/hospital-types"

// Map styling
const MAP_STYLES = {
  background: "#f8f9fa",
  rooms: {
    emergency: { fill: "#ffcdd2", stroke: "#ef5350" },
    radiology: { fill: "#e1bee7", stroke: "#ab47bc" },
    surgery: { fill: "#ffcc80", stroke: "#ff9800" },
    icu: { fill: "#ffecb3", stroke: "#ffc107" },
    pharmacy: { fill: "#c8e6c9", stroke: "#66bb6a" },
    laboratory: { fill: "#fff9c4", stroke: "#ffee58" },
    reception: { fill: "#bbdefb", stroke: "#42a5f5" },
    cafeteria: { fill: "#ffe0b2", stroke: "#ff9800" },
    administration: { fill: "#d1c4e9", stroke: "#7e57c2" },
    restroom: { fill: "#cfd8dc", stroke: "#90a4ae" },
    elevator: { fill: "#e0e0e0", stroke: "#757575" },
    stairs: { fill: "#e0e0e0", stroke: "#757575" },
    hallway: { fill: "#f5f5f5", stroke: "#e0e0e0" },
    default: { fill: "#e0e0e0", stroke: "#9e9e9e" },
  },
  hallway: { fill: "#ffffff", stroke: "#e0e0e0" },
  text: {
    room: "#424242",
    hallway: "#757575",
  },
  path: {
    stroke: "#4285f4",
    strokeWidth: 4,
    arrow: "#4285f4",
    activeStroke: "#ea4335",
    activeFill: "rgba(234, 67, 53, 0.2)",
    activeWidth: 6,
  },
  currentLocation: {
    fill: "#4285f4",
    stroke: "#ffffff",
    radius: 8,
    pulse: "rgba(66, 133, 244, 0.4)",
  },
  destination: {
    fill: "#ea4335",
    stroke: "#ffffff",
    radius: 8,
  },
}

// Hospital map data
const rooms: Room[] = [
  {
    id: "main-entrance",
    name: "Main Entrance",
    type: "entrance",
    floor: 1,
    points: [
      [400, 50],
      [600, 50],
      [600, 100],
      [400, 100],
    ],
    center: [500, 75],
  },
  {
    id: "reception",
    name: "Reception",
    type: "reception",
    floor: 1,
    points: [
      [150, 150],
      [350, 150],
      [350, 300],
      [150, 300],
    ],
    center: [250, 225],
  },
  {
    id: "emergency",
    name: "Emergency",
    type: "emergency",
    floor: 1,
    points: [
      [400, 150],
      [600, 150],
      [600, 300],
      [400, 300],
    ],
    center: [500, 225],
  },
  {
    id: "radiology",
    name: "Radiology",
    type: "radiology",
    floor: 1,
    points: [
      [650, 150],
      [850, 150],
      [850, 300],
      [650, 300],
    ],
    center: [750, 225],
  },
  {
    id: "elevator-1",
    name: "Elevator",
    type: "elevator",
    floor: 1,
    points: [
      [400, 350],
      [450, 350],
      [450, 400],
      [400, 400],
    ],
    center: [425, 375],
  },
  {
    id: "stairs-1",
    name: "Stairs",
    type: "stairs",
    floor: 1,
    points: [
      [650, 350],
      [700, 350],
      [700, 400],
      [650, 400],
    ],
    center: [675, 375],
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    type: "pharmacy",
    floor: 1,
    points: [
      [150, 450],
      [350, 450],
      [350, 600],
      [150, 600],
    ],
    center: [250, 525],
  },
  {
    id: "laboratory",
    name: "Laboratory",
    type: "laboratory",
    floor: 1,
    points: [
      [400, 450],
      [600, 450],
      [600, 600],
      [400, 600],
    ],
    center: [500, 525],
  },
  {
    id: "cafeteria",
    name: "Cafeteria",
    type: "cafeteria",
    floor: 1,
    points: [
      [650, 450],
      [850, 450],
      [850, 600],
      [650, 600],
    ],
    center: [750, 525],
  },
  {
    id: "administration",
    name: "Administration",
    type: "administration",
    floor: 1,
    points: [
      [150, 650],
      [350, 650],
      [350, 800],
      [150, 800],
    ],
    center: [250, 725],
  },
  {
    id: "waiting-area",
    name: "Waiting Area",
    type: "default",
    floor: 1,
    points: [
      [400, 650],
      [600, 650],
      [600, 800],
      [400, 800],
    ],
    center: [500, 725],
  },
  {
    id: "restroom-1",
    name: "Restrooms",
    type: "restroom",
    floor: 1,
    points: [
      [650, 650],
      [850, 650],
      [850, 800],
      [650, 800],
    ],
    center: [750, 725],
  },
  {
    id: "icu",
    name: "ICU",
    type: "icu",
    floor: 1,
    points: [
      [900, 150],
      [1100, 150],
      [1100, 300],
      [900, 300],
    ],
    center: [1000, 225],
  },
  {
    id: "surgery",
    name: "Surgery",
    type: "surgery",
    floor: 1,
    points: [
      [900, 450],
      [1100, 450],
      [1100, 600],
      [900, 600],
    ],
    center: [1000, 525],
  },
  // Floor 2 rooms
  {
    id: "cardiology",
    name: "Cardiology",
    type: "icu",
    floor: 2,
    points: [
      [150, 150],
      [350, 150],
      [350, 300],
      [150, 300],
    ],
    center: [250, 225],
  },
  {
    id: "neurology",
    name: "Neurology",
    type: "radiology",
    floor: 2,
    points: [
      [400, 150],
      [600, 150],
      [600, 300],
      [400, 300],
    ],
    center: [500, 225],
  },
  {
    id: "orthopedics",
    name: "Orthopedics",
    type: "surgery",
    floor: 2,
    points: [
      [650, 150],
      [850, 150],
      [850, 300],
      [650, 300],
    ],
    center: [750, 225],
  },
  {
    id: "elevator-2",
    name: "Elevator",
    type: "elevator",
    floor: 2,
    points: [
      [400, 350],
      [450, 350],
      [450, 400],
      [400, 400],
    ],
    center: [425, 375],
  },
  {
    id: "stairs-2",
    name: "Stairs",
    type: "stairs",
    floor: 2,
    points: [
      [650, 350],
      [700, 350],
      [700, 400],
      [650, 400],
    ],
    center: [675, 375],
  },
  {
    id: "pediatrics",
    name: "Pediatrics",
    type: "reception",
    floor: 2,
    points: [
      [150, 450],
      [350, 450],
      [350, 600],
      [150, 600],
    ],
    center: [250, 525],
  },
  {
    id: "maternity",
    name: "Maternity",
    type: "reception",
    floor: 2,
    points: [
      [400, 450],
      [600, 450],
      [600, 600],
      [400, 600],
    ],
    center: [500, 525],
  },
  {
    id: "oncology",
    name: "Oncology",
    type: "radiology",
    floor: 2,
    points: [
      [650, 450],
      [850, 450],
      [850, 600],
      [650, 600],
    ],
    center: [750, 525],
  },
  {
    id: "staff-lounge",
    name: "Staff Lounge",
    type: "cafeteria",
    floor: 2,
    points: [
      [150, 650],
      [350, 650],
      [350, 800],
      [150, 800],
    ],
    center: [250, 725],
  },
  {
    id: "conference-room",
    name: "Conference Room",
    type: "administration",
    floor: 2,
    points: [
      [400, 650],
      [600, 650],
      [600, 800],
      [400, 800],
    ],
    center: [500, 725],
  },
  {
    id: "restroom-2",
    name: "Restrooms",
    type: "restroom",
    floor: 2,
    points: [
      [650, 650],
      [850, 650],
      [850, 800],
      [650, 800],
    ],
    center: [750, 725],
  },
]

// Hallways
const hallways: Hallway[] = [
  // Floor 1 hallways
  {
    id: "main-hallway-1",
    floor: 1,
    points: [
      [500, 100],
      [500, 850],
    ],
  },
  {
    id: "cross-hallway-1",
    floor: 1,
    points: [
      [100, 350],
      [1150, 350],
    ],
  },
  {
    id: "cross-hallway-2",
    floor: 1,
    points: [
      [100, 650],
      [1150, 650],
    ],
  },
  {
    id: "vertical-hallway-1",
    floor: 1,
    points: [
      [250, 100],
      [250, 850],
    ],
  },
  {
    id: "vertical-hallway-2",
    floor: 1,
    points: [
      [750, 100],
      [750, 850],
    ],
  },
  {
    id: "vertical-hallway-3",
    floor: 1,
    points: [
      [1000, 100],
      [1000, 850],
    ],
  },
  // Floor 2 hallways (same layout)
  {
    id: "main-hallway-1-f2",
    floor: 2,
    points: [
      [500, 100],
      [500, 850],
    ],
  },
  {
    id: "cross-hallway-1-f2",
    floor: 2,
    points: [
      [100, 350],
      [1150, 350],
    ],
  },
  {
    id: "cross-hallway-2-f2",
    floor: 2,
    points: [
      [100, 650],
      [1150, 650],
    ],
  },
  {
    id: "vertical-hallway-1-f2",
    floor: 2,
    points: [
      [250, 100],
      [250, 850],
    ],
  },
  {
    id: "vertical-hallway-2-f2",
    floor: 2,
    points: [
      [750, 100],
      [750, 850],
    ],
  },
  {
    id: "vertical-hallway-3-f2",
    floor: 2,
    points: [
      [1000, 100],
      [1000, 850],
    ],
  },
]

// Navigation points
const navigationPoints: NavigationPoint[] = [
  // Floor 1 navigation points
  {
    id: "nav-main-entrance",
    name: "Main Entrance",
    floor: 1,
    position: [500, 75],
    connections: ["nav-hallway-1"],
    type: "entrance",
  },
  {
    id: "nav-reception",
    name: "Reception",
    floor: 1,
    position: [250, 225],
    connections: ["nav-hallway-2"],
    type: "room",
  },
  {
    id: "nav-emergency",
    name: "Emergency",
    floor: 1,
    position: [500, 225],
    connections: ["nav-hallway-3"],
    type: "room",
  },
  {
    id: "nav-radiology",
    name: "Radiology",
    floor: 1,
    position: [750, 225],
    connections: ["nav-hallway-4"],
    type: "room",
  },
  {
    id: "nav-icu",
    name: "ICU",
    floor: 1,
    position: [1000, 225],
    connections: ["nav-hallway-5"],
    type: "room",
  },
  {
    id: "nav-elevator-1",
    name: "Elevator",
    floor: 1,
    position: [425, 375],
    connections: ["nav-hallway-6", "nav-elevator-2"],
    type: "elevator",
  },
  {
    id: "nav-stairs-1",
    name: "Stairs",
    floor: 1,
    position: [675, 375],
    connections: ["nav-hallway-7", "nav-stairs-2"],
    type: "stairs",
  },
  {
    id: "nav-pharmacy",
    name: "Pharmacy",
    floor: 1,
    position: [250, 525],
    connections: ["nav-hallway-8"],
    type: "room",
  },
  {
    id: "nav-laboratory",
    name: "Laboratory",
    floor: 1,
    position: [500, 525],
    connections: ["nav-hallway-9"],
    type: "room",
  },
  {
    id: "nav-cafeteria",
    name: "Cafeteria",
    floor: 1,
    position: [750, 525],
    connections: ["nav-hallway-10"],
    type: "room",
  },
  {
    id: "nav-surgery",
    name: "Surgery",
    floor: 1,
    position: [1000, 525],
    connections: ["nav-hallway-11"],
    type: "room",
  },
  {
    id: "nav-administration",
    name: "Administration",
    floor: 1,
    position: [250, 725],
    connections: ["nav-hallway-12"],
    type: "room",
  },
  {
    id: "nav-waiting-area",
    name: "Waiting Area",
    floor: 1,
    position: [500, 725],
    connections: ["nav-hallway-13"],
    type: "room",
  },
  {
    id: "nav-restroom-1",
    name: "Restrooms",
    floor: 1,
    position: [750, 725],
    connections: ["nav-hallway-14"],
    type: "room",
  },

  // Hallway navigation points - Floor 1
  {
    id: "nav-hallway-1",
    name: "Hallway",
    floor: 1,
    position: [500, 125],
    connections: ["nav-main-entrance", "nav-hallway-3", "nav-hallway-v1-1", "nav-hallway-v2-1", "nav-hallway-v3-1"],
    type: "hallway",
  },
  {
    id: "nav-hallway-2",
    name: "Hallway",
    floor: 1,
    position: [250, 350],
    connections: ["nav-reception", "nav-hallway-8", "nav-hallway-h1-1", "nav-hallway-h1-2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-3",
    name: "Hallway",
    floor: 1,
    position: [500, 350],
    connections: [
      "nav-hallway-1",
      "nav-emergency",
      "nav-hallway-9",
      "nav-hallway-6",
      "nav-hallway-h1-1",
      "nav-hallway-h1-3",
    ],
    type: "hallway",
  },
  {
    id: "nav-hallway-4",
    name: "Hallway",
    floor: 1,
    position: [750, 350],
    connections: ["nav-radiology", "nav-hallway-10", "nav-hallway-7", "nav-hallway-h1-3", "nav-hallway-h1-4"],
    type: "hallway",
  },
  {
    id: "nav-hallway-5",
    name: "Hallway",
    floor: 1,
    position: [1000, 350],
    connections: ["nav-icu", "nav-hallway-11", "nav-hallway-h1-4"],
    type: "hallway",
  },
  {
    id: "nav-hallway-6",
    name: "Hallway",
    floor: 1,
    position: [425, 375],
    connections: ["nav-elevator-1", "nav-hallway-3"],
    type: "hallway",
  },
  {
    id: "nav-hallway-7",
    name: "Hallway",
    floor: 1,
    position: [675, 375],
    connections: ["nav-stairs-1", "nav-hallway-4"],
    type: "hallway",
  },
  {
    id: "nav-hallway-8",
    name: "Hallway",
    floor: 1,
    position: [250, 450],
    connections: ["nav-hallway-2", "nav-pharmacy", "nav-hallway-12", "nav-hallway-v1-2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-9",
    name: "Hallway",
    floor: 1,
    position: [500, 450],
    connections: ["nav-hallway-3", "nav-laboratory", "nav-hallway-13", "nav-hallway-v4-1"],
    type: "hallway",
  },
  {
    id: "nav-hallway-10",
    name: "Hallway",
    floor: 1,
    position: [750, 450],
    connections: ["nav-hallway-4", "nav-cafeteria", "nav-hallway-14", "nav-hallway-v2-2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-11",
    name: "Hallway",
    floor: 1,
    position: [1000, 450],
    connections: ["nav-hallway-5", "nav-surgery", "nav-hallway-v3-2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-12",
    name: "Hallway",
    floor: 1,
    position: [250, 650],
    connections: ["nav-hallway-8", "nav-administration", "nav-hallway-h2-1", "nav-hallway-h2-2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-13",
    name: "Hallway",
    floor: 1,
    position: [500, 650],
    connections: ["nav-hallway-9", "nav-waiting-area", "nav-hallway-h2-2", "nav-hallway-h2-3"],
    type: "hallway",
  },
  {
    id: "nav-hallway-14",
    name: "Hallway",
    floor: 1,
    position: [750, 650],
    connections: ["nav-hallway-10", "nav-restroom-1", "nav-hallway-h2-3", "nav-hallway-h2-4"],
    type: "hallway",
  },

  // Additional hallway navigation points for better connectivity - Floor 1
  {
    id: "nav-hallway-h1-1",
    name: "Hallway",
    floor: 1,
    position: [350, 350],
    connections: ["nav-hallway-2", "nav-hallway-3"],
    type: "hallway",
  },
  {
    id: "nav-hallway-h1-2",
    name: "Hallway",
    floor: 1,
    position: [150, 350],
    connections: ["nav-hallway-2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-h1-3",
    name: "Hallway",
    floor: 1,
    position: [650, 350],
    connections: ["nav-hallway-3", "nav-hallway-4"],
    type: "hallway",
  },
  {
    id: "nav-hallway-h1-4",
    name: "Hallway",
    floor: 1,
    position: [900, 350],
    connections: ["nav-hallway-4", "nav-hallway-5"],
    type: "hallway",
  },
  {
    id: "nav-hallway-h2-1",
    name: "Hallway",
    floor: 1,
    position: [150, 650],
    connections: ["nav-hallway-12"],
    type: "hallway",
  },
  {
    id: "nav-hallway-h2-2",
    name: "Hallway",
    floor: 1,
    position: [350, 650],
    connections: ["nav-hallway-12", "nav-hallway-13"],
    type: "hallway",
  },
  {
    id: "nav-hallway-h2-3",
    name: "Hallway",
    floor: 1,
    position: [650, 650],
    connections: ["nav-hallway-13", "nav-hallway-14"],
    type: "hallway",
  },
  {
    id: "nav-hallway-h2-4",
    name: "Hallway",
    floor: 1,
    position: [900, 650],
    connections: ["nav-hallway-14"],
    type: "hallway",
  },
  {
    id: "nav-hallway-v1-1",
    name: "Hallway",
    floor: 1,
    position: [250, 200],
    connections: ["nav-hallway-1", "nav-hallway-v1-2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-v1-2",
    name: "Hallway",
    floor: 1,
    position: [250, 500],
    connections: ["nav-hallway-8", "nav-hallway-v1-1", "nav-hallway-v1-3"],
    type: "hallway",
  },
  {
    id: "nav-hallway-v1-3",
    name: "Hallway",
    floor: 1,
    position: [250, 800],
    connections: ["nav-hallway-v1-2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-v2-1",
    name: "Hallway",
    floor: 1,
    position: [750, 200],
    connections: ["nav-hallway-1", "nav-hallway-v2-2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-v2-2",
    name: "Hallway",
    floor: 1,
    position: [750, 500],
    connections: ["nav-hallway-10", "nav-hallway-v2-1", "nav-hallway-v2-3"],
    type: "hallway",
  },
  {
    id: "nav-hallway-v2-3",
    name: "Hallway",
    floor: 1,
    position: [750, 800],
    connections: ["nav-hallway-v2-2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-v3-1",
    name: "Hallway",
    floor: 1,
    position: [1000, 200],
    connections: ["nav-hallway-1", "nav-hallway-v3-2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-v3-2",
    name: "Hallway",
    floor: 1,
    position: [1000, 500],
    connections: ["nav-hallway-11", "nav-hallway-v3-1", "nav-hallway-v3-3"],
    type: "hallway",
  },
  {
    id: "nav-hallway-v3-3",
    name: "Hallway",
    floor: 1,
    position: [1000, 800],
    connections: ["nav-hallway-v3-2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-v4-1",
    name: "Hallway",
    floor: 1,
    position: [500, 500],
    connections: ["nav-hallway-9", "nav-hallway-v4-2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-v4-2",
    name: "Hallway",
    floor: 1,
    position: [500, 800],
    connections: ["nav-hallway-v4-1"],
    type: "hallway",
  },

  // Floor 2 navigation points
  {
    id: "nav-cardiology",
    name: "Cardiology",
    floor: 2,
    position: [250, 225],
    connections: ["nav-hallway-2-f2"],
    type: "room",
  },
  {
    id: "nav-neurology",
    name: "Neurology",
    floor: 2,
    position: [500, 225],
    connections: ["nav-hallway-3-f2"],
    type: "room",
  },
  {
    id: "nav-orthopedics",
    name: "Orthopedics",
    floor: 2,
    position: [750, 225],
    connections: ["nav-hallway-4-f2"],
    type: "room",
  },
  {
    id: "nav-elevator-2",
    name: "Elevator",
    floor: 2,
    position: [425, 375],
    connections: ["nav-hallway-6-f2", "nav-elevator-1"],
    type: "elevator",
  },
  {
    id: "nav-stairs-2",
    name: "Stairs",
    floor: 2,
    position: [675, 375],
    connections: ["nav-hallway-7-f2", "nav-stairs-1"],
    type: "stairs",
  },
  {
    id: "nav-pediatrics",
    name: "Pediatrics",
    floor: 2,
    position: [250, 525],
    connections: ["nav-hallway-8-f2"],
    type: "room",
  },
  {
    id: "nav-maternity",
    name: "Maternity",
    floor: 2,
    position: [500, 525],
    connections: ["nav-hallway-9-f2"],
    type: "room",
  },
  {
    id: "nav-oncology",
    name: "Oncology",
    type: "radiology",
    floor: 2,
    position: [750, 525],
    connections: ["nav-hallway-10-f2"],
    type: "room",
  },
  {
    id: "nav-staff-lounge",
    name: "Staff Lounge",
    floor: 2,
    position: [250, 725],
    connections: ["nav-hallway-12-f2"],
    type: "room",
  },
  {
    id: "nav-conference-room",
    name: "Conference Room",
    floor: 2,
    position: [500, 725],
    connections: ["nav-hallway-13-f2"],
    type: "room",
  },
  {
    id: "nav-restroom-2",
    name: "Restrooms",
    floor: 2,
    position: [750, 725],
    connections: ["nav-hallway-14-f2"],
    type: "room",
  },

  // Hallway navigation points - Floor 2 (similar to floor 1 with better connectivity)
  {
    id: "nav-hallway-1-f2",
    name: "Hallway",
    floor: 2,
    position: [500, 125],
    connections: ["nav-hallway-3-f2", "nav-hallway-v1-1-f2", "nav-hallway-v2-1-f2", "nav-hallway-v3-1-f2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-2-f2",
    name: "Hallway",
    floor: 2,
    position: [250, 350],
    connections: ["nav-cardiology", "nav-hallway-8-f2", "nav-hallway-h1-1-f2", "nav-hallway-h1-2-f2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-3-f2",
    name: "Hallway",
    floor: 2,
    position: [500, 350],
    connections: [
      "nav-hallway-1-f2",
      "nav-neurology",
      "nav-hallway-9-f2",
      "nav-hallway-6-f2",
      "nav-hallway-h1-1-f2",
      "nav-hallway-h1-3-f2",
    ],
    type: "hallway",
  },
  {
    id: "nav-hallway-4-f2",
    name: "Hallway",
    floor: 2,
    position: [750, 350],
    connections: [
      "nav-orthopedics",
      "nav-hallway-10-f2",
      "nav-hallway-7-f2",
      "nav-hallway-h1-3-f2",
      "nav-hallway-h1-4-f2",
    ],
    type: "hallway",
  },
  {
    id: "nav-hallway-6-f2",
    name: "Hallway",
    floor: 2,
    position: [425, 375],
    connections: ["nav-elevator-2", "nav-hallway-3-f2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-7-f2",
    name: "Hallway",
    floor: 2,
    position: [675, 375],
    connections: ["nav-stairs-2", "nav-hallway-4-f2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-8-f2",
    name: "Hallway",
    floor: 2,
    position: [250, 450],
    connections: ["nav-hallway-2-f2", "nav-pediatrics", "nav-hallway-12-f2", "nav-hallway-v1-2-f2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-9-f2",
    name: "Hallway",
    floor: 2,
    position: [500, 450],
    connections: ["nav-hallway-3-f2", "nav-maternity", "nav-hallway-13-f2", "nav-hallway-v4-1-f2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-10-f2",
    name: "Hallway",
    floor: 2,
    position: [750, 450],
    connections: ["nav-hallway-4-f2", "nav-oncology", "nav-hallway-14-f2", "nav-hallway-v2-2-f2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-12-f2",
    name: "Hallway",
    floor: 2,
    position: [250, 650],
    connections: ["nav-hallway-8-f2", "nav-staff-lounge", "nav-hallway-h2-1-f2", "nav-hallway-h2-2-f2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-13-f2",
    name: "Hallway",
    floor: 2,
    position: [500, 650],
    connections: ["nav-hallway-9-f2", "nav-conference-room", "nav-hallway-h2-2-f2", "nav-hallway-h2-3-f2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-14-f2",
    name: "Hallway",
    floor: 2,
    position: [750, 650],
    connections: ["nav-hallway-10-f2", "nav-restroom-2", "nav-hallway-h2-3-f2", "nav-hallway-h2-4-f2"],
    type: "hallway",
  },

  // Additional hallway navigation points for better connectivity - Floor 2
  {
    id: "nav-hallway-h1-1-f2",
    name: "Hallway",
    floor: 2,
    position: [350, 350],
    connections: ["nav-hallway-2-f2", "nav-hallway-3-f2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-h1-2-f2",
    name: "Hallway",
    floor: 2,
    position: [150, 350],
    connections: ["nav-hallway-2-f2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-h1-3-f2",
    name: "Hallway",
    floor: 2,
    position: [650, 350],
    connections: ["nav-hallway-3-f2", "nav-hallway-4-f2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-h1-4-f2",
    name: "Hallway",
    floor: 2,
    position: [900, 350],
    connections: ["nav-hallway-4-f2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-h2-1-f2",
    name: "Hallway",
    floor: 2,
    position: [150, 650],
    connections: ["nav-hallway-12-f2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-h2-2-f2",
    name: "Hallway",
    floor: 2,
    position: [350, 650],
    connections: ["nav-hallway-12-f2", "nav-hallway-13-f2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-h2-3-f2",
    name: "Hallway",
    floor: 2,
    position: [650, 650],
    connections: ["nav-hallway-13-f2", "nav-hallway-14-f2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-h2-4-f2",
    name: "Hallway",
    floor: 2,
    position: [900, 650],
    connections: ["nav-hallway-14-f2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-v1-1-f2",
    name: "Hallway",
    floor: 2,
    position: [250, 200],
    connections: ["nav-hallway-1-f2", "nav-hallway-v1-2-f2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-v1-2-f2",
    name: "Hallway",
    floor: 2,
    position: [250, 500],
    connections: ["nav-hallway-8-f2", "nav-hallway-v1-1-f2", "nav-hallway-v1-3-f2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-v1-3-f2",
    name: "Hallway",
    floor: 2,
    position: [250, 800],
    connections: ["nav-hallway-v1-2-f2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-v2-1-f2",
    name: "Hallway",
    floor: 2,
    position: [750, 200],
    connections: ["nav-hallway-1-f2", "nav-hallway-v2-2-f2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-v2-2-f2",
    name: "Hallway",
    floor: 2,
    position: [750, 500],
    connections: ["nav-hallway-10-f2", "nav-hallway-v2-1-f2", "nav-hallway-v2-3-f2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-v2-3-f2",
    name: "Hallway",
    floor: 2,
    position: [750, 800],
    connections: ["nav-hallway-v2-2-f2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-v3-1-f2",
    name: "Hallway",
    floor: 2,
    position: [1000, 200],
    connections: ["nav-hallway-1-f2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-v4-1-f2",
    name: "Hallway",
    floor: 2,
    position: [500, 500],
    connections: ["nav-hallway-9-f2", "nav-hallway-v4-2-f2"],
    type: "hallway",
  },
  {
    id: "nav-hallway-v4-2-f2",
    name: "Hallway",
    floor: 2,
    position: [500, 800],
    connections: ["nav-hallway-v4-1-f2"],
    type: "hallway",
  },
]

// Filter navigation points to only include rooms and entrances (not hallways)
const locationPoints = navigationPoints.filter((point) => point.type !== "hallway")

// Canvas dimensions
const CANVAS_WIDTH = 1200
const CANVAS_HEIGHT = 850

export default function HospitalMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentFloor, setCurrentFloor] = useState(1)
  const [currentLocation, setCurrentLocation] = useState<NavigationPoint | null>(
    navigationPoints.find((point) => point.id === "nav-main-entrance") || null,
  )
  const [destination, setDestination] = useState<NavigationPoint | null>(null)
  const [path, setPath] = useState<NavigationPoint[]>([])
  const [directions, setDirections] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<NavigationPoint[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [mapMode, setMapMode] = useState<"standard" | "satellite">("standard")
  const [isNavigating, setIsNavigating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null)
  const [animationFrame, setAnimationFrame] = useState(0)
  const animationRef = useRef<number | null>(null)
  const [canvasClicked, setCanvasClicked] = useState(false)
  const [clickMode, setClickMode] = useState<"start" | "destination" | null>(null)
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d")

  // Initialize the canvas and draw the hospital map
  useEffect(() => {
    if (viewMode === "3d") return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw floor background
    ctx.fillStyle = MAP_STYLES.background
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw hallways first (they should be behind rooms)
    drawHallways(ctx)

    // Draw rooms
    drawRooms(ctx)

    // Draw navigation points if in debug mode
    // drawNavigationPoints(ctx)

    // Draw path
    if (path.length > 0) {
      drawPath(ctx, path, isNavigating, currentStep)
    }

    // Draw current location
    if (isNavigating && currentPosition && currentFloor === path[currentStep]?.floor) {
      drawLocationMarker(ctx, currentPosition, MAP_STYLES.currentLocation, true)
    } else if (currentLocation && currentFloor === currentLocation.floor) {
      drawLocationMarker(ctx, currentLocation.position, MAP_STYLES.currentLocation, false)
    }

    // Draw destination
    if (destination && currentFloor === destination.floor) {
      drawLocationMarker(ctx, destination.position, MAP_STYLES.destination, false)
    }

    // Draw compass
    drawCompass(ctx)

    // Draw scale
    drawScale(ctx)

    // Draw floor indicator
    drawFloorIndicator(ctx)
  }, [
    currentFloor,
    currentLocation,
    destination,
    path,
    mapMode,
    isNavigating,
    currentStep,
    currentPosition,
    animationFrame,
    viewMode,
  ])

  // Animation effect for navigation
  useEffect(() => {
    if (!isNavigating || path.length === 0 || viewMode === "3d") return

    // Set initial position to current location
    if (!currentPosition) {
      setCurrentPosition(path[0].position)
    }

    // Start animation
    const animate = () => {
      setAnimationFrame((prev) => prev + 1)

      // If we've reached the end of the path
      if (currentStep >= path.length - 1) {
        setIsNavigating(false)
        setCurrentStep(0)
        setCurrentPosition(null)
        return
      }

      // Get current and next points
      const current = path[currentStep]
      const next = path[currentStep + 1]

      // If current and next are on different floors, switch floors
      if (current.floor !== next.floor) {
        setCurrentFloor(next.floor)
        setCurrentStep(currentStep + 1)
        setCurrentPosition(next.position)
        return
      }

      // Calculate distance between points
      const dx = next.position[0] - (currentPosition ? currentPosition[0] : current.position[0])
      const dy = next.position[1] - (currentPosition ? currentPosition[1] : current.position[1])
      const distance = Math.sqrt(dx * dx + dy * dy)

      // If we're close enough to the next point, move to it
      if (distance < 5) {
        setCurrentStep(currentStep + 1)
        setCurrentPosition(next.position)
        return
      }

      // Otherwise, move towards the next point
      const speed = 2 // Adjust for faster/slower movement
      const ratio = speed / distance
      const newX = (currentPosition ? currentPosition[0] : current.position[0]) + dx * ratio
      const newY = (currentPosition ? currentPosition[1] : current.position[1]) + dy * ratio
      setCurrentPosition([newX, newY])

      // Continue animation
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isNavigating, path, currentStep, currentPosition, viewMode])

  // Handle canvas click for selecting start/destination points
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!clickMode || viewMode === "3d") return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Find the closest navigation point
    const floorPoints = navigationPoints.filter((point) => point.floor === currentFloor)

    let closestPoint: NavigationPoint | null = null
    let minDistance = Number.MAX_VALUE

    floorPoints.forEach((point) => {
      const dx = point.position[0] - x
      const dy = point.position[1] - y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < minDistance) {
        minDistance = distance
        closestPoint = point
      }
    })

    // If we found a close point and it's within a reasonable distance
    if (closestPoint && minDistance < 50) {
      if (clickMode === "start") {
        setCurrentLocation(closestPoint)
        if (destination) {
          findPath(closestPoint, destination)
        }
      } else if (clickMode === "destination") {
        setDestination(closestPoint)
        if (currentLocation) {
          findPath(currentLocation, closestPoint)
        }
      }

      setClickMode(null)
      setCanvasClicked(true)
    }
  }

  // Draw rooms
  const drawRooms = (ctx: CanvasRenderingContext2D) => {
    const floorRooms = rooms.filter((room) => room.floor === currentFloor)

    floorRooms.forEach((room) => {
      // Get room style
      const style = MAP_STYLES.rooms[room.type as keyof typeof MAP_STYLES.rooms] || MAP_STYLES.rooms.default

      // Draw room polygon
      ctx.fillStyle = style.fill
      ctx.strokeStyle = style.stroke
      ctx.lineWidth = 2

      ctx.beginPath()
      ctx.moveTo(room.points[0][0], room.points[0][1])
      for (let i = 1; i < room.points.length; i++) {
        ctx.lineTo(room.points[i][0], room.points[i][1])
      }
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // Draw room label
      ctx.fillStyle = MAP_STYLES.text.room
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(room.name, room.center[0], room.center[1])

      // Draw room icon if needed
      if (room.type === "restroom") {
        // Simple restroom icon
        ctx.fillStyle = MAP_STYLES.text.room
        ctx.beginPath()
        ctx.arc(room.center[0], room.center[1] - 15, 5, 0, Math.PI * 2)
        ctx.fill()
      } else if (room.type === "elevator") {
        // Simple elevator icon
        ctx.fillStyle = MAP_STYLES.text.room
        ctx.fillRect(room.center[0] - 5, room.center[1] - 20, 10, 10)
      } else if (room.type === "stairs") {
        // Simple stairs icon
        ctx.fillStyle = MAP_STYLES.text.room
        ctx.beginPath()
        ctx.moveTo(room.center[0] - 5, room.center[1] - 15)
        ctx.lineTo(room.center[0] + 5, room.center[1] - 25)
        ctx.lineTo(room.center[0] + 5, room.center[1] - 15)
        ctx.fill()
      }
    })
  }

  // Draw hallways
  const drawHallways = (ctx: CanvasRenderingContext2D) => {
    const floorHallways = hallways.filter((hallway) => hallway.floor === currentFloor)

    floorHallways.forEach((hallway) => {
      ctx.strokeStyle = MAP_STYLES.hallway.stroke
      ctx.lineWidth = 20 // Wide hallways
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      ctx.beginPath()
      ctx.moveTo(hallway.points[0][0], hallway.points[0][1])
      for (let i = 1; i < hallway.points.length; i++) {
        ctx.lineTo(hallway.points[i][0], hallway.points[i][1])
      }
      ctx.stroke()

      // Draw hallway fill
      ctx.strokeStyle = MAP_STYLES.hallway.fill
      ctx.lineWidth = 18 // Slightly smaller to create a border effect
      ctx.beginPath()
      ctx.moveTo(hallway.points[0][0], hallway.points[0][1])
      for (let i = 1; i < hallway.points.length; i++) {
        ctx.lineTo(hallway.points[i][0], hallway.points[i][1])
      }
      ctx.stroke()
    })
  }

  // Draw navigation points (for debugging)
  const drawNavigationPoints = (ctx: CanvasRenderingContext2D) => {
    const floorPoints = navigationPoints.filter((point) => point.floor === currentFloor)

    floorPoints.forEach((point) => {
      ctx.fillStyle = point.type === "hallway" ? "#aaaaaa" : "#ff0000"
      ctx.beginPath()
      ctx.arc(point.position[0], point.position[1], 4, 0, Math.PI * 2)
      ctx.fill()

      // Draw point ID for debugging
      ctx.fillStyle = "#000000"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.fillText(point.id, point.position[0], point.position[1] - 10)
    })
  }

  // Draw location marker (current location or destination)
  const drawLocationMarker = (
    ctx: CanvasRenderingContext2D,
    position: [number, number],
    style: { fill: string; stroke: string; radius: number; pulse?: string },
    animate: boolean,
  ) => {
    // Draw pulsing circle if animating
    if (animate && style.pulse) {
      const pulseSize = 15 + Math.sin(Date.now() / 200) * 5
      ctx.fillStyle = style.pulse
      ctx.beginPath()
      ctx.arc(position[0], position[1], pulseSize, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw outer circle
    ctx.fillStyle = style.fill
    ctx.beginPath()
    ctx.arc(position[0], position[1], style.radius, 0, Math.PI * 2)
    ctx.fill()

    // Draw inner circle (white border)
    ctx.fillStyle = style.stroke
    ctx.beginPath()
    ctx.arc(position[0], position[1], style.radius - 2, 0, Math.PI * 2)
    ctx.fill()

    // Draw center dot
    ctx.fillStyle = style.fill
    ctx.beginPath()
    ctx.arc(position[0], position[1], style.radius - 4, 0, Math.PI * 2)
    ctx.fill()
  }

  // Draw path between points
  const drawPath = (
    ctx: CanvasRenderingContext2D,
    pathPoints: NavigationPoint[],
    isActive: boolean,
    currentStep: number,
  ) => {
    // Filter points for current floor
    const floorPoints = pathPoints.filter((point) => point.floor === currentFloor)

    if (floorPoints.length < 2) return

    // Draw path line
    if (isActive) {
      // Draw completed path segments
      if (currentStep > 0) {
        const completedPoints = floorPoints.filter((_, index) => index <= currentStep && index < floorPoints.length)
        if (completedPoints.length >= 2) {
          ctx.strokeStyle = MAP_STYLES.path.activeStroke
          ctx.lineWidth = MAP_STYLES.path.activeWidth
          ctx.lineCap = "round"
          ctx.lineJoin = "round"

          ctx.beginPath()
          ctx.moveTo(completedPoints[0].position[0], completedPoints[0].position[1])

          for (let i = 1; i < completedPoints.length; i++) {
            ctx.lineTo(completedPoints[i].position[0], completedPoints[i].position[1])
          }

          ctx.stroke()
        }
      }

      // Draw remaining path segments
      const remainingPoints = floorPoints.filter((_, index) => index >= currentStep && index < floorPoints.length)
      if (remainingPoints.length >= 2) {
        ctx.strokeStyle = MAP_STYLES.path.stroke
        ctx.lineWidth = MAP_STYLES.path.strokeWidth
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.setLineDash([5, 5]) // Dashed line for remaining path

        ctx.beginPath()
        ctx.moveTo(remainingPoints[0].position[0], remainingPoints[0].position[1])

        for (let i = 1; i < remainingPoints.length; i++) {
          ctx.lineTo(remainingPoints[i].position[0], remainingPoints[i].position[1])
        }

        ctx.stroke()
        ctx.setLineDash([]) // Reset to solid line
      }
    } else {
      // Draw regular path
      ctx.strokeStyle = MAP_STYLES.path.stroke
      ctx.lineWidth = MAP_STYLES.path.strokeWidth
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      ctx.beginPath()
      ctx.moveTo(floorPoints[0].position[0], floorPoints[0].position[1])

      for (let i = 1; i < floorPoints.length; i++) {
        ctx.lineTo(floorPoints[i].position[0], floorPoints[i].position[1])
      }

      ctx.stroke()

      // Draw direction arrows along the path
      for (let i = 0; i < floorPoints.length - 1; i++) {
        const start = floorPoints[i].position
        const end = floorPoints[i + 1].position

        // Calculate midpoint
        const midX = (start[0] + end[0]) / 2
        const midY = (start[1] + end[1]) / 2

        // Calculate angle
        const angle = Math.atan2(end[1] - start[1], end[0] - start[0])

        // Draw arrow
        drawArrow(ctx, midX, midY, angle)
      }
    }

    // Draw turn indicators at each junction
    for (let i = 1; i < floorPoints.length - 1; i++) {
      const prev = floorPoints[i - 1].position
      const current = floorPoints[i].position
      const next = floorPoints[i + 1].position

      // Calculate angles
      const angle1 = Math.atan2(current[1] - prev[1], current[0] - prev[0])
      const angle2 = Math.atan2(next[1] - current[1], next[0] - current[0])

      // Calculate turn angle
      let turnAngle = (angle2 - angle1) * (180 / Math.PI)
      if (turnAngle > 180) turnAngle -= 360
      if (turnAngle < -180) turnAngle += 360

      // If there's a significant turn, draw a turn indicator
      if (Math.abs(turnAngle) > 30) {
        ctx.fillStyle = isActive && i <= currentStep ? MAP_STYLES.path.activeStroke : MAP_STYLES.path.stroke
        ctx.beginPath()
        ctx.arc(current[0], current[1], 6, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  // Draw direction arrow
  const drawArrow = (ctx: CanvasRenderingContext2D, x: number, y: number, angle: number) => {
    const arrowSize = 10

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(angle)

    // Draw arrow
    ctx.fillStyle = MAP_STYLES.path.arrow
    ctx.beginPath()
    ctx.moveTo(arrowSize, 0)
    ctx.lineTo(0, arrowSize / 2)
    ctx.lineTo(0, -arrowSize / 2)
    ctx.closePath()
    ctx.fill()

    ctx.restore()
  }

  // Draw compass
  const drawCompass = (ctx: CanvasRenderingContext2D) => {
    const x = CANVAS_WIDTH - 60
    const y = 60
    const radius = 20

    // Draw compass circle
    ctx.fillStyle = "#ffffff"
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = "#cccccc"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.stroke()

    // Draw N indicator
    ctx.fillStyle = "#ff0000"
    ctx.beginPath()
    ctx.moveTo(x, y - radius + 5)
    ctx.lineTo(x - 5, y)
    ctx.lineTo(x + 5, y)
    ctx.closePath()
    ctx.fill()

    // Draw N label
    ctx.fillStyle = "#000000"
    ctx.font = "10px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("N", x, y - radius + 10)
  }

  // Draw scale
  const drawScale = (ctx: CanvasRenderingContext2D) => {
    const x = 50
    const y = CANVAS_HEIGHT - 30
    const width = 100

    // Draw scale line
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + width, y)
    ctx.stroke()

    // Draw ticks
    ctx.beginPath()
    ctx.moveTo(x, y - 5)
    ctx.lineTo(x, y + 5)
    ctx.moveTo(x + width, y - 5)
    ctx.lineTo(x + width, y + 5)
    ctx.stroke()

    // Draw label
    ctx.fillStyle = "#000000"
    ctx.font = "10px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    ctx.fillText("20 meters", x + width / 2, y + 5)
  }

  // Draw floor indicator
  const drawFloorIndicator = (ctx: CanvasRenderingContext2D) => {
    const x = 60
    const y = 60
    const width = 40
    const height = 40

    // Draw background
    ctx.fillStyle = "#ffffff"
    ctx.strokeStyle = "#cccccc"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.rect(x - width / 2, y - height / 2, width, height)
    ctx.fill()
    ctx.stroke()

    // Draw floor number
    ctx.fillStyle = "#000000"
    ctx.font = "16px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(`F${currentFloor}`, x, y)
  }

  // Find path between two navigation points
  const findPath = (start: NavigationPoint, end: NavigationPoint) => {
    // Implementation of A* algorithm for navigation points
    const openSet: NavigationPoint[] = [start]
    const closedSet: NavigationPoint[] = []
    const cameFrom: Map<string, NavigationPoint> = new Map()

    // g score is the cost from start to current node
    const gScore: Map<string, number> = new Map()
    gScore.set(start.id, 0)

    // f score is the estimated cost from start to end through current node
    const fScore: Map<string, number> = new Map()
    fScore.set(start.id, heuristic(start, end))

    while (openSet.length > 0) {
      // Find node with lowest f score
      let current = openSet[0]
      let lowestFScore = fScore.get(current.id) || Number.POSITIVE_INFINITY
      let lowestIndex = 0

      for (let i = 1; i < openSet.length; i++) {
        const score = fScore.get(openSet[i].id) || Number.POSITIVE_INFINITY
        if (score < lowestFScore) {
          lowestFScore = score
          current = openSet[i]
          lowestIndex = i
        }
      }

      // If we reached the end
      if (current.id === end.id) {
        // Reconstruct path
        const path: NavigationPoint[] = [current]
        while (cameFrom.has(current.id)) {
          current = cameFrom.get(current.id)!
          path.unshift(current)
        }

        // Generate directions
        const directions = generateDirections(path)

        setPath(path)
        setDirections(directions)
        return
      }

      // Remove current from openSet and add to closedSet
      openSet.splice(lowestIndex, 1)
      closedSet.push(current)

      // Check neighbors
      for (const neighborId of current.connections) {
        const neighbor = navigationPoints.find((p) => p.id === neighborId)
        if (!neighbor || closedSet.some((p) => p.id === neighbor.id)) continue

        // Calculate tentative g score
        const tentativeGScore = (gScore.get(current.id) || Number.POSITIVE_INFINITY) + distance(current, neighbor)

        // If neighbor is not in openSet, add it
        if (!openSet.some((p) => p.id === neighbor.id)) {
          openSet.push(neighbor)
        } else if (tentativeGScore >= (gScore.get(neighbor.id) || Number.POSITIVE_INFINITY)) {
          // This is not a better path
          continue
        }

        // This path is the best so far
        cameFrom.set(neighbor.id, current)
        gScore.set(neighbor.id, tentativeGScore)
        fScore.set(neighbor.id, tentativeGScore + heuristic(neighbor, end))
      }
    }

    // No path found
    setPath([])
    setDirections(["No path found to this destination."])
  }

  // Heuristic function for A* (Euclidean distance)
  const heuristic = (a: NavigationPoint, b: NavigationPoint) => {
    // If points are on different floors, add a penalty
    const floorPenalty = a.floor !== b.floor ? 1000 : 0

    // Calculate Euclidean distance
    const dx = a.position[0] - b.position[0]
    const dy = a.position[1] - b.position[1]

    return Math.sqrt(dx * dx + dy * dy) + floorPenalty
  }

  // Calculate distance between two navigation points
  const distance = (a: NavigationPoint, b: NavigationPoint) => {
    // If points are on different floors, add a penalty
    const floorPenalty = a.floor !== b.floor ? 1000 : 0

    // Calculate Euclidean distance
    const dx = a.position[0] - b.position[0]
    const dy = a.position[1] - b.position[1]

    return Math.sqrt(dx * dx + dy * dy) + floorPenalty
  }

  // Generate human-readable directions
  const generateDirections = (path: NavigationPoint[]) => {
    if (path.length <= 1) return ["Stay where you are."]

    const directions: string[] = []
    directions.push(`Starting from ${path[0].name}.`)

    let currentFloorNum = path[0].floor

    for (let i = 1; i < path.length; i++) {
      const prev = path[i - 1]
      const current = path[i]

      // Check for floor changes
      if (current.floor !== currentFloorNum) {
        if (current.type === "elevator") {
          directions.push(`Take the elevator to floor ${current.floor}.`)
        } else if (current.type === "stairs") {
          directions.push(`Take the stairs to floor ${current.floor}.`)
        } else {
          directions.push(`Go to floor ${current.floor}.`)
        }
        currentFloorNum = current.floor
      }

      // Calculate direction
      if (i < path.length - 1) {
        const next = path[i + 1]

        // Skip if it's a hallway point with no turn
        if (current.type === "hallway" && next.type === "hallway" && i > 1) {
          const prev2 = path[i - 1]

          // Calculate angles
          const angle1 = Math.atan2(current.position[1] - prev2.position[1], current.position[0] - prev2.position[0])
          const angle2 = Math.atan2(next.position[1] - current.position[1], next.position[0] - current.position[0])

          // Calculate turn angle
          let turnAngle = (angle2 - angle1) * (180 / Math.PI)
          if (turnAngle > 180) turnAngle -= 360
          if (turnAngle < -180) turnAngle += 360

          // If there's no significant turn, skip this point
          if (Math.abs(turnAngle) < 30) {
            continue
          }
        }

        // Calculate angles
        const angle1 = Math.atan2(current.position[1] - prev.position[1], current.position[0] - prev.position[0])
        const angle2 = Math.atan2(next.position[1] - current.position[1], next.position[0] - current.position[0])

        // Calculate turn angle
        let turnAngle = (angle2 - angle1) * (180 / Math.PI)
        if (turnAngle > 180) turnAngle -= 360
        if (turnAngle < -180) turnAngle += 360

        // Calculate distance
        const dx = next.position[0] - current.position[0]
        const dy = next.position[1] - current.position[1]
        const distance = Math.sqrt(dx * dx + dy * dy)
        const distanceText = `${Math.round(distance / 10)} meters`

        // Generate direction text
        if (current.type === "room" || current.type === "entrance" || current.type === "exit") {
          directions.push(`Exit ${current.name}.`)
        } else if (Math.abs(turnAngle) < 10) {
          directions.push(`Continue straight for ${distanceText}.`)
        } else if (turnAngle > 0) {
          if (turnAngle > 135) {
            directions.push(`Make a sharp left turn and walk ${distanceText}.`)
          } else if (turnAngle > 45) {
            directions.push(`Turn left and walk ${distanceText}.`)
          } else {
            directions.push(`Make a slight left turn and walk ${distanceText}.`)
          }
        } else {
          if (turnAngle < -135) {
            directions.push(`Make a sharp right turn and walk ${distanceText}.`)
          } else if (turnAngle < -45) {
            directions.push(`Turn right and walk ${distanceText}.`)
          } else {
            directions.push(`Make a slight right turn and walk ${distanceText}.`)
          }
        }
      }

      // Destination reached
      if (i === path.length - 1) {
        if (current.type === "room" || current.type === "entrance" || current.type === "exit") {
          directions.push(`You have arrived at ${current.name}.`)
        } else {
          directions.push(`You have reached your destination.`)
        }
      }
    }

    return directions
  }

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)

    if (query.length < 2) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    // Search for matching navigation points
    const results = navigationPoints.filter(
      (point) => point.name.toLowerCase().includes(query.toLowerCase()) && point.type !== "hallway",
    )

    setSearchResults(results)
    setShowSearchResults(results.length > 0)
  }

  // Handle selecting a starting point from the dropdown
  const handleSelectStartPoint = (pointId: string) => {
    const point = navigationPoints.find((p) => p.id === pointId)
    if (point) {
      setCurrentLocation(point)

      // If destination is already set, calculate path
      if (destination) {
        findPath(point, destination)
      }
    }
  }

  // Handle selecting a destination from the dropdown
  const handleSelectDestPoint = (pointId: string) => {
    const point = navigationPoints.find((p) => p.id === pointId)
    if (point) {
      setDestination(point)

      // If current location is set, calculate path
      if (currentLocation) {
        findPath(currentLocation, point)
      }

      // Set current floor to destination floor if not navigating
      if (!isNavigating) {
        setCurrentFloor(point.floor)
      }
    }
  }

  // Start navigation
  const startNavigation = () => {
    if (currentLocation && destination && path.length > 0) {
      setIsNavigating(true)
      setCurrentStep(0)
      setCurrentPosition(currentLocation.position)
      setCurrentFloor(path[0].floor)
    }
  }

  // Stop navigation
  const stopNavigation = () => {
    setIsNavigating(false)
    setCurrentStep(0)
    setCurrentPosition(null)
  }

  // Set click mode for selecting points directly on the map
  const setMapClickMode = (mode: "start" | "destination" | null) => {
    setClickMode(mode)
    if (mode) {
      // Show a message to the user
      alert(`Click on the map to select a ${mode === "start" ? "starting point" : "destination"}`)
    }
  }

  // Toggle between 2D and 3D view
  const toggleViewMode = () => {
    try {
      setViewMode(viewMode === "2d" ? "3d" : "2d")
    } catch (error) {
      console.error("Error toggling view mode:", error)
      // If there's an error switching to 3D, stay in 2D
      if (viewMode === "2d") {
        alert("Unable to switch to 3D view. Please try again or use 2D view.")
      } else {
        setViewMode("2d")
      }
    }
  }

  return (
    <div className="grid h-full grid-cols-1 md:grid-cols-3">
      <div className="col-span-2 flex flex-col p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium">Hospital Navigation</h2>
            <div className="flex items-center gap-2">
              <select
                value={currentFloor}
                onChange={(e) => setCurrentFloor(Number.parseInt(e.target.value))}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value={1}>Floor 1</option>
                <option value={2}>Floor 2</option>
              </select>
              <button
                onClick={() => setMapClickMode("start")}
                className="rounded-md border border-blue-500 bg-blue-50 px-3 py-2 text-sm text-blue-600 hover:bg-blue-100"
                disabled={viewMode === "3d"}
              >
                Set Start Point
              </button>
              <button
                onClick={() => setMapClickMode("destination")}
                className="rounded-md border border-red-500 bg-red-50 px-3 py-2 text-sm text-red-600 hover:bg-red-100"
                disabled={viewMode === "3d"}
              >
                Set Destination
              </button>
              <Button
                onClick={toggleViewMode}
                className="flex items-center gap-1 rounded-md border border-purple-500 bg-purple-50 px-3 py-2 text-sm text-purple-600 hover:bg-purple-100"
              >
                <Cube className="h-4 w-4" />
                {viewMode === "2d" ? "3D View" : "2D View"}
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="flex items-center rounded-md border bg-white px-3 py-2">
                <Search className="mr-2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search locations..."
                  className="border-0 p-0 outline-none focus:ring-0"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              {showSearchResults && (
                <div className="absolute top-full z-10 mt-1 w-full rounded-md border bg-white p-2 shadow-md">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="cursor-pointer rounded-md px-3 py-2 hover:bg-gray-100"
                      onClick={() => {
                        // Set as destination by default
                        handleSelectDestPoint(result.id)
                        setShowSearchResults(false)
                        setSearchQuery("")
                      }}
                    >
                      <div className="font-medium">{result.name}</div>
                      <div className="text-xs text-gray-500">Floor {result.floor}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {isNavigating ? (
              <button
                className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                onClick={stopNavigation}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Stop
              </button>
            ) : (
              <button
                className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                onClick={startNavigation}
                disabled={!currentLocation || !destination || path.length === 0}
              >
                <Navigation className="h-4 w-4" />
                Navigate
              </button>
            )}
          </div>
        </div>
        <div className="relative flex-1 overflow-auto rounded-lg border bg-white shadow-sm">
          {viewMode === "2d" ? (
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="h-full w-full"
              onClick={handleCanvasClick}
            />
          ) : (
            <HospitalMap3D
              rooms={rooms}
              hallways={hallways}
              navigationPoints={navigationPoints}
              currentFloor={currentFloor}
              currentLocation={currentLocation}
              destination={destination}
              path={path}
              isNavigating={isNavigating}
              currentStep={currentStep}
            />
          )}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <button
              className="h-10 w-10 rounded-full bg-white shadow-md"
              onClick={() => setMapMode(mapMode === "standard" ? "satellite" : "standard")}
            >
              <Compass className="mx-auto h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="h-full rounded-lg border bg-white p-4 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-medium">Navigation Controls</h3>
            <p className="text-sm text-gray-500">Select your starting point and destination</p>
          </div>
          <div className="space-y-6">
            {/* Starting point selector */}
            <div className="space-y-2">
              <label htmlFor="starting-point" className="text-sm font-medium">
                Starting Point
              </label>
              <select
                id="starting-point"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                value={currentLocation?.id || ""}
                onChange={(e) => handleSelectStartPoint(e.target.value)}
              >
                <option value="">Select starting point</option>
                {locationPoints
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((point) => (
                    <option key={point.id} value={point.id}>
                      {point.name} (Floor {point.floor})
                    </option>
                  ))}
              </select>
            </div>

            {/* Destination selector */}
            <div className="space-y-2">
              <label htmlFor="destination" className="text-sm font-medium">
                Destination
              </label>
              <select
                id="destination"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                value={destination?.id || ""}
                onChange={(e) => handleSelectDestPoint(e.target.value)}
              >
                <option value="">Select destination</option>
                {locationPoints
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((point) => (
                    <option key={point.id} value={point.id}>
                      {point.name} (Floor {point.floor})
                    </option>
                  ))}
              </select>
            </div>

            {/* Quick Access */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Quick Access</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  navigationPoints.find((p) => p.name === "Emergency"),
                  navigationPoints.find((p) => p.name === "Radiology"),
                  navigationPoints.find((p) => p.name === "Pharmacy"),
                  navigationPoints.find((p) => p.name === "ICU"),
                ]
                  .filter((p): p is NavigationPoint => p !== undefined)
                  .map((point) => (
                    <button
                      key={point.id}
                      className="flex items-center justify-start rounded-md border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
                      onClick={() => handleSelectDestPoint(point.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {point.name}
                    </button>
                  ))}
              </div>
            </div>

            {/* Show directions only when a path is calculated */}
            {directions.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Directions</h3>
                  {currentLocation && destination && path.length > 0 && (
                    <button
                      className={`rounded-md px-3 py-1 text-sm ${
                        isNavigating
                          ? "bg-red-100 text-red-600 hover:bg-red-200"
                          : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                      }`}
                      onClick={isNavigating ? stopNavigation : startNavigation}
                    >
                      {isNavigating ? "Stop" : "Start"} Navigation
                    </button>
                  )}
                </div>
                <div className="max-h-[300px] overflow-y-auto rounded-md border p-3">
                  <ol className="space-y-3">
                    {directions.map((direction, index) => (
                      <li
                        key={index}
                        className={`flex items-start gap-3 ${
                          isNavigating && index === currentStep ? "rounded-md bg-blue-50 p-2" : ""
                        }`}
                      >
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                            isNavigating && index < currentStep
                              ? "bg-green-100 text-green-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm">{direction}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {/* Map Legend */}
            {!directions.length && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Map Legend</h3>
                <div className="grid grid-cols-2 gap-2 rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-sm"
                      style={{ backgroundColor: MAP_STYLES.rooms.emergency.fill }}
                    ></div>
                    <span className="text-xs">Emergency</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-sm"
                      style={{ backgroundColor: MAP_STYLES.rooms.radiology.fill }}
                    ></div>
                    <span className="text-xs">Radiology</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-sm"
                      style={{ backgroundColor: MAP_STYLES.rooms.surgery.fill }}
                    ></div>
                    <span className="text-xs">Surgery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: MAP_STYLES.rooms.icu.fill }}></div>
                    <span className="text-xs">ICU</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-sm"
                      style={{ backgroundColor: MAP_STYLES.rooms.pharmacy.fill }}
                    ></div>
                    <span className="text-xs">Pharmacy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-sm"
                      style={{ backgroundColor: MAP_STYLES.rooms.laboratory.fill }}
                    ></div>
                    <span className="text-xs">Laboratory</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
