"use client";

import { useEffect, useState } from "react";

export default function useAmaOptions() {
  const [amas, setAmas] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/amas")
      .then((res) => res.json())
      .then((res) => {
        setAmas(Array.isArray(res) ? res : []);
      });
  }, []);

  return {
    amas,
    setAmas,
  };
}
