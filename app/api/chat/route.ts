import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Kamu adalah NEURON Assistant, asisten AI untuk proyek ESP32 Pulse Sensor Lie Detector oleh XI PPLG B. Jawab dalam Bahasa Indonesia, singkat dan jelas. Konteks proyek: menggunakan ESP32 + Heart Pulse Sensor untuk mengukur BPM, terhubung ke Blynk Cloud. BPM <90=Tenang, 90-120=Tegang, >120=Bohong. Komponen: ESP32, Heart Pulse Sensor, Blynk, Kabel Jumper. Hanya jawab pertanyaan seputar proyek ini.`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENROUTER_KEY}`,
    },
    body: JSON.stringify({
      model: 'openrouter/free',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
    }),
  });
  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content ?? 'Maaf, tidak dapat menjawab saat ini.';
  return NextResponse.json({ reply });
}
