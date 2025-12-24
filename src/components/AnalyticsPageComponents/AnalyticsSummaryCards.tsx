"use client";

import { useEffect, useState } from "react";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function AnalyticsSummaryCards() {
  const [data, setData] = useState<{ totalViews: number; todayViews: number } | null>(null);

  useEffect(() => {
    fetch(`${baseURL}/api/v2/analytics/summary`)
      .then(res => res.json())
      .then(res => setData(res.data))
      .catch(console.error);
  }, []);

  if (!data) return null;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-outfit">
      <StatCard label="Total Views" value={data.totalViews} />
      <StatCard label="Today Views" value={data.todayViews} />
    </section>
  );
}

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-950">
    <p className="text-sm font-poppins font-medium text-blue-950">{label}</p>
    <h2 className="text-4xl font-outfit font-semibold text-black mt-2">
      {value}
    </h2>
  </div>
);
