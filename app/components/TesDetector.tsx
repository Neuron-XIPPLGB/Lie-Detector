'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Filler, LineController } from 'chart.js';
import { getStatus } from '../lib/utils';
import { useRiwayat } from '../hooks/useRiwayat';
import SectionHeader from './SectionHeader';

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, LineController);

interface TesRow { nama: string; bpm: number; waktu: string; }

export default function TesDetector({ liveBpm, riwayatHook }: { liveBpm: number; riwayatHook: ReturnType<typeof useRiwayat> }) {
  const [testing, setTesting]   = useState(false);
  const [nama, setNama]         = useState('');
  const [rows, setRows]         = useState<TesRow[]>([]);
  const [kesimpulan, setKesimpulan] = useState<null | { text: string; detail: string; persen: string; max: number; avg: number; min: number; cls: string; borderCls: string; rawData: TesRow[] }>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef  = useRef<Chart | null>(null);
  const tesDataRef = useRef<TesRow[]>([]);
  const { simpan } = riwayatHook;

  useEffect(() => {
    if (!canvasRef.current) return;
    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: { labels: [], datasets: [{ label: 'BPM', data: [], borderColor: '#22d3ee', backgroundColor: 'rgba(34,211,238,0.1)', tension: 0.4, pointRadius: 3, fill: true }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
          y: { min: 0, max: 180, ticks: { color: '#9ca3af' }, grid: { color: '#374151' } },
          x: { ticks: { color: '#9ca3af', maxTicksLimit: 8 }, grid: { color: '#374151' } },
        },
        plugins: { legend: { display: false } },
      },
    });
    return () => chartRef.current?.destroy();
  }, []);

  const recordBpm = useCallback(() => {
    if (!testing || isNaN(liveBpm)) return;
    const waktu = new Date().toLocaleTimeString('id-ID');
    const row: TesRow = { nama, bpm: liveBpm, waktu };
    tesDataRef.current.push(row);
    setRows(prev => [...prev, row]);
    const s = getStatus(liveBpm);
    if (chartRef.current) {
      chartRef.current.data.labels!.push(waktu);
      chartRef.current.data.datasets[0].data.push(liveBpm);
      (chartRef.current.data.datasets[0] as never as { borderColor: string; backgroundColor: string }).borderColor = s.color;
      (chartRef.current.data.datasets[0] as never as { borderColor: string; backgroundColor: string }).backgroundColor = s.color + '22';
      chartRef.current.update();
    }
  }, [testing, liveBpm, nama]);

  useEffect(() => {
    if (!testing) return;
    const id = setInterval(recordBpm, 2000);
    return () => clearInterval(id);
  }, [testing, recordBpm]);

  function mulai() {
    if (!nama.trim()) { alert('Masukkan nama terlebih dahulu!'); return; }
    tesDataRef.current = [];
    setRows([]);
    setKesimpulan(null);
    if (chartRef.current) { chartRef.current.data.labels = []; chartRef.current.data.datasets[0].data = []; chartRef.current.update(); }
    setTesting(true);
  }

  function selesai() {
    setTesting(false);
    const data = [...tesDataRef.current];
    const bpms = data.map(r => r.bpm).filter(b => b > 0);
    if (!bpms.length) return;
    const avg = Math.round(bpms.reduce((a, b) => a + b, 0) / bpms.length);
    const max = Math.max(...bpms);
    const min = Math.min(...bpms);
    const s = getStatus(avg);
    const pBohong = Math.round((bpms.filter(b => b > 120).length / bpms.length) * 100);
    const colorMap: Record<string, string> = { 'text-green-400': 'border-green-500 bg-green-500/10', 'text-yellow-400': 'border-yellow-500 bg-yellow-500/10', 'text-red-500': 'border-red-500 bg-red-500/10', 'text-gray-400': 'border-gray-600 bg-gray-800' };
    setKesimpulan({
      text: `${s.t} — Rata-rata ${avg} BPM`,
      detail: `Dari ${bpms.length} data yang direkam, kondisi subjek dinilai: ${s.t}.`,
      persen: pBohong === 0 ? 'Tidak terdeteksi indikasi kebohongan.' : pBohong < 30 ? `Indikasi kebohongan rendah (${pBohong}%).` : pBohong < 60 ? `Indikasi kebohongan sedang — ${pBohong}% BPM di atas normal.` : `Indikasi kebohongan tinggi — ${pBohong}% BPM sangat tinggi.`,
      max, avg, min, cls: s.c, borderCls: colorMap[s.c] || 'border-gray-600 bg-gray-800', rawData: data,
    });
    const namaFinal = nama;
    const waktuFinal = new Date().toLocaleString('id-ID');
    setRows([]);
    setNama('');
    if (chartRef.current) {
      chartRef.current.data.labels = [];
      chartRef.current.data.datasets[0].data = [];
      chartRef.current.update();
    }
    simpan({ nama: namaFinal, avg, max, min, kondisi: s.t, waktu: waktuFinal, rawData: data });
  }

  return (
    <section id="tes-detector" className="py-12 sm:py-20">
      <SectionHeader title="Tes Lie Detector" />
      <p className="text-gray-300 text-sm sm:text-base mb-6">Masukkan nama, lalu tekan <strong>Mulai Tes</strong> untuk merekam data BPM dari sensor.</p>
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input value={nama} onChange={e => setNama(e.target.value)} disabled={testing} placeholder="Masukkan nama..."
            className="flex-1 px-4 py-2 rounded bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-500 text-sm disabled:opacity-50" />
          <button onClick={mulai} disabled={testing} className="px-5 py-2 rounded bg-cyan-500 text-gray-900 font-semibold hover:bg-cyan-400 transition text-sm disabled:opacity-40 disabled:cursor-not-allowed">Mulai Tes</button>
          <button onClick={selesai} disabled={!testing} className="px-5 py-2 rounded bg-red-500 text-gray-900 font-semibold hover:bg-red-400 transition text-sm disabled:opacity-40 disabled:cursor-not-allowed">Selesai Tes</button>
        </div>
        <p className={`text-sm mb-4 ${testing ? 'text-cyan-400' : 'text-gray-400'}`}>
          {testing ? `Status: Sedang merekam data untuk "${nama}"...` : 'Status: Belum dimulai'}
        </p>
        <div className="bg-gray-800 rounded-lg p-3 sm:p-4 h-48 sm:h-64 mb-6">
          <canvas ref={canvasRef} />
        </div>
        {kesimpulan && (
          <div className={`mb-6 p-4 rounded-lg border ${kesimpulan.borderCls}`}>
            <p className="text-sm font-semibold mb-1 text-gray-300">Kesimpulan Tes</p>
            <p className={`text-lg font-bold ${kesimpulan.cls}`}>{kesimpulan.text}</p>
            <p className="text-sm text-gray-400 mt-1">{kesimpulan.detail}</p>
            <p className={`text-sm mt-1 ${kesimpulan.cls}`}>{kesimpulan.persen}</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[{ label: 'Tertinggi', val: kesimpulan.max, cls: 'text-red-400' }, { label: 'Rata-rata', val: kesimpulan.avg, cls: 'text-cyan-400' }, { label: 'Terendah', val: kesimpulan.min, cls: 'text-green-400' }].map(s => (
                <div key={s.label} className="bg-gray-800 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                  <p className={`text-lg font-bold ${s.cls}`}>{s.val} BPM</p>
                </div>
              ))}
            </div>

          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead><tr className="text-gray-400 border-b border-gray-700"><th className="pb-2 pr-4">No</th><th className="pb-2 pr-4">Nama</th><th className="pb-2 pr-4">BPM</th><th className="pb-2">Waktu</th></tr></thead>
            <tbody className="text-gray-300">
              {rows.map((r, i) => {
                const s = getStatus(r.bpm);
                return <tr key={i} className="border-b border-gray-800 hover:bg-white/[0.02]"><td className="py-1 pr-4">{i + 1}</td><td className="py-1 pr-4">{r.nama}</td><td className={`py-1 pr-4 font-semibold ${s.c}`}>{r.bpm}</td><td className="py-1">{r.waktu}</td></tr>;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
