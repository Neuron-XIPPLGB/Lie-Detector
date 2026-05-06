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
        setRiwayat(data.map((d: Record<string, unknown>) => ({ ...d, rawData: d.raw_data })));
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
