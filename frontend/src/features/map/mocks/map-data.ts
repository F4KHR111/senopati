export interface MovementHistoryItem {
  id: string;
  oldLocation: string;
  newLocation: string;
  date: string;
  responsibleUser: string;
  reason: string;
  notes?: string;
}

export interface MaintenanceHistoryItem {
  id: string;
  date: string;
  type: string;
  vendor: string;
  cost: string;
  notes: string;
}

export interface Asset {
  id: string;
  code: string;
  name: string;
  category: "vehicle" | "inventory" | "linen" | "supply" | "art";
  condition: "Baik" | "Rusak Ringan" | "Rusak Berat";
  responsiblePerson: string;
  purchaseDate: string;
  photoColor: string; // Dynamic visual gradient helper
  qrCodeUrl: string;
  movementHistory: MovementHistoryItem[];
  maintenanceHistory: MaintenanceHistoryItem[];
}

export interface Room {
  id: string;
  name: string;
  occupancy: number;
  status: "Optimal" | "Kapasitas Penuh" | "Pemeliharaan";
  svgPolygonPoints: string;
  labelX: number;
  labelY: number;
  assets: Asset[];
}

export interface Floor {
  id: string;
  name: string;
  svgStackY: number; // Y offset when stacked in 3D Isometric View
  rooms: Room[];
}

export interface Building {
  id: string;
  name: string;
  description: string;
  floorsCount: number;
  totalAssets: number;
  floors: Floor[];
}

export interface Area {
  id: string;
  name: string;
  description: string;
  buildings: Building[];
}

