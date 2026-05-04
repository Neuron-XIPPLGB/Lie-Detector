const BLYNK_TOKEN = "TJVGOror5c-VtwcyFh1iudIVL-p4T4U8";
const BLYNK_BASE  = "https://blynk.cloud/external/api/get";

AOS.init({ once: false, offset: 80, disable: false, startEvent: 'DOMContentLoaded' });

// TOGGLE KODE
const dots = document.getElementById("dots");
const more = document.getElementById("more");
const btn  = document.getElementById("btnCode");
btn.addEventListener("click", () => {
  const open = dots.classList.contains("hidden");
  dots.classList.toggle("hidden", !open);
  more.classList.toggle("hidden", open);
  btn.textContent = open ? "Baca selengkapnya" : "Tutup";
});

// =============================================
//  GAUGE — hanya dari Blynk
// =============================================
const gaugeCtx      = document.getElementById("gaugeChart");
const gaugeValue    = document.getElementById("gaugeValue");
const blynkStatus   = document.getElementById("blynkStatus");
const btnStart      = document.getElementById("btnStart");
const btnFinish     = document.getElementById("btnFinish");
const inputNama     = document.getElementById("inputNama");
const namaError     = document.getElementById("namaError");
const namaDisplay   = document.getElementById("namaDisplay");
const namaInputArea = document.getElementById("namaInputArea");
const namaTampil    = document.getElementById("namaTampil");
const btnGantiNama  = document.getElementById("btnGantiNama");

const INPUT_CLASS    = "flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-500 text-sm sm:text-base";
const BTN_START_ON   = "px-5 py-2 rounded-lg bg-cyan-500 text-gray-900 font-semibold hover:bg-cyan-400 transition text-sm sm:text-base";
const BTN_START_OFF  = "px-5 py-2 rounded-lg bg-gray-700 text-gray-400 font-semibold cursor-not-allowed transition text-sm sm:text-base";
const BTN_FINISH_ON  = "px-5 py-2 rounded-lg bg-red-500 text-gray-900 font-semibold hover:bg-red-400 transition text-sm sm:text-base";
const BTN_FINISH_OFF = "px-5 py-2 rounded-lg bg-gray-700 text-gray-400 font-semibold cursor-not-allowed transition text-sm sm:text-base";

