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
const gaugeCtx    = document.getElementById("gaugeChart");
const gaugeValue  = document.getElementById("gaugeValue");
const blynkStatus = document.getElementById("blynkStatus");

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
  if (bpm === 0)  return { t: "Menunggu",  c: "text-gray-400",   color: "#9ca3af" };
  if (bpm < 90)   return { t: "Tenang",    c: "text-green-400",  color: "#4ade80" };
  if (bpm <= 120) return { t: "Tegang",    c: "text-yellow-400", color: "#facc15" };
  return               { t: "Bohong",    c: "text-red-500",    color: "#ef4444" };
}

function updateGauge(bpm) {
  const clamped = Math.min(bpm, 180);
  const s = getStatus(bpm);
  gaugeChart.data.datasets[0].data = [clamped, 180 - clamped];
  gaugeChart.data.datasets[0].backgroundColor[0] = s.color;
  gaugeChart.update();
  gaugeValue.textContent = `${bpm} BPM`;
  gaugeValue.className   = `mt-4 text-3xl sm:text-4xl font-bold ${s.c}`;
  blynkStatus.textContent = `Status: ${s.t}`;
  blynkStatus.className   = `mt-2 text-base sm:text-lg font-semibold ${s.c}`;
}

async function fetchBlynk() {
  try {
    const res = await fetch(`${BLYNK_BASE}?token=${BLYNK_TOKEN}&v1`);
    if (!res.ok) throw new Error();
    const bpm = Math.round(parseFloat(await res.text()));
    updateGauge(isNaN(bpm) ? 0 : bpm);
  } catch {
    blynkStatus.textContent = "Status: Gagal terhubung ke Blynk";
    blynkStatus.className   = "mt-2 text-base sm:text-lg font-semibold text-red-400";
  }
}

fetchBlynk();
setInterval(fetchBlynk, 2000);

// =============================================
//  LINE CHART — hanya dari simulasi manual
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
