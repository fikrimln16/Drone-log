import Image from "next/image";
import {
  Clock3,
  Plane,
  ShieldCheck,
  Users,
  Trophy,
  Flame,
  MapPinned,
} from "lucide-react";

type Props = {
  title: string;

  value: string | number;

  subtitle?: string;

  image?: string;

  color: "blue" | "purple" | "yellow" | "green" | "cyan" | "red";
};

export default function PilotCard({
  title,
  value,
  subtitle,
  image,
  color,
}: Props) {
  const colors = {
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-600",
    },

    purple: {
      bg: "bg-purple-100",
      text: "text-purple-600",
    },

    yellow: {
      bg: "bg-yellow-100",
      text: "text-yellow-600",
    },

    green: {
      bg: "bg-green-100",
      text: "text-green-600",
    },

    cyan: {
      bg: "bg-cyan-100",
      text: "text-cyan-600",
    },

    red: {
      bg: "bg-red-100",
      text: "text-red-600",
    },
  };

  const icons = {
    blue: Users,
    purple: Plane,
    yellow: Clock3,
    green: ShieldCheck,
    cyan: Trophy,
    red: Flame,
  };

  const Icon = icons[color];

  return (
    <div className="group rounded-[32px] border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold tracking-[0.25em] text-slate-400 uppercase">
            {title}
          </p>

          {/* IMAGE MODE */}
          {image ? (
            <div className="mt-4 flex items-center gap-4">
              <div className="h-14 w-14 overflow-hidden rounded-2xl border-2 border-cyan-100">
                <Image
                  src={image}
                  alt={String(value)}
                  width={56}
                  height={56}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-xl font-bold text-slate-900">
                  {value}
                </h1>

                {subtitle && (
                  <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
                )}
              </div>
            </div>
          ) : (
            <>
              <h1 className="mt-4 text-5xl font-black tracking-tight text-slate-900">
                {value}
              </h1>

              {subtitle && (
                <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
              )}
            </>
          )}
        </div>

        {/* ICON */}
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 ${colors[color].bg}`}
        >
          <Icon className={`h-7 w-7 ${colors[color].text}`} />
        </div>
      </div>
    </div>
  );
}
