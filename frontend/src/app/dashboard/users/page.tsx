import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/components";
import { Users } from "lucide-react";

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-none">
          <div className="flex flex-col gap-1.5">
            <CardTitle className="text-xl flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" /> Manajemen Pengguna & Pegawai
            </CardTitle>
            <CardDescription>
              Pengaturan akun staf internal, sinkronisasi NIP pegawai, penetapan role, dan batas akses departemen.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-secondary leading-relaxed">
            Halaman ini khusus diakses oleh administrator (SuperAdmin) untuk mengontrol data user aktif. Mengaktifkan/menonaktifkan akun staf operasional, mengikat kredensial login dengan database pegawai, dan mengawasi aktivitas login.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
