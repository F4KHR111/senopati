"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, Info, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { slideUp, easeTransition } from "@/lib/animations";

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  isRead: boolean;
  type: "info" | "warning";
}

export function NotificationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "1",
      title: "Jadwal Servis Kir",
      desc: "Masa berlaku KIR kendaraan KND-012 segera habis dalam 7 hari.",
      time: "2 jam yang lalu",
      isRead: false,
      type: "warning",
    },
    {
      id: "2",
      title: "Audit Selesai",
      desc: "Sesi Stock Opname Gedung Agung Yogyakarta telah rampung.",
      time: "1 hari yang lalu",
      isRead: true,
      type: "info",
    },
    {
      id: "3",
      title: "Stok Menipis",
      desc: "Jumlah persediaan Kertas A4 Sinar Dunia tersisa 2 rim (Min: 5).",
      time: "2 hari yang lalu",
      isRead: false,
      type: "warning",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex items-center justify-center h-9 w-9 rounded-full hover:bg-bg-secondary border border-border text-text-secondary hover:text-text-primary transition-colors focus:outline-none cursor-pointer"
        aria-label="Notifikasi"
      >
        <Bell className="h-4.5 w-4.5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={slideUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={easeTransition}
            className="absolute right-0 mt-2 w-80 rounded-md border border-border bg-bg shadow-lg overflow-hidden z-dropdown py-1"
          >
            {/* Header notifications */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-bg-secondary/40">
              <span className="text-xs font-semibold text-text-primary">Notifikasi</span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[10px] font-semibold text-accent hover:text-accent-dark flex items-center gap-1 cursor-pointer"
                >
                  <Check className="h-3 w-3" /> Tandai semua dibaca
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-64 overflow-y-auto divide-y divide-border">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-xs text-text-tertiary">Tidak ada notifikasi.</div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "p-3.5 flex gap-3 transition-colors text-left",
                      !item.isRead ? "bg-bg-secondary/30" : "opacity-75"
                    )}
                  >
                    <div className="shrink-0 mt-0.5">
                      {item.type === "warning" ? (
                        <AlertTriangle className="h-4 w-4 text-warning" />
                      ) : (
                        <Info className="h-4 w-4 text-info" />
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold text-text-primary leading-tight">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-text-secondary leading-relaxed">
                        {item.desc}
                      </span>
                      <span className="text-[9px] text-text-tertiary mt-0.5">{item.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
