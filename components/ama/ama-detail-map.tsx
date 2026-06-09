"use client";

import dynamic from "next/dynamic";

const AmaDetailMapLeaflet = dynamic(() => import("./ama-detail-map-leaflet"), {
  ssr: false,
});

type Props = {
  ama: any;
};

export default function AmaDetailMap({ ama }: Props) {
  return (
    <div className="h-[520px] w-full overflow-hidden rounded-[28px]">
      <AmaDetailMapLeaflet ama={ama} />
    </div>
  );
}
