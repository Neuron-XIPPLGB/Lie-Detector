'use client';
import { useState, useEffect, useRef } from 'react';
import { getStatus } from '../lib/utils';

const BLYNK_TOKEN = process.env.NEXT_PUBLIC_BLYNK_TOKEN!;
const BLYNK_BASE  = 'https://blynk.cloud/external/api/get';

export function useBlynk() {
  const [bpm, setBpm] = useState(0);
  const [error, setError] = useState(false);
  const status = getStatus(bpm);

  async function fetchBpm() {
    try {
      const res = await fetch(`${BLYNK_BASE}?token=${BLYNK_TOKEN}&v1`);
      if (!res.ok) throw new Error();
      const val = Math.round(parseFloat(await res.text()));
      setBpm(isNaN(val) ? 0 : val);
      setError(false);
    } catch {
      setError(true);
    }
  }

  useEffect(() => {
    fetchBpm();
    const id = setInterval(fetchBpm, 2000);
    return () => clearInterval(id);
  }, []);

  return { bpm, status, error };
}
