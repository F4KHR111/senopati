"use client";

import { useState } from "react";
import { Building } from "../mocks/map-data";
import { motion } from "framer-motion";
import { Layers, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/shared/components";

interface BuildingViewProps {
  building: Building;
  onSelectFloor: (floorId: string) => void;
  onBack: () => void;
}

export default function BuildingView({ building, onSelectFloor, onBack }: BuildingViewProps) {
  const [hoveredFloor, setHoveredFloor] = useState<string | null>(null);

  // Return a sorted list of floors (from top floor to ground floor for visual stacking order)
  const sortedFloors = [...building.floors].sort((a, b) => b.svgStackY - a.svgStackY);

  return (
    <div className="flex flex-col gap-4">
      {/* Back to Area Header */}
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={onBack} className="flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Area
        </Button>
        <div className="text-right">
          <h3 className="text-sm font-bold text-text-primary">{building.name}</h3>
          <p className="text-[10px] text-text-tertiary">{building.description}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center bg-bg-secondary border border-border p-6 rounded-lg shadow-xs">
        {/* Isometric Stacking SVG View */}
        <div className="flex-1 w-full max-w-lg aspect-[3/2] bg-bg border border-border rounded-lg relative overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent opacity-60 pointer-events-none" />
          
          <svg viewBox="0 0 600 400" className="w-full h-full select-none">
            {sortedFloors.map((floor) => {
              const isHovered = hoveredFloor === floor.id;
              // Stacking offsets: lower svgStackY means higher floor.
              const yOffset = floor.svgStackY;
              // Hover effect: translate slightly upwards
              const hoverTranslateY = isHovered ? -15 : 0;

              return (
                <g
                  key={floor.id}
                  className="group cursor-pointer"
                  onClick={() => onSelectFloor(floor.id)}
                  onMouseEnter={() => setHoveredFloor(floor.id)}
                  onMouseLeave={() => setHoveredFloor(null)}
                >
                  {/* Isometric Slab (Rhombus shape) */}
                  <motion.g
                    animate={{ y: yOffset + hoverTranslateY }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    {/* Floor Base Polygon */}
                    <polygon
                      points="100,100 300,30 500,100 300,170"
                      className={`transition-all duration-300 stroke-2 ${
                        isHovered
                          ? "fill-accent/25 stroke-accent"
                          : "fill-bg-secondary/70 stroke-border group-hover:stroke-accent/50 group-hover:fill-accent/10"
                      }`}
                    />
                    
                    {/* Slab thickness bottom shadow (for 3D effect) */}
                    <polygon
                      points="100,100 100,108 300,178 300,170"
                      className={`transition-all duration-300 ${
                        isHovered ? "fill-accent/40" : "fill-border-hover/60"
                      }`}
                    />
                    <polygon
                      points="300,170 300,178 500,108 500,100"
                      className={`transition-all duration-300 ${
                        isHovered ? "fill-accent/35" : "fill-border/60"
                      }`}
                    />

                    {/* Room Layout Outlines drawn inside the slab to represent division */}
                    <polygon points="100,100 200,65 300,100 200,135" fill="none" stroke="currentColor" className="text-border/20" />
                    <polygon points="300,100 400,65 500,100 400,135" fill="none" stroke="currentColor" className="text-border/20" />

                    {/* Floor Label inside the Isometric Slab */}
                    <foreignObject x="220" y="80" width="160" height="40" className="pointer-events-none">
                      <div className="flex flex-col items-center justify-center h-full">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-sm border transition-colors ${
                          isHovered 
                            ? "bg-accent text-white border-accent" 
                            : "bg-bg text-text-primary border-border"
                        }`}>
                          {floor.name}
                        </span>
                      </div>
                    </foreignObject>
                  </motion.g>
                </g>
              );
            })}
          </svg>

          {/* Floating Helper */}
          <div className="absolute top-3 left-3 bg-bg/90 backdrop-blur-xs border border-border px-2.5 py-1.5 rounded shadow-xs flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-accent" />
            <span className="text-[10px] font-semibold text-text-primary">Pilih lantai untuk melihat denah</span>
          </div>
        </div>

        {/* Floor Selection Sidebar buttons */}
        <div className="w-full md:w-64 flex flex-col gap-3">
          <div className="text-[10px] font-bold text-text-tertiary tracking-wider uppercase mb-1">Daftar Lantai</div>
          {building.floors.map((f) => (
            <motion.button
              key={f.id}
              whileHover={{ scale: 1.01 }}
              onClick={() => onSelectFloor(f.id)}
              onMouseEnter={() => setHoveredFloor(f.id)}
              onMouseLeave={() => setHoveredFloor(null)}
              className={`w-full p-4 border rounded-lg text-left transition-all duration-200 flex items-center justify-between group ${
                hoveredFloor === f.id
                  ? "border-accent bg-accent/5"
                  : "border-border bg-bg hover:border-border-hover"
              }`}
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-accent" />
                  {f.name}
                </span>
                <span className="text-[9px] text-text-tertiary mt-1">
                  {f.rooms.length} Ruangan Fisik Terdata
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-text-tertiary opacity-0 group-hover:opacity-100 group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-200" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
