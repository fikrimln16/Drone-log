"use client";

import { useEffect, useState } from "react";

type Ama = {
  id: number;

  ama_name: string;
};

export default function useAmaOptions() {
  const [amas, setAmas] = useState<Ama[]>([]);

  useEffect(() => {
    async function fetchAmas() {
      try {
        const res = await fetch("/api/amas");

        const data = await res.json();

        setAmas(data || []);
      } catch (error) {
        console.error(error);
      }
    }

    fetchAmas();
  }, []);

  return {
    amas,
  };
}