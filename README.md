# PULSE FIT AI — Aplikasi Workout Routine & Voice AI Personal Trainer Pro

Aplikasi Workout Routine terlengkap dan tercanggih dengan panduan suara instruktur interaktif (*Voice Coach*), animasi vektor anatomi biomekanik bergerak, asisten *Voice-to-Voice AI Personal Trainer* cerdas berkecepatan tinggi, dan sistem proteksi lisensi otomatis yang terintegrasi langsung dengan penjualan di **Lynk.id**.

---

## ⚡ Fitur Utama Aplikasi

### 1. 🎯 Smart Trainee Onboarding & Assessment Wizard
- **Level Kebugaran**: Pemula (*Beginner*), Menengah (*Intermediate*), Mahir (*Advanced*).
- **Target Hasil Fisik**:
  - Otot Sixpack & Perut Ramping (*Core Definition*)
  - Hilangkan Perut Buncit (*Visceral Fat Burn*)
  - Turun Berat Badan (*Metabolic Fat Loss*)
  - Pembentukan Massa Otot (*Muscle Hypertrophy*)
  - Perbaikan Postur & Stamina Atletik
- **Durasi Fleksibel**: 7 Hari (Kickstart), 14 Hari (Reset), 30 Hari (Total Transformation), 3 Bulan / 90 Hari (Ultimate).
- **Pilihan Peralatan**:
  - Tanpa Alat (*Bodyweight / Calisthenics* di rumah / matras)
  - Dumbbell Rumah & Gym
- **Penyesuaian Fisik & Sendi**: Opsi *Low Impact* ramah sendi bagi yang memiliki keluhan nyeri lutut (tanpa lompatan berlebih).
- **Generator Program Cerdas**: Otomatis menyusun jadwal hari-demi-hari (Hari 1 s/d Hari N) lengkap dengan *Rest Day* & *Active Recovery*.

---

### 2. 🧬 Katalog Gerakan & Animasi Biomekanik Vektor (SVG)
- Animasi anatomi dinamis interaktif untuk setiap gerakan (Push-up, Squat, Forearm Plank, Abdominal Crunches, Mountain Climbers, Lunges, Jumping Jacks, Burpees, Leg Raises, Russian Twist, Bicep Curls, Bent-Over Rows, Shoulder Press, dll).
- Indikator visual target otot (*Muscle Heatmap*).
- Panduan tempo repetisi (misal: 2 detik turun, 1 detik tahan, 1 detik dorong eksplosif).
- Panduan pernapasan (*Inhale / Exhale pattern*).
- Daftar kesalahan umum yang wajib dihindari.

---

### 3. ⏱️ Live Workout Player dengan Suara Personal Trainer
- Layar interaktif latihan berukuran besar (*high-visibility timer*) yang sangat mudah dipantau saat Anda berolahraga dari kejauhan.
- Efek suara berbasis **Web Audio API** (Bunyi *beep countdown 3-2-1*, peluit instruktur gym, dan *victory fanfare*).
- **3 Persona Pelatih Suara (Bahasa Indonesia)**:
  1. **Coach Bima**: Energetik, berenergi tinggi, disiplin Spartan/CrossFit.
  2. **Coach Maya**: Ramah, suportif, membimbing teknik & napas dengan tenang.
  3. **Coach Alex**: Presisi, fokus teknik, mind-muscle connection.
- Suara otomatis memberi komando:
  - *Start Cue*: *"Mulai push-up! Jaga tubuh lurus seperti papan kayu, rasakan dorongan kuat dari dada!"*
  - *Halfway Cue*: *"Setengah waktu selesai! Tahan form tetap sempurna, kamu luar biasa!"*
  - *10-Second Warning*: *"10 detik terakhir! Jangan berhenti, dorong sampai detik nol!"*
  - *Rest Cue*: *"Selesai! Waktu istirahat 30 detik. Tarik napas dalam dan minum sedikit air..."*

---

### 4. 🎙️ Voice-to-Voice AI Personal Trainer ("Tanya Coach AI")
- Trainee dapat berbicara langsung melalui mikrofon (*Web Speech Recognition* bahasa Indonesia).
- **Respon Sangat Cepat & Berbasis Suara**: Coach langsung membalas dalam hitungan milidetik menggunakan suara manusia yang responsif.
- **Dual-Engine AI**:
  - **Built-in Local PT Brain**: Menjawab instan (< 200ms) ratusan pertanyaan umum seputar sixpack, defisit kalori, kebutuhan protein, suplemen creatine/whey, cara mengatasi pegal (DOMS), sendi lutut, push-up pemula.
  - **Google Gemini API**: Trainee atau Anda dapat memasukkan Gemini API Key di menu Pengaturan untuk kecerdasan tak terbatas secara *real-time*.

---

