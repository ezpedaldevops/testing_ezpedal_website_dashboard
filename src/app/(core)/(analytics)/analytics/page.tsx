"use client";

import AnalyticsMediaTrend from "@/components/AnalyticsPageComponents/AnalyticsMediaTrend";
import AnalyticsSummaryCards from "@/components/AnalyticsPageComponents/AnalyticsSummaryCards";
import AnalyticsTopMedia from "@/components/AnalyticsPageComponents/AnalyticsTopMedia";
import Header from "@/components/Header";
import Head from "next/head";
import { useState } from "react";

const Page = () => {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Analytics - eZpedal</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="w-full px-6 py-8 flex flex-col gap-10">
        {/* Header */}
        <section className="text-center">
          <h3 className="text-lg font-poppins font-medium">Learn</h3>
          <h1 className="text-5xl font-outfit">Analytics</h1>
          <p className="mt-2 text-lg text-gray-600">
            Track top media, view performance trends, and monitor overall
            analytics.
          </p>
        </section>

        {/* Summary */}
        <AnalyticsSummaryCards />

        {/* Top Media */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnalyticsTopMedia onSelectMedia={setSelectedMedia} />

          {/* Media Trend */}
          {selectedMedia && <AnalyticsMediaTrend mediaId={selectedMedia} />}
        </div>
      </main>
    </div>
  );
};

export default Page;

// "use client"
// import Header from "@/components/Header";
// import Head from "next/head";
// import React from "react";

// const Page = () => {
//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Head>
//         <title>Data - Ezpedal</title>
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <Header />

//       <main className="w-full px-4  py-8 flex flex-col">
//         <section>
//           <div className="flex flex-col justify-center items-center mb-8">
//             <h3 className="text-lg  font-poppins font-medium text-black">
//               Learn
//             </h3>
//             <h1 className="text-5xl font-outfit text-black">Analytics</h1>
//             <h3 className="font-Poppins my-2 text-lg">
//               Track top media, view performance trends, and monitor overall analytics.
//             </h3>
//           </div>

//           {/* ========================================================================== */}
//         </section>
//       </main>
//     </div>
//   );
// };

// export default Page;
