export default function FeatureSection() {
  const features = [
    {
      title: "Flight Management",
      desc: "Manage all drone flight logs.",
    },
    {
      title: "Pilot Analytics",
      desc: "Track pilot performance.",
    },
    {
      title: "Mission Monitoring",
      desc: "Monitor mission activities.",
    },
    {
      title: "AMA Monitoring",
      desc: "View operational coverage.",
    },
  ];

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-center text-4xl font-bold">Platform Features</h1>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((item) => (
            <div
              key={item.title}
              className="rounded-[32px] border bg-white p-8 shadow-sm"
            >
              <h1 className="text-xl font-bold">{item.title}</h1>

              <p className="mt-3 text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
