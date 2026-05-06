'use client';
import { useEffect, useState } from 'react';

export function ProgressBar() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => setPct(window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <div className="fixed top-0 left-0 h-0.5 z-[9999] transition-[width_.1s]" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#22d3ee,#a855f7)' }} />;
}

export function ScrollTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-[90px] right-6 z-50 w-9 h-9 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center hover:border-cyan-400 transition-opacity ${show ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>
    </button>
  );
}