### 5. 🥗 Kalkulator Nutrisi Makro & Pelacak Hidrasi
- Kalkulator BMR & TDEE (Harris-Benedict formula) untuk pria & wanita.
- Target gramasi harian untuk **Protein, Karbohidrat, dan Lemak Sehat**.
- Pelacak 8 gelas air harian (*Hydration Tracker*) dengan animasi volume air.

---

## 🔒 Sistem Lisensi Otomatis Lynk.id, Netlify Blobs & Supabase Database

Aplikasi ini diproteksi dengan sistem **Lock Screen Eksklusif** yang otomatis membuka akses ketika customer menyelesaikan pembayaran di **Lynk.id**.

### 🔄 Alur Pembelian & Buka Akses Otomatis:
1. **Pembeli Checkout di Lynk.id**: Customer memasukkan email dan membayar produk di toko Lynk.id Anda (`https://lynk.id/olapoal`).
2. **Webhook Lynk.id / Google Apps Script**: Lynk.id secara instan mengirim data transaksi ke endpoint serverless:
   `https://<nama-aplikasi>.netlify.app/.netlify/functions/lynk-webhook`
3. **Penyimpanan Permanen (Dual Cloud Storage)**:
   - **Supabase Cloud PostgreSQL**: Tabel `workout_buyers` (sangat cepat, visual dashboard tabel modern).
   - **Netlify Blobs**: Cloud database serverless bawaan Netlify sebagai backup otomatis.
4. **Buka Akses Otomatis**:
   - Pembeli membuka website aplikasi Anda.
   - Layar terkunci (*Lock Screen*) meminta email pembelian.
   - Pembeli mengetik emailnya, klik **"Buka Akses Program Saya"**, sistem memvalidasi ke Supabase/Blobs dalam hitungan detik.
   - Status lisensi tersimpan otomatis di perangkat pembeli (tidak perlu login ulang).

---

## 🗄️ Panduan Setup Database Supabase (3 Langkah Mudah)

File skema SQL telah disediakan lengkap di file: 👉 **[`supabase-schema.sql`](supabase-schema.sql)**

