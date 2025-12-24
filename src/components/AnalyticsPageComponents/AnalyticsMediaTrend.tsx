"use client";

import { useEffect, useState } from "react";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Trend {
  date: string;
  views: number;
}

export default function AnalyticsMediaTrend({ mediaId }: { mediaId: string }) {
  const [data, setData] = useState<Trend[]>([]);

  useEffect(() => {
    fetch(`${baseURL}/api/v2/analytics/media-trend/${mediaId}`)
      .then(res => res.json())
      .then(res => setData(res.data))
      .catch(console.error);
  }, [mediaId]);

  return (
    <section className="bg-white rounded-xl border shadow-sm p-6">
      <h3 className="text-xl font-outfit mb-4">Media View Trend</h3>

      {data.length === 0 ? (
        <p className="text-sm text-gray-500">No trend data available.</p>
      ) : (
        <ul className="space-y-2">
          {data.map(item => (
            <li
              key={item.date}
              className="flex justify-between text-sm font-poppins"
            >
              <span>{item.date}</span>
              <span className="font-medium">{item.views} views</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
