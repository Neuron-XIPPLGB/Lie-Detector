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

  function getSessionId() {
    let id = sessionStorage.getItem('neuron_session_id');
    if (!id) { id = crypto.randomUUID(); sessionStorage.setItem('neuron_session_id', id); }
    return id;
  }

  useEffect(() => {
    const sessionId = getSessionId();
    fetch(`/api/riwayat?session_id=${sessionId}`)
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
    const sessionId = getSessionId();
    const res = await fetch('/api/riwayat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...item, sessionId }),
    });
    const saved = await res.json();
    const newItem: RiwayatItem = {
      id: saved.id,
      nama: saved.nama ?? item.nama,
      avg: saved.avg ?? item.avg,
      max: saved.max ?? item.max,
      min: saved.min ?? item.min,
      kondisi: saved.kondisi ?? item.kondisi,
      waktu: saved.waktu ?? item.waktu,
      rawData: saved.raw_data ?? item.rawData,
    };
    setRiwayat(prev => [newItem, ...prev].slice(0, 20));
  }

  async function hapusSemua() {
    const sessionId = getSessionId();
    await fetch(`/api/riwayat?session_id=${sessionId}`, { method: 'DELETE' });
    setRiwayat([]);
  }

  return { riwayat, loading, simpan, hapusSemua };
}
