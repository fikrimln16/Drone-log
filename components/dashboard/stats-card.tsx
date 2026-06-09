"use client";

type Props = {
  title: string;

  value: number | string;

  color?: "blue" | "green" | "yellow" | "red";
};

export default function StatsCard({ title, value, color = "blue" }: Props) {
  const styles = {
    blue: {
      card: "border-blue-200 bg-blue-50",
      text: "text-blue-700",
    },

    green: {
      card: "border-green-200 bg-green-50",
      text: "text-green-700",
    },

    yellow: {
      card: "border-yellow-200 bg-yellow-50",
      text: "text-yellow-700",
    },

    red: {
      card: "border-red-200 bg-red-50",
      text: "text-red-700",
    },
  };

  return (
    <div
      className={`rounded-[28px] border p-6 shadow-sm ${styles[color].card}`}
    >
      {/* TITLE */}
      <p
        className={`text-xs font-bold tracking-[0.25em] uppercase ${styles[color].text}`}
      >
        {title}
      </p>

      {/* VALUE */}
      <h1 className="mt-4 text-5xl font-bold text-black">{value}</h1>
    </div>
  );
}
