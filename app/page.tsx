'use client';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProjectDetails from './components/ProjectDetails';
import BlynkMonitor from './components/BlynkMonitor';
import TesDetector from './components/TesDetector';
import Riwayat from './components/Riwayat';
import Simulasi from './components/Simulasi';
import KodeArduino from './components/KodeArduino';
import Chatbot from './components/Chatbot';
import { ProgressBar, ScrollTop } from './components/UI';
import { useRiwayat } from './hooks/useRiwayat';

const SectionLine = () => <div className="h-px bg-gradient-to-r from-transparent via-white/7 to-transparent" />;

export default function Home() {
  const [liveBpm, setLiveBpm] = useState(0);
  const riwayatHook = useRiwayat();

  return (
    <div className="bg-gray-950 text-gray-100 min-h-screen" style={{ fontFamily: 'Inter, sans-serif' }}>
      <ProgressBar />
      <Navbar />
      <Hero />
      <main className="max-w-6xl mx-auto px-4 sm:px-6">
        <ProjectDetails />
        <SectionLine />
        <BlynkMonitor onBpm={setLiveBpm} />
        <SectionLine />
        <TesDetector liveBpm={liveBpm} riwayatHook={riwayatHook} />
        <SectionLine />
        <Riwayat riwayatHook={riwayatHook} />
        <SectionLine />
        <Simulasi />
        <SectionLine />
        <KodeArduino />
      </main>
      <footer className="border-t border-gray-800/60 py-8 text-center">
        <p className="text-cyan-400 font-bold text-sm tracking-widest mb-1">NEURON</p>
        <p className="text-gray-500 text-xs">XI PPLG B · ESP32 Pulse Sensor Lie Detector · 2025</p>
      </footer>
      <ScrollTop />
      <Chatbot />
    </div>
  );
}
