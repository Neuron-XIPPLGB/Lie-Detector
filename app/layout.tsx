import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NEURON - XI PPLG B | Pulse Sensor Lie Detector',
  description: 'Analisis detak jantung (BPM) untuk mendeteksi respons stres menggunakan ESP32 dan Blynk.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
