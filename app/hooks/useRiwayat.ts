'use client';
import { useState, useEffect } from 'react';

export interface RiwayatItem {
  nama: string;
  avg: number;
  max: number;
  min: number;
  kondisi: string;
  waktu: string;
  rawData: { nama: string; bpm: number; waktu: string }[];
}

const KEY = 'neuron_riwayat';

export function useRiwayat() {
  const [riwayat, setRiwayat] = useState<RiwayatItem[]>([]);

  useEffect(() => {
    setRiwayat(JSON.parse(localStorage.getItem(KEY) || '[]'));
  }, []);

  function simpan(item: RiwayatItem) {
    const newList = [item, ...riwayat].slice(0, 20);
    localStorage.setItem(KEY, JSON.stringify(newList));
    setRiwayat(newList);
  }

  function hapusSemua() {
    localStorage.removeItem(KEY);
    setRiwayat([]);
  }

  return { riwayat, simpan, hapusSemua };
}
