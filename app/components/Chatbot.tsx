'use client';
import { useState, useRef, useEffect } from 'react';

interface Msg { role: 'user' | 'assistant'; content: string; }

const quickReplies = ['Konsep deteksi kebohongan?', 'Tips tanya jawab?', 'Apa itu lie detector?', 'Cara pakai tes?', 'Arti BPM?', 'Komponen apa saja?'];

export default function Chatbot() {
  const [open, setOpen]       = useState(false);
  const [msgs, setMsgs]       = useState<Msg[]>([]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR]   = useState(true);
  const [notif, setNotif]     = useState(true);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight; }, [msgs, loading]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { role: 'user', content: text };
    const history = [...msgs, userMsg];
    setMsgs(history);
    setInput('');
    setShowQR(false);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history }) });
      const data = await res.json();
      setMsgs([...history, { role: 'assistant', content: data.reply }]);
    } catch {
      setMsgs([...history, { role: 'assistant', content: 'Gagal terhubung ke AI. Periksa koneksi internet.' }]);
    }
    setLoading(false);
  }

  return (
    <>
      {/* Bubble */}
      <button onClick={() => { setOpen(o => !o); setNotif(false); }}
        className="fixed bottom-6 right-6 z-50 w-13 h-13 rounded-full flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.4)]"
        style={{ background: 'linear-gradient(135deg,#06b6d4,#a855f7)', width: 52, height: 52 }}>
        {open
          ? <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          : <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        }
        {notif && !open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">1</span>
        )}
      </button>

      {/* Box */}
      {open && (
        <div className="fixed bottom-20 right-6 z-40 w-80 max-h-[480px] bg-[#0f172a] border border-cyan-500/20 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col">
          {/* Header */}
          <div className="p-3.5 flex items-center gap-2.5" style={{ background: 'linear-gradient(135deg,#06b6d4,#a855f7)' }}>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm">NEURON Assistant</p>
              <p className="text-white/70 text-[11px]">● Online — Lie Detector Guide</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={boxRef} className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-2.5 max-h-72">
            <div className="bg-slate-800 border border-cyan-500/15 rounded-xl rounded-tl-sm p-2.5 text-[13px] text-slate-300 leading-relaxed max-w-[90%] self-start">
              Halo! 👋 Saya NEURON Assistant. Tanya apa saja seputar proyek <strong>ESP32 Pulse Sensor Lie Detector</strong> ini!
            </div>
            {msgs.map((m, i) => (
              <div key={i} className={`p-2.5 text-[13px] leading-relaxed max-w-[90%] rounded-xl whitespace-pre-wrap ${m.role === 'user' ? 'self-end rounded-br-sm text-white' : 'self-start rounded-tl-sm bg-slate-800 border border-cyan-500/15 text-slate-300'}`}
                style={m.role === 'user' ? { background: 'linear-gradient(135deg,#0e7490,#7c3aed)' } : {}}>
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="bg-slate-800 border border-cyan-500/15 rounded-xl rounded-tl-sm p-2.5 text-[13px] text-slate-500 italic max-w-[90%] self-start">Mengetik...</div>
            )}
          </div>

          {/* Quick replies */}
          {showQR && (
            <div className="px-3.5 pb-2 flex flex-wrap gap-1.5">
              {quickReplies.map(q => (
                <button key={q} onClick={() => send(q)} className="bg-cyan-500/8 border border-cyan-500/25 rounded-full px-2.5 py-1 text-[11px] text-cyan-400 hover:bg-cyan-500/18 transition">{q}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-2.5 border-t border-white/5 flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send(input)}
              placeholder="Ketik pertanyaan..." disabled={loading}
              className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-slate-100 text-[13px] outline-none focus:border-cyan-500 disabled:opacity-50" />
            <button onClick={() => send(input)} disabled={loading} className="bg-cyan-500 rounded-lg px-3 py-2 hover:bg-cyan-400 transition disabled:opacity-50">
              <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
