"use client";

import { useState } from "react";
import { mockArea, Asset } from "../mocks/map-data";
import AreaView from "./area-view";
import BuildingView from "./building-view";
import FloorView from "./floor-view";
import RoomDetailPanel from "./room-detail-panel";
import AssetPassportModal from "./asset-passport-modal";
import { ChevronRight, Home, Filter } from "lucide-react";
import { motion } from "framer-motion";

type MapLevel = "area" | "building" | "floor";

export default function MapEngine() {
  const [level, setLevel] = useState<MapLevel>("area");
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [selectedFloorId, setSelectedFloorId] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const currentBuilding = mockArea.buildings.find((b) => b.id === selectedBuildingId);
  const currentFloor = currentBuilding?.floors.find((f) => f.id === selectedFloorId);
  const currentRoom = currentFloor?.rooms.find((r) => r.id === selectedRoomId);

  const handleSelectBuilding = (buildingId: string) => {
    setSelectedBuildingId(buildingId);
    setLevel("building");
  };

  const handleSelectFloor = (floorId: string) => {
    setSelectedFloorId(floorId);
    setLevel("floor");
  };

  const handleSelectRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
  };

  const handleCloseRoomDetail = () => {
    setSelectedRoomId(null);
  };

  const handleBackToArea = () => {
    setSelectedBuildingId(null);
    setSelectedFloorId(null);
    setSelectedRoomId(null);
    setLevel("area");
  };

  const handleBackToBuilding = () => {
    setSelectedFloorId(null);
    setSelectedRoomId(null);
    setLevel("building");
  };

  const categories = [
    { id: "all", label: "Semua", icon: "🌐" },
    { id: "vehicle", label: "Kendaraan", icon: "🚗" },
    { id: "inventory", label: "Inventaris", icon: "💻" },
    { id: "art", label: "Benda Seni", icon: "🎨" },
    { id: "linen", label: "Linen", icon: "👕" },
    { id: "supply", label: "Persediaan", icon: "📦" },
  ];

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Top Header Breadcrumbs navigation */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-bg border border-border p-4 rounded-lg shadow-xs">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-tertiary">
          <button
            onClick={handleBackToArea}
            className="flex items-center gap-1 hover:text-accent transition-colors"
          >
            <Home className="h-3.5 w-3.5" /> Area
          </button>
          
          {selectedBuildingId && currentBuilding && (
            <>
              <ChevronRight className="h-3 w-3" />
              <button
                onClick={handleBackToBuilding}
                className="hover:text-accent transition-colors capitalize"
              >
                {currentBuilding.name}
              </button>
            </>
          )}

          {selectedFloorId && currentFloor && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span className="text-text-primary capitalize">{currentFloor.name}</span>
            </>
          )}
        </div>

        {/* Categories filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Filter className="h-3.5 w-3.5 text-text-tertiary mr-1 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2 py-1 text-[9px] font-extrabold rounded-md border flex items-center gap-1 transition-all ${
                selectedCategory === cat.id
                  ? "bg-accent border-accent text-white shadow-xs"
                  : "bg-bg border-border text-text-secondary hover:border-border-hover"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main viewport area */}
      <div className="w-full">
        {level === "area" && (
          <AreaView buildings={mockArea.buildings} onSelectBuilding={handleSelectBuilding} />
        )}

        {level === "building" && currentBuilding && (
          <BuildingView
            building={currentBuilding}
            onSelectFloor={handleSelectFloor}
            onBack={handleBackToArea}
          />
        )}

        {level === "floor" && currentFloor && (
          <div className="flex flex-col lg:flex-row gap-5 items-start">
            <div className="flex-1 w-full">
              <FloorView
                floor={currentFloor}
                selectedRoomId={selectedRoomId}
                onSelectRoom={handleSelectRoom}
                selectedCategory={selectedCategory}
              />
            </div>
            
            {selectedRoomId && currentRoom && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full lg:w-auto shrink-0"
              >
                <RoomDetailPanel
                  room={currentRoom}
                  onClose={handleCloseRoomDetail}
                  onSelectAsset={setSelectedAsset}
                />
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Asset Passport modal overlay */}
      <AssetPassportModal asset={selectedAsset} onClose={() => setSelectedAsset(null)} />
    </div>
  );
}
