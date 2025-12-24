"use client";

import Header from "@/components/Header";
import Head from "next/head";
import Link from "next/link";

const Page = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Head>
          <title>Applications - Ezpedal</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header />

        <main className="w-full px-4 md:px-16 xl:px-32 py-8 flex flex-col">
          <section>
            {/* Header Text */}
            <div className="flex flex-col justify-center items-center text-center mb-10">
              <h3 className="text-base sm:text-lg font-poppins text-black">
                Application
              </h3>
              <h1 className="text-4xl sm:text-5xl font-outfit text-black mt-2">
                {"Website Form's Data"}
              </h1>
              <p className="font-poppins text-sm sm:text-base mt-3 text-gray-700">
                View List of Applications Data collected from Website Pages
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {/* Career Applications */}
              <Link href={`/application/career/apply`} className="p-5 h-64 sm:h-72 lg:h-80 flex flex-col justify-center items-center bg-slate-400 cursor-pointer hover:shadow-lg transition border-2 border-slate-400">
                <h3 className="text-2xl font-semibold font-outfit text-white">
                  {"Career Page - Apply"}
                </h3>
              </Link>

              {/* Career Contact Page Applications */}
              <Link href={`/application/career/contactus`} className="p-5 h-64 sm:h-72 lg:h-80 flex flex-col justify-center items-center bg-slate-400 cursor-pointer hover:shadow-lg transition border-2 border-slate-400">
                <h3 className="text-2xl font-semibold font-outfit text-white">
                  {"Career Page - Contact Us"}
                </h3>
              </Link>

              {/* Contact Page Applications */}
              <Link href={`/application/contact`} className="p-5 h-64 sm:h-72 lg:h-80 flex flex-col justify-center items-center bg-slate-400 cursor-pointer hover:shadow-lg transition border-2 border-slate-400">
                <h3 className="text-2xl font-semibold font-outfit text-white">
                  {"Contact Us Page"}
                </h3>
              </Link>

              {/* Subscribe Page Applications */}
              <Link href={`/application/subscriber`} className="p-5 h-64 sm:h-72 lg:h-80 flex flex-col justify-center items-center bg-slate-400 cursor-pointer hover:shadow-lg transition border-2 border-slate-400">
                <h3 className="text-2xl font-semibold font-outfit text-white">
                  {"Subscribe - Email List"}
                </h3>
              </Link>

              {/* Contact Page Applications */}
              <Link href={`/application/buissness`} className="p-5 h-64 sm:h-72 lg:h-80 flex flex-col justify-center items-center bg-slate-400 cursor-pointer hover:shadow-lg transition border-2 border-slate-400">
                <h3 className="text-2xl font-semibold font-outfit text-white">
                  {"Buissness Request's - Email List"}
                </h3>
              </Link>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Page;
