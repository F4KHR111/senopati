import { Card, CardHeader, CardTitle, CardDescription, CardContent, AuthGuard } from "@/shared/components";
import { Shirt } from "lucide-react";

export default function LinenPage() {
  return (
    <AuthGuard allowedRoles={["SuperAdmin", "AssetManager"]}>
      <div className="flex flex-col gap-6 max-w-4xl">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-none">
            <div className="flex flex-col gap-1.5">
              <CardTitle className="text-xl flex items-center gap-2">
                <Shirt className="h-5 w-5 text-accent" /> Siklus Pengelolaan Linen
              </CardTitle>
              <CardDescription>
                Pelacakan sprei, sarung bantal, handuk wisma tamu, status pencucian (laundry), dan penggantian linen rusak.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary leading-relaxed">
              Halaman ini memantau siklus hidup linen di lingkungan Istana Kepresidenan Yogyakarta. Pelacakan mencakup statistik siklus cuci, pelaporan kerusakan kain, rekapitulasi masuk/keluar gudang laundry, serta perencanaan penggantian stok tahunan.
            </p>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
