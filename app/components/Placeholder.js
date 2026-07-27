export default function Placeholder({ title }) {
  return (
    <div className="p-6">
      <h2 className="text-base font-medium text-[#1A3C5E] mb-2">{title}</h2>
      <div className="bg-white border border-dashed border-[#CBD5E1] rounded-lg p-10 text-center">
        <p className="text-sm text-[#94A3B8]">Coming soon — not part of the MVP build yet.</p>
      </div>
    </div>
  );
}