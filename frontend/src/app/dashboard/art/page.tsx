import { Card, CardHeader, CardTitle, CardDescription, CardContent, AuthGuard } from "@/shared/components";
import { Paintbrush } from "lucide-react";

export default function ArtPage() {
  return (
    <AuthGuard allowedRoles={["SuperAdmin", "AssetManager"]}>
      <div className="flex flex-col gap-6 max-w-4xl">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-none">
            <div className="flex flex-col gap-1.5">
              <CardTitle className="text-xl flex items-center gap-2">
                <Paintbrush className="h-5 w-5 text-accent" /> Koleksi Benda Seni & Cagar Budaya
              </CardTitle>
              <CardDescription>
                Dokumentasi lukisan sejarah, patung istana, guci antik, instrumen musik tradisional, dan log preservasi.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary leading-relaxed">
              Halaman ini mendokumentasikan aset cagar budaya Istana Kepresidenan Yogyakarta. Fitur mencakup dokumentasi foto resolusi tinggi, nama seniman pencipta, dimensi fisik, taksiran nilai historis, serta rekam jejak restorasi konservator luar negeri.
            </p>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
