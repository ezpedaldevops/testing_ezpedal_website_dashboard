"use client";
import { useState } from "react";
import axios from "axios";

interface JobFormProps {
  baseUrl: string | undefined;
}

const CareerPageNewJobForm = ({ baseUrl}: JobFormProps) => {
  const [jobTitle, setJobTitle] = useState("");
  const [domain, setDomain] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [confirmDetails, setConfirmDetails] = useState(false);
  const [loading, setLoading] = useState(false);
    const getToken = (): string | null => {
    const token = localStorage.getItem("token");
    return token ? `Bearer ${token}` : null;
  };

  const jobTypeOptions = [
    "Full Time",
    "Internship",
    "Part Time",
    "Contract",
    "Freelance",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = getToken();
    if (!token) throw new Error("Not authenticated");

    if (!confirmDetails) {
      alert("You must confirm the job details before submitting.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        job_title: jobTitle,
        domain,
        description,
        location,
        job_type: jobType,
        confirm_details: confirmDetails,
      };

      const res = await axios.post(`${baseUrl}/api/v2/job/create`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (res.data.success) {
        alert("✅ Job created successfully");
        // Reset form fields
        setJobTitle("");
        setDomain("");
        setDescription("");
        setLocation("");
        setJobType("");
        setConfirmDetails(false);
      } else {
        alert("❌ Failed to create job");
      }
    } catch (err) {
      console.error("Error creating job:", err);
      alert("⚠️ Error creating job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full xl:px-32 md:px-16 px-4 pt-10">
      <div className="flex flex-col gap-y-5 py-7">
        <h1 className="text-5xl font-outfit font-medium text-black">
          Job Description
        </h1>
        <p className="text-xl font-outfit text-black">
          Invite opportunities and talent
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center w-[60%] items-start gap-y-6 transition"
      >
        {/* Title + Domain */}
        <div className="flex justify-center items-center w-full gap-5">
          <div className="flex flex-col w-1/2">
            <label className="font-outfit text-black mb-2">Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
              required
            />
          </div>
          <div className="flex flex-col w-1/2">
            <label className="font-outfit text-black mb-2">Domain</label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col w-full gap-y-4">
          <label className="font-outfit text-black">Description</label>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none resize-none"
            rows={4}
            required
          />
        </div>

        {/* Location + Job Type */}
        <div className="flex justify-center items-center w-full gap-5">
          <div className="flex flex-col w-1/2">
            <label className="font-outfit text-black mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col w-1/2">
            <label className="font-outfit text-black mb-2">Job Type</label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none bg-white"
              required
            >
              <option value="">Select Job Type</option>
              {jobTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Confirmation Checkbox */}
        <div className="flex justify-start items-center w-full gap-3 mt-3">
          <input
            type="checkbox"
            checked={confirmDetails}
            onChange={(e) => setConfirmDetails(e.target.checked)}
            className="w-5 h-5 border border-gray-400 rounded"
            required
          />
          <label className="font-outfit text-black text-sm">
            I have cross-checked the job post information
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-6 w-1/5 bg-[#1a2947] text-white py-2 px-4 rounded-xl hover:bg-black transition"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Job"}
        </button>
      </form>
    </div>
  );
};

export default CareerPageNewJobForm;

















// "use client";
// import { useState } from "react";
// import axios from "axios";

// interface JobFormProps {
//   baseUrl: string | undefined;
//   token: string | null;
// }

// const CareerPageNewJobForm = ({ baseUrl, token }: JobFormProps) => {
//   const [jobTitle, setJobTitle] = useState("");
//   const [domain, setDomain] = useState("");
//   const [description, setDescription] = useState("");
//   const [location, setLocation] = useState("");
//   const [jobType, setJobType] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!token) {
//       alert("Authentication token missing");
//       return;
//     }

//     setLoading(true);
//     try {
//       const payload = {
//         job_title: jobTitle,
//         domain,
//         description,
//         location,
//         job_type: jobType,
//         confirm_details: false,
//       };

//       const res = await axios.post(`${baseUrl}/api/v2/job/create`, payload, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: token,
//         },
//       });

//       if (res.data.success) {
//         alert("✅ Job created successfully");
//         setJobTitle("");
//         setDomain("");
//         setDescription("");
//         setLocation("");
//         setJobType("");
//       } else {
//         alert("Failed to create job");
//       }
//     } catch (err) {
//       console.error("Error creating job:", err);
//       alert("Error creating job");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full xl:px-32 md:px-16 px-4 pt-10">
//       <div className="flex flex-col gap-y-5 py-7">
//         <h1 className="text-5xl font-outfit font-medium text-black">
//           Job Description
//         </h1>
//         <p className="text-xl font-outfit text-black">
//           Invite opportunities and talent
//         </p>
//       </div>

//       <form
//         onSubmit={handleSubmit}
//         className="flex flex-col justify-center items-start gap-y-6 transition"
//       >
//         {/* Title + Domain */}
//         <div className="flex justify-center items-center w-full gap-5">
//           <div className="flex flex-col w-1/2">
//             <label className="font-outfit text-black mb-2">Job Title</label>
//             <input
//               type="text"
//               value={jobTitle}
//               onChange={(e) => setJobTitle(e.target.value)}
//               className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
//               required
//             />
//           </div>
//           <div className="flex flex-col w-1/2">
//             <label className="font-outfit text-black mb-2">Domain</label>
//             <input
//               type="text"
//               value={domain}
//               onChange={(e) => setDomain(e.target.value)}
//               className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
//               required
//             />
//           </div>
//         </div>

//         {/* Description */}
//         <div className="flex flex-col w-full gap-y-4">
//           <label className="font-outfit text-black">Description</label>
//           <textarea
//             onChange={(e) => setDescription(e.target.value)}
//             value={description}
//             className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none resize-none"
//             rows={3}
//             required
//           />
//         </div>

//         {/* Location + Job Type */}
//         <div className="flex justify-center items-center w-full gap-5">
//           <div className="flex flex-col w-1/2">
//             <label className="font-outfit text-black mb-2">Location</label>
//             <input
//               type="text"
//               value={location}
//               onChange={(e) => setLocation(e.target.value)}
//               className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
//               required
//             />
//           </div>
//           <div className="flex flex-col w-1/2">
//             <label className="font-outfit text-black mb-2">Job Type</label>
//             <input
//               type="text"
//               value={jobType}
//               onChange={(e) => setJobType(e.target.value)}
//               className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
//               required
//             />
//           </div>
//         </div>
//         <div className="flex justify-start items-center w-full gap-5">
//           <input
//             type="checkbox"
//             className=" rounded-xl border"
//             required
//           />
//           <p className="font-outfit text-black">I have cross-checked the job post information</p>
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="mt-4 w-1/5 bg-[#1a2947] text-white py-2 px-4 rounded-xl hover:bg-black transition"
//           disabled={loading}
//         >
//           {loading ? "Creating..." : "Create Job"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CareerPageNewJobForm;


















// "use client";
// import Image from "next/image";
// import { useState } from "react";

// const CareerPageNewJobForm = () => {
//   const [jobtitle, setJobtitle] = useState("");
//   const [domain, setDomain] = useState("");
//   const [description, setDescription] = useState("");
//   const [location, setLocation] = useState("");
//   const [loading, setLoading] = useState(false);
//   const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

//   return (
//     <div className="w-full xl:px-32 md:px-16 px-4 pt-10">
//       <div className="flex flex-col gap-y-5 py-7">
//         <h1 className="text-5xl font-outfit font-medium text-black ">
//           Job Description
//         </h1>
//         <p className="text-xl font-outfit text-black">
//           Invite opportunities and Talent
//         </p>
//       </div>

//       <form
//         className=" gap-y-6  flex flex-col justify-center items-start transition "
//         // onSubmit={handleSubmit}
//       >
//         <div className=" flex justify-center items-center w-full gap-5">
//           <div className="flex flex-col w-1/2">
//             <label htmlFor="title" className="font-outfit text-black  mb-2">
//               Job Title
//             </label>
//             <input
//               type="text"
//               id="jobtitle"
//               value={jobtitle}
//               onChange={(e) => setJobtitle(e.target.value)}
//               name="jobtitle"
//               className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
//               required
//             />
//           </div>{" "}
//           <div className="flex flex-col w-1/2">
//             <label htmlFor="title" className="font-outfit text-black  mb-2">
//               Domain
//             </label>
//             <input
//               type="text"
//               id="domain"
//               value={domain}
//               onChange={(e) => setDomain(e.target.value)}
//               name="domain"
//               className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
//               required
//             />
//           </div>
//         </div>

//         {/* Description */}
//         <div className="flex flex-col w-full gap-y-4">
//           <label htmlFor="description" className="font-outfit text-black ">
//             Description
//           </label>
//           <textarea
//             onChange={(e) => setDescription(e.target.value)}
//             id="description"
//             name="description"
//             value={description}
//             className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none resize-none"
//             rows={3}
//             required
//           />
//         </div>

//         <div className=" flex justify-center items-center w-full gap-5">
//           <div className="flex flex-col w-1/2">
//             <label htmlFor="title" className="font-outfit text-black  mb-2">
//               Location
//             </label>
//             <input
//               type="text"
//               id="location"
//               value={location}
//               onChange={(e) => setLocation(e.target.value)}
//               name="location"
//               className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
//               required
//             />
//           </div>{" "}
//           <div className="flex flex-col w-1/2">
//             <label htmlFor="title" className="font-outfit text-black  mb-2">
//               Job Type
//             </label>
//             <input
//               type="text"
//               id="domain"
//               value={domain}
//               onChange={(e) => setDomain(e.target.value)}
//               name="domain"
//               className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
//               required
//             />
//           </div>
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="mt-4 w-1/5 bg-[#1a2947] text-white py-2 px-4 rounded-xl hover:bg-black transition"
//           disabled={loading}
//         >
//           {loading ? "Creating..." : "Create Category"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CareerPageNewJobForm;