### Langkah 1: Buat Project di Supabase
1. Buka [https://supabase.com](https://supabase.com) dan buat akun gratis.
2. Klik **"New Project"**, beri nama (misal: `workout-routine`), tentukan kata sandi database, lalu klik **Create new project**.

### Langkah 2: Eksekusi SQL Script
1. Masuk ke menu **SQL Editor** (ikon terminal/SQL di menu samping kiri).
2. Klik tombol **"New query"**.
3. Buka file **`supabase-schema.sql`** di project ini, salin (*copy*) seluruh isinya, dan tempelkan (*paste*) ke SQL Editor Supabase.
4. Klik tombol **"Run"** (atau tekan `Ctrl + Enter`).
5. Selesai! Tiga tabel utama langsung terbuat:
   - `workout_buyers`: Tabel pembeli Lynk.id & hak akses VIP.
   - `trainee_profiles`: Tabel kuesioner assessment & program latihan.
   - `workout_logs`: Tabel riwayat latihan harian & kalori terbakar.

### Langkah 3: Ambil Kunci API & Hubungkan
1. Di dashboard Supabase, buka menu **Project Settings** (ikon gerigi) ➜ **API**.
2. Salin:
   - **Project URL** (contoh: `https://xxxxxxxxxxxx.supabase.co`)
   - **anon / public key** (kunci panjang `eyJhbGciOi...`)
3. Masukkan ke Netlify Environment Variables:
   - `SUPABASE_URL`: `https://xxxxxxxxxxxx.supabase.co`
   - `SUPABASE_KEY`: `eyJhbGciOi...`
   - `ADMIN_KEY`: `workout-admin-secret-2026` *(atau password admin pilihan Anda)*
4. Atau masukkan langsung di menu **Portal Admin** ([admin.html](admin.html)) untuk pengujian langsung tanpa deploy ulang.

---

## 🚀 Panduan Deploy ke Netlify

1. Hubungkan repositori GitHub ini ke **Netlify** ([https://app.netlify.com](https://app.netlify.com)).
2. Build Settings:
   - **Build Command**: *(kosongkan atau `npm install`)*
   - **Publish Directory**: `.` *(root)*
   - **Functions Directory**: `netlify/functions`
3. Tambahkan **Environment Variable** di Netlify Site Settings:
   - `ADMIN_KEY`: Buat kata sandi rahasia untuk dashboard admin Anda.
4. Selesai! Website Anda langsung aktif dengan SSL HTTPS gratis dan domain Netlify.

---

## ⚙️ Panduan Konfigurasi Lynk.id & Toko Digital

### 1. Konfigurasi Produk di Lynk.id
- Masuk ke dashboard toko Lynk.id Anda di: **[https://lynk.id](https://lynk.id)**
- **Buat Produk Digital Baru**:
  - **Nama Produk**: Beri awalan **`[WORKOUT]`**, contoh:
    `[WORKOUT] Aplikasi Workout Routine Pro & Voice Personal Trainer`
  - **Harga**: Tentukan harga jual (misal Rp 49.000 atau Rp 99.000 sekali bayar seumur hidup).
  - **Thank You Page / Redirect URL**:
    Arahkan pembeli ke URL website Netlify Anda:
    `https://<nama-aplikasi>.netlify.app/?email={buyer_email}`

---

### 2. Otomasi Membaca Email Pembelian Lynk.id via Google Apps Script (100% Gratis)
Jika Lynk.id Anda belum mengaktifkan webhook langsung, pasang script otomatis ini di **[script.google.com](https://script.google.com)** (berjalan di cloud Google 24 jam nonstop):

```javascript
const NETLIFY_WEBHOOK_URL = "https://<nama-aplikasi-anda>.netlify.app/.netlify/functions/lynk-webhook";

function periksaEmailPembelianLynkIdWorkout() {
  // Hanya mencari email Lynk.id yang memuat nama produk [WORKOUT]
  const query = 'from:(lynk.id) "[WORKOUT]" -label:WORKOUT-PROCESSED';
  const threads = GmailApp.search(query, 0, 10);
  if (threads.length === 0) return;

  let label = GmailApp.getUserLabelByName("WORKOUT-PROCESSED") || GmailApp.createLabel("WORKOUT-PROCESSED");

  threads.forEach(thread => {
    thread.getMessages().forEach(message => {
      const body = message.getPlainBody();
      const subject = message.getSubject();
      
      // Validasi ketat bahwa ini memang produk [WORKOUT]
      if (subject.includes("[WORKOUT]") || body.includes("[WORKOUT]")) {
        const emailMatches = body.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
        if (emailMatches) {
          const buyerEmail = emailMatches.find(e => 
            !e.includes("lynk.id") && !e.includes("google.com") && 
            e.toLowerCase() !== Session.getActiveUser().getEmail().toLowerCase()
          );

          if (buyerEmail) {
            UrlFetchApp.fetch(NETLIFY_WEBHOOK_URL, {
              method: "post",
              contentType: "application/json",
              payload: JSON.stringify({
                customer_email: buyerEmail,
                customer_name: "Trainee Lynk.id",
                product_name: "[WORKOUT] Aplikasi Workout Routine Pro",
                order_id: "LYNK-WO-" + message.getDate().getTime()
              })
            });
          }
        }
      }
    });
    thread.addLabel(label);
  });
}
```

---

## 🛠️ Dashboard Admin (`admin.html`)

Aplikasi dilengkapi dashboard admin khusus di file:
👉 **`admin.html`**

Fungsi Admin Portal:
1. **Melihat Seluruh Pembeli**: Daftar email, nama, nomor pesanan, dan tanggal pembelian.
2. **Tambah Pembeli Manual**: Berikan akses ke teman/tester secara langsung tanpa perlu bayar.
3. **Cabut Lisensi**: Menghapus akses email tertentu jika terjadi refund atau penyalahgunaan.
4. **Simulator Webhook Lynk.id**: Uji coba pengiriman payload pembelian langsung dari antarmuka web.

---

## 📂 Struktur File Proyek

```
├── index.html                   # Aplikasi utama untuk Trainee (Daily Routine, Voice AI, Player)
├── admin.html                   # Dashboard admin untuk kelola pembeli & simulator webhook
├── README.md                    # Dokumentasi lengkap & petunjuk integrasi Lynk.id
├── package.json                 # Manifest dependensi (@netlify/blobs)
├── netlify.toml                 # Konfigurasi build & serverless Netlify
├── .gitignore                   # Git ignore file
│
├── css/
│   └── style.css                # Desain athletic dark-mode modern, quiet luxury & responsif
│
├── js/
│   ├── app.js                   # State program, onboarding questionnaire, tab navigation
│   ├── exercises.js             # Database latihan lengkap + generator animasi SVG biomekanik
│   ├── voice-ai.js              # Web Audio SFX + Voice Coach + Voice-to-Voice AI Chatbot
│   ├── workout-player.js        # Fullscreen workout player, timers, rest intervals & voice cues
│   └── auth-lynk.js             # Verifikasi lisensi email Lynk.id & mode demo
│
├── assets/
│   └── logo.png                 # Logo & icon aplikasi
│
└── netlify/
    └── functions/
        ├── verify-email.js      # Verifikasi lisensi email pembeli
        ├── lynk-webhook.js      # Penerima webhook pembayaran otomatis Lynk.id
        └── admin-buyers.js      # Endpoint manajemen data pembeli khusus admin
```
