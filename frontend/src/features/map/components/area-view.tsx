"use client";

import { useState } from "react";
import { Building } from "../mocks/map-data";
import { motion } from "framer-motion";
import { Building2, Layers, Shield } from "lucide-react";

interface AreaViewProps {
  buildings: Building[];
  onSelectBuilding: (id: string) => void;
}

export default function AreaView({ buildings, onSelectBuilding }: AreaViewProps) {
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);

  return (
    <div className="flex flex-col md:flex-row gap-6 items-center bg-bg-secondary border border-border p-6 rounded-lg shadow-xs">
      {/* Visual Isometric SVG Render */}
      <div className="flex-1 w-full max-w-lg aspect-[3/2] bg-bg border border-border rounded-lg relative overflow-hidden flex items-center justify-center p-4">
        {/* Decorative Grid Lines to give Blueprint feeling */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent opacity-60 pointer-events-none" />
        <svg viewBox="0 0 600 400" className="w-full h-full select-none">
          {/* Floor Grid Guidelines */}
          <path
            d="M 50,200 L 300,75 L 550,200 L 300,325 Z"
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <path d="M 300,75 L 300,325" fill="none" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M 50,200 L 550,200" fill="none" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4 4" />

          {/* Building 1: Gedung Utama Agung */}
          <g
            className="group cursor-pointer"
            onClick={() => onSelectBuilding("building-agung")}
            onMouseEnter={() => setHoveredBuilding("building-agung")}
            onMouseLeave={() => setHoveredBuilding(null)}
          >
            {/* Left Wall */}
            <polygon
              points="180,240 260,280 260,160 180,120"
              className="fill-accent/15 group-hover:fill-accent/35 stroke-accent/40 group-hover:stroke-accent transition-all duration-300"
            />
            {/* Right Wall */}
            <polygon
              points="260,280 380,220 380,100 260,160"
              className="fill-accent/20 group-hover:fill-accent/40 stroke-accent/45 group-hover:stroke-accent transition-all duration-300"
            />
            {/* Top Roof */}
            <polygon
              points="180,120 260,160 380,100 300,60"
              className="fill-accent/10 group-hover:fill-accent/30 stroke-accent/35 group-hover:stroke-accent transition-all duration-300"
            />
            {/* Highlight Glow under hovered state */}
            {hoveredBuilding === "building-agung" && (
              <polygon
                points="180,240 260,280 380,220 300,180"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="2"
                className="opacity-50"
              />
            )}
            {/* Floating label */}
            <foreignObject x="210" y="110" width="140" height="40" className="pointer-events-none">
              <div className="flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold bg-primary text-text-inverse px-1.5 py-0.5 rounded shadow border border-accent/30">
                  Gedung Utama
                </span>
              </div>
            </foreignObject>
          </g>

          {/* Building 2: Wisma Negara Delegasi */}
          <g
            className="group cursor-pointer"
            onClick={() => onSelectBuilding("building-delegasi")}
            onMouseEnter={() => setHoveredBuilding("building-delegasi")}
            onMouseLeave={() => setHoveredBuilding(null)}
          >
            {/* Left Wall */}
            <polygon
              points="380,270 430,295 430,225 380,200"
              className="fill-info/15 group-hover:fill-info/35 stroke-info/40 group-hover:stroke-info transition-all duration-300"
            />
            {/* Right Wall */}
            <polygon
              points="430,295 500,260 500,190 430,225"
              className="fill-info/20 group-hover:fill-info/40 stroke-info/45 group-hover:stroke-info transition-all duration-300"
            />
            {/* Top Roof */}
            <polygon
              points="380,200 430,225 500,190 450,165"
              className="fill-info/10 group-hover:fill-info/30 stroke-info/35 group-hover:stroke-info transition-all duration-300"
            />
            {/* Label */}
            <foreignObject x="400" y="195" width="100" height="40" className="pointer-events-none">
              <div className="flex flex-col items-center justify-center">
                <span className="text-[9px] font-bold bg-bg border border-border text-text-primary px-1 py-0.5 rounded shadow">
                  Wisma Delegasi
                </span>
              </div>
            </foreignObject>
          </g>
        </svg>

        {/* Informative Float Overlay */}
        <div className="absolute top-3 left-3 bg-bg/90 backdrop-blur-xs border border-border px-2.5 py-1.5 rounded shadow-xs flex items-center gap-1.5">
          <Shield className="h-3.5 w-3.5 text-accent" />
          <span className="text-[10px] font-semibold text-text-primary">Pilih gedung untuk navigasi</span>
        </div>
      </div>

      {/* Buildings Meta Detail Lists */}
      <div className="w-full md:w-64 flex flex-col gap-3">
        {buildings.map((b) => (
          <motion.div
            key={b.id}
            whileHover={{ scale: 1.01 }}
            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
              hoveredBuilding === b.id
                ? "border-accent bg-accent/5 shadow-xs"
                : "border-border bg-bg hover:border-border-hover"
            }`}
            onClick={() => onSelectBuilding(b.id)}
            onMouseEnter={() => setHoveredBuilding(b.id)}
            onMouseLeave={() => setHoveredBuilding(null)}
          >
            <h3 className="text-xs font-bold text-text-primary flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-accent" />
              {b.name}
            </h3>
            <p className="text-[10px] text-text-tertiary leading-relaxed mt-1">{b.description}</p>
            <div className="flex items-center gap-3 mt-3 text-[10px] font-medium text-text-secondary">
              <span className="flex items-center gap-1">
                <Layers className="h-3 w-3" />
                {b.floorsCount} Lantai
              </span>
              <span>•</span>
              <span>{b.totalAssets} Aset Terdata</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