const gaugeChart = new Chart(gaugeCtx, {
  type: "doughnut",
  data: {
    datasets: [{
      data: [0, 180],
      backgroundColor: ["#22d3ee", "#1f2937"],
      borderWidth: 0,
      circumference: 180,
      rotation: 270
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    cutout: "75%",
    plugins: { legend: { display: false }, tooltip: { enabled: false } }
  }
});

function getStatus(bpm) {
  if (bpm === 0)  return { t: "Menunggu", c: "text-gray-400",   color: "#9ca3af" };
  if (bpm < 90)   return { t: "Tenang",   c: "text-green-400",  color: "#4ade80" };
  if (bpm <= 120) return { t: "Tegang",   c: "text-yellow-400", color: "#facc15" };
  return               { t: "Bohong",   c: "text-red-500",    color: "#ef4444" };
}

function updateGauge(bpm) {
  const clamped = Math.min(bpm, 180);
  const s = getStatus(bpm);
  gaugeChart.data.datasets[0].data = [clamped, 180 - clamped];
  gaugeChart.data.datasets[0].backgroundColor[0] = s.color;
  gaugeChart.update();
  gaugeValue.textContent  = `${bpm} BPM`;
  gaugeValue.className    = `text-4xl sm:text-5xl font-bold ${s.c}`;
  blynkStatus.textContent = `Status: ${s.t}`;
  blynkStatus.className   = `mt-2 text-base sm:text-lg font-semibold ${s.c}`;
}

// =============================================
//  NAMA — tampil, simpan, ganti
// =============================================
let namaPeserta = "";

function setNama(nama) {
  namaPeserta            = nama;
  namaTampil.textContent = nama;
  namaDisplay.classList.remove("hidden");
  namaDisplay.classList.add("flex");
  namaInputArea.classList.add("hidden");
}

function resetKeInputNama() {
  namaDisplay.classList.add("hidden");
  namaDisplay.classList.remove("flex");
  namaInputArea.classList.remove("hidden");
  inputNama.disabled = false;
  inputNama.value    = namaPeserta;
  inputNama.focus();
}

btnGantiNama.addEventListener("click", resetKeInputNama);

// =============================================
//  SESI — start / finish
// =============================================
let fetchInterval = null;
let sessionData   = [];
let secondCount   = 0;

async function fetchBlynk() {
  try {
    const res = await fetch(`${BLYNK_BASE}?token=${BLYNK_TOKEN}&v1`);
    if (!res.ok) throw new Error();
    const bpm = Math.round(parseFloat(await res.text()));
    const value = isNaN(bpm) ? 0 : bpm;
    updateGauge(value);
    if (fetchInterval !== null) {
      secondCount++;
      sessionData.push({ detik: secondCount, bpm: value });
    }
  } catch {
    blynkStatus.textContent = "Status: Gagal terhubung ke Blynk";
    blynkStatus.className   = "mt-2 text-base sm:text-lg font-semibold text-red-400";
  }
}

btnStart.addEventListener("click", () => {
  const nama = inputNama.value.trim();
  if (!nama) {
    namaError.classList.remove("hidden");
    inputNama.focus();
    return;
  }
  namaError.classList.add("hidden");
  setNama(nama);

  sessionData  = [];
  secondCount  = 0;

  fetchBlynk();
  fetchInterval = setInterval(fetchBlynk, 2000);

  btnStart.disabled  = true;
  btnStart.className = BTN_START_OFF;
  btnFinish.disabled  = false;
  btnFinish.className = BTN_FINISH_ON;
  btnGantiNama.disabled = true;
  btnGantiNama.className = "px-3 py-1 rounded bg-gray-800 text-gray-600 text-xs cursor-not-allowed";

  blynkStatus.textContent = "Status: Sesi berjalan...";
  blynkStatus.className   = "mt-2 text-base sm:text-lg font-semibold text-cyan-400";

  document.getElementById("session-result").classList.add("hidden");
});

btnFinish.addEventListener("click", () => {
  clearInterval(fetchInterval);
  fetchInterval = null;

  btnFinish.disabled  = true;
  btnFinish.className = BTN_FINISH_OFF;
  btnStart.disabled   = false;
  btnStart.className  = BTN_START_ON;
  btnGantiNama.disabled = false;
  btnGantiNama.className = "px-3 py-1 rounded bg-gray-700 text-gray-300 text-xs hover:bg-gray-600 transition";

  blynkStatus.textContent = "Sesi selesai.";
  blynkStatus.className   = "mt-2 text-base sm:text-lg font-semibold text-gray-400";

  showResult();
});

// =============================================
//  TAMPILKAN HASIL SESI
// =============================================
function showResult() {
  if (sessionData.length === 0) return;

  const validData = sessionData.filter(d => d.bpm > 0);
  const allBpm    = validData.map(d => d.bpm);
  const avg    = allBpm.length ? Math.round(allBpm.reduce((a, b) => a + b, 0) / allBpm.length) : 0;
  const maks   = allBpm.length ? Math.max(...allBpm) : 0;
  const min    = allBpm.length ? Math.min(...allBpm) : 0;
  const durasi = sessionData.length * 2;

  const counts = { Tenang: 0, Tegang: 0, Bohong: 0 };
  validData.forEach(d => {
    const s = getStatus(d.bpm).t;
    if (counts[s] !== undefined) counts[s]++;
  });
  const dominan = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];

  // nama di header hasil
  document.getElementById("resultNama").textContent = `Peserta: ${namaPeserta}`;

  const cards = [
    { label: "Rata-rata BPM", value: `${avg} BPM`,    color: "text-cyan-400"   },
    { label: "BPM Tertinggi", value: `${maks} BPM`,   color: "text-red-400"    },
    { label: "BPM Terendah",  value: `${min} BPM`,    color: "text-green-400"  },
    { label: "Durasi Sesi",   value: `${durasi} dtk`, color: "text-yellow-400" },
    { label: "Status Dominan",value: dominan,          color: getStatus(avg).c  },
  ];

  document.getElementById("resultCards").innerHTML = cards.map(c => `
    <div class="bg-gray-900 rounded-xl p-4 text-center">
      <p class="text-xs text-gray-500 mb-1">${c.label}</p>
      <p class="text-lg sm:text-xl font-bold ${c.color}">${c.value}</p>
    </div>
  `).join("");

  document.getElementById("resultTable").innerHTML = sessionData.map(d => {
    const s = getStatus(d.bpm);
    return `
      <tr class="border-b border-gray-800">
        <td class="py-2 pr-6">${d.detik}</td>
        <td class="py-2 pr-6">${d.bpm}</td>
        <td class="py-2 font-medium ${s.c}">${s.t}</td>
      </tr>
    `;
  }).join("");

  const section = document.getElementById("session-result");
  section.classList.remove("hidden");
  section.scrollIntoView({ behavior: "smooth", block: "start" });

  document.getElementById("btnDownload").onclick = () => downloadExcel();
}

function downloadExcel() {
  const rows = [
    ["Peserta", namaPeserta],
    [],
    ["Detik ke-", "BPM", "Status"]
  ];

  sessionData.forEach(d => {
    rows.push([d.detik, d.bpm, getStatus(d.bpm).t]);
  });

  const validData = sessionData.filter(d => d.bpm > 0);
  const allBpm    = validData.map(d => d.bpm);
  const avg    = allBpm.length ? Math.round(allBpm.reduce((a, b) => a + b, 0) / allBpm.length) : 0;
  const maks   = allBpm.length ? Math.max(...allBpm) : 0;
  const min    = allBpm.length ? Math.min(...allBpm) : 0;
  const durasi = sessionData.length * 2;
  const counts = { Tenang: 0, Tegang: 0, Bohong: 0 };
  validData.forEach(d => { const s = getStatus(d.bpm).t; if (counts[s] !== undefined) counts[s]++; });
  const dominan = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];

  rows.push(
    [],
    ["Ringkasan"],
    ["Rata-rata BPM", avg],
    ["BPM Tertinggi", maks],
    ["BPM Terendah",  min],
    ["Durasi (detik)", durasi],
    ["Status Dominan", dominan]
  );

  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Hasil Sesi");

  const tanggal = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `LieDetector_${namaPeserta}_${tanggal}.xlsx`);
}

