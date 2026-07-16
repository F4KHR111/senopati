# Catatan Keputusan Arsitektur (Architect Decisions) - SENOPATI
**Sistem Enterprise Nasional Operasional Pengelolaan Aset Terintegrasi**

Dokumen ini mencatat keputusan arsitektur (Architecture Decision Records / ADR) yang diambil berdasarkan temuan pada [ARCHITECT_REVIEW.md](file:///d:/KULIAH/MAGANG/senopati/ARCHITECT_REVIEW.md). Setiap keputusan dirancang agar realistis terhadap ruang lingkup proyek magang (MVP), namun tetap menjaga jalur evolusi sistem menuju produksi jangka panjang (10 tahun).

---

## 1. Kopling Basis Data pada Desain Polimorfisme Aset

### Ringkasan
Model relasi 1:1 fisik menggunakan *Class Table Inheritance* antara tabel `assets` dan detail kategori (`vehicle_details`, `art_details`, dll.) berpotensi menurunkan performa *query* akibat beban *join* data yang berat dan menyulitkan pemisahan database per modul di masa depan.

### Keputusan
**Diterima dengan Modifikasi**

### Alasan Keputusan
* **Teknis:** NestJS dan Prisma ORM mendukung skema 1:1 secara *native* dengan sangat baik. Untuk versi awal (MVP), memaksakan arsitektur JSONB atau memisahkan modul ke basis data terpisah akan memperumit validasi tipe data di tingkat pengembang magang. Namun, penggunaan *query* dengan filter selektif (`select` bukan `include`) harus diperketat sejak awal agar beban *join* minimal.
* **Bisnis:** Saat ini jumlah kategori aset hanya 5 kategori. Model relasional murni mempermudah pembuatan laporan cepat dan pencarian langsung untuk fase awal penggunaan.

### Rencana Implementasi
**Versi 1.0** (Tetap menggunakan skema relasional 1:1, tetapi menerapkan aturan optimasi pembacaan secara ketat di tingkat repositori). Transformasi ke JSONB/loose coupling ditunda ke **Versi 2.0** jika jumlah kategori melebihi 10 tipe.

### Dampak terhadap AGENTS.md
**Perlu Direvisi.**
Pada bagian `# PRISMA RULES` di [AGENTS.md](file:///d:/KULIAH/MAGANG/senopati/AGENTS.md), aturan penggunaan `select` harus diperjelas agar mencakup pembatasan *join* implisit dari detail aset.

*Bagian Sebelum Revisi:*
```markdown
Use

select

instead of

include

whenever possible.

Only request required fields.
```

*Bagian Setelah Revisi:*
```markdown
Use

select

instead of

include

whenever possible.

Only request required fields.

Never query details tables dynamically unless explicitly requested by the specific feature service.
```

---

## 2. Ketiadaan Dukungan Offline-First pada Alur Kerja Stock Opname

### Ringkasan
Proses Stock Opname membutuhkan koneksi internet aktif yang konstan, padahal banyak area penyimpanan fisik aset pemerintah berada pada lokasi *blind spot* internet.

### Keputusan
**Ditunda ke Versi Berikutnya**

### Alasan Keputusan
* **Teknis:** Mengembangkan sistem *offline-first* dengan sinkronisasi basis data dua arah dan resolusi konflik otomatis memerlukan waktu rekayasa yang sangat lama dan kompleksitas tinggi pada sisi klien dan server.
* **Bisnis:** Untuk fase magang saat ini, prioritas adalah menyelesaikan alur bisnis utama secara fungsional. Sebagai alternatif sementara, tim pengembang akan mengimplementasikan mekanisme *antrean unggah* sederhana pada aplikasi klien (menyimpan data pemindaian di `localStorage` jika koneksi putus) sebelum dikirim secara manual oleh auditor ketika sinyal kembali tersedia.

### Rencana Implementasi
**Versi 1.1** (Implementasi antrean penyimpanan lokal sederhana di browser) dan **Versi 2.0** (Penuh *offline-first* dengan sinkronisasi terotomatisasi).

### Dampak terhadap AGENTS.md
**Perlu Direvisi.**
Pada bagian `# STOCK OPNAME WORKFLOW` di [AGENTS.md](file:///d:/KULIAH/MAGANG/senopati/AGENTS.md), ditambahkan aturan penanganan kegagalan koneksi di tingkat antarmuka pengguna (UI).

*Bagian Sebelum Revisi:*
```markdown
# STOCK OPNAME WORKFLOW

Stock opname must become digital.

Workflow

Create Session
↓
Assign Auditor
↓
Generate Asset List
↓
Navigate Using Map
↓
Scan QR
↓
Verify Condition
↓
Verify Location
↓
Add Notes
↓
Complete Session
↓
Generate Report

No spreadsheet should be required.
```

*Bagian Setelah Revisi:*
```markdown
# STOCK OPNAME WORKFLOW

Stock opname must become digital.

Workflow

Create Session
↓
Assign Auditor
↓
Generate Asset List
↓
Navigate Using Map (Cache map data locally on entry)
↓
Scan QR (Queue scan locally if offline)
↓
Verify Condition
↓
Verify Location
↓
Add Notes
↓
Complete Session
↓
Generate Report

No spreadsheet should be required. The application MUST handle network interruptions by buffering scan results in local storage.
```

---

## 3. Penyimpanan Berkas Berbasis Sistem File Lokal

### Ringkasan
Penggunaan penyimpanan sistem file server lokal (`uploads/`) menghambat skalabilitas horizontal (Multi-instance) dan meningkatkan risiko kehilangan data akibat kerusakan hardware server.

### Keputusan
**Diterima dengan Modifikasi**

### Alasan Keputusan
* **Teknis:** Untuk fase awal proyek magang (MVP), penyimpanan di file lokal server sangat mudah diatur dan dideploy tanpa dependensi infrastruktur tambahan. Namun, agar tidak menimbulkan hutang teknis (*technical debt*), penulisan file ke disk tidak boleh dilakukan secara langsung dari modul bisnis. Kita harus menggunakan abstraksi `StorageService` di NestJS.
* **Bisnis:** Mengurangi beban penyediaan infrastruktur penyimpanan eksternal (Object Storage) pada awal proyek magang.

### Rencana Implementasi
**Versi 1.0** (Menggunakan local filesystem di belakang modul abstraksi `StorageService`). **Versi 1.1** (Migrasi ke MinIO/S3 compatible storage hanya dengan mengubah konfigurasi backend di `StorageService` tanpa mengubah kode bisnis).

### Dampak terhadap AGENTS.md
**Perlu Direvisi.**
Menambahkan aturan abstraksi penyimpanan pada bagian `# FILE STORAGE` di [AGENTS.md](file:///d:/KULIAH/MAGANG/senopati/AGENTS.md).

*Bagian Sebelum Revisi:*
```markdown
# FILE STORAGE

Uploaded files must never be mixed with source code.

Preferred structure

uploads/

vehicles/

art/

documents/

inventory/

linen/

supplies/

temporary/

Use unique generated filenames.

Never trust original filenames.
```

*Bagian Setelah Revisi:*
```markdown
# FILE STORAGE

Uploaded files must never be mixed with source code. All file operations MUST go through a unified StorageService abstraction layer.

Preferred local structure (for local storage driver)

uploads/
vehicles/
art/
documents/
inventory/
linen/
supplies/
temporary/

Use unique generated filenames.

Never trust original filenames. Storage driver must be configurable (Local, MinIO, or S3 compatible).
```

---

## 4. Pembatasan Flat RBAC Tanpa Batasan Wilayah Kerja (Scoped RBAC)

### Ringkasan
Pengguna dengan Role tertentu dapat memanipulasi aset milik departemen lain karena sistem keamanan tidak membatasi hak akses berdasarkan batas departemen atau wilayah kerja (Scope).

### Keputusan
**Diterima**

### Alasan Keputusan
* **Teknis:** Implementasi Scoped RBAC di tingkat aplikasi (NestJS Guards/Decorators) relatif mudah dan tidak membebani performa, namun secara drastis meningkatkan keamanan dari celah IDOR (*Insecure Direct Object Reference*).
* **Bisnis:** Sangat krusial karena ini adalah sistem pemerintahan. Kerahasiaan operasional antar departemen di lingkungan Sekretariat Negara bersifat non-negosiasi.

### Rencana Implementasi
**Versi 1.0** (Wajib diterapkan sejak fase awal pengembangan kode otorisasi).

### Dampak terhadap AGENTS.md
**Perlu Direvisi.**
Merevisi bagian `# SECURITY` di [AGENTS.md](file:///d:/KULIAH/MAGANG/senopati/AGENTS.md) untuk menetapkan kebijakan *Scoped RBAC*.

*Bagian Sebelum Revisi:*
```markdown
# SECURITY

Authentication

JWT

Authorization

RBAC

Password

bcrypt

Helmet enabled

CORS configured

Rate limiting enabled

Input validation mandatory

Output sanitization required
```

*Bagian Setelah Revisi:*
```markdown
# SECURITY

Authentication

JWT

Authorization

Scoped RBAC (Users are bound to specific department_id and building_id scopes)

Password

bcrypt

Helmet enabled

CORS configured

Rate limiting enabled

Input validation mandatory

Output sanitization required

Verification rules: NestJS Guards must intercept requests and verify that the user's scope matches the owner scope of the targeted asset.
```

---

## 5. Kerentanan Integritas Log Audit

### Ringkasan
Menyimpan log audit pada tabel MySQL transaksional yang sama tanpa enkripsi hash chaining rentan dihapus atau dimodifikasi oleh oknum internal yang memiliki akses administratif basis data.

### Keputusan
**Ditunda ke Versi Berikutnya**

### Alasan Keputusan
* **Teknis:** Implementasi *cryptographic hashing chains* (seperti struktur blockchain) atau integrasi server syslog terpisah memerlukan penataan infrastruktur yang rumit bagi pengembang magang di awal proyek.
* **Bisnis:** Untuk versi 1.0, audit log cukup dijamin keamanannya dengan membatasi API akses pembacaan log hanya untuk Role `SuperAdmin` dan memastikan tidak ada kode aplikasi yang menyediakan fungsi pembaruan/penghapusan pada tabel log tersebut.

### Rencana Implementasi
**Versi 2.0** (Penerapan enkripsi rantai hash dan pengarsipan log ke sistem penyimpanan terpisah).

### Dampak terhadap AGENTS.md
**Tidak Ada Revisi.** Aturan pada [AGENTS.md](file:///d:/KULIAH/MAGANG/senopati/AGENTS.md) saat ini ("Logs are immutable. System administrators may view them but never modify them") tetap dipertahankan, namun dipaksakan di level kode aplikasi terlebih dahulu.

---

## 6. Potensi Degradasi Performa Akibat Akumulasi Riwayat Aset (History Tables)

### Ringkasan
Tabel riwayat mutasi, pemeliharaan, dan penugasan yang tumbuh cepat dalam jangka 10 tahun dapat memperlambat pencarian data lini masa aset secara signifikan.

### Keputusan
**Diterima dengan Modifikasi**

### Alasan Keputusan
* **Teknis:** Mengatur partisi tabel database (*Table Partitioning*) sejak awal proyek dinilai terlalu dini dan kompleks bagi tim magang. Namun, mitigasi performa wajib dilakukan dengan membuat indeks gabungan (*Composite Indexes*) yang tepat pada semua tabel riwayat.
* **Bisnis:** Mengurangi kompleksitas pemeliharaan database di awal proyek, namun tetap menjamin performa pembacaan lini masa memadai.

### Rencana Implementasi
**Versi 1.0** (Membuat indeks gabungan relasional yang optimal). **Versi 2.0** (Implementasi partisi tabel database dan kebijakan pengarsipan data riwayat >5 tahun ke penyimpanan sekunder).

### Dampak terhadap AGENTS.md
**Perlu Direvisi.**
Menambahkan aturan pembuatan indeks gabungan pada bagian `# INDEXING STRATEGY` di [AGENTS.md](file:///d:/KULIAH/MAGANG/senopati/AGENTS.md).

*Bagian Sebelum Revisi:*
```markdown
# INDEXING STRATEGY

Create indexes for

Asset Code

QR Code

RFID Identifier

Building

Room

Category

Status

Current PIC

Created Date

Movement Date

Frequently searched columns should always be indexed.
```

*Bagian Setelah Revisi:*
```markdown
# INDEXING STRATEGY

Create indexes for

Asset Code

QR Code

RFID Identifier

Building

Room

Category

Status

Current PIC

Created Date

Movement Date

Composite Indexes on History Tables:
- asset_id + created_at (on location, assignment, transfer, and maintenance history tables)

Frequently searched columns should always be indexed.
```

---

## 7. Risiko Bottleneck Performa pada Render SVG Peta Isometrik Dinamis

### Ringkasan
Merender ribuan aset dinamis secara langsung sebagai node DOM SVG di browser dapat membuat aplikasi lag dan mengonsumsi memori browser yang tinggi.

### Keputusan
**Diterima dengan Modifikasi**

### Alasan Keputusan
* **Teknis:** WebGL dinilai terlalu rumit untuk masa pengembangan magang yang singkat. SVG tetap digunakan karena fleksibilitas styling CSS. Namun, kompleksitas DOM diatasi dengan membatasi file SVG hanya untuk cetak biru gedung (dinding, pintu, koridor). Aset di dalamnya akan dirender sebagai penanda absolut (*absolute HTML elements*) di atas lapisan SVG.
* **Bisnis:** Memastikan visualisasi premium tetap berjalan lancar pada spesifikasi komputer dinas staf pemerintahan yang umumnya berspesifikasi rendah hingga menengah.

### Rencana Implementasi
**Versi 1.0** (SVG statis untuk peta dasar + Absolute HTML Pins untuk penanda aset di frontend).

### Dampak terhadap AGENTS.md
**Perlu Direvisi.**
Memperjelas batas tanggung jawab render pada bagian `# ISOMETRIC DESIGN` di [AGENTS.md](file:///d:/KULIAH/MAGANG/senopati/AGENTS.md).

*Bagian Sebelum Revisi:*
```markdown
# ISOMETRIC DESIGN

The interactive map uses isometric illustrations.

Reasons

Better orientation

Better usability

Premium appearance

Easy navigation

Future Digital Twin compatibility

SVG is preferred.

Avoid WebGL unless necessary.
```

*Bagian Setelah Revisi:*
```markdown
# ISOMETRIC DESIGN

The interactive map uses isometric illustrations.

Reasons

Better orientation

Better usability

Premium appearance

Easy navigation

Future Digital Twin compatibility

SVG is preferred for static floor layout ONLY. Dynamic asset markers MUST be rendered as lightweight absolute-positioned HTML elements overlaid on the SVG container to minimize DOM node count inside the SVG.

Avoid WebGL unless necessary.
```

---

## 8. Ketiadaan Mekanisme Enkripsi Data Sensitif Saat Istirahat

### Ringkasan
Data penting seperti NIP pegawai, nomor telepon, nilai taksiran karya seni bernilai tinggi, dan kontrak vendor disimpan secara polos (*plain text*) di MySQL, rentan bocor jika file backup atau harddisk dicuri.

### Keputusan
**Ditunda ke Versi Berikutnya**

### Alasan Keputusan
* **Teknis:** Enkripsi tingkat aplikasi (NestJS) memerlukan pengelolaan kunci enkripsi (KMS) yang rumit. Untuk implementasi jaringan internal tertutup pada Fase 1.0, keamanan fisik server basis data dan enkripsi hard disk di tingkat sistem operasi (seperti BitLocker atau dm-crypt) dinilai lebih cepat dan mencukupi.
* **Bisnis:** Memprioritaskan penyelesaian fungsional aplikasi utama selama masa magang.

### Rencana Implementasi
**Versi 1.1** (Enkripsi kolom sensitif tingkat aplikasi menggunakan modul enkripsi bawaan Node.js `crypto` untuk kolom NIP dan Nilai Taksiran Aset Seni).

### Dampak terhadap AGENTS.md
**Tidak Ada Revisi.** Ditunda ke perencanaan peningkatan keamanan versi minor berikutnya.

---

## 9. Ketiadaan Abstraksi Integrasi Sistem Eksternal (SIMAK BMN & SAKTI)

### Ringkasan
Kode klasifikasi dan penomoran aset di SENOPATI tidak memiliki pemetaan dengan skema penomoran barang nasional milik Kementerian Keuangan (SIMAK BMN & SAKTI), menyulitkan sinkronisasi otomatis di masa depan.

### Keputusan
**Diterima**

### Alasan Keputusan
* **Teknis:** Menambahkan kolom opsional pada tabel `assets` sejak awal tidak memerlukan usaha besar (hanya menambahkan beberapa kolom bertipe string opsional pada skema Prisma) namun mencegah proses perubahan struktur database yang mahal di kemudian hari.
* **Bisnis:** Menghindari pengerjaan ulang (*rework*) arsitektur inti ketika sistem ini ditingkatkan untuk sinkronisasi otomatis dengan portal BMN nasional.

### Rencana Implementasi
**Versi 1.0** (Menyertakan kolom referensi eksternal di skema database).

### Dampak terhadap AGENTS.md
**Perlu Direvisi.**
Mengubah tabel `assets` pada bagian `# TABLE : assets` di [AGENTS.md](file:///d:/KULIAH/MAGANG/senopati/AGENTS.md) untuk menampung data BMN.

*Bagian Sebelum Revisi:*
```markdown
# TABLE : assets

This is the heart of the system.

Columns

id UUID

asset_code

asset_name

category_id

type_id

status_id

condition_id

room_id

current_pic_id

barcode

qr_code

rfid_uid

brand

model

serial_number

purchase_date

purchase_price

vendor_id

manufacturer_id

useful_life

depreciation_method

description

is_active

created_at

updated_at

deleted_at

created_by

updated_by

deleted_by
```

*Bagian Setelah Revisi:*
```markdown
# TABLE : assets

This is the heart of the system.

Columns

id UUID

asset_code

asset_name

category_id

type_id

status_id

condition_id

room_id

current_pic_id

barcode

qr_code

rfid_uid

bmn_code (VARCHAR, nullable)

nup (INT, nullable)

sakti_id (VARCHAR, nullable)

brand

model

serial_number

purchase_date

purchase_price

vendor_id

manufacturer_id

useful_life

depreciation_method

description

is_active

created_at

updated_at

deleted_at

created_by

updated_by

deleted_by
```
