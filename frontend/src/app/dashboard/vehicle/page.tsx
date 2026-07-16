import { Card, CardHeader, CardTitle, CardDescription, CardContent, AuthGuard } from "@/shared/components";
import { Car } from "lucide-react";

export default function VehiclePage() {
  return (
    <AuthGuard allowedRoles={["SuperAdmin", "AssetManager"]}>
      <div className="flex flex-col gap-6 max-w-4xl">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-none">
            <div className="flex flex-col gap-1.5">
              <CardTitle className="text-xl flex items-center gap-2">
                <Car className="h-5 w-5 text-accent" /> Manajemen Kendaraan Dinas
              </CardTitle>
              <CardDescription>
                Pemantauan mobil/motor operasional, jadwal KIR, servis berkala, dan penugasan driver.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary leading-relaxed">
              Halaman ini digunakan untuk mendata seluruh kendaraan dinas internal Sekretariat Negara. Fitur mencakup histori peminjaman, grafik konsumsi bahan bakar, pengingat pajak STNK, dan pengajuan jadwal servis rutin vendor.
            </p>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
