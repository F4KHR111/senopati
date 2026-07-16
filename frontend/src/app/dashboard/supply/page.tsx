import { Card, CardHeader, CardTitle, CardDescription, CardContent, AuthGuard } from "@/shared/components";
import { Package } from "lucide-react";

export default function SupplyPage() {
  return (
    <AuthGuard allowedRoles={["SuperAdmin", "AssetManager"]}>
      <div className="flex flex-col gap-6 max-w-4xl">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-none">
            <div className="flex flex-col gap-1.5">
              <CardTitle className="text-xl flex items-center gap-2">
                <Package className="h-5 w-5 text-accent" /> Persediaan & Alat Tulis Kantor (ATK)
              </CardTitle>
              <CardDescription>
                Stok barang habis pakai, tinta printer, bahan pembersih wisma, dan formulir reorder stok minimum.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary leading-relaxed">
              Halaman ini membantu mengelola logistik barang habis pakai wisma dan kantor. Dilengkapi kalkulator stok otomatis, alert batas stok minimum (reorder level), rekap mutasi barang masuk/keluar, dan monitoring tanggal kedaluwarsa bahan kimia.
            </p>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
