# Ringkasan Perubahan (CHANGELOG) - AGENTS.md
**SENOPATI - System Enterprise Nasional Operasional Pengelolaan Aset Terintegrasi**

Dokumen ini mencatat riwayat revisi pada [AGENTS.md](file:///d:/KULIAH/MAGANG/senopati/AGENTS.md) berdasarkan keputusan arsitektur yang disepakati dalam [ARCHITECT_DECISIONS.md](file:///d:/KULIAH/MAGANG/senopati/ARCHITECT_DECISIONS.md).

---

## Ringkasan Revisi - 15 Juli 2026

### 1. Bagian: `# PRISMA RULES`
* **Perubahan:** Menambahkan larangan *query* dynamic join implisit ke tabel detail kategori dari repositori global (`Never query details tables dynamically...`).
* **Alasan Perubahan:** Mengurangi beban kerja basis data MySQL dari relasi polimorfisme aset 1:1, membatasi *query* hanya mengambil kolom spesifik melalui perintah `select` terisolasi.
* **Dampak Terhadap Pengembangan:** Tim pengembang wajib memisahkan pengambilan detail spesifik (seperti data kendaraan atau lukisan) ke tingkat *service layer* spesifik fitur masing-masing, bukan melakukan *eager load join* global di tingkat repositori aset.

### 2. Bagian: `# SECURITY`
* **Perubahan:** Mengubah otorisasi standar RBAC menjadi **Scoped RBAC** di mana pengguna diikat ke departemen (`department_id`) dan gedung (`building_id`) tertentu. Menambahkan panduan NestJS Guards untuk melakukan verifikasi silang kepemilikan aset.
* **Alasan Perubahan:** Mencegah celah keamanan IDOR (*Insecure Direct Object Reference*), di mana pengguna dari instansi/departemen lain dapat memanipulasi aset di luar wewenangnya.
* **Dampak Terhadap Pengembangan:** Pengembang wajib mengimplementasikan *Guards/Decorators* kustom di NestJS untuk memeriksa kesesuaian cakupan (*scope*) pengguna aktif dengan entitas data aset yang diminta sebelum memberikan izin mutasi.

### 3. Bagian: `# FILE STORAGE`
* **Perubahan:** Mewajibkan semua operasi penyimpanan file melalui abstraksi `StorageService`. Mengubah konfigurasi driver agar dapat disesuaikan antara Local Filesystem, MinIO, atau S3.
* **Alasan Perubahan:** Membuka jalur skalabilitas horizontal agar aplikasi siap dijalankan pada multi-instance/container tanpa kehilangan konsistensi file, serta mempermudah migrasi backend penyimpanan di masa depan.
* **Dampak Terhadap Pengembangan:** Pengembang dilarang menulis langsung ke sistem file lokal menggunakan pustaka Node.js `fs` bawaan pada modul bisnis. Semua logika unggah/baca file harus menyuntikkan (*inject*) kelas `StorageService`.

### 4. Bagian: `# ISOMETRIC DESIGN`
* **Perubahan:** Membatasi peran berkas SVG hanya untuk merender peta dasar statis (*floor layout*). Komponen dinamis seperti penanda posisi aset (*markers/pins*) harus dirender sebagai elemen HTML ringan dengan posisi absolut di atas kanvas SVG.
* **Alasan Perubahan:** Menghindari beban rendering DOM browser (*repaint/reflow*) akibat ribuan node SVG dinamis yang dapat memperlambat performa antarmuka pada komputer berspesifikasi rendah.
* **Dampak Terhadap Pengembangan:** Implementasi peta di sisi frontend (React/Next.js) akan menggunakan kombinasi elemen SVG sebagai background dan komponen absolute React untuk pin interaktifnya.

### 5. Bagian: `# STOCK OPNAME WORKFLOW`
* **Perubahan:** Menambahkan mekanisme *caching* peta secara lokal dan *buffering* hasil pemindaian barcode/QR ke dalam penyimpanan lokal perangkat (*local storage*) jika koneksi internet terputus.
* **Alasan Perubahan:** Menjamin proses Stock Opname fisik di lapangan tetap berjalan lancar meski berada di area *blind spot* sinyal internet.
* **Dampak Terhadap Pengembangan:** Pengembang frontend harus menambahkan logika penyimpanan sementara menggunakan IndexedDB atau LocalStorage pada modul Stock Opname untuk mengantrekan data unggahan secara offline.

### 6. Bagian: `# INDEXING STRATEGY`
* **Perubahan:** Menambahkan instruksi pembuatan **Composite Indexes** (indeks gabungan) `asset_id + created_at` pada semua tabel riwayat mutasi.
* **Alasan Perubahan:** Mengoptimalkan kecepatan pencarian data histori yang tumbuh cepat guna meminimalkan degradasi performa render lini masa aset (*Asset Timeline*).
* **Dampak Terhadap Pengembangan:** Pengembang wajib mendefinisikan indeks gabungan tersebut pada berkas `schema.prisma` sebelum menjalankan migrasi database.

### 7. Bagian: `# TABLE : assets`
* **Perubahan:** Menambahkan kolom opsional `bmn_code` (VARCHAR), `nup` (INT), dan `sakti_id` (VARCHAR) ke dalam definisi tabel `assets`.
* **Alasan Perubahan:** Mempersiapkan struktur data agar kompatibel dengan sistem pengelolaan barang nasional (SIMAK BMN & SAKTI) sejak hari pertama tanpa perlu merombak ulang skema database di masa depan.
* **Dampak Terhadap Pengembangan:** Skema database awal akan memiliki kolom-kolom penomoran nasional tersebut sebagai atribut opsional (*nullable*).
