"use client";

import { useState } from "react";
import { Floor, Room } from "../mocks/map-data";
import { Plus, Minus, RotateCcw } from "lucide-react";
import { Button } from "@/shared/components";

interface FloorViewProps {
  floor: Floor;
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  selectedCategory: string; // Filter asset category
}

export default function FloorView({ floor, selectedRoomId, onSelectRoom, selectedCategory }: FloorViewProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hoveredRoom, setHoveredRoom] = useState<Room | null>(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.6));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const getStatusColor = (room: Room) => {
    // If a room has assets matching the selected filter, highlight it in golden accent color
    if (selectedCategory !== "all") {
      const hasMatchingAsset = room.assets.some((a) => a.category === selectedCategory);
      if (hasMatchingAsset) return "fill-accent/25 stroke-accent hover:fill-accent/40";
      return "fill-bg-secondary/40 stroke-border/40 hover:fill-accent/10";
    }

    // Default status colors
    if (room.status === "Kapasitas Penuh") {
      return "fill-error/15 stroke-error hover:fill-error/25";
    }
    if (room.status === "Pemeliharaan") {
      return "fill-warning/15 stroke-warning hover:fill-warning/25";
    }
    return "fill-success/15 stroke-success hover:fill-success/25";
  };

  const getStatusText = (room: Room) => {
    if (room.status === "Kapasitas Penuh") return "Penuh (90%+)";
    if (room.status === "Pemeliharaan") return "Pemeliharaan";
    return "Optimal";
  };

  return (
    <div className="flex flex-col gap-4 relative">
      {/* 2.5D Interactive SVG Board */}
      <div className="w-full aspect-[4/3] sm:aspect-[16/10] bg-bg border border-border rounded-lg relative overflow-hidden flex items-center justify-center p-4">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.03] pointer-events-none" />

        {/* Floating Tooltip Indicator */}
        {hoveredRoom && (
          <div className="absolute top-4 left-4 z-dropdown bg-primary/95 backdrop-blur-xs text-text-inverse border border-accent/20 px-3 py-2 rounded shadow-md max-w-[200px] pointer-events-none flex flex-col gap-1">
            <span className="text-[10px] font-bold tracking-tight">{hoveredRoom.name}</span>
            <div className="flex justify-between items-center gap-4 text-[9px] text-text-inverse/70 mt-1">
              <span>Aset Terdata:</span>
              <span className="font-semibold text-accent">{hoveredRoom.assets.length} Item</span>
            </div>
            <div className="flex justify-between items-center gap-4 text-[9px] text-text-inverse/70">
              <span>Status:</span>
              <span className="font-semibold">{getStatusText(hoveredRoom)}</span>
            </div>
          </div>
        )}

        {/* Floating Zoom controls */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-bg/95 backdrop-blur-xs border border-border p-1.5 rounded-lg shadow-sm z-10">
          <Button variant="outline" size="sm" onClick={handleZoomIn} className="h-7 w-7 p-0 flex items-center justify-center">
            <Plus className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomOut} className="h-7 w-7 p-0 flex items-center justify-center">
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset} className="h-7 w-7 p-0 flex items-center justify-center">
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Main Isometric Map Render Container */}
        <div className="w-full h-full flex items-center justify-center">
          <svg
            viewBox="0 0 600 450"
            className="w-full h-full max-h-[380px] max-w-[500px] select-none transition-transform duration-200"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            }}
          >
            {/* Outline Floor boundary border */}
            <polygon
              points="300,30 550,155 300,280 50,155"
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="opacity-70"
            />
            {/* Outline Floor boundary shadow bottom */}
            <polygon
              points="50,155 50,165 300,290 300,280"
              fill="none"
              stroke="var(--color-border)"
              className="opacity-40"
            />
            <polygon
              points="300,280 300,290 550,165 550,155"
              fill="none"
              stroke="var(--color-border)"
              className="opacity-40"
            />

            {/* Render Rooms polygons */}
            {floor.rooms.map((room) => {
              const isSelected = selectedRoomId === room.id;
              const colorClasses = getStatusColor(room);

              return (
                <g
                  key={room.id}
                  className="group cursor-pointer"
                  onClick={() => onSelectRoom(room.id)}
                  onMouseEnter={() => setHoveredRoom(room)}
                  onMouseLeave={() => setHoveredRoom(null)}
                >
                  {/* Base room polygon shadow thickness */}
                  <polygon
                    points={`${room.svgPolygonPoints.split(" ").map((p) => {
                      const [x, y] = p.split(",").map(Number);
                      return `${x},${y + 6}`;
                    }).join(" ")}`}
                    className={`transition-all duration-300 ${
                      isSelected ? "fill-accent/40" : "fill-border/20 group-hover:fill-accent/20"
                    }`}
                  />
                  {/* Dynamic Room Floor Polygon */}
                  <polygon
                    points={room.svgPolygonPoints}
                    className={`transition-all duration-300 stroke-2 ${colorClasses} ${
                      isSelected
                        ? "fill-accent/30 stroke-accent"
                        : "stroke-border group-hover:stroke-accent/60"
                    }`}
                  />

                  {/* Room Label Display */}
                  <foreignObject
                    x={room.labelX - 70}
                    y={room.labelY - 18}
                    width="140"
                    height="36"
                    className="pointer-events-none overflow-visible"
                  >
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <span className={`text-[8px] font-bold leading-tight px-1.5 py-0.5 rounded border transition-colors ${
                        isSelected
                          ? "bg-accent text-white border-accent shadow"
                          : "bg-bg/95 text-text-secondary border-border"
                      }`}>
                        {room.name.split(" (")[0]}
                      </span>
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
