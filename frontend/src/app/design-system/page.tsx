"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  Switch,
  Badge,
  Avatar,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Modal,
  Dialog,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Pagination,
  Tabs,
  Dropdown,
  Search,
  Skeleton,
  EmptyState,
} from "@/shared/components";
import { useToastStore } from "@/stores";
import { Info, AlertTriangle, CheckCircle, MoreVertical, Trash, Edit, Star } from "lucide-react";

export default function DesignSystemShowcase() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogLoading, setIsDialogLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("tab-1");
  const [searchVal, setSearchVal] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [checkboxVal, setCheckboxVal] = useState(false);
  const [switchVal, setSwitchVal] = useState(false);

  const addToast = useToastStore((state) => state.addToast);

  const triggerDialogConfirm = () => {
    setIsDialogLoading(true);
    setTimeout(() => {
      setIsDialogLoading(false);
      setIsDialogOpen(false);
      addToast({
        type: "success",
        title: "Aksi Berhasil",
        description: "Data berhasil dihapus secara permanen.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-bg-secondary py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col gap-2 border-b border-border pb-6">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-accent animate-pulse" />
            <h1 className="text-3xl font-bold tracking-tight text-primary">SENOPATI Design System</h1>
          </div>
          <p className="text-sm text-text-secondary">
            Dokumentasi komponen reusable dan style guide interaktif proyek SENOPATI.
          </p>
        </div>

        {/* Buttons & Loading */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons & Spinners</CardTitle>
            <CardDescription>Komponen tombol dengan berbagai variasi, ukuran, dan status loading.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost Link</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="primary" isLoading>
              Memuat...
            </Button>
            <Button variant="secondary" disabled>
              Disabled
            </Button>
          </CardContent>
        </Card>

        {/* Form Inputs */}
        <Card>
          <CardHeader>
            <CardTitle>Form Inputs & Selects</CardTitle>
            <CardDescription>Input teks, textarea, dropdown select, checkbox, dan switch toggle.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <Input label="Nama Lengkap" placeholder="Masukkan nama Anda..." hint="Nama sesuai kartu identitas" />
              <Input label="Email" placeholder="nama@email.com" error="Format email tidak valid" />
              <Textarea label="Deskripsi Aset" placeholder="Detail deskripsi kondisi aset..." />
            </div>
            <div className="flex flex-col gap-5">
              <Select
                label="Kategori Aset"
                placeholder="Pilih Kategori"
                options={[
                  { value: "vehicle", label: "Kendaraan Dinas" },
                  { value: "art", label: "Koleksi Seni" },
                  { value: "inventory", label: "Inventaris Kantor" },
                ]}
              />
              <div className="flex flex-col gap-3 mt-2">
                <Checkbox
                  label="Saya menyetujui seluruh ketentuan peminjaman aset"
                  checked={checkboxVal}
                  onChange={(e) => setCheckboxVal(e.target.checked)}
                />
                <Switch
                  label="Aktifkan notifikasi pengingat via Email/WA"
                  checked={switchVal}
                  onChange={(e) => setSwitchVal(e.target.checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badges, Avatars & Dropdowns */}
        <Card>
          <CardHeader>
            <CardTitle>Badges, Avatars & Dropdowns</CardTitle>
            <CardDescription>Komponen badge status, avatar profil, dan menu dropdown interaktif.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-xs font-semibold text-text-secondary mr-2">Badges:</span>
              <Badge variant="primary">Aktif</Badge>
              <Badge variant="secondary">Draft</Badge>
              <Badge variant="success">Normal</Badge>
              <Badge variant="warning">Perbaikan</Badge>
              <Badge variant="error">Rusak Berat</Badge>
              <Badge variant="info">Dipinjam</Badge>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <span className="text-xs font-semibold text-text-secondary">Avatars:</span>
              <Avatar src="" alt="Fakhrul" fallback="FK" size="sm" />
              <Avatar src="" alt="Fakhrul" fallback="FK" size="md" />
              <Avatar src="" alt="Fakhrul" fallback="FK" size="lg" />
              <Avatar src="" alt="Fakhrul" fallback="FK" size="xl" />
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-text-secondary mr-2">Dropdown Action:</span>
              <Dropdown
                trigger={
                  <Button variant="secondary" size="sm" className="gap-1">
                    Pilihan Aksi <MoreVertical className="h-4 w-4" />
                  </Button>
                }
                items={[
                  { id: "edit", label: "Edit Aset", icon: <Edit className="h-3.5 w-3.5" />, onClick: () => alert("Edit clicked") },
                  { id: "fav", label: "Jadikan Favorit", icon: <Star className="h-3.5 w-3.5" />, onClick: () => alert("Fav clicked") },
                  { id: "delete", label: "Hapus Aset", icon: <Trash className="h-3.5 w-3.5" />, onClick: () => setIsDialogOpen(true), danger: true },
                ]}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs & Search */}
        <Card>
          <CardHeader>
            <CardTitle>Navigation & Search Filters</CardTitle>
            <CardDescription>Tabs dengan slide indicators dan komponen pencarian otomatis dengan debounce.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <Tabs
              activeTab={activeTab}
              onChange={setActiveTab}
              tabs={[
                { id: "tab-1", label: "Ringkasan" },
                { id: "tab-2", label: "Riwayat Pergerakan" },
                { id: "tab-3", label: "Pemeliharaan" },
              ]}
            />
            <div className="flex flex-col gap-2">
              <Search onSearch={setSearchVal} placeholder="Cari kode aset, nama, atau lokasi..." />
              {searchVal && (
                <p className="text-xs text-text-tertiary">
                  Hasil pencarian ter-debounce untuk: <span className="font-semibold text-text-primary">"{searchVal}"</span>
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Modals & Toasts */}
        <Card>
          <CardHeader>
            <CardTitle>Overlays: Modals, Dialogs & Toasts</CardTitle>
            <CardDescription>Uji coba pemicu alert toast, dialog konfirmasi modal, dan popup detail.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              Buka Modal Detail
            </Button>
            <Button variant="danger" onClick={() => setIsDialogOpen(true)}>
              Buka Dialog Hapus (Danger)
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                addToast({
                  type: "success",
                  title: "Data Disimpan",
                  description: "Perubahan aset berhasil direkam ke riwayat.",
                })
              }
            >
              Toast Sukses
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                addToast({
                  type: "error",
                  title: "Gagal Mengunggah",
                  description: "Format file gambar tidak didukung (max 5MB).",
                })
              }
            >
              Toast Error
            </Button>
          </CardContent>
        </Card>

        {/* Data Presentation (Table, Pagination, Empty State, Skeletons) */}
        <Card>
          <CardHeader>
            <CardTitle>Data Tables & Loading States</CardTitle>
            <CardDescription>Struktur tabel data dinamis, kerangka skeleton loading, dan empty state.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <Table striped>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode Aset</TableHead>
                  <TableHead>Nama Aset</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Kondisi</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono">KND-001</TableCell>
                  <TableCell>Toyota Camry Hybrid (Dinas Kepala)</TableCell>
                  <TableCell>Kendaraan</TableCell>
                  <TableCell>
                    <Badge variant="success">Baik</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="primary">Aktif</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono">ART-009</TableCell>
                  <TableCell>Lukisan Penangkapan Pangeran Diponegoro</TableCell>
                  <TableCell>Benda Seni</TableCell>
                  <TableCell>
                    <Badge variant="success">Sangat Baik</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="info">Dipajang</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono">INV-102</TableCell>
                  <TableCell>AC Split Daikin 2 PK (Ruang Rapat A)</TableCell>
                  <TableCell>Inventaris</TableCell>
                  <TableCell>
                    <Badge variant="warning">Rusak Ringan</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="warning">Maintenance</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Pagination currentPage={currentPage} totalPages={10} onPageChange={setCurrentPage} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {/* Skeleton Showcase */}
              <div className="flex flex-col gap-4 p-5 border border-border rounded-lg bg-bg">
                <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">Skeleton Loading Placeholder</h4>
                <div className="flex items-center gap-3">
                  <Skeleton variant="circle" className="h-10 w-10" />
                  <div className="flex-1 flex flex-col gap-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-20 w-full" />
              </div>

              {/* Empty State Showcase */}
              <EmptyState
                title="Tidak Ada Riwayat Pemeliharaan"
                description="Aset ini belum pernah masuk masa perbaikan atau servis berkala sejak didata."
                action={<Button variant="secondary" size="sm">Jadwalkan Servis</Button>}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal Showcase */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Detail Transaksi Aset #KND-001">
        <div className="flex flex-col gap-4">
          <p>Berikut rincian spesifikasi aset terdaftar di bawah pengawasan Sekretariat Negara:</p>
          <div className="grid grid-cols-2 gap-4 border border-border rounded-lg p-4 bg-bg-secondary/40">
            <div>
              <span className="text-[10px] text-text-tertiary uppercase font-semibold">Merk / Model</span>
              <p className="text-sm font-medium text-text-primary">Toyota Camry Hybrid 2.5</p>
            </div>
            <div>
              <span className="text-[10px] text-text-tertiary uppercase font-semibold">Tahun Pengadaan</span>
              <p className="text-sm font-medium text-text-primary">2023</p>
            </div>
            <div>
              <span className="text-[10px] text-text-tertiary uppercase font-semibold">Nilai Aset (Sakti BMN)</span>
              <p className="text-sm font-medium text-text-primary">Rp 850.000.000</p>
            </div>
            <div>
              <span className="text-[10px] text-text-tertiary uppercase font-semibold">Penanggung Jawab</span>
              <p className="text-sm font-medium text-text-primary">Supriyadi (NIP. 1988...)</p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-border">
            <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Kembali
            </Button>
            <Button variant="primary" size="sm" onClick={() => {
              setIsModalOpen(false);
              addToast({
                type: "info",
                title: "Aksi Terbaca",
                description: "Membuka formulir edit aset...",
              });
            }}>
              Edit Informasi
            </Button>
          </div>
        </div>
      </Modal>

      {/* Dialog Confirm Showcase */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Hapus Aset Secara Permanen?"
        description="Aksi ini tidak dapat dibatalkan. Seluruh riwayat mutasi lokasi, data detail penugasan, dan dokumen terlampir pada aset KND-001 akan dihapus permanen dari basis data utama."
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        onConfirm={triggerDialogConfirm}
        type="danger"
        isLoading={isDialogLoading}
      />
    </div>
  );
}
