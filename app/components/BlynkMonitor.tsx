'use client';
import { useEffect, useRef } from 'react';
import { Chart, ArcElement, DoughnutController, Tooltip } from 'chart.js';
import { useBlynk } from '../hooks/useBlynk';
import SectionHeader from './SectionHeader';

Chart.register(ArcElement, DoughnutController, Tooltip);

const legend = [
  { color: 'bg-gray-400',   label: '0 BPM → Menunggu' },
  { color: 'bg-green-400',  label: '< 90 BPM → Tenang' },
  { color: 'bg-yellow-400', label: '90 – 120 BPM → Tegang' },
  { color: 'bg-red-500',    label: '> 120 BPM → Bohong' },
];

export default function BlynkMonitor({ onBpm }: { onBpm?: (bpm: number) => void }) {
  const { bpm, status, error } = useBlynk();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef  = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    chartRef.current = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: { datasets: [{ data: [0, 180], backgroundColor: ['#22d3ee', '#1f2937'], borderWidth: 0, circumference: 180, rotation: 270 } as never] },
      options: { responsive: true, maintainAspectRatio: true, cutout: '75%', plugins: { legend: { display: false }, tooltip: { enabled: false } } },
    });
    return () => chartRef.current?.destroy();
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;
    const clamped = Math.min(bpm, 180);
    chartRef.current.data.datasets[0].data = [clamped, 180 - clamped];
    (chartRef.current.data.datasets[0] as never as { backgroundColor: string[] }).backgroundColor[0] = status.color;
    chartRef.current.update();
    onBpm?.(bpm);
  }, [bpm, status.color, onBpm]);

  return (
    <section id="blynk-monitor" className="py-12 sm:py-20">
      <SectionHeader title="Monitor Real-time dari Blynk" />
      <p className="text-gray-300 text-sm sm:text-base mb-6">Data BPM langsung dari sensor ESP32 melalui Blynk Cloud.</p>
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 sm:p-8 transition-transform hover:-translate-y-1">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10">
          <div className="w-48 sm:w-64 shrink-0">
            <p className="text-xs text-gray-500 mb-2 text-center">Gauge BPM Real-time</p>
            <canvas ref={canvasRef} />
          </div>
          <div className="flex flex-col items-center sm:items-start justify-center flex-1 text-center sm:text-left">
            <p className={`text-4xl sm:text-5xl font-bold ${status.c}`}>{bpm} BPM</p>
            <p className={`mt-2 text-base sm:text-lg font-semibold ${error ? 'text-red-400' : status.c}`}>
              {error ? 'Status: Gagal terhubung ke Blynk' : `Status: ${status.t}`}
            </p>
            <ul className="mt-6 space-y-2 text-gray-300 text-sm sm:text-base">
              {legend.map(l => (
                <li key={l.label} className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${l.color} shrink-0`} />
                  <span>{l.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
