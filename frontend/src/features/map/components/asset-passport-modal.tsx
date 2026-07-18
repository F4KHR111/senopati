"use client";

import { useState } from "react";
import { Asset } from "../mocks/map-data";
import { X, Calendar, User, QrCode, ClipboardList, ShieldAlert, History, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge, Button } from "@/shared/components";
import { fadeIn, scaleIn, easeTransition } from "@/lib/animations";

interface AssetPassportModalProps {
  asset: Asset | null;
  onClose: () => void;
}

export default function AssetPassportModal({ asset, onClose }: AssetPassportModalProps) {
  const [activeTab, setActiveTab] = useState<"details" | "movement" | "maintenance">("details");

  if (!asset) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.15 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Content Card */}
        <motion.div
          variants={scaleIn}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={easeTransition}
          className="w-full max-w-xl bg-bg border border-border rounded-lg shadow-xl relative overflow-hidden flex flex-col max-h-[90vh] z-10 text-left"
        >
          {/* Top Header Card Info */}
          <div className={`h-36 bg-gradient-to-br ${asset.photoColor} p-6 flex flex-col justify-between relative`}>
            {/* Visual Grid pattern overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-40 pointer-events-none" />
            
            <div className="flex justify-between items-start z-10 w-full">
              <Badge variant="secondary" className="text-white border-white/20 bg-white/10 backdrop-blur-xs uppercase text-[8px] font-bold">
                {asset.category === "art" ? "Benda Seni" : asset.category}
              </Badge>
              <button
                onClick={onClose}
                className="p-1 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="z-10 text-white flex flex-col gap-0.5">
              <span className="text-[10px] font-bold tracking-wider text-white/70 uppercase">
                {asset.code}
              </span>
              <h3 className="text-sm font-extrabold tracking-tight">{asset.name}</h3>
            </div>
          </div>

          {/* Navigation Tab Bar */}
          <div className="flex border-b border-border bg-bg-secondary px-4">
            {[
              { id: "details", label: "Informasi Utama", icon: ClipboardList },
              { id: "movement", label: "Riwayat Pergerakan", icon: History },
              { id: "maintenance", label: "Riwayat Pemeliharaan", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "details" | "movement" | "maintenance")}
                  className={`flex items-center gap-1.5 py-3 px-4 text-[10px] font-bold border-b-2 transition-all relative ${
                    activeTab === tab.id
                      ? "border-accent text-accent"
                      : "border-transparent text-text-tertiary hover:text-text-secondary"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Body Content Container */}
          <div className="p-6 overflow-y-auto flex-1 text-xs">
            {activeTab === "details" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Meta details list */}
                <div className="sm:col-span-2 flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-bold text-text-tertiary uppercase">Kondisi Aset</span>
                      <span className="font-semibold text-text-primary mt-0.5">
                        {asset.condition === "Baik" ? (
                          <span className="text-success font-bold">Baik</span>
                        ) : asset.condition === "Rusak Ringan" ? (
                          <span className="text-warning font-bold">Rusak Ringan</span>
                        ) : (
                          <span className="text-error font-bold">Rusak Berat</span>
                        )}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-bold text-text-tertiary uppercase">Tanggal Pembelian</span>
                      <span className="font-medium text-text-primary flex items-center gap-1 mt-0.5">
                        <Calendar className="h-3.5 w-3.5 text-text-tertiary" /> {asset.purchaseDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-0.5 border-t border-border pt-4">
                    <span className="text-[9px] font-bold text-text-tertiary uppercase">Penanggung Jawab (PIC)</span>
                    <span className="font-medium text-text-primary flex items-center gap-1 mt-1">
                      <User className="h-3.5 w-3.5 text-text-tertiary" /> {asset.responsiblePerson}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 border-t border-border pt-4 bg-bg-secondary/40 p-3 rounded-lg border">
                    <span className="text-[9px] font-bold text-text-tertiary uppercase flex items-center gap-1">
                      <ShieldAlert className="h-3.5 w-3.5 text-accent" /> Konstitusi Keamanan Aset
                    </span>
                    <p className="text-[10px] text-text-secondary leading-relaxed">
                      Penempatan aset fisik harus selalu dipetakan secara real-time. Jika memindahkan aset, wajib melaporkan dan memindai ulang QR Code pada konsol SENOPATI untuk memperbarui histori pergerakan.
                    </p>
                  </div>
                </div>

                {/* QR Code Column */}
                <div className="flex flex-col items-center justify-center border border-border p-4 rounded-lg bg-bg-secondary/35 text-center gap-2">
                  <div className="h-28 w-28 bg-white border border-border rounded p-1.5 flex items-center justify-center shadow-xs">
                    <QrCode className="h-24 w-24 text-black" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-text-primary">PASPOR DIGITAL</span>
                    <span className="text-[8px] text-text-tertiary leading-tight">Pindai QR fisik untuk melihat profil live.</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "movement" && (
              <div className="flex flex-col gap-3">
                {asset.movementHistory.length === 0 ? (
                  <div className="py-8 text-center text-text-tertiary flex flex-col items-center gap-1">
                    <History className="h-5 w-5" />
                    <span>Tidak ada riwayat pergerakan.</span>
                  </div>
                ) : (
                  <div className="relative border-l border-border pl-4 ml-2 flex flex-col gap-5">
                    {asset.movementHistory.map((mov) => (
                      <div key={mov.id} className="relative text-left">
                        {/* Timeline Bullet */}
                        <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent border-2 border-bg" />
                        <span className="text-[9px] font-bold text-text-tertiary">{mov.date}</span>
                        <h4 className="text-[11px] font-bold text-text-primary mt-0.5 leading-tight">
                          Dipindahkan dari {mov.oldLocation} ke {mov.newLocation}
                        </h4>
                        <p className="text-[10px] text-text-secondary mt-1 leading-normal">
                          <span className="font-semibold text-text-primary">Alasan:</span> {mov.reason}
                        </p>
                        <span className="text-[9px] text-text-tertiary block mt-1">PIC: {mov.responsibleUser}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "maintenance" && (
              <div className="flex flex-col gap-3">
                {asset.maintenanceHistory.length === 0 ? (
                  <div className="py-8 text-center text-text-tertiary flex flex-col items-center gap-1">
                    <Settings className="h-5 w-5" />
                    <span>Tidak ada riwayat pemeliharaan terdaftar.</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {asset.maintenanceHistory.map((maint) => (
                      <div key={maint.id} className="p-4 border border-border rounded-lg bg-bg-secondary/40 flex flex-col gap-2">
                        <div className="flex justify-between items-start gap-2">
                          <Badge variant="accent" className="border-accent/30 text-accent font-bold text-[8px] bg-accent/5 uppercase">
                            {maint.type}
                          </Badge>
                          <span className="text-[10px] font-bold text-text-primary">{maint.cost}</span>
                        </div>
                        <p className="text-[10px] text-text-secondary leading-normal">{maint.notes}</p>
                        <div className="flex items-center justify-between text-[9px] text-text-tertiary mt-1 border-t border-border/40 pt-2">
                          <span>Vendor: {maint.vendor}</span>
                          <span>Tanggal: {maint.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="p-4 border-t border-border flex justify-end bg-bg-secondary">
            <Button variant="outline" size="sm" onClick={onClose}>
              Tutup Paspor
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
