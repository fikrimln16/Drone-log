import {
  Clock3,
  Plane,
  ShieldCheck,
  Users,
} from "lucide-react";

type Props = {
  title: string;

  value: string | number;

  color:
    | "blue"
    | "purple"
    | "yellow"
    | "green";
};

export default function PilotCard({
  title,
  value,
  color,
}: Props) {
  // COLORS
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
  };

  // ICONS
  const icons = {
    blue: Users,

    purple: Plane,

    yellow: Clock3,

    green: ShieldCheck,
  };

  const Icon = icons[color];

  return (
    <div className="rounded-[32px] border bg-white p-6 shadow-sm transition hover:shadow-md">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
            {title}
          </p>

          <h1 className="mt-4 text-5xl font-bold leading-tight">
            {value}
          </h1>
        </div>

        {/* ICON */}
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${colors[color].bg}`}
        >
          <Icon
            className={`h-7 w-7 ${colors[color].text}`}
          />
        </div>
      </div>
    </div>
  );
}