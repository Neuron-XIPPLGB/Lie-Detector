import Image from 'next/image';

export default function Hero() {
  return (
    <header className="relative min-h-screen flex items-center justify-center text-center px-4 sm:px-6 pt-14 overflow-hidden">
      <Image
        src="/arduino-diagram.png"
        alt="Arduino Diagram"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gray-950/75" />
      <div className="relative z-10 max-w-3xl w-full animate-fadeUp">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4">
          ESP32 Pulse Sensor Lie Detector
        </h1>
        <p className="text-gray-300 text-sm sm:text-base mb-8">
          Analisis detak jantung (BPM) untuk mendeteksi respons stres.
        </p>
        <a
          href="#project-details"
          className="inline-block px-6 py-3 bg-cyan-500 text-gray-900 font-semibold rounded-lg hover:bg-cyan-400 transition text-sm sm:text-base"
        >
          Jelajahi Proyek
        </a>
      </div>
    </header>
  );
}
