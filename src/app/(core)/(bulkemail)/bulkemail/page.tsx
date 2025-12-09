"use client";
import Header from "@/components/Header";
import axios from "axios";
import { Trash2 } from "lucide-react";
import Head from "next/head";
import { useEffect, useState } from "react";
interface Subscriber {
  _id: string;
  name: string;
  email: string;
  contact: string;
}

const Page = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const getToken = (): string | null => {
    const token = localStorage.getItem("token");
    return token ? `Bearer ${token}` : null;
  };
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendBulkEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = getToken();
    if (!token) {
      console.error("No auth token found");
      return;
    }

    try {
      const res = await axios.post(
        `${baseURL}/api/v1/email-notification/send-bulk`,
        { title, link, message },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      console.log("Bulk email sent:", res.data);
      alert("Bulk email sent successfully!");
    } catch (error) {
      console.error("Error sending bulk email:", error);
      alert("Failed to send emails");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  async function fetchSubscribers() {
    const token = getToken();
    if (!token) throw new Error("Not authenticated");
    try {
      const res = await axios.get(
        `${baseURL}/api/v1/email-notification/get-all-subscribers-form`,
        {
          method: "GET",
          headers: { Authorization: `${token}` },
        }
      );

      if (!res.data) {
        console.error("Failed to fetch subscribers");
        return;
      }

      setSubscribers(res.data.data); // Adjust if response structure differs
    } catch (err) {
      console.error("Error fetching subscribers:", err);
    }
  }

  async function deleteSubscriber(id: string) {
    const token = getToken();
    if (!token) return alert("Not authenticated");

    try {
      await axios.delete(
        `${baseURL}/api/v1/email-notification/unsubscribe/${id}`,
        {
          headers: { Authorization: token },
        }
      );

      // Remove from UI without full refresh
      setSubscribers((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete subscriber.");
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Head>
          <title>Careers - Ezpedal</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header />

        <main className="flex flex-col w-full ">
          <div className="flex flex-col justify-center items-center gap-4 my-10">
            <h3 className="text-lg  font-poppins font-medium text-black">
              List
            </h3>
            <h1 className="text-5xl font-outfit text-black">
              {"eZpedal's Subscribers"}
            </h1>
            <h3 className="font-Poppins my-2 text-lg">
              Email Notifications — Broadcast Updates to All Subscribers
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="w-full px-4 col-span-2 flex flex-col">
              <section>
                {/* ========================================================================== */}
                <table className="min-w-full text-sm border-separate border-spacing-3 font-poppins text-center">
                  <thead>
                    <tr>
                      <th className="px-3 py-4">Full Name</th>
                      <th className="px-3 py-4">Contact</th>
                      <th className="px-3 py-4">Email</th>
                      <th className="px-3 py-4">Action</th>
                    </tr>
                  </thead>

                  <tbody className="font-poppins">
                    {subscribers.length > 0 ? (
                      subscribers.map((item) => (
                        <tr key={item._id}>
                          <td className="px-3 py-4 bg-slate-200 rounded-lg border">
                            {item.name}
                          </td>
                          <td className="px-3 py-4 bg-slate-200 rounded-lg border">
                            {item.contact}
                          </td>
                          <td className="px-3 py-4 bg-slate-200 rounded-lg border">
                            {item.email}
                          </td>
                          <td className="px-3 py-4 bg-slate-200 rounded-lg border">
                            <div className="flex justify-center gap-3">
                              <button
                                onClick={() => deleteSubscriber(item._id)}
                              >
                                <Trash2 className="cursor-pointer hover:text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="py-4 text-gray-500">
                          No Subscribers Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </section>
            </div>
            <div className="col-span-1 p-4">
              <form
                className="gap-y-6 w-full flex flex-col justify-center items-start transition"
                onSubmit={sendBulkEmail}
              >
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="title"
                    className="font-outfit text-black mb-2"
                  >
                    Email Subject Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="eZpedal Rideshare : {{ Enter your email subject }}"
                    className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
                    required
                  />
                </div>

                <div className="flex flex-col w-full gap-y-4">
                  <label htmlFor="link" className="font-outfit text-black">
                    Attachment Link
                  </label>
                  <input
                    type="text"
                    id="link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="Paste Link here "
                    className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
                    required
                  />
                </div>

                <div className="flex flex-col w-full gap-y-4">
                  <label htmlFor="message" className="font-outfit text-black">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder=" Enter Textual message ( Without link )"
                    className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none resize-none"
                    rows={3}
                    required
                  />
                  <p className="text-[10px] font-poppins font-thin px-5 my-[-5px]">
                    Maximum 300 Character.
                  </p>
                </div>

                <button
                  type="submit"
                  className="mt-4 bg-[#223658] text-white py-2 px-6 rounded-xl hover:bg-[#1a2947] transition"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Bulk Email to Subscribers"}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Page;
