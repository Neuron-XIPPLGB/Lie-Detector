'use client';
import { useEffect, useState } from 'react';

const links = [
  { href: '#project-details', label: 'Proyek' },
  { href: '#blynk-monitor',   label: 'Monitor' },
  { href: '#tes-detector',    label: 'Tes' },
  { href: '#riwayat',         label: 'Riwayat' },
  { href: '#data-visualization', label: 'Simulasi' },
  { href: '#code',            label: 'Kode' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-gray-950/92 backdrop-blur-md border-b border-white/5' : ''}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <span className="font-bold text-sm tracking-widest text-cyan-400">NEURON</span>
        <div className="hidden sm:flex gap-6 text-xs font-medium text-gray-400">
          {links.map(l => (
            <a key={l.href} href={l.href} className="hover:text-white transition">{l.label}</a>
          ))}
        </div>
      </div>
    </nav>
  );
}
