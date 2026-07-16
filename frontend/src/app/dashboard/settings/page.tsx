import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/components";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-none">
          <div className="flex flex-col gap-1.5">
            <CardTitle className="text-xl flex items-center gap-2">
              <Settings className="h-5 w-5 text-accent" /> Pengaturan Sistem (Configuration)
            </CardTitle>
            <CardDescription>
              Konfigurasi parameter sistem, backup database MySQL, driver file storage, dan mapping gedung/ruangan.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-secondary leading-relaxed">
            Halaman konfigurasi server global SENOPATI. Mengatur batas minimum stok, backup berkas lampiran secara berkala, konfigurasi SMTP pengiriman email peringatan servis, serta inisialisasi awal kode gedung Istana Kepresidenan.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
