"use client";

import { useEffect, useState } from "react";

export default function useFlightDetail(id: string) {
  const [data, setData] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/flights/${id}`);

        const json = await res.json();

        setData(json);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchData();
    }
  }, [id]);

  return {
    data,
    loading,
  };
}
