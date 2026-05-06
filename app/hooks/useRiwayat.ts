'use client';
import { useState, useEffect } from 'react';

export interface RiwayatItem {
  id?: string;
  nama: string;
  avg: number;
  max: number;
  min: number;
  kondisi: string;
  waktu: string;
  rawData: { nama: string; bpm: number; waktu: string }[];
}

export function useRiwayat() {
  const [riwayat, setRiwayat] = useState<RiwayatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/riwayat')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data))
          setRiwayat(data.map((d: Record<string, unknown>) => ({
            id: d.id as string,
            nama: d.nama as string,
            avg: d.avg as number,
            max: d.max as number,
            min: d.min as number,
            kondisi: d.kondisi as string,
            waktu: d.waktu as string,
            rawData: d.raw_data as { nama: string; bpm: number; waktu: string }[],
          })));
      })
      .finally(() => setLoading(false));
  }, []);

  async function simpan(item: RiwayatItem) {
    const res = await fetch('/api/riwayat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    const saved = await res.json();
    setRiwayat(prev => [{ ...saved, rawData: saved.raw_data }, ...prev].slice(0, 20));
  }

  async function hapusSemua() {
    await fetch('/api/riwayat', { method: 'DELETE' });
    setRiwayat([]);
  }

  return { riwayat, loading, simpan, hapusSemua };
}
