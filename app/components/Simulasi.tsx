'use client';
import { useEffect, useRef, useState } from 'react';
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Filler, LineController, Title } from 'chart.js';
import { getStatus } from '../lib/utils';
import SectionHeader from './SectionHeader';

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, LineController, Title);

export default function Simulasi() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef  = useRef<Chart | null>(null);
  const [status, setStatus] = useState({ text: 'Menunggu', cls: 'text-gray-400' });

  useEffect(() => {
    if (!canvasRef.current) return;
    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: Array.from({ length: 10 }, (_, i) => `${i + 1}`),
        datasets: [{ label: 'BPM Simulasi', data: Array(10).fill(0), borderColor: '#22d3ee', backgroundColor: 'rgba(34,211,238,0.15)', tension: 0.4, pointRadius: 4 }],
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { min: 0, max: 180, title: { display: true, text: 'BPM' } } } },
    });
    return () => chartRef.current?.destroy();
  }, []);

  function simulate(type: 'tenang' | 'bohong') {
    const bpm = type === 'tenang' ? Math.floor(Math.random() * 20) + 65 : Math.floor(Math.random() * 30) + 121;
    const s = getStatus(bpm);
    if (chartRef.current) {
      const d = chartRef.current.data.datasets[0].data as number[];
      d.shift(); d.push(bpm);
      chartRef.current.update();
    }
    setStatus({ text: `${s.t} (${bpm} BPM)`, cls: s.c });
  }

  function reset() {
    if (chartRef.current) { chartRef.current.data.datasets[0].data = Array(10).fill(0); chartRef.current.update(); }
    setStatus({ text: 'Menunggu', cls: 'text-gray-400' });
  }

  return (
    <section id="data-visualization" className="py-12 sm:py-20">
      <SectionHeader title="Simulasi BPM (Testing Manual)" />
      <p className="text-gray-300 text-sm sm:text-base mb-6">Gunakan tombol di bawah untuk mensimulasikan kondisi berbeda tanpa sensor.</p>
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 sm:p-6 h-56 sm:h-80">
        <canvas ref={canvasRef} />
      </div>
      <p className={`mt-4 text-base sm:text-lg font-semibold ${status.cls}`}>Status: {status.text}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={() => simulate('tenang')} className="flex-1 sm:flex-none px-4 py-2 rounded bg-green-500 text-gray-900 font-medium hover:bg-green-400 transition text-sm">Simulasikan Tenang</button>
        <button onClick={() => simulate('bohong')} className="flex-1 sm:flex-none px-4 py-2 rounded bg-red-500 text-gray-900 font-medium hover:bg-red-400 transition text-sm">Simulasikan Bohong</button>
        <button onClick={reset} className="flex-1 sm:flex-none px-4 py-2 rounded bg-gray-600 text-gray-100 font-medium hover:bg-gray-500 transition text-sm">Reset</button>
      </div>
    </section>
  );
}
