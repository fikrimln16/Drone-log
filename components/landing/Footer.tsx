export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* COMPANY */}
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Aerial Survey
            </h2>

            <p className="mt-2 text-sm font-semibold text-cyan-600">
              Application Performance & Monitoring
            </p>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-500">
              Centralized platform for monitoring drone operations, flight
              activities, pilot performance, mission execution, and AMA
              deployment across operational areas.
            </p>
          </div>

          {/* OFFICE */}
          <div>
            <h3 className="text-lg font-bold text-slate-900">Head Office</h3>

            <div className="mt-4 space-y-2 text-sm text-slate-500">
              <p>PT PP London Sumatra Indonesia Tbk</p>

              <p>Ariobimo Sentral, 12th Floor</p>

              <p>Jl. HR. Rasuna Said Blok X-2 Kav.5</p>

              <p>Jakarta 12950</p>
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Contact Information
            </h3>

            <div className="mt-4 space-y-3 text-sm text-slate-500">
              <div>
                <span className="font-semibold text-slate-700">Tel:</span> (+62
                21) 8065 7388
              </div>

              <div>
                <span className="font-semibold text-slate-700">Fax:</span> (+62
                21) 8065 7399
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-12 border-t pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-500 md:flex-row">
            <p>
              © {new Date().getFullYear()} PT PP London Sumatra Indonesia Tbk.
              All rights reserved.
            </p>

            <p>Aerial Survey Application Performance & Monitoring</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
