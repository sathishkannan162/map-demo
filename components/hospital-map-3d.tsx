"use client"

import { useEffect, useRef, useState } from "react"
import type { Room, Hallway, NavigationPoint } from "@/types/hospital-types"

interface HospitalMap3DProps {
  rooms: Room[]
  hallways: Hallway[]
  navigationPoints: NavigationPoint[]
  currentFloor: number
  currentLocation: NavigationPoint | null
  destination: NavigationPoint | null
  path: NavigationPoint[]
  isNavigating: boolean
  currentStep: number
}

export default function HospitalMap3D({
  rooms,
  hallways,
  navigationPoints,
  currentFloor,
  currentLocation,
  destination,
  path,
  isNavigating,
  currentStep,
}: HospitalMap3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingStatus, setLoadingStatus] = useState("Loading 3D view...")
  const [threeLoaded, setThreeLoaded] = useState(false)

  // Initialize 3D scene
  useEffect(() => {
    if (!containerRef.current) return

    let cleanup: (() => void) | undefined

    const initThree = async () => {
      try {
        setLoadingStatus("Loading Three.js library...")

        // Dynamically import Three.js from CDN
        const threeScript = document.createElement("script")
        threeScript.src = "https://unpkg.com/three@0.160.0/build/three.min.js"
        threeScript.async = true

        const loadThree = new Promise<void>((resolve, reject) => {
          threeScript.onload = () => {
            console.log("Three.js loaded successfully")
            resolve()
          }
          threeScript.onerror = () => {
            reject(new Error("Failed to load Three.js"))
          }
        })

        document.head.appendChild(threeScript)
        await loadThree
        setThreeLoaded(true)

        // Access THREE from window
        const THREE = (window as any).THREE
        if (!THREE) {
          throw new Error("THREE.js not found in window object")
        }

        setLoadingStatus("Creating 3D scene...")

        // Create renderer
        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        })
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
        renderer.setClearColor(0xf0f0f0)
        containerRef.current.appendChild(renderer.domElement)

        // Create scene
        const scene = new THREE.Scene()

        // Create camera
        const camera = new THREE.PerspectiveCamera(
          60,
          containerRef.current.clientWidth / containerRef.current.clientHeight,
          1,
          2000,
        )
        camera.position.set(600, 600, 1000)
        camera.lookAt(600, 0, 400)

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
        scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
        directionalLight.position.set(1000, 1000, 500)
        scene.add(directionalLight)

        // Create a simple building model
        createSimpleBuilding(THREE, scene, rooms, hallways, currentFloor)

        // Add navigation path if available
        if (path.length > 0) {
          addNavigationPath(THREE, scene, path, currentFloor)
        }

        // Add markers for current location and destination
        if (currentLocation && currentLocation.floor === currentFloor) {
          addMarker(THREE, scene, currentLocation.position[0], currentLocation.position[1], 0x4285f4)
        }

        if (destination && destination.floor === currentFloor) {
          addMarker(THREE, scene, destination.position[0], destination.position[1], 0xea4335)
        }

        // Simple camera controls
        let isDragging = false
        let previousMousePosition = { x: 0, y: 0 }

        const onMouseDown = (event: MouseEvent) => {
          isDragging = true
          previousMousePosition = { x: event.clientX, y: event.clientY }
        }

        const onMouseMove = (event: MouseEvent) => {
          if (!isDragging) return

          const deltaX = event.clientX - previousMousePosition.x
          const deltaY = event.clientY - previousMousePosition.y

          camera.position.x -= deltaX * 0.5
          camera.position.z += deltaY * 0.5

          camera.lookAt(600, 0, 400)

          previousMousePosition = { x: event.clientX, y: event.clientY }
        }

        const onMouseUp = () => {
          isDragging = false
        }

        const onWheel = (event: WheelEvent) => {
          event.preventDefault()

          // Zoom in/out
          camera.position.y += event.deltaY * 0.5
          camera.position.y = Math.max(100, Math.min(1000, camera.position.y))

          camera.lookAt(600, 0, 400)
        }

        containerRef.current.addEventListener("mousedown", onMouseDown)
        window.addEventListener("mousemove", onMouseMove)
        window.addEventListener("mouseup", onMouseUp)
        containerRef.current.addEventListener("wheel", onWheel)

        // Animation loop
        const animate = () => {
          const animationId = requestAnimationFrame(animate)

          // Run any custom animations registered
          if (scene.userData.animate) {
            scene.userData.animate()
          }

          renderer.render(scene, camera)
          return animationId
        }

        const animationId = animate()

        // Handle window resize
        const handleResize = () => {
          if (!containerRef.current) return

          camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
          camera.updateProjectionMatrix()
          renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
        }

        window.addEventListener("resize", handleResize)

        setLoadingStatus("")

        // Cleanup function
        cleanup = () => {
          cancelAnimationFrame(animationId)
          containerRef.current?.removeEventListener("mousedown", onMouseDown)
          window.removeEventListener("mousemove", onMouseMove)
          window.removeEventListener("mouseup", onMouseUp)
          containerRef.current?.removeEventListener("wheel", onWheel)
          window.removeEventListener("resize", handleResize)

          if (containerRef.current && renderer.domElement) {
            containerRef.current.removeChild(renderer.domElement)
          }

          document.head.removeChild(threeScript)
        }
      } catch (err) {
        console.error("Error initializing 3D scene:", err)
        setError(`Failed to initialize 3D view: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    initThree()

    return () => {
      if (cleanup) cleanup()
    }
  }, [rooms, hallways, navigationPoints, currentFloor, currentLocation, destination, path])

  // Create a simple building model
  function createSimpleBuilding(THREE: any, scene: any, rooms: Room[], hallways: Hallway[], currentFloor: number) {
    // Create floor
    const floorGeometry = new THREE.BoxGeometry(1200, 10, 800)
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee })
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.position.set(600, 0, 400)
    scene.add(floor)

    // Create rooms for current floor
    const floorRooms = rooms.filter((room) => room.floor === currentFloor)

    floorRooms.forEach((room) => {
      // Create a simple box for each room
      const roomMaterial = new THREE.MeshStandardMaterial({
        color: getRoomColor(room.type),
        transparent: true,
        opacity: 0.7,
      })

      // Calculate room dimensions from points
      const minX = Math.min(...room.points.map((p) => p[0]))
      const maxX = Math.max(...room.points.map((p) => p[0]))
      const minZ = Math.min(...room.points.map((p) => p[1]))
      const maxZ = Math.max(...room.points.map((p) => p[1]))

      const width = maxX - minX
      const depth = maxZ - minZ
      const height = 100 // Standard room height

      const roomGeometry = new THREE.BoxGeometry(width, height, depth)
      const roomMesh = new THREE.Mesh(roomGeometry, roomMaterial)

      // Position at center of room
      roomMesh.position.set(
        minX + width / 2,
        height / 2 + 5, // Slightly above floor
        minZ + depth / 2,
      )

      scene.add(roomMesh)
    })

    // Create hallways
    const floorHallways = hallways.filter((hallway) => hallway.floor === currentFloor)

    floorHallways.forEach((hallway) => {
      for (let i = 0; i < hallway.points.length - 1; i++) {
        const start = hallway.points[i]
        const end = hallway.points[i + 1]

        // Calculate hallway dimensions
        const dx = end[0] - start[0]
        const dz = end[1] - start[1]
        const length = Math.sqrt(dx * dx + dz * dz)
        const angle = Math.atan2(dz, dx)

        const hallwayGeometry = new THREE.BoxGeometry(length, 5, 20)
        const hallwayMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
        const hallwayMesh = new THREE.Mesh(hallwayGeometry, hallwayMaterial)

        // Position at midpoint of hallway segment
        hallwayMesh.position.set(
          (start[0] + end[0]) / 2,
          2.5, // Half height above floor
          (start[1] + end[1]) / 2,
        )

        // Rotate to align with hallway direction
        hallwayMesh.rotation.y = angle

        scene.add(hallwayMesh)
      }
    })

    // Create a single-color floor plane instead of a grid
    const floorPlaneGeometry = new THREE.PlaneGeometry(2000, 2000)
    const floorPlaneMaterial = new THREE.MeshStandardMaterial({
      color: 0xf0f0f0,
      side: THREE.DoubleSide,
      roughness: 0.8,
    })
    const floorPlane = new THREE.Mesh(floorPlaneGeometry, floorPlaneMaterial)
    floorPlane.rotation.x = Math.PI / 2 // Rotate to be horizontal
    floorPlane.position.y = -1 // Slightly below the building floor
    floorPlane.receiveShadow = true
    scene.add(floorPlane)
  }

  // Add a navigation path
  function addNavigationPath(THREE: any, scene: any, path: NavigationPoint[], currentFloor: number) {
    const floorPath = path.filter((point) => point.floor === currentFloor)

    if (floorPath.length < 2) return

    // Create points for the path line
    const points = floorPath.map((point) => new THREE.Vector3(point.position[0], 20, point.position[1]))

    // Create a more visible path line
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({
      color: 0x4285f4,
      linewidth: 5,
      linecap: "round",
      linejoin: "round",
    })
    const line = new THREE.Line(geometry, material)
    scene.add(line)

    // Add path points as small spheres for better visibility
    floorPath.forEach((point, index) => {
      // Skip first and last points as they'll have markers
      if (index > 0 && index < floorPath.length - 1) {
        const pointGeometry = new THREE.SphereGeometry(5, 16, 16)
        const pointMaterial = new THREE.MeshBasicMaterial({ color: 0x4285f4 })
        const pointMesh = new THREE.Mesh(pointGeometry, pointMaterial)
        pointMesh.position.set(point.position[0], 25, point.position[1])
        scene.add(pointMesh)
      }
    })
  }

  // Add a marker at a position
  function addMarker(THREE: any, scene: any, x: number, z: number, color: number) {
    // Create a larger, more visible marker
    const markerGeometry = new THREE.SphereGeometry(20, 16, 16)
    const markerMaterial = new THREE.MeshBasicMaterial({ color })
    const marker = new THREE.Mesh(markerGeometry, markerMaterial)
    marker.position.set(x, 40, z) // Position higher above floor for visibility
    scene.add(marker)

    // Add a pulsing effect with a second sphere
    const pulseGeometry = new THREE.SphereGeometry(25, 16, 16)
    const pulseMaterial = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.3,
    })
    const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial)
    pulse.position.set(x, 40, z)
    scene.add(pulse)

    // Add animation to the pulse
    const animate = () => {
      const scale = 1 + 0.2 * Math.sin(Date.now() / 300)
      pulse.scale.set(scale, scale, scale)
    }

    // Add the animate function to the animation loop
    const originalAnimate = scene.userData.animate || (() => {})
    scene.userData.animate = () => {
      originalAnimate()
      animate()
    }
  }

  // Get color for room type
  function getRoomColor(type: string): number {
    const colors: Record<string, number> = {
      emergency: 0xffcdd2,
      radiology: 0xe1bee7,
      surgery: 0xffcc80,
      icu: 0xffecb3,
      pharmacy: 0xc8e6c9,
      laboratory: 0xfff9c4,
      reception: 0xbbdefb,
      cafeteria: 0xffe0b2,
      administration: 0xd1c4e9,
      restroom: 0xcfd8dc,
      elevator: 0xe0e0e0,
      stairs: 0xe0e0e0,
      entrance: 0x90caf9,
      default: 0xe0e0e0,
    }

    return colors[type] || colors.default
  }

  // Render a fallback 2D view if 3D fails
  const renderFallback = () => {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100 p-8 text-center">
        <div className="mb-4 text-xl font-semibold text-gray-800">3D View Not Available</div>
        <div className="mb-6 max-w-md text-gray-600">
          {error || "Unable to load 3D view. Please try switching back to 2D view."}
        </div>
        <div className="text-sm text-gray-500">The 3D view requires WebGL support in your browser.</div>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      {/* Container for 3D scene */}
      <div ref={containerRef} className="h-full w-full" />

      {/* Loading or error overlay */}
      {(loadingStatus || error) && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
          <div className="text-center">
            {error ? (
              renderFallback()
            ) : (
              <div>
                <div className="mb-2 text-lg font-medium">{loadingStatus}</div>
                <div className="h-2 w-48 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-500"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Debug info */}
      <div className="absolute bottom-4 left-4 rounded bg-white bg-opacity-70 p-2 text-xs">
        <div>Three.js loaded: {threeLoaded ? "Yes" : "No"}</div>
        <div>Current floor: {currentFloor}</div>
        <div>Path points: {path.length}</div>
      </div>
    </div>
  )
}
