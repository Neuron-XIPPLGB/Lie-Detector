export function getStatus(bpm: number) {
  if (bpm === 0)  return { t: 'Menunggu', c: 'text-gray-400',   color: '#9ca3af' };
  if (bpm < 90)   return { t: 'Tenang',   c: 'text-green-400',  color: '#4ade80' };
  if (bpm <= 120) return { t: 'Tegang',   c: 'text-yellow-400', color: '#facc15' };
  return               { t: 'Bohong',   c: 'text-red-500',    color: '#ef4444' };
}

export function downloadCSV(rawData: { nama: string; bpm: number; waktu: string }[], nama: string, waktu: string) {
  const ts = (waktu ?? '').replace(/[/:, ]/g, '-').slice(0, 19);
  const bpms = rawData.map(r => r.bpm).filter(b => b > 0);
  const avg = bpms.length ? Math.round(bpms.reduce((a, b) => a + b, 0) / bpms.length) : 0;
  const max = bpms.length ? Math.max(...bpms) : 0;
  const min = bpms.length ? Math.min(...bpms) : 0;
  const pBohong = bpms.length ? Math.round((bpms.filter(b => b > 120).length / bpms.length) * 100) : 0;
  const rows = [
    `Nama,${nama}`, `Waktu Tes,${waktu}`, `Rata-rata BPM,${avg}`,
    `BPM Tertinggi,${max}`, `BPM Terendah,${min}`, `Persentase Indikasi Bohong,${pBohong}%`,
    '', 'no,nama,bpm,waktu',
    ...rawData.map((r, i) => `${i + 1},${r.nama},${r.bpm},${r.waktu}`),
  ];
  const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `hasil_tes_${nama}_${ts}.csv`;
  a.click();
}
