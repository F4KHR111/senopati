import { Card, CardHeader, CardTitle, CardDescription, CardContent, AuthGuard } from "@/shared/components";
import { Laptop } from "lucide-react";

export default function InventoryPage() {
  return (
    <AuthGuard allowedRoles={["SuperAdmin", "AssetManager"]}>
      <div className="flex flex-col gap-6 max-w-4xl">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-none">
            <div className="flex flex-col gap-1.5">
              <CardTitle className="text-xl flex items-center gap-2">
                <Laptop className="h-5 w-5 text-accent" /> Manajemen Inventaris Kantor
              </CardTitle>
              <CardDescription>
                Pengelolaan aset elektronik, mebel, perlengkapan ruangan, penanggung jawab (PIC), dan pemindahan barang.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary leading-relaxed">
              Halaman ini digunakan untuk mengelola data inventaris yang dapat digunakan kembali. Pencatatan mencakup barcode / QR Code aset, masa garansi barang, depresiasi nilai aset, dan status operasional (baik, rusak, diservis).
            </p>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