// Global Mock Database
export const mockArea: Area = {
  id: "area-yogya",
  name: "Gedung Agung Yogyakarta",
  description: "Istana Kepresidenan Republik Indonesia, Yogyakarta",
  buildings: [
    {
      id: "building-agung",
      name: "Gedung Utama Agung",
      description: "Gedung utama untuk resepsi kenegaraan dan kediaman presiden.",
      floorsCount: 2,
      totalAssets: 48,
      floors: [
        {
          id: "floor-1",
          name: "Lantai 1",
          svgStackY: 160,
          rooms: [
            {
              id: "room-101",
              name: "Ruang Rapat Utama (Garuda)",
              occupancy: 65,
              status: "Optimal",
              svgPolygonPoints: "200,80 340,150 200,220 60,150",
              labelX: 200,
              labelY: 150,
              assets: [
                {
                  id: "asset-art-01",
                  code: "ART-GDA-001",
                  name: "Lukisan Penangkapan Diponegoro (Repro Resmi)",
                  category: "art",
                  condition: "Baik",
                  responsiblePerson: "Supriyadi (Super Admin)",
                  purchaseDate: "12 Mar 2021",
                  photoColor: "from-amber-600 to-amber-950",
                  qrCodeUrl: "https://senopati.setneg.go.id/passport/art-gda-001",
                  movementHistory: [
                    {
                      id: "mov-1",
                      oldLocation: "Gudang Utama",
                      newLocation: "Ruang Rapat Utama (Garuda)",
                      date: "14 Jun 2024",
                      responsibleUser: "Supriyadi",
                      reason: "Penempatan pameran kenegaraan",
                    },
                  ],
                  maintenanceHistory: [
                    {
                      id: "maint-1",
                      date: "10 Jan 2025",
                      type: "Konservasi Khusus",
                      vendor: "Balai Pelestarian Nilai Budaya Yogya",
                      cost: "Rp 15.000.000",
                      notes: "Restorasi bingkai kayu jati prada emas dan pembersihan debu kanvas.",
                    },
                  ],
                },
                {
                  id: "asset-inv-01",
                  code: "INV-ELK-012",
                  name: "Smart Board Interactive TV 86 Inch",
                  category: "inventory",
                  condition: "Baik",
                  responsiblePerson: "Rian Hidayat (Asset Manager)",
                  purchaseDate: "10 Feb 2023",
                  photoColor: "from-blue-600 to-slate-900",
                  qrCodeUrl: "https://senopati.setneg.go.id/passport/inv-elk-012",
                  movementHistory: [],
                  maintenanceHistory: [
                    {
                      id: "maint-2",
                      date: "15 Sep 2024",
                      type: "Pengecekan Rutin",
                      vendor: "PT Samsung Electronics Indonesia",
                      cost: "Rp 500.000",
                      notes: "Pembaruan firmware OS dan kalibrasi layar sentuh.",
                    },
                  ],
                },
                {
                  id: "asset-sup-01",
                  code: "SUP-ATK-302",
                  name: "Paket Kertas HVS A4 80g (20 Rim)",
                  category: "supply",
                  condition: "Baik",
                  responsiblePerson: "Indah Rahmawati (Staf Logistik)",
                  purchaseDate: "05 Jul 2026",
                  photoColor: "from-green-500 to-green-700",
                  qrCodeUrl: "https://senopati.setneg.go.id/passport/sup-atk-302",
                  movementHistory: [],
                  maintenanceHistory: [],
                },
              ],
            },
            {
              id: "room-102",
              name: "Ruang Kerja Kepala Istana",
              occupancy: 45,
              status: "Optimal",
              svgPolygonPoints: "360,160 500,230 360,300 220,230",
              labelX: 360,
              labelY: 230,
              assets: [
                {
                  id: "asset-inv-02",
                  code: "INV-FUR-088",
                  name: "Meja Kerja Kayu Jati Ukir Jepara",
                  category: "inventory",
                  condition: "Baik",
                  responsiblePerson: "Drs. H. Heru Budi (Kepala Istana)",
                  purchaseDate: "18 Aug 2019",
                  photoColor: "from-amber-800 to-amber-950",
                  qrCodeUrl: "https://senopati.setneg.go.id/passport/inv-fur-088",
                  movementHistory: [
                    {
                      id: "mov-2",
                      oldLocation: "Gedung Delegasi B",
                      newLocation: "Ruang Kerja Kepala Istana",
                      date: "20 Aug 2019",
                      responsibleUser: "Supriyadi",
                      reason: "Inventarisasi pejabat baru",
                    },
                  ],
                  maintenanceHistory: [],
                },
                {
                  id: "asset-inv-03",
                  code: "INV-ELK-109",
                  name: "Apple iMac 24 Inch M3 16GB",
                  category: "inventory",
                  condition: "Baik",
                  responsiblePerson: "Siti Rahma (Sekretaris Kepala Istana)",
                  purchaseDate: "12 Dec 2023",
                  photoColor: "from-sky-400 to-indigo-900",
                  qrCodeUrl: "https://senopati.setneg.go.id/passport/inv-elk-109",
                  movementHistory: [],
                  maintenanceHistory: [],
                },
              ],
            },
            {
              id: "room-103",
              name: "Gudang Logistik & Persediaan",
              occupancy: 95,
              status: "Kapasitas Penuh",
              svgPolygonPoints: "200,240 340,310 200,380 60,310",
              labelX: 200,
              labelY: 310,
              assets: [
                {
                  id: "asset-sup-02",
                  code: "SUP-TKN-005",
                  name: "Toner Printer HP Laserjet Enterprise M506 (5 Pcs)",
                  category: "supply",
                  condition: "Baik",
                  responsiblePerson: "Indah Rahmawati (Staf Logistik)",
                  purchaseDate: "01 Jul 2026",
                  photoColor: "from-gray-700 to-black",
                  qrCodeUrl: "https://senopati.setneg.go.id/passport/sup-tkn-005",
                  movementHistory: [],
                  maintenanceHistory: [],
                },
                {
                  id: "asset-lin-01",
                  code: "LIN-BED-009",
                  name: "Set Linen Bed Sheet Royal VIP Suite (12 Pcs)",
                  category: "linen",
                  condition: "Baik",
                  responsiblePerson: "Agus Santoso (Housekeeping)",
                  purchaseDate: "14 Feb 2025",
                  photoColor: "from-teal-600 to-indigo-950",
                  qrCodeUrl: "https://senopati.setneg.go.id/passport/lin-bed-009",
                  movementHistory: [
                    {
                      id: "mov-3",
                      oldLocation: "Ruang Laundry",
                      newLocation: "Gudang Logistik",
                      date: "12 May 2026",
                      responsibleUser: "Agus Santoso",
                      reason: "Penyimpanan cadangan pasca laundry",
                    },
                  ],
                  maintenanceHistory: [
                    {
                      id: "maint-3",
                      date: "11 May 2026",
                      type: "Pembersihan Khusus / Cuci",
                      vendor: "Sari Laundry Istana",
                      cost: "Rp 120.000",
                      notes: "Dry cleaning sterilisasi linen VIP.",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "floor-2",
          name: "Lantai 2",
          svgStackY: 50,
          rooms: [
            {
              id: "room-201",
              name: "Kamar Tidur Utama Presiden (VVIP)",
              occupancy: 30,
              status: "Optimal",
              svgPolygonPoints: "200,80 340,150 200,220 60,150",
              labelX: 200,
              labelY: 150,
              assets: [
                {
                  id: "asset-lin-02",
                  code: "LIN-BED-011",
                  name: "Sprei Kasur Sutra Emas VVIP",
                  category: "linen",
                  condition: "Baik",
                  responsiblePerson: "Agus Santoso (Housekeeping)",
                  purchaseDate: "10 Jan 2026",
                  photoColor: "from-yellow-600 to-yellow-900",
                  qrCodeUrl: "https://senopati.setneg.go.id/passport/lin-bed-011",
                  movementHistory: [],
                  maintenanceHistory: [],
                },
                {
                  id: "asset-art-02",
                  code: "ART-KTP-002",
                  name: "Patung Perunggu Garuda Wisnu Kencana Mini",
                  category: "art",
                  condition: "Baik",
                  responsiblePerson: "Supriyadi (Super Admin)",
                  purchaseDate: "12 May 2022",
                  photoColor: "from-yellow-800 to-stone-900",
                  qrCodeUrl: "https://senopati.setneg.go.id/passport/art-ktp-002",
                  movementHistory: [],
                  maintenanceHistory: [],
                },
              ],
            },
            {
              id: "room-202",
              name: "Ruang Keluarga & Santai Kepresidenan",
              occupancy: 50,
              status: "Optimal",
              svgPolygonPoints: "360,160 500,230 360,300 220,230",
              labelX: 360,
              labelY: 230,
              assets: [
                {
                  id: "asset-inv-04",
                  code: "INV-FUR-112",
                  name: "Sofa Set Kulit Chesterfield Imperial",
                  category: "inventory",
                  condition: "Baik",
                  responsiblePerson: "Agus Santoso (Housekeeping)",
                  purchaseDate: "05 Mar 2024",
                  photoColor: "from-amber-950 to-stone-950",
                  qrCodeUrl: "https://senopati.setneg.go.id/passport/inv-fur-112",
                  movementHistory: [],
                  maintenanceHistory: [],
                },
              ],
            },
            {
              id: "room-203",
              name: "Ruang Server & Kontrol IoT",
              occupancy: 20,
              status: "Pemeliharaan",
              svgPolygonPoints: "200,240 340,310 200,380 60,310",
              labelX: 200,
              labelY: 310,
              assets: [
                {
                  id: "asset-inv-05",
                  code: "INV-ELK-504",
                  name: "Server Rack Dell PowerEdge R760",
                  category: "inventory",
                  condition: "Rusak Ringan",
                  responsiblePerson: "Bambang Tri (Operator IT)",
                  purchaseDate: "11 Nov 2024",
                  photoColor: "from-slate-700 to-black",
                  qrCodeUrl: "https://senopati.setneg.go.id/passport/inv-elk-504",
                  movementHistory: [],
                  maintenanceHistory: [
                    {
                      id: "maint-4",
                      date: "14 Jul 2026",
                      type: "Perbaikan Modul PSU",
                      vendor: "Dell Indonesia Authorized Partner",
                      cost: "Rp 4.500.000",
                      notes: "Mengganti Power Supply Unit redundant yang mengalami kegagalan tegangan.",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "building-delegasi",
      name: "Wisma Negara Delegasi",
      description: "Gedung penginapan untuk delegasi dan menteri tamu negara.",
      floorsCount: 1,
      totalAssets: 18,
      floors: [
        {
          id: "floor-d1",
          name: "Lantai 1",
          svgStackY: 160,
          rooms: [
            {
              id: "room-d101",
              name: "Suite VIP Menteri",
              occupancy: 40,
              status: "Optimal",
              svgPolygonPoints: "200,80 340,150 200,220 60,150",
              labelX: 200,
              labelY: 150,
              assets: [
                {
                  id: "asset-lin-03",
                  code: "LIN-BED-022",
                  name: "Handuk Mandi Serat Bambu VIP (5 Pcs)",
                  category: "linen",
                  condition: "Baik",
                  responsiblePerson: "Agus Santoso (Housekeeping)",
                  purchaseDate: "15 Jan 2026",
                  photoColor: "from-sky-200 to-blue-400",
                  qrCodeUrl: "https://senopati.setneg.go.id/passport/lin-bed-022",
                  movementHistory: [],
                  maintenanceHistory: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
