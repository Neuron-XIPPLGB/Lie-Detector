'use client';
import { useRiwayat } from '../hooks/useRiwayat';
import { downloadCSV } from '../lib/utils';
import SectionHeader from './SectionHeader';

export default function Riwayat({ riwayatHook }: { riwayatHook: ReturnType<typeof import('../hooks/useRiwayat').useRiwayat> }) {
  const { riwayat, hapusSemua } = riwayatHook;

  return (
    <section id="riwayat" className="py-12 sm:py-20">
      <SectionHeader title="Riwayat Tes" />
      <p className="text-gray-300 text-sm sm:text-base mb-6">Riwayat tes tersimpan otomatis di perangkat ini.</p>
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-400">Total: <span className="text-cyan-400 font-semibold">{riwayat.length}</span> sesi</p>
          <button onClick={() => { if (confirm('Hapus semua riwayat tes?')) hapusSemua(); }} className="text-xs text-red-400 hover:text-red-300 transition">Hapus Semua</button>
        </div>
        <div className="space-y-3">
          {riwayat.length === 0
            ? <p className="text-sm text-gray-600 text-center py-4">Belum ada riwayat tes.</p>
            : riwayat.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg text-sm gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-200">{r.nama}</p>
                  <p className="text-xs text-gray-500">{r.waktu}</p>
                </div>
                <button onClick={() => downloadCSV(r.rawData, r.nama, r.waktu)}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-cyan-500/20 border border-gray-600 hover:border-cyan-500 text-xs text-gray-300 hover:text-cyan-400 font-medium transition-all">
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Unduh CSV
                </button>
              </div>
            ))
          }
        </div>
      </div>
    </section>
  );
}
