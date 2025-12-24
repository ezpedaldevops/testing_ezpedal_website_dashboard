"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Media {
  mediaId: string;
  title: string;
  fileType: string;
  views: number;
}

export default function AnalyticsTopMedia({
  onSelectMedia,
}: {
  onSelectMedia: (id: string) => void;
}) {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!baseURL) {
      console.error("NEXT_PUBLIC_BACKEND_URL is missing");
      return;
    }

    const from = new Date().toISOString().slice(0, 10);
    const to = new Date(Date.now() + 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    fetch(
      `${baseURL}/api/v2/analytics/top-media?from=${from}&to=${to}&limit=10`
    )
      .then((res) => res.json())
      .then((res) => {
        setMedia(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border">
        <p className="text-sm text-gray-500">Loading top media…</p>
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 border">
        <p className="text-sm text-gray-500">No media data available.</p>
      </div>
    );
  }

  return (
    <section className="bg-white rounded-xl max-w- border shadow-sm font-poppins col-span-1 border-blue-950">
      <header className="px-6 py-5 border-b bg-slate-100">
        <h3 className="text-3xl font-outfit font-medium text-center">Top Media</h3>
      </header>

      <ul>
        {media.map((item, index) => {
          const isPdf = item.fileType === "pdf";

          return (
            <li
              key={item.mediaId}
              className={`p-10 flex items-center justify-between
                ${isPdf ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-50 cursor-pointer"}
              `}
              onClick={() => {
                if (!isPdf) onSelectMedia(item.mediaId);
              }}
            >
              <div className="flex flex-col gap-4 relative">
                <p className="font-poppins font-medium text-3xl">
                  {index + 1}. {item.title}
                </p>
                <p className="text-sm text-black">
                  File Type : {item.fileType}  
                </p>
                <p className="text-sm text-black">
                    {item.views} views
                </p>
              </div>

              {!isPdf && (
                <div className="flex justify-center items-center text-sm bg-blue-950 p-2 px-4 text-white rounded-xl">
                    View Trend <ChevronRight className="w-4 h-4 ml-2" />
                </div>
                
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

