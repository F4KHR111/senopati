import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/components";
import { FileText } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-none">
          <div className="flex flex-col gap-1.5">
            <CardTitle className="text-xl flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent" /> Pelaporan & Ekspor Data Aset
            </CardTitle>
            <CardDescription>
              Penarikan laporan mutasi aset, rekapitulasi stock opname gedung, pencetakan berkas PDF/Excel untuk SIMAK BMN.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-secondary leading-relaxed">
            Halaman ini digunakan untuk menyusun laporan aset berstandar kedinasan. Pengguna dapat memfilter berdasarkan kategori barang, nama penanggung jawab, ataupun status kelayakan fisik untuk diekspor menjadi format Excel atau dokumen PDF yang ditandatangani.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
