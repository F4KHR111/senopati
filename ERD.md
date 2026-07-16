# Entity Relationship Diagram (ERD) - SENOPATI
**Sistem Enterprise Nasional Operasional Pengelolaan Aset Terintegrasi**

Dokumen ini mendefinisikan rancangan struktur data basis data relasional (MySQL) untuk proyek SENOPATI berdasarkan panduan konstitusi teknik yang tercantum dalam [AGENTS.md](file:///d:/KULIAH/MAGANG/senopati/AGENTS.md). Dokumen ini berfungsi sebagai acuan tunggal sebelum pembuatan berkas `schema.prisma`.

---

## 1. Diagram ERD (Mermaid ER Diagram)

Berikut adalah representasi visual seluruh tabel dan hubungan antar-entitas dalam sistem SENOPATI.

```mermaid
erDiagram
    %% ==========================================
    %% DOMAIN: AUTHENTICATION & AUTHORIZATION
    %% ==========================================
    roles ||--o{ users : "has"
    roles ||--|{ role_permissions : "grants"
    permissions ||--|{ role_permissions : "granted_to"

    %% ==========================================
    %% DOMAIN: MASTER DATA
    %% ==========================================
    departments ||--o{ employees : "employs"
    employees |o--o| users : "identifies"
    buildings ||--o{ floors : "has"
    floors ||--o{ zones : "divides"
    zones ||--o{ rooms : "contains"
    asset_categories ||--o{ asset_types : "contains"
    asset_statuses ||--o{ assets : "marks"
    asset_conditions ||--o{ assets : "evaluates"
    vendors ||--o{ assets : "supplies"
    manufacturers ||--o{ assets : "manufactures"
    document_types ||--o{ asset_documents : "categorizes"
    movement_types ||--o{ asset_movements : "categorizes"
    maintenance_types ||--o{ deletion_logs_temp : "categorizes" %% placeholder
    maintenance_types ||--o{ maintenances : "categorizes"

    %% ==========================================
    %% DOMAIN: ASSET CORE
    %% ==========================================
    rooms ||--o{ assets : "located_in"
    employees ||--o{ assets : "responsible_person"
    asset_types ||--o{ assets : "classifies"

    %% ==========================================
    %% DOMAIN: ASSET DETAILS (1:1 Extension)
    %% ==========================================
    assets ||--o| vehicle_details : "details"
    assets ||--o| inventory_details : "details"
    assets ||--o| art_details : "details"
    assets ||--o| linen_details : "details"
    assets ||--o| supply_details : "details"

    %% ==========================================
    %% DOMAIN: ASSIGNMENTS & MOVEMENTS
    %% ==========================================
    assets ||--o{ asset_assignments : "assigned"
    employees ||--o{ asset_assignments : "assigned_to"
    assets ||--o{ asset_movements : "moved"
    rooms ||--o{ asset_movements : "from_room"
    rooms ||--o{ asset_movements : "to_room"
    users ||--o{ asset_movements : "moved_by"
    users ||--o{ asset_movements : "approved_by"

    %% ==========================================
    %% DOMAIN: MAINTENANCES
    %% ==========================================
    assets ||--o{ maintenances : "maintained"
    vendors ||--o{ maintenances : "services"

    %% ==========================================
    %% DOMAIN: STOCK OPNAME
    %% ==========================================
    buildings ||--o{ stock_opnames : "audited_in"
    users ||--o{ stock_opnames : "created_by"
    stock_opnames ||--|{ stock_opname_items : "lists"
    assets ||--o{ stock_opname_items : "audited"
    rooms ||--o{ stock_opname_items : "expected_room"
    rooms ||--o{ stock_opname_items : "actual_room"
    asset_conditions ||--o{ stock_opname_items : "checked_condition"
    users ||--o{ stock_opname_items : "checked_by"

    %% ==========================================
    %% DOMAIN: MEDIA & DOCUMENTS
    %% ==========================================
    assets ||--o{ asset_media : "attaches"
    users ||--o{ asset_media : "uploaded_by"
    assets ||--o{ asset_documents : "binds"
    users ||--o{ asset_documents : "uploaded_by"

    %% ==========================================
    %% DOMAIN: NOTIFICATIONS, REPORTING & AUDIT
    %% ==========================================
    users ||--o{ notifications : "receives"
    users ||--o{ generated_reports : "generated_by"
    users ||--o{ audit_logs : "performed_by"

    %% ==========================================
    %% ENTITY ATTRIBUTES DEFINITIONS
    %% ==========================================
    users {
        uuid id PK
        uuid employee_id FK
        uuid role_id FK
        string username
        string email
        string password
        boolean is_active
        timestamp last_login_at
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
        uuid created_by
        uuid updated_by
        uuid deleted_by
    }

    roles {
        uuid id PK
        string name
        string description
        timestamp created_at
        timestamp updated_at
    }

    permissions {
        uuid id PK
        string module
        string action
        string description
    }

    role_permissions {
        uuid role_id PK_FK
        uuid permission_id PK_FK
    }

    departments {
        uuid id PK
        string department_name
        string department_code
        string description
    }

    employees {
        uuid id PK
        uuid department_id FK
        string employee_name
        string nip
        string position
        string phone
        string email
        string status
    }

    buildings {
        uuid id PK
        string building_code
        string building_name
        string description
        double latitude
        double longitude
        boolean is_active
    }

    floors {
        uuid id PK
        uuid building_id FK
        int floor_number
        string floor_name
    }

    zones {
        uuid id PK
        uuid floor_id FK
        string zone_name
        string description
    }

    rooms {
        uuid id PK
        uuid zone_id FK
        string room_code
        string room_name
        string room_function
        string description
    }

    asset_categories {
        uuid id PK
        string category_name
        string description
    }

    asset_types {
        uuid id PK
        uuid category_id FK
        string type_name
        string description
    }

    asset_statuses {
        uuid id PK
        string name
        string description
    }

    asset_conditions {
        uuid id PK
        string name
        string description
    }

    vendors {
        uuid id PK
        string name
        string contact_person
        string phone
        string email
        string address
    }

    manufacturers {
        uuid id PK
        string name
        string country
    }

    document_types {
        uuid id PK
        string name
        string description
    }

    movement_types {
        uuid id PK
        string name
        string description
    }

    maintenance_types {
        uuid id PK
        string name
        string description
    }

    assets {
        uuid id PK
        string asset_code
        string asset_name
        uuid category_id FK
        uuid type_id FK
        uuid status_id FK
        uuid condition_id FK
        uuid room_id FK
        uuid current_pic_id FK
        string barcode
        string qr_code
        string rfid_uid
        string bmn_code
        int nup
        string sakti_id
        string brand
        string model
        string serial_number
        date purchase_date
        double purchase_price
        uuid vendor_id FK
        uuid manufacturer_id FK
        int useful_life
        string depreciation_method
        string description
        boolean is_active
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
        uuid created_by
        uuid updated_by
        uuid deleted_by
    }

    vehicle_details {
        uuid asset_id PK_FK
        string plate_number
        string engine_number
        string chassis_number
        string vehicle_type
        string fuel_type
        string transmission
        string color
        int production_year
        int engine_capacity
        int fuel_capacity
        int odometer
        string insurance_number
        date insurance_expiry
        string stnk_number
        date stnk_expiry
        date kir_expiry
        date next_service
    }

    inventory_details {
        uuid asset_id PK_FK
        string inventory_number
        string material
        string size
        double weight
        string manufacturer
        date warranty_expiry
        int expected_lifetime
    }

    art_details {
        uuid asset_id PK_FK
        string artist
        string art_style
        string origin
        int creation_year
        string material
        double width
        double height
        double depth
        double estimated_value
        string historical_description
        string preservation_notes
        string restoration_notes
    }

    linen_details {
        uuid asset_id PK_FK
        string linen_type
        string material
        string size
        string color
        int wash_cycle
        int replacement_cycle
    }

    supply_details {
        uuid asset_id PK_FK
        string unit
        int minimum_stock
        int maximum_stock
        int reorder_level
        int current_stock
        date expiration_date
    }

    asset_assignments {
        uuid id PK
        uuid asset_id FK
        uuid employee_id FK
        timestamp assigned_at
        timestamp returned_at
        string assignment_notes
        string status
    }

    asset_movements {
        uuid id PK
        uuid asset_id FK
        uuid from_room_id FK
        uuid to_room_id FK
        uuid movement_type_id FK
        string reason
        uuid moved_by FK
        timestamp movement_date
        uuid approved_by FK
        string notes
    }

    maintenances {
        uuid id PK
        uuid asset_id FK
        uuid maintenance_type_id FK
        uuid vendor_id FK
        date maintenance_date
        double cost
        string description
        date next_schedule
        string status
    }

    stock_opnames {
        uuid id PK
        string session_name
        uuid building_id FK
        uuid created_by FK
        timestamp started_at
        timestamp finished_at
        string status
    }

    stock_opname_items {
        uuid id PK
        uuid stock_opname_id FK
        uuid asset_id FK
        uuid expected_room FK
        uuid actual_room FK
        uuid condition FK
        string result
        string notes
        uuid checked_by FK
        timestamp checked_at
    }

    asset_media {
        uuid id PK
        uuid asset_id FK
        string file_name
        string file_type
        int file_size
        string mime_type
        string storage_path
        string thumbnail_path
        uuid uploaded_by FK
        timestamp uploaded_at
    }

    asset_documents {
        uuid id PK
        uuid asset_id FK
        uuid document_type_id FK
        string document_name
        string file_path
        string version
        uuid uploaded_by FK
        timestamp uploaded_at
    }

    notifications {
        uuid id PK
        string title
        string message
        uuid receiver_id FK
        string type
        string priority
        boolean is_read
        timestamp created_at
    }

    generated_reports {
        uuid id PK
        string report_name
        string report_type
        uuid generated_by FK
        timestamp generated_at
        string download_path
    }

    audit_logs {
        uuid id PK
        uuid user_id FK
        string module
        string action
        string table_name
        string record_id
        string old_value
        string new_value
        string ip_address
        string user_agent
        timestamp created_at
    }
```

---

## 2. Pengelompokan Berdasarkan Domain/Modul

### A. Domain Otorisasi (Authentication & Authorization)
* **`users`**: Menyimpan kredensial pengguna yang dapat masuk ke sistem. Setiap pengguna wajib memiliki satu `role_id` (1:N) dan merujuk ke satu profil `employee_id` (1:1) jika mereka merupakan karyawan internal.
* **`roles`**: Mendefinisikan peran akses pengguna (misal: *SuperAdmin*, *AssetManager*, *Auditor*).
* **`permissions`**: Daftar izin akses fungsional di tingkat modul (misal: `vehicle:create`, `art:read`).
* **`role_permissions`**: Tabel persimpangan (junction table) untuk memetakan hubungan Many-to-Many antara Roles dan Permissions.

### B. Domain Data Induk (Master Data)
* **`departments` & `employees`**: Mendefinisikan struktur organisasi internal Sekretariat Negara.
* **`buildings`, `floors`, `zones`, `rooms`**: Representasi fisik hierarki lokasi aset. Kamar (`rooms`) adalah unit terkecil yang menampung aset fisik.
* **`asset_categories` & `asset_types`**: Klasifikasi jenis aset (Kategori: Kendaraan, Alat Kantor, dsb.; Tipe: Mobil, Motor, AC, Laptop).
* **`asset_statuses` & `asset_conditions`**: Tabel referensi penilai kondisi (Sangat Baik, Rusak Ringan, dsb.) dan status (Aktif, Dipinjam, Diservis, dsb.).
* **`vendors` & `manufacturers`**: Data pihak ketiga penyedia barang (*vendor*) dan pabrikan pembuat (*manufacturer*).

### C. Domain Inti Aset (Asset Core & Details)
* **`assets`**: Tabel utama penyimpan properti fisik inti, kode identifikasi (QR, Barcode, RFID), nilai pembelian, penanggung jawab (`current_pic_id`), lokasi ruangan (`room_id`), serta kode integrasi nasional (BMN & SAKTI).
* **Tabel Detail Polimorfik (`vehicle_details`, `inventory_details`, `art_details`, `linen_details`, `supply_details`)**: Extensi data 1:1 opsional dari tabel `assets`. Kunci utama (`asset_id`) bertindak sebagai Primary Key sekaligus Foreign Key yang merujuk ke `assets.id`.

### D. Domain Mutasi, Penugasan, & Pemeliharaan (Assignments, Movements, Maintenances)
* **`asset_assignments`**: Pencatatan penugasan/peminjaman aset kepada seorang karyawan (`employees`).
* **`asset_movements`**: Log pergerakan lokasi aset dari satu ruangan (`from_room_id`) ke ruangan lainnya (`to_room_id`).
* **`maintenances`**: Riwayat perawatan berkala dan perbaikan aset yang melibatkan penyedia jasa (`vendors`).

### E. Domain Stock Opname
* **`stock_opnames`**: Sesi audit fisik inventarisasi aset per gedung.
* **`stock_opname_items`**: Detail pemeriksaan aset per item dalam sesi audit, membandingkan ekspektasi lokasi awal (`expected_room`) dengan lokasi aktual fisik (`actual_room`) serta mencatat kondisi terbaru.

### F. Domain Media, Pelaporan, & Audit (Media, Reporting, Audit Logs)
* **`asset_media` & `asset_documents`**: Dokumen digital (Sertifikat, BPKB, Invoice) dan media visual (Foto Aset, Foto Kerusakan) yang terlampir pada aset.
* **`notifications`**: Notifikasi operasional (misal: pengingat pajak kendaraan, jadwal perawatan rutin) untuk user penerima.
* **`generated_reports`**: Riwayat dokumen laporan (PDF/CSV/Excel) yang diekspor oleh pengguna.
* **`audit_logs`**: Catatan aktivitas transaksional pengguna di tingkat aplikasi untuk tujuan akuntabilitas hukum.

---

## 3. Alasan Desain Relasi Penting

### 1. Desain Polimorfisme Aset 1:1 (Class Table Inheritance)
* **Relasi:** `assets` $\rightarrow$ `vehicle_details` / `art_details` / dll. (1:0..1)
* **Alasan Desain:** Atribut spesifik kendaraan (nomor pelat, nomor mesin) sangat tidak relevan bagi aset karya seni (nama pelukis, gaya lukisan). Dengan memisahkan kolom spesifik ini ke tabel eksternal, tabel utama `assets` tetap ramping, memiliki performa pencarian yang konsisten, dan mudah diekstensi untuk kategori aset baru tanpa mengubah skema tabel inti.

### 2. Hierarki Lokasi Terisolasi
* **Relasi:** `buildings` (1:N) $\rightarrow$ `floors` (1:N) $\rightarrow$ `zones` (1:N) $\rightarrow$ `rooms` (1:N) $\rightarrow$ `assets` (1:N)
* **Alasan Desain:** Relasi bertingkat ini memastikan penelusuran lokasi aset konsisten secara spasial. Aset tidak langsung merujuk ke gedung atau lantai, melainkan hanya ke ruangan (`room_id`). Ruangan secara otomatis mewarisi relasi zona, lantai, dan gedung di atasnya. Ini menyederhanakan pembaruan lokasi dan rendering peta isometrik dinamis.

### 3. Pemisahan Log Riwayat (Assignments & Movements)
* **Relasi:** `assets` ||--o{ `asset_assignments` dan `assets` ||--o{ `asset_movements`
* **Alasan Desain:** Lokasi saat ini (`room_id`) dan PIC saat ini (`current_pic_id`) disimpan langsung di tabel `assets` untuk query cepat tampilan daftar. Namun, setiap perubahan lokasi atau penanggung jawab wajib memicu insert record baru ke tabel `asset_movements` dan `asset_assignments`. Hal ini menjamin sejarah kepemilikan dan lokasi terlacak secara kronologis tanpa mengganggu performa pembacaan kondisi terkini.

---

## 4. Analisis Masalah Masa Depan & Rekomendasi Penyempurnaan

### Temuan 1: Ambiguitas Hubungan Karyawan (`employees`) dan Pengguna (`users`)
* **Kondisi:** `employees` ||--o| `users` (Relasi 1:1 opsional). Namun, di tabel mutasi dan audit (`asset_movements`, `stock_opnames`, `audit_logs`), pencatatan aktor menggunakan Foreign Key ke tabel `users`.
* **Potensi Masalah:** Bagaimana jika ada mutasi aset yang dilakukan oleh karyawan yang tidak memiliki akun login (`users`), atau sebaliknya? Jika penanggung jawab aset saat ini (`current_pic_id`) merujuk ke `employees.id`, namun pergerakan aset (`moved_by`) mencatat `users.id`, pencarian korelasi aktivitas mutasi karyawan menjadi rumit (memerlukan join ganda).
* **Rekomendasi:** Pastikan semua entitas mutasi mencatat aktor menggunakan `users.id`, tetapi tetapkan kebijakan ketat bahwa setiap `users` wajib terikat ke satu `employees` (bukan opsional) agar data PIC mutasi dan penanggung jawab fisik dapat ditelusuri ke NIP yang sama tanpa celah inkonsistensi.

### Temuan 2: Potensi Masalah pada Penggunaan Relasi Many-to-Many Murni pada Roles & Permissions
* **Kondisi:** Skema menggunakan tabel pivot `role_permissions` tanpa atribut tambahan.
* **Potensi Masalah:** Prisma ORM mendukung penanganan relasi Many-to-Many implisit. Namun, jika di masa depan terdapat kebutuhan untuk menonaktifkan sementara izin tertentu untuk *role* tertentu tanpa menghapus relasi (misalnya menambahkan flag `is_active` pada relasi role-permission), tabel pivot implisit Prisma tidak dapat digunakan.
* **Rekomendasi:** Terapkan **Explicit Many-to-Many** pada `role_permissions` sejak awal pembuatan skema Prisma (mendefinisikan model `RolePermission` secara eksplisit dengan kolom tambahan seperti `created_at` atau `is_active`).

### Temuan 3: Duplikasi Status Kondisi Aset pada Sesi Audit (Stock Opname)
* **Kondisi:** Tabel `stock_opname_items` merekam kolom `condition` yang merujuk langsung ke tabel master `asset_conditions`.
* **Potensi Masalah:** Jika ada proses pembaruan nama kondisi pada master data (misal: "Minor Damage" diganti menjadi "Rusak Ringan"), riwayat kondisi pada saat stock opname di masa lalu akan ikut berubah secara visual pada laporan audit lama. Padahal, laporan audit masa lalu harus bersifat statis sesuai dengan kondisi fisik saat audit dilaksanakan.
* **Rekomendasi:** Kolom kondisi pada tabel `stock_opname_items` sebaiknya menyimpan nilai String hasil salinan teks kondisi saat audit dilakukan (denormalisasi khusus histori), atau pastikan basis data memiliki mekanisme retensi data kondisi historis yang tidak berubah meskipun data master diperbarui.
