"use client";

import Header from "@/components/Header";
import axios from "axios";
import {  Trash2 } from "lucide-react";
import Head from "next/head";
import { useEffect, useState } from "react";

interface EmailI {
    _id: string;
    email: string;
}



const Page = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [token, setToken] = useState<string | null>(null);
  const [applications, setApplications] = useState<EmailI[]>([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(`Bearer ${storedToken}`);
  }, []);

  const fetchApplications = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${baseUrl}/api/v1/email-notification/get-all-subscribers`, {
        headers: { Authorization: token },
      });

      const result = await res.json();
      setApplications(result.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [token,fetchApplications]);

  const handleDelete = async (applicationId: string) => {
    if (!token) return;

    try {
      await axios.delete(`${baseUrl}/api/v1/email-notification/delete/${applicationId}`, {
        headers: { Authorization: token },
      });

      // ✅ Refresh UI without page reload
      fetchApplications();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };





  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Head>
          <title>contact-us - Ezpedal</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header />

        <main className="w-full px-4  py-8 flex flex-col">
          <section>
            <div className="flex flex-col justify-center items-center mb-8">
              <h3 className="text-lg  font-poppins font-medium text-black">
                List
              </h3>
              <h1 className="text-5xl font-outfit text-black">
                News / Events Subscriber
              </h1>
              <h3 className="font-Poppins my-2 text-lg">
                Review, Forward and Delete applications from here
              </h3>
            </div>

            {/* ========================================================================== */}
            <table className="w-1/2 mx-auto text-sm border-separate border-spacing-3 font-poppins text-center">
              <thead>
                <tr>
                  <th className="px-3 py-4">Email</th>
                  <th className="px-3 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="font-poppins">
                {applications.map((item) => (
                  <tr key={item._id}>
                    <td className="px-3 py-4 bg-slate-200 rounded-lg border">
                      {item.email}
                    </td>

                    <td className="px-3 py-4 bg-slate-200 rounded-lg border">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleDelete(item._id)}
                          className=""
                        >
                          <Trash2 className="cursor-pointer hover:text-red-600" />
                        </button>
                        <button
                          className=""
                        //   onClick={() => handleShowPopUp(item._id)}
                        >
                          {/* <Expand className="cursor-pointer hover:text-green-600" /> */}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>

      </div>
    </>
  );
};

export default Page;