export default function SectionHeader({ title }: { title: string }) {
  return (
    <>
      <h2 className="text-2xl sm:text-3xl font-bold mb-1">{title}</h2>
      <div className="w-10 h-0.5 bg-cyan-500 rounded mb-6" />
    </>
  );
}
