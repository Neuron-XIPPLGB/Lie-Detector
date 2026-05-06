import Image from 'next/image';
import SectionHeader from './SectionHeader';

const komponen = ['ESP32', 'Heart Pulse Sensor', 'Aplikasi Blynk', 'Kabel Jumper'];

export default function ProjectDetails() {
  return (
    <section id="project-details" className="py-12 sm:py-20">
      <SectionHeader title="Detail Proyek" />
      <p className="text-gray-300 text-sm sm:text-base mb-6 sm:mb-8">
        Proyek ini menggunakan <span className="text-cyan-400 font-semibold">Heart Pulse Sensor</span> untuk mengukur{' '}
        <span className="font-semibold">BPM (Beats Per Minute)</span>. Perubahan BPM digunakan sebagai indikator kondisi psikologis pengguna.
      </p>
      <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
        <ul className="space-y-3 text-gray-300 text-sm sm:text-base">
          {komponen.map(k => (
            <li key={k} className="flex items-center gap-2">
              <span className="text-cyan-400">✔</span> {k}
            </li>
          ))}
        </ul>
        <div className="h-40 sm:h-48 w-full flex items-center justify-center bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          <Image src="/arduino-diagram.png" alt="Diagram Rangkaian" width={400} height={300} className="w-full h-full object-contain" />
        </div>
      </div>
    </section>
  );
}
