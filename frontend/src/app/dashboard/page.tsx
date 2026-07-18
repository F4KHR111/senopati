"use client";

import { useState } from "react";
import { useAuthStore, useToastStore } from "@/stores";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
} from "@/shared/components";
import {
  Shield,
  Car,
  Paintbrush,
  Laptop,
  Shirt,
  Package,
  Map,
  TrendingUp,
  History,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// Sample recent activities
const recentActivities = [
  {
    id: "act-1",
    user: "Supriyadi",
    action: "Peminjaman Toyota Camry Hybrid #KND-001 disetujui",
    time: "20 menit yang lalu",
    icon: <Car className="h-4 w-4 text-accent" />,
  },
  {
    id: "act-2",
    user: "Rian Hidayat",
    action: "Pemindahan Lukisan Penangkapan Diponegoro #ART-009 ke Ruang Utama",
    time: "2 jam yang lalu",
    icon: <Paintbrush className="h-4 w-4 text-info" />,
  },
  {
    id: "act-3",
    user: "Sri Wahyuni",
    action: "Stock Opname Gedung Agung Yogyakarta selesai",
    time: "1 hari yang lalu",
    icon: <CheckCircle className="h-4 w-4 text-success" />,
  },
  {
    id: "act-4",
    user: "Sistem",
    action: "Alert: Stok Kertas HVS A4 menipis di bawah reorder level",
    time: "2 hari yang lalu",
    icon: <AlertTriangle className="h-4 w-4 text-error" />,
  },
];

// Sample chart data representing monthly asset registration trend
const chartData = [
  { month: "Jan", val: 45 },
  { month: "Feb", val: 65 },
  { month: "Mar", val: 55 },
  { month: "Apr", val: 85 },
  { month: "Mei", val: 70 },
  { month: "Jun", val: 110 },
  { month: "Jul", val: 95 },
];

export default function DashboardHomePage() {
  const { user } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 11) return "Selamat Pagi";
    if (hours < 15) return "Selamat Siang";
    if (hours < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  const handleQuickTest = () => {
    addToast({
      type: "success",
      title: "Data Sinkron",
      description: "Metrik dashboard diperbarui dari server mock.",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-bg border border-border p-6 rounded-lg shadow-xs"
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            {getGreeting()}, {user?.name || "Staf Setneg"}!
          </h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            Anda terdaftar sebagai <span className="font-semibold text-accent">{user?.position}</span> pada{" "}
            <span className="font-semibold text-text-primary">{user?.departmentName}</span>.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleQuickTest} className="sm:self-center shrink-0">
          Sinkronisasi Metrik
        </Button>
      </motion.div>

      {/* 2. Statistical Counters (Grid of 4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Aset Terdata", val: "1.254", desc: "Semua modul aset", icon: Shield, color: "text-accent bg-accent/10 border-accent/20" },
          { title: "Kendaraan Aktif", val: "24", desc: "Sedang dipinjam staf", icon: Car, color: "text-info bg-info/10 border-info/20" },
          { title: "Dalam Pemeliharaan", val: "8 Aset", desc: "Servis berkala / KIR", icon: AlertTriangle, color: "text-warning bg-warning/10 border-warning/20" },
          { title: "Persediaan Kritis", val: "3 Barang", desc: "Di bawah limit stok", icon: Package, color: "text-error bg-error/10 border-error/20" },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 border-none">
                  <span className="text-xs font-semibold text-text-secondary">{item.title}</span>
                  <div className={`p-1.5 rounded-lg border ${item.color}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xl font-bold text-text-primary">{item.val}</div>
                  <p className="text-[10px] text-text-tertiary mt-0.5">{item.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* 3. Main Operational Sections (Chart & Recent Activities) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Interactive Chart (Government / Asset Activity Trend) */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-none">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4.5 w-4.5 text-accent" /> Tren Registrasi Aset Baru
            </CardTitle>
            <CardDescription>
              Jumlah item aset terdaftar per bulan di Istana Kepresidenan Yogyakarta.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-56 flex flex-col justify-end">
            <div className="w-full h-44 flex items-end justify-between px-2 relative border-b border-border">
              {chartData.map((bar, idx) => {
                const maxVal = 120;
                const barHeight = `${(bar.val / maxVal) * 100}%`;
                const isHovered = hoveredBar === idx;

                return (
                  <div
                    key={bar.month}
                    className="flex flex-col items-center flex-1 group cursor-pointer relative"
                    onMouseEnter={() => setHoveredBar(idx)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute bottom-full mb-2 bg-primary text-text-inverse text-[10px] py-1 px-2 rounded shadow-md z-dropdown font-semibold pointer-events-none">
                        {bar.val} Aset
                      </div>
                    )}
                    {/* Bar Pillar */}
                    <div className="w-6 sm:w-8 bg-accent/20 hover:bg-accent rounded-t transition-all duration-200" style={{ height: barHeight }}>
                      <div className="h-full w-full bg-gradient-to-t from-transparent to-accent opacity-0 group-hover:opacity-40 transition-opacity rounded-t" />
                    </div>
                    {/* Label */}
                    <span className="text-[10px] text-text-tertiary mt-2">{bar.month}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Logs */}
        <Card>
          <CardHeader className="border-none">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-accent" /> Log Aktivitas Terkini
            </CardTitle>
            <CardDescription>Mutasi lokasi dan riwayat peminjaman aset.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col divide-y divide-border">
              {recentActivities.map((act) => (
                <div key={act.id} className="p-4 flex gap-3 text-left">
                  <div className="shrink-0 h-7 w-7 rounded-full bg-bg-secondary border border-border flex items-center justify-center">
                    {act.icon}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-text-primary leading-tight font-medium">
                      {act.action}
                    </span>
                    <div className="flex items-center gap-1.5 text-[9px] text-text-tertiary">
                      <span>{act.user}</span>
                      <span>•</span>
                      <span>{act.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Quick Access Panel (Feature Shortcuts) */}
      <Card>
        <CardHeader className="border-none pb-4">
          <CardTitle className="text-sm flex items-center gap-2">
            <Map className="h-4.5 w-4.5 text-accent" /> Akses Cepat Modul Utama
          </CardTitle>
          <CardDescription>Lompat ke halaman modul operasional yang Anda kelola.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {[
            { label: "Interactive Map", href: "/dashboard/map", icon: Map, color: "text-accent" },
            { label: "Kendaraan Dinas", href: "/dashboard/vehicle", icon: Car, color: "text-info" },
            { label: "Benda Seni", href: "/dashboard/art", icon: Paintbrush, color: "text-success" },
            { label: "Inventaris", href: "/dashboard/inventory", icon: Laptop, color: "text-warning" },
            { label: "Linen Guest House", href: "/dashboard/linen", icon: Shirt, color: "text-indigo-500" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.label} href={item.href} className="group">
                <div className="flex flex-col items-center justify-center p-4 border border-border rounded-lg bg-bg hover:border-border-hover hover:bg-bg-secondary/40 shadow-xs hover:shadow-sm transition-all duration-200 text-center gap-2">
                  <div className={`p-2 rounded-full bg-bg-secondary group-hover:bg-white group-hover:scale-105 border border-border transition-all ${item.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-text-secondary group-hover:text-text-primary transition-colors">
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
