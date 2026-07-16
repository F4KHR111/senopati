"use client";

import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components";
import { useToastStore } from "@/stores";
import { Shield, Sparkles } from "lucide-react";

export default function DashboardHomePage() {
  const addToast = useToastStore((state) => state.addToast);

  const triggerToast = () => {
    addToast({
      type: "info",
      title: "Uji Coba Hub",
      description: "Layout dashboard SENOPATI terverifikasi berjalan lancar.",
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Intro Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-none">
          <div className="flex flex-col gap-1.5">
            <CardTitle className="text-xl flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" /> Selamat Datang di SENOPATI
            </CardTitle>
            <CardDescription>
              Sistem Enterprise Nasional Operasional Pengelolaan Aset Terintegrasi
            </CardDescription>
          </div>
          <div className="h-12 w-12 rounded-xl bg-bg-secondary border border-border flex items-center justify-center shrink-0">
            <Shield className="h-6 w-6 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-text-secondary leading-relaxed">
            Layout dashboard dan navigasi modular proyek SENOPATI telah selesai dibangun. Gunakan menu sidebar untuk berpindah modul
            serta meninjau responsivitas layout pada layar handphone (mobile) atau desktop.
          </p>
          <div className="flex items-center gap-3">
            <Button variant="primary" size="sm" onClick={triggerToast}>
              Uji Koneksi Notifikasi
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
