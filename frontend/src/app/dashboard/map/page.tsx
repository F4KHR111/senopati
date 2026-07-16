import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/components";
import { Map } from "lucide-react";

export default function MapPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-none">
          <div className="flex flex-col gap-1.5">
            <CardTitle className="text-xl flex items-center gap-2">
              <Map className="h-5 w-5 text-accent" /> Interactive Map Engine
            </CardTitle>
            <CardDescription>
              Navigasi visual aset berbasis denah isometrik gedung, lantai, dan pemetaan ruangan fisik Istana.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-secondary leading-relaxed">
            Ini merupakan fitur utama visualisasi SENOPATI (akan dikembangkan penuh pada Phase 6). Memungkinkan pencarian lokasi aset secara instan dengan mengklik ruangan pada peta 2.5D, menyoroti penempatan barang berharga, dan mempermudah stock opname auditor.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
