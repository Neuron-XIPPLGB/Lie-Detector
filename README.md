# NEURON — ESP32 Pulse Sensor Lie Detector (Next.js)

Proyek IoT berbasis **ESP32** dan **Heart Pulse Sensor** untuk mendeteksi respons stres melalui perubahan detak jantung (BPM). Dibuat oleh **XI PPLG B**.

🔗 [Repositori GitHub](https://github.com/Neuron-XIPPLGB/Lie-Detector)

---

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Chart.js** + **react-chartjs-2**
- **Blynk IoT Cloud**
- **OpenRouter AI** (mistralai/mistral-7b-instruct:free)

---

## Fitur

- ✅ **Monitor Real-time** — Gauge BPM dari Blynk Cloud (polling 2 detik)
- ✅ **Tes Lie Detector** — Rekam sesi tes, grafik live, kesimpulan otomatis
- ✅ **Statistik Tes** — BPM tertinggi, rata-rata, terendah, persentase indikasi bohong
- ✅ **Unduh CSV** — Export hasil tes
- ✅ **Riwayat Tes** — Tersimpan di localStorage (maks. 20 sesi)
- ✅ **Simulasi Manual** — Uji tampilan tanpa sensor fisik
- ✅ **NEURON Assistant** — Chatbot AI untuk menjawab pertanyaan proyek

---

## Setup & Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/Neuron-XIPPLGB/Lie-Detector.git
cd neuron-lie-detector
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Environment Variables

Buat file `.env.local` di root folder:

```env
NEXT_PUBLIC_BLYNK_TOKEN=YOUR_BLYNK_TOKEN
OPENROUTER_KEY=YOUR_OPENROUTER_API_KEY
```

**Cara mendapatkan:**
- **Blynk Token**: Daftar di [blynk.cloud](https://blynk.cloud), buat template, salin Auth Token
- **OpenRouter Key**: Daftar di [openrouter.ai](https://openrouter.ai), buat API key gratis

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

### 5. Build untuk Production

```bash
npm run build
npm start
```

---

## Struktur Folder

```
neuron-lie-detector/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # API route untuk OpenRouter
│   ├── components/
│   │   ├── Navbar.tsx            # Navigasi dengan scroll detection
│   │   ├── Hero.tsx              # Hero section dengan background
│   │   ├── ProjectDetails.tsx    # Detail proyek & komponen
│   │   ├── BlynkMonitor.tsx      # Gauge BPM real-time
│   │   ├── TesDetector.tsx       # Tes lie detector dengan chart
│   │   ├── Riwayat.tsx           # Riwayat tes dari localStorage
│   │   ├── Simulasi.tsx          # Simulasi BPM manual
│   │   ├── KodeArduino.tsx       # Kode Arduino dengan toggle
│   │   ├── Chatbot.tsx           # Chatbot AI
│   │   ├── SectionHeader.tsx     # Reusable section header
│   │   └── UI.tsx                # ProgressBar & ScrollTop
│   ├── hooks/
│   │   ├── useBlynk.ts           # Hook untuk polling Blynk
│   │   └── useRiwayat.ts         # Hook untuk localStorage
│   ├── lib/
│   │   └── utils.ts              # Utility functions (getStatus, downloadCSV)
│   ├── globals.css               # Global styles + animasi
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Halaman utama
├── public/
│   └── arduino-diagram.png       # Diagram rangkaian
├── .env.local                    # Environment variables (jangan commit!)
├── package.json
└── README.md
```

---

## Cara Kerja

| BPM | Kondisi |
|-----|---------|
| 0 | Menunggu |
| < 90 | Tenang 🟢 |
| 90 – 120 | Tegang 🟡 |
| > 120 | Kemungkinan Bohong 🔴 |

---

## Kode Arduino (ESP32)

```cpp
#define BLYNK_TEMPLATE_ID   "YOUR_ID"
#define BLYNK_TEMPLATE_NAME "LIE DETECTOR"
#define BLYNK_AUTH_TOKEN    "YOUR_TOKEN"

#include <WiFi.h>
#include <BlynkSimpleEsp32.h>

char ssid[] = "YOUR_SSID";
char pass[] = "YOUR_PASSWORD";

const int PulseSensorPin = 34;
int BPM = 0, lastSensorValue = 0;
unsigned long lastBeat = 0, lastSendTime = 0;
BlynkTimer timer;

void sendData() {
  int sensorValue = analogRead(PulseSensorPin);
  if (sensorValue > 600 && lastSensorValue <= 600) {
    unsigned long now = millis();
    if (now - lastBeat > 600) { BPM = 60000 / (now - lastBeat); lastBeat = now; }
  }
  if (millis() - lastBeat > 9000) BPM = 0;
  lastSensorValue = sensorValue;
  if (millis() - lastSendTime >= 1000) {
    Blynk.virtualWrite(V0, sensorValue);
    Blynk.virtualWrite(V1, BPM);
    Blynk.virtualWrite(V2, BPM == 0 ? "Menunggu..." : BPM < 90 ? "Tenang" : BPM <= 120 ? "Tegang" : "Bohong");
    lastSendTime = millis();
  }
}

void setup() { Blynk.begin(BLYNK_AUTH_TOKEN, ssid, pass); timer.setInterval(50L, sendData); }
void loop()  { Blynk.run(); timer.run(); }
```

**Virtual Pin Blynk:**
| Pin | Data |
|-----|------|
| V0 | Nilai raw sensor |
| V1 | BPM |
| V2 | Status teks |

---

## Deploy

### Vercel (Recommended)

1. Push ke GitHub
2. Import di [vercel.com](https://vercel.com)
3. Tambahkan environment variables di Vercel dashboard
4. Deploy otomatis

### Netlify

```bash
npm run build
# Upload folder .next ke Netlify
```

---

## Catatan Penting

⚠️ **Proyek ini bersifat edukatif**. Hasil deteksi bukan bukti forensik resmi — perubahan BPM dapat dipengaruhi banyak faktor selain kebohongan.

🔒 **Jangan commit `.env.local`** ke repository publik. API key harus dijaga kerahasiaannya.

---

**NEURON · XI PPLG B · 2025**
