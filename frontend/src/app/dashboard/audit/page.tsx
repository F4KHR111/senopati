import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/components";
import { History } from "lucide-react";

export default function AuditPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-none">
          <div className="flex flex-col gap-1.5">
            <CardTitle className="text-xl flex items-center gap-2">
              <History className="h-5 w-5 text-accent" /> Audit Logs & Riwayat Aktivitas
            </CardTitle>
            <CardDescription>
              Catatan mutasi data non-editable, pelacakan histori login, pencatatan IP Address pengubah data, dan pengawasan audit trail.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-secondary leading-relaxed">
            Halaman log aktivitas sistem yang bersifat append-only dan tidak dapat diubah oleh peran apa pun. Berfungsi menjaga integritas data pemerintah dengan merekam aktivitas login, pemindahan aset penting, dan perubahan otorisasi role.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