// =============================================
//  LINE CHART — simulasi manual
// =============================================
const lineCtx   = document.getElementById("lieDetectorChart");
const bpmStatus = document.getElementById("bpmStatus");

const lineChart = new Chart(lineCtx, {
  type: "line",
  data: {
    labels: Array.from({length: 10}, (_, i) => `${i + 1}`),
    datasets: [{
      label: "BPM Simulasi",
      data: Array(10).fill(0),
      borderColor: "#22d3ee",
      backgroundColor: "rgba(34,211,238,0.15)",
      tension: 0.4,
      pointRadius: 4
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { min: 0, max: 180, title: { display: true, text: "BPM" } }
    }
  }
});

function simulateBPM(type) {
  let bpm = 0;
  if (type === "tenang") bpm = Math.floor(Math.random() * 20) + 65;
  if (type === "bohong") bpm = Math.floor(Math.random() * 30) + 121;

  const d = lineChart.data.datasets[0].data;
  d.shift();
  d.push(bpm);
  lineChart.update();

  const s = getStatus(bpm);
  bpmStatus.textContent = `Status: ${s.t} (${bpm} BPM)`;
  bpmStatus.className   = `mt-4 text-base sm:text-lg font-semibold ${s.c}`;
}

document.getElementById("resetChart").onclick = () => {
  lineChart.data.datasets[0].data = Array(10).fill(0);
  lineChart.update();
  bpmStatus.textContent = "Status: Menunggu";
  bpmStatus.className   = "mt-4 text-base sm:text-lg font-semibold text-gray-400";
};

document.getElementById("simulateTruth").onclick = () => simulateBPM("tenang");
document.getElementById("simulateLie").onclick   = () => simulateBPM("bohong");
