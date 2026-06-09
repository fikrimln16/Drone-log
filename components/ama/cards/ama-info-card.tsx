export default function AmaInfoCard({ title, value }: any) {
  return (
    <div className="rounded-[24px] border bg-gray-50 p-6">
      <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
        {title}
      </p>

      <h1 className="mt-4 text-4xl font-bold">{value}</h1>
    </div>
  );
}
