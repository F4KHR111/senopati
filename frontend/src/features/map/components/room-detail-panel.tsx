"use client";

import { useState } from "react";
import { Room, Asset } from "../mocks/map-data";
import { X, Search, Package } from "lucide-react";
import { Badge } from "@/shared/components";
import { useDebounce } from "@/shared/hooks";

interface RoomDetailPanelProps {
  room: Room;
  onClose: () => void;
  onSelectAsset: (asset: Asset) => void;
}

export default function RoomDetailPanel({ room, onClose, onSelectAsset }: RoomDetailPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Filter assets based on search query
  const filteredAssets = room.assets.filter((a) => {
    const query = debouncedSearch.toLowerCase();
    return (
      a.name.toLowerCase().includes(query) ||
      a.code.toLowerCase().includes(query) ||
      a.category.toLowerCase().includes(query)
    );
  });

  const getConditionBadge = (condition: string) => {
    if (condition === "Baik") return <Badge variant="success">Baik</Badge>;
    if (condition === "Rusak Ringan") return <Badge variant="warning">Rusak Ringan</Badge>;
    return <Badge variant="error">Rusak Berat</Badge>;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "art":
        return "🎨";
      case "linen":
        return "👕";
      case "supply":
        return "📦";
      case "vehicle":
        return "🚗";
      default:
        return "💻";
    }
  };

  return (
    <div className="w-full lg:w-96 flex flex-col border border-border bg-bg-secondary rounded-lg overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-border p-4 bg-bg">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold text-text-tertiary tracking-wider uppercase">Detail Ruangan</span>
          <h4 className="text-xs font-bold text-text-primary leading-tight">{room.name}</h4>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-bg-secondary text-text-tertiary hover:text-text-primary transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Metrics Row */}
      <div className="p-4 grid grid-cols-2 gap-2 border-b border-border bg-bg/50">
        <div className="flex flex-col p-2 bg-bg border border-border rounded">
          <span className="text-[9px] font-semibold text-text-tertiary">Okupansi Ruang</span>
          <span className="text-xs font-bold text-text-primary mt-0.5">{room.occupancy}%</span>
        </div>
        <div className="flex flex-col p-2 bg-bg border border-border rounded">
          <span className="text-[9px] font-semibold text-text-tertiary">Total Aset Fisik</span>
          <span className="text-xs font-bold text-text-primary mt-0.5">{room.assets.length} Item</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-4 bg-bg border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-text-tertiary" />
          <input
            type="text"
            placeholder="Cari nama atau kode aset..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-[11px] h-8.5 pl-9 pr-4 rounded-md border border-border bg-bg text-text-primary focus:outline-hidden focus:border-border-hover placeholder-text-tertiary"
          />
        </div>
      </div>

      {/* Asset List Container */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5 max-h-[350px] lg:max-h-[500px]">
        {filteredAssets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center gap-1.5 border border-dashed border-border rounded-lg bg-bg/30">
            <Package className="h-6 w-6 text-text-tertiary" />
            <span className="text-[10px] font-bold text-text-secondary">Tidak ada aset ditemukan</span>
            <span className="text-[9px] text-text-tertiary">Gunakan kata kunci pencarian lain.</span>
          </div>
        ) : (
          filteredAssets.map((asset) => (
            <div
              key={asset.id}
              onClick={() => onSelectAsset(asset)}
              className="p-3 border border-border rounded-lg bg-bg hover:border-border-hover hover:bg-bg-secondary/40 shadow-xs cursor-pointer flex flex-col gap-2 transition-all group"
            >
              <div className="flex justify-between items-start gap-2">
                <span className="text-[9px] font-bold text-text-tertiary tracking-tight uppercase">
                  {asset.code}
                </span>
                {getConditionBadge(asset.condition)}
              </div>
              
              <h5 className="text-[11px] font-bold text-text-primary group-hover:text-accent transition-colors leading-normal text-left">
                {asset.name}
              </h5>

              <div className="flex items-center justify-between text-[9px] text-text-tertiary mt-0.5 border-t border-border/40 pt-2">
                <span className="flex items-center gap-1">
                  <span>{getCategoryIcon(asset.category)}</span>
                  <span className="capitalize">{asset.category === "art" ? "Benda Seni" : asset.category}</span>
                </span>
                <span>PIC: {asset.responsiblePerson.split(" (")[0]}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
