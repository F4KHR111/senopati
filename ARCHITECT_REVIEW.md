# Dokumen Tinjauan Arsitektur (Architect Review) - SENOPATI
**Sistem Enterprise Nasional Operasional Pengelolaan Aset Terintegrasi**

Dokumen ini berisi tinjauan kritis dan mendalam terhadap rancangan konstitusi teknik proyek SENOPATI yang tertuang dalam [AGENTS.md](file:///d:/KULIAH/MAGANG/senopati/AGENTS.md). Evaluasi ini dilakukan dengan perspektif sistem enterprise pemerintahan yang harus andal, aman, berkinerja tinggi, dan dapat dipelihara selama minimal 10 tahun ke depan.

---

## 1. Kopling Basis Data pada Desain Polimorfisme Aset (Asset-Centric 1:1 Relationship)

**Kondisi Saat Ini**
Dokumen [AGENTS.md](file:///d:/KULIAH/MAGANG/senopati/AGENTS.md) (Bagian *Database Philosophy*) menetapkan arsitektur "Asset-Centric". Semua entitas spesifik seperti `vehicle_details`, `inventory_details`, `art_details`, `linen_details`, dan `supply_details` dihubungkan menggunakan relasi 1:1 melalui Foreign Key `asset_id` yang merujuk ke tabel utama `assets` (`asset_id PK FK assets`).

**Mengapa Ini Menjadi Masalah**
Meskipun secara konseptual pendekatan *Class Table Inheritance* ini terlihat rapi untuk normalisasi data, dalam praktek sistem enterprise berskala besar, ini menciptakan kopling basis data yang sangat ketat (*tight coupling*). 
1. **Penurunan Performa Query (Join Overhead):** Setiap kali aplikasi ingin menampilkan daftar aset beserta atribut spesifiknya (misalnya menampilkan campuran mobil dinas dan lukisan bersejarah pada dasbor atau peta), database harus melakukan operasi `LEFT JOIN` ke seluruh tabel detail (`vehicle_details`, `art_details`, dsb.). Seiring berjalannya waktu dan pertumbuhan volume data, kompleksitas query join ini akan menurunkan performa secara drastis, sehingga target performa query kompleks <300ms sulit tercapai.
2. **Hambatan Evolusi Skema:** Jika ada kebutuhan untuk menambahkan kategori aset baru di masa depan (misal: Gedung, Tanah, Alat IoT), pengembang harus membuat tabel baru dan mengubah logika join global di lapisan repositori dan ORM, yang melanggar *Open-Closed Principle* pada tingkat database.
3. **Pemisahan Modul (Microservices Readiness):** Sulit untuk memisahkan basis data per modul di kemudian hari karena semua modul berbagi tabel `assets` yang sama secara fisik di database.

**Rekomendasi**
1. **Gunakan Polymorphic Pattern dengan JSONB:** Tetapkan kolom `specific_attributes` bertipe `JSON` (atau `JSONB` jika didukung versi database) pada tabel `assets` untuk menyimpan atribut yang tidak umum (misal: warna mobil, bahan linen, dimensi lukisan). Kolom-kolom inti yang perlu diindeks (seperti `asset_code`, `status_id`, `condition_id`, `room_id`) tetap berada sebagai kolom relasional pada tabel `assets`.
2. **Pola Service-Level Aggregation:** Jika tabel relasional terpisah tetap ingin digunakan, hindari relasi fisik FK di tingkat database antar modul. Gunakan *polymorphic association* di tingkat aplikasi (Service Layer) di mana data detail diambil melalui *query* sekunder secara asinkron atau menggunakan database views yang terindeks (*Materialized Views*) jika performa pembacaan menjadi prioritas utama.

**Prioritas**
- Critical

**Dampak Jika Tidak Diperbaiki**
* **Jangka Pendek:** Penulisan kode repositori di NestJS dan Prisma akan menjadi kompleks karena harus selalu menangani kondisional join untuk setiap tipe aset.
* **Jangka Panjang:** Penurunan performa sistem secara eksponensial seiring bertambahnya jumlah aset. Sistem akan sangat sulit dimigrasi ke arsitektur *distributed database* atau *microservices* jika volume data melampaui kapasitas satu server MySQL.

---

## 2. Ketiadaan Dukungan Offline-First pada Alur Kerja Stock Opname

**Kondisi Saat Ini**
Alur kerja Stock Opname di dalam dokumen [AGENTS.md](file:///d:/KULIAH/MAGANG/senopati/AGENTS.md) dirancang sebagai alur digital berurutan: *Create Session $\rightarrow$ Assign Auditor $\rightarrow$ Generate Asset List $\rightarrow$ Navigate Using Map $\rightarrow$ Scan QR $\rightarrow$ Verify Condition $\rightarrow$ Verify Location $\rightarrow$ Add Notes $\rightarrow$ Complete Session $\rightarrow$ Generate Report*.

**Mengapa Ini Menjadi Masalah**
Aset-aset pemerintah sering kali ditempatkan di area yang tidak memiliki jangkauan sinyal internet yang memadai (misalnya di basement gedung, ruang penyimpanan berkas bawah tanah, bunker, atau area terpencil di kompleks Istana Kepresidenan). Jika sistem dirancang dengan asumsi konektivitas internet selalu aktif (*always-online*), auditor tidak akan dapat memverifikasi QR code, memperbarui kondisi aset, atau mengakses peta ruangan saat berada di lokasi *blind spot*. Hal ini akan menghentikan seluruh proses Stock Opname fisik atau memaksa auditor kembali menggunakan pencatatan manual di kertas.

**Rekomendasi**
Rancang subsistem Stock Opname dengan pendekatan **Offline-First**:
1. **Sinkronisasi Sesi Awal:** Sebelum melakukan audit lapangan, perangkat klien (ponsel/tablet) mengunduh seluruh data sesi audit, daftar aset, dan peta ruangan yang diperlukan ke penyimpanan lokal (*local storage* seperti IndexedDB atau SQLite lokal pada perangkat mobile).
2. **Operasi Offline:** Auditor dapat melakukan pemindaian QR code, verifikasi kondisi, dan penulisan catatan secara offline. Aplikasi akan mencatat riwayat pemindaian secara lokal beserta timestamp fisik pemindaian.
3. **Resolusi Konflik data:** Saat perangkat mendeteksi adanya koneksi internet kembali, aplikasi akan mengirimkan antrean data audit lokal ke server dengan mekanisme resolusi konflik yang jelas (misalnya aturan *last-write-wins* berdasarkan timestamp pemindaian fisik, atau verifikasi manual oleh admin jika terdapat perbedaan data yang signifikan).

**Prioritas**
- High

**Dampak Jika Tidak Diperbaiki**
* **Jangka Pendek:** Frustrasi pengguna di lapangan ketika aplikasi mendadak hang atau gagal memuat data saat melakukan pemindaian di area bersinyal lemah.
* **Jangka Panjang:** Ketidakakuratan data stock opname karena banyak aset di area terisolasi yang terlewatkan untuk dipindai atau dicatat secara real-time.

---

## 3. Penyimpanan Berkas (File Storage) Berbasis Sistem File Lokal (Local Filesystem)

**Kondisi Saat Ini**
Dokumen [AGENTS.md](file:///d:/KULIAH/MAGANG/senopati/AGENTS.md) menetapkan struktur direktori lokal untuk file yang diunggah (`uploads/vehicles/`, `uploads/art/`, dll.) dan melarang pencampuran berkas dengan kode sumber.

**Mengapa Ini Menjadi Masalah**
Menggunakan sistem file lokal server untuk aplikasi enterprise yang direncanakan berjalan selama 10 tahun memiliki risiko kegagalan yang tinggi:
1. **Skalabilitas Horizontal Terhambat:** Jika lalu lintas pengguna meningkat dan sistem perlu dideploy di belakang Load Balancer dengan beberapa instance aplikasi (misal: multi-container di Kubernetes atau beberapa VM), berkas yang diunggah ke Instance A tidak akan dapat diakses oleh Instance B tanpa solusi replikasi file system yang kompleks dan lambat (seperti NFS).
2. **Ketiadaan Backup Otomatis & Keamanan Terpusat:** Penyimpanan file lokal pada server web meningkatkan risiko kehilangan data apabila server mengalami crash atau *disk failure*. Selain itu, berkas-berkas sensitif pemerintah (seperti dokumen sertifikat tanah atau foto aset bernilai tinggi) tidak terlindungi oleh enkripsi pada level penyimpanan (*encryption at rest*).

**Rekomendasi**
1. **Unified Storage Abstraction Layer:** Implementasikan pola *Repository/Storage Pattern* di NestJS yang mengabstraksi penyimpanan berkas. Aplikasi tidak boleh menulis langsung ke path file lokal.
2. **Gunakan S3-Compatible Object Storage:** Rekomendasikan penggunaan Object Storage lokal di dalam jaringan internal (misalnya **MinIO** atau **Ceph**) sebagai backend penyimpanan default. Hal ini menjamin berkas disimpan secara terpusat, aman, memiliki fitur redundansi data, dan siap dideploy menggunakan arsitektur multi-node/container.
3. **Akses Berkas Melalui Presigned URLs:** Berkas-berkas dokumen tidak boleh diakses secara langsung melalui path publik web server. Gunakan *temporary presigned URLs* untuk mengakses dokumen sensitif guna memastikan otorisasi pengguna selalu divalidasi sebelum file dikirim ke browser.

**Prioritas**
- High

**Dampak Jika Tidak Diperbaiki**
* **Jangka Pendek:** Kesulitan dalam melakukan deployment aplikasi dengan skema High Availability (HA) dan backup file secara berkala.
* **Jangka Panjang:** Kehilangan data aset yang fatal akibat kerusakan hardware server, serta risiko kebocoran dokumen pemerintah karena tidak adanya kontrol otorisasi tingkat file yang ketat.

---

## 4. Pembatasan Flat RBAC (Role-Based Access Control) Tanpa Batasan Wilayah Kerja (Scope/Department Boundaries)

**Kondisi Saat Ini**
Sistem keamanan pada [AGENTS.md](file:///d:/KULIAH/MAGANG/senopati/AGENTS.md) menggunakan RBAC standar dengan tabel `users`, `roles`, `permissions`, dan `role_permissions`.

**Mengapa Ini Menjadi Masalah**
Dalam struktur organisasi pemerintahan, hak akses tidak hanya ditentukan oleh *apa pekerjaan mereka* (Role), tetapi juga *di mana wilayah kerja mereka* (Scope/Department). 
Sebagai contoh:
* Seorang pengelola aset (Role: `Asset Manager`) di Departemen A seharusnya hanya memiliki hak untuk mengubah atau memindahkan aset milik Departemen A. Mereka tidak boleh mengubah aset milik Departemen B meskipun memiliki Role yang sama.
* Seorang auditor (Role: `Auditor`) yang ditugaskan di Gedung A tidak boleh memverifikasi sesi stock opname di Gedung B.
Dengan flat RBAC yang hanya memeriksa `role_permissions` (misal: `permission: "asset:update"`), sistem tidak mampu membatasi akses data secara horizontal. Pengguna dengan permission tertentu dapat memodifikasi data milik departemen atau gedung lain dengan memanipulasi ID pada request API (kerentanan *Insecure Direct Object Reference* / IDOR).

**Rekomendasi**
Tingkatkan sistem otorisasi dari Flat RBAC menjadi **Hierarchical/Scoped RBAC** atau **Attribute-Based Access Control (ABAC)** sederhana:
1. **Tambahkan Kolom Scope:** Tambahkan kolom scope pada relasi pengguna (misalnya mengikat user ke `department_id` atau `building_id` tertentu).
2. **Otorisasi Berbasis Kepemilikan (Ownership/Resource-based Authorization):** Di level NestJS Services/Guards, setiap request untuk mutasi data aset harus memvalidasi kesesuaian antara scope departemen/lokasi pengguna yang sedang aktif dengan scope kepemilikan aset yang dituju.
   ```ts
   // Contoh logika otorisasi di NestJS Service
   if (user.role !== 'SuperAdmin' && asset.department_id !== user.department_id) {
       throw new ForbiddenException('Anda tidak memiliki akses ke aset departemen lain');
   }
   ```

**Prioritas**
- High

**Dampak Jika Tidak Diperbaiki**
* **Jangka Pendek:** Kebocoran wewenang di mana staf antar-bagian dapat melihat atau memodifikasi daftar aset bagian lain secara tidak sah.
* **Jangka Panjang:** Sulitnya melakukan audit internal jika terjadi kesalahan manipulasi data aset karena batas tanggung jawab antar-departemen dalam aplikasi tidak terisolasi dengan jelas.

---

## 5. Kerentanan Integritas Log Audit (Immutable Log Terpusat di Database Utama)

**Kondisi Saat Ini**
Dokumen [AGENTS.md](file:///d:/KULIAH/MAGANG/senopati/AGENTS.md) menyatakan bahwa log audit bersifat *immutable* (tidak dapat diubah) dan disimpan dalam tabel `audit_logs` pada basis data utama MySQL.

**Mengapa Ini Menjadi Masalah**
Menyimpan log audit pada tabel MySQL yang sama dengan data transaksional utama sangat rentan terhadap manipulasi internal:
1. **Risiko Modifikasi oleh Admin/Peretas:** Jika peretas berhasil mendapatkan akses administrator basis data (`root`) atau akun dengan hak akses tinggi, mereka dapat dengan mudah menjalankan perintah SQL `UPDATE` atau `DELETE` pada tabel `audit_logs` untuk menghapus jejak aktivitas mencurigakan mereka.
2. **Kepatuhan Hukum (Non-Repudiation):** Untuk sistem informasi milik Sekretariat Negara yang mengelola aset negara bernilai tinggi, keabsahan log audit sangat krusial jika terjadi penyelidikan hukum. Log yang disimpan dalam basis data relasional biasa tanpa tanda tangan digital (*cryptographic signing*) sulit dibuktikan keasliannya di pengadilan karena mudah dimodifikasi tanpa meninggalkan bekas modifikasi.

**Rekomendasi**
1. **Tanda Tangan Kriptografis (Cryptographic Hash Chaining):** Setiap kali entri log audit baru dibuat, buat hash SHA-256 dari konten log tersebut yang digabungkan dengan hash dari entri log sebelumnya (seperti struktur blockchain sederhana). Jika ada satu baris log di masa lalu yang diubah atau dihapus, rantai hash akan rusak dan sistem akan langsung mendeteksi adanya manipulasi data.
2. **Pemisahan Penyimpanan Log (WORM Principle):** Kirim salinan log audit secara real-time ke server log eksternal yang aman atau sistem penyimpanan berbasis *Write Once, Read Many* (WORM). Alternatif lainnya adalah menggunakan tools logging terpusat bersertifikat keamanan tinggi (seperti Graylog atau Elastic Stack dengan proteksi indeks log) yang terpisah dari basis data transaksional utama.

**Prioritas**
- Medium

**Dampak Jika Tidak Diperbaiki**
* **Jangka Pendek:** Kerentanan terhadap sabotase data oleh oknum internal (*insider threat*) yang memiliki akses ke database MySQL.
* **Jangka Panjang:** Ketidakmampuan sistem untuk memberikan bukti audit yang sah secara hukum jika terjadi sengketa atau hilangnya aset negara yang bernilai tinggi (misalnya koleksi seni bersejarah).

---

## 6. Potensi Degradasi Performa Akibat Akumulasi Riwayat Aset (History Tables)

**Kondisi Saat Ini**
Dokumen [AGENTS.md](file:///d:/KULIAH/MAGANG/senopati/AGENTS.md) menekankan prinsip "Everything Has History". Sistem mendefinisikan tabel-tabel seperti `asset_location_histories`, `asset_assignment_histories`, `asset_transfer_histories`, dan `maintenance_histories` untuk mencatat setiap mutasi secara permanen.

**Mengapa Ini Menjadi Masalah**
Dalam jangka waktu 10 tahun, frekuensi mutasi aset, pemindaian QR code, perubahan penanggung jawab, dan perawatan rutin akan menghasilkan jutaan baris data riwayat. 
Jika tabel riwayat ini dibiarkan tumbuh dalam satu ruang tabel MySQL tanpa strategi manajemen data khusus:
1. **Query Lambat pada Aplikasi:** Menampilkan lini masa aset (*Asset Timeline*) akan membutuhkan waktu yang sangat lama karena pencarian indeks pada tabel riwayat berukuran gigabytes akan membebani I/O disk server.
2. **Backup dan Restorasi Lambat:** Proses backup basis data harian akan memakan waktu berjam-jam dan ukuran file backup akan membengkak, meningkatkan biaya infrastruktur penyimpanan secara signifikan.

**Rekomendasi**
1. **Strategi Partisi Tabel (Table Partitioning):** Implementasikan partisi tabel MySQL pada tabel riwayat berdasarkan kolom tanggal (`created_at` atau `movement_date`). Misalnya, data dipartisi per tahun. Ini membuat MySQL hanya memindai partisi tahun aktif saat melakukan pencarian mutasi terbaru.
2. **Mekanisme Pengarsipan Data (Data Archiving):** Tetapkan kebijakan retensi data riwayat aktif (misalnya, data mutasi berusia >5 tahun dipindahkan ke tabel arsip dingin/*cold storage* atau basis data analitik terpisah, dan dihapus dari basis data operasional utama).
3. **Optimasi Indeks Gabungan (Composite Indexes):** Pastikan query pada tabel riwayat menggunakan indeks gabungan yang tepat (misal: indeks gabungan pada `(asset_id, created_at)`) untuk mempercepat rendering visualisasi lini masa aset.

**Prioritas**
- Medium

**Dampak Jika Tidak Diperbaiki**
* **Jangka Pendek:** Penurunan performa secara perlahan yang mungkin tidak terlihat pada masa uji coba pengembangan, namun akan mulai dirasakan setelah 2-3 tahun sistem beroperasi di lingkungan produksi.
* **Jangka Panjang:** Server database mengalami kelebihan beban memori dan CPU karena ukuran tabel riwayat yang terlampau besar, menyebabkan downtime aplikasi secara berkala.

---

## 7. Risiko Bottleneck Performa pada Render SVG Peta Isometrik Dinamis

**Kondisi Saat Ini**
Rancangan peta interaktif pada [AGENTS.md](file:///d:/KULIAH/MAGANG/senopati/AGENTS.md) menggunakan ilustrasi isometrik berbasis **SVG** dengan pemuatan data dinamis (*lazy load*). Dokumen menyarankan untuk menghindari WebGL kecuali jika benar-benar diperlukan.

**Mengapa Ini Menjadi Masalah**
Format SVG merender setiap elemen visual (dinding, meja, ikon aset, indikator status) sebagai node DOM di browser. Jika satu lantai atau gedung memiliki ratusan ruangan dengan ribuan aset individu yang ditampilkan secara detail, jumlah node DOM SVG dapat mencapai belasan ribu. 
Browser akan mengalami kendala kinerja (*rendering lag*, konsumsi RAM tinggi, dan animasi peta patah-patah) karena harus terus-menerus melakukan proses rekalkulasi tata letak (*reflow* dan *repaint*) saat pengguna melakukan zoom, geser (pan), atau mengklik ruangan untuk melihat info dinamis secara interaktif.

**Rekomendasi**
1. **Batas Kompleksitas SVG & Pre-rendering:** Tetapkan aturan bahwa file SVG hanya digunakan untuk tata letak arsitektur statis gedung/ruangan (dinding dan batas zona). Penanda aset individual dinamis harus dirender di atas peta menggunakan elemen HTML ringan dengan koordinat absolut atau pustaka Canvas 2D yang efisien.
2. **Gunakan Canvas API untuk Data Padat:** Jika jumlah objek visual pada satu tampilan lantai melebihi 1.000 elemen, gantilah visualisasi dinamis menggunakan **HTML5 Canvas API** (menggunakan pustaka seperti *PixiJS* or *Konva.js*). Canvas merender seluruh grafik sebagai bitmap tunggal, sehingga tidak membebani pohon DOM browser berapapun jumlah objek yang digambar.
3. **Optimasi Berkas SVG:** Terapkan proses kompresi dan sanitasi file SVG hasil desain arsitek (menggunakan tools seperti `svgo`) untuk menghapus metadata desain tersembunyi yang memperbesar ukuran file sebelum diunggah ke sistem.

**Prioritas**
- Medium

**Dampak Jika Tidak Diperbaiki**
* **Jangka Pendek:** Peta terasa berat, lambat merespons klik, atau bahkan membuat browser di komputer staf pemerintah dengan spesifikasi rendah mengalami hang saat memuat gedung yang padat aset.
* **Jangka Panjang:** Antarmuka visual yang merupakan fitur andalan SENOPATI dihindari oleh pengguna karena tidak nyaman digunakan secara harian.

---

## 8. Ketiadaan Mekanisme Enkripsi Data Sensitif Saat Istirahat (Data-at-Rest Encryption)

**Kondisi Saat Ini**
Dokumen [AGENTS.md](file:///d:/KULIAH/MAGANG/senopati/AGENTS.md) merinci sistem keamanan transport (HTTPS, CORS, Helmet) dan otentikasi (JWT, bcrypt). Namun, tidak ada aturan mengenai pengamanan data fisik di tingkat penyimpanan.

**Mengapa Ini Menjadi Masalah**
Sistem SENOPATI mengelola data sensitif milik Sekretariat Negara, termasuk data karyawan (NIP, email, nomor telepon), data vendor, lokasi ruang kerja pejabat tinggi, dokumen legal kepemilikan aset negara, dan nilai taksiran koleksi seni bersejarah yang bernilai sangat tinggi. Jika server database mengalami pencurian fisik hard drive atau file backup database jatuh ke tangan pihak ketiga, data tersebut dapat dibaca dengan mudah karena disimpan dalam bentuk teks biasa (*plain text*).

**Rekomendasi**
1. **Transparent Data Encryption (TDE):** Wajibkan konfigurasi TDE di level basis data MySQL (atau menggunakan enkripsi penyimpanan tingkat OS pada server basis data) untuk memastikan semua file tabel basis data dan berkas log transaksi dienkripsi secara otomatis pada media penyimpanan fisik.
2. **Enkripsi Kolom Sensitif (Application-Level Encryption):** Kolom-kolom yang sangat sensitif seperti NIP pegawai, nomor telepon pribadi, nilai taksiran aset seni tertentu, atau detail kontrak vendor harus dienkripsi di tingkat aplikasi (NestJS) menggunakan algoritma enkripsi simetris (seperti AES-256-GCM) sebelum disimpan ke database. Kunci enkripsi didefinisikan secara aman melalui Environment Variables dan dikelola menggunakan solusi HSM (Hardware Security Module) atau Key Management Service (KMS) internal.

**Prioritas**
- High

**Dampak Jika Tidak Diperbaiki**
* **Jangka Pendek:** Ketidakpatuhan terhadap standar keamanan informasi pemerintahan nasional (seperti regulasi BSSN terkait perlindungan data strategis).
* **Jangka Panjang:** Risiko kebocoran data strategis nasional yang masif jika file backup database tidak sengaja terekspos atau server fisik disusupi.

---

## 9. Ketiadaan Abstraksi Integrasi Sistem Eksternal (SIMAK BMN & SAKTI)

**Kondisi Saat Ini**
Dalam bagian *Future Roadmap*, disebutkan rencana integrasi dengan sistem nasional seperti SIMAK BMN (Sistem Informasi Manajemen dan Akuntansi Barang Milik Negara) dan SAKTI (Sistem Aplikasi Keuangan Tingkat Instansi). Namun, rancangan skema database saat ini sangat berorientasi lokal untuk SENOPATI saja.

**Mengapa Ini Menjadi Masalah**
SIMAK BMN dan SAKTI memiliki struktur data, penomoran kode barang (tabel referensi barang nasional), dan format transaksi yang sangat kaku dan terstandarisasi oleh Kementerian Keuangan. Jika SENOPATI merancang struktur tabel `assets` dan kodefikasi `asset_code` secara ad-hoc tanpa mempertimbangkan pemetaan (*mapping*) ke kodefikasi nasional tersebut, proses integrasi di masa depan akan memerlukan restrukturisasi database secara besar-besaran (refactoring skema inti) yang berisiko merusak integritas data historis yang sudah berjalan selama bertahun-tahun.

**Rekomendasi**
1. **Tambahkan Kolom Referensi Nasional:** Tambahkan kolom opsional `bmn_code` (Kode Barang BMN), `nup` (Nomor Urut Pendaftaran BMN), dan `sakti_id` pada tabel `assets` sejak awal skema dirancang.
2. **Pola Pemetaan Fleksibel (Mapping Table):** Buat tabel relasional khusus pemetaan kategori aset lokal SENOPATI dengan tabel referensi barang nasional (BMN). Hal ini meminimalkan perubahan skema ketika Kementerian Keuangan memperbarui standar klasifikasi barang mereka di masa depan.
3. **Abstraksi Integration Service:** Rancang modul sinkronisasi terisolasi di NestJS dengan pola *Adapter/Bridge Pattern* untuk memisahkan logika sinkronisasi eksternal dari logika bisnis inti pengelolaan aset harian.

**Prioritas**
- High

**Dampak Jika Tidak Diperbaiki**
* **Jangka Pendek:** Kerumitan administrasi di mana staf harus memasukkan data yang sama dua kali (di SENOPATI dan di SIMAK BMN) secara manual karena tidak adanya jembatan data yang kompatibel.
* **Jangka Panjang:** Integrasi otomatis dengan SIMAK BMN/SAKTI akan sangat mahal secara biaya dan waktu rekayasa ulang perangkat lunak karena perbedaan struktural data yang terlampau jauh.
