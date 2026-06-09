export default function AmaMiniCard({ title, value, color }: any) {
  const styles: any = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",

    green: "bg-green-50 text-green-700 border-green-200",

    purple: "bg-purple-50 text-purple-700 border-purple-200",

    orange: "bg-orange-50 text-orange-700 border-orange-200",
  };

  return (
    <div className={`rounded-[24px] border p-5 ${styles[color]}`}>
      <p className="text-xs font-bold tracking-widest">{title}</p>

      <h1 className="mt-3 text-4xl font-bold">{value}</h1>
    </div>
  );
}
