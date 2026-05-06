export default function Hero() {
  return (
    <header
      className="min-h-screen flex items-center justify-center text-center px-4 sm:px-6 pt-14"
      style={{ background: "linear-gradient(rgba(3,7,18,0.7),rgba(3,7,18,0.85)),url('/arduino-diagram.png') center/cover no-repeat" }}
    >
      <div className="max-w-3xl w-full animate-fadeUp">
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
