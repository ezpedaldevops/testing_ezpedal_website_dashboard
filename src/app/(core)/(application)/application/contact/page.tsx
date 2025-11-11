"use client";

import Header from "@/components/Header";
import axios from "axios";
import { Expand, Trash2, X } from "lucide-react";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";

interface IContactFormInputV2 {
  _id: string;
  name: string;
  email: string;
  message: string;
}

  interface DetailRowProps {
  label: string;
  value: string | undefined;
  multiline?: boolean;
}

const Page = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [token, setToken] = useState<string | null>(null);
  const [applications, setApplications] = useState<IContactFormInputV2[]>([]);
  const [showPopUp, setShowPopUp] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<IContactFormInputV2 | null >(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(`Bearer ${storedToken}`);
  }, []);

  // const fetchApplications = async () => {
  //   if (!token) return;

  //   try {
  //     const res = await fetch(`${baseUrl}/api/v2/contact/get-all`, {
  //       headers: { Authorization: token },
  //     });

  //     const result = await res.json();
  //     setApplications(result.data || []);
  //   } catch (err) {
  //     console.error("Fetch Error:", err);
  //   }
  // };

  // useEffect(() => {
  //   fetchApplications();
  // }, [token]);

    const fetchApplications = useCallback(async () => {
      if (!token) return;
    
      try {
        const res = await fetch(`${baseUrl}/api/v2/contact/get-all`, {
          headers: { Authorization: token },
        });
    
        const result = await res.json();
        setApplications(result.data || []);
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    }, [token, baseUrl]);
    
    useEffect(() => {
      fetchApplications();
    }, [fetchApplications]);

  const handleDelete = async (applicationId: string) => {
    if (!token) return;

    try {
      await axios.delete(`${baseUrl}/api/v2/contact/delete/${applicationId}`, {
        headers: { Authorization: token },
      });

      // ✅ Refresh UI without page reload
      fetchApplications();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  const handleShowPopUp = async (id: string) => {
    if (!token) return;

    try {
      const res = await axios.get(`${baseUrl}/api/v2/contact/get/${id}`, {
        headers: { Authorization: token },
      });

      setSelectedApplication(res.data.data);
      setShowPopUp(true);
    } catch (err) {
      console.error("Popup Fetch Error:", err);
    }
  };

  const DetailRow = ({ label, value, multiline = false }: DetailRowProps) => (
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p
        className={`text-lg text-gray-900 mt-1 ${
          multiline ? "whitespace-pre-line" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );

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
                Contact Us Applications
              </h1>
              <h3 className="font-Poppins my-2 text-lg">
                Review, Forward and Delete applications from here
              </h3>
            </div>

            {/* ========================================================================== */}
            <table className="min-w-full text-sm border-separate border-spacing-3 font-poppins text-center">
              <thead>
                <tr>
                  <th className="px-3 py-4">Name</th>
                  <th className="px-3 py-4">Email</th>
                  <th className="px-3 py-4">Message</th>
                  <th className="px-3 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="font-poppins">
                {applications.map((item) => (
                  <tr key={item._id}>
                    <td className="px-3 py-4 bg-slate-200 rounded-lg border">
                      {item.name}
                    </td>
                    <td className="px-3 py-4 bg-slate-200 rounded-lg border">
                      {item.email}
                    </td>
                    <td className="px-3 py-4 max-w-[200px] bg-slate-200 rounded-lg border">
                        <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                          {item.message}
                        </p>
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
                          onClick={() => handleShowPopUp(item._id)}
                        >
                          <Expand className="cursor-pointer hover:text-green-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
        {/* ✅ Popup */}
        {showPopUp && selectedApplication && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
            <div className="bg-white/90 font-poppins p-8 w-[600px] rounded-2xl shadow-2xl relative animate-scaleIn border border-gray-200">
              {/* Close Button */}
              <button
                className="absolute right-4 top-4 text-gray-600 hover:text-black transition"
                onClick={() => setShowPopUp(false)}
              >
                <X size={24} />
              </button>

              {/* Title */}
              <h2 className="text-3xl text-center font-outfit font-semibold text-gray-900 mb-6">
                Application Details
              </h2>

              {/* Content container */}
              <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-2">
                <DetailRow
                  label="Name"
                  value={`${selectedApplication.name}`}
                />

                <DetailRow label="Email" value={selectedApplication.email} />

                <DetailRow
                  label="Message"
                  value={selectedApplication.message || "-"}
                  multiline
                />
              </div>

              {/* <a
                href={selectedApplication.resume}
                target="_blank"
                className="block text-center mt-8 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-md"
              >
                Forward Email
              </a> */}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Page;
