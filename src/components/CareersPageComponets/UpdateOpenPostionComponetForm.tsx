import React, { useState, useEffect } from "react";
import axios from "axios";

interface Job {
  _id: string;
  job_title: string;
  domain: string;
  description: string;
  location: string;
  job_type: string;
  confirm_details: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UpdateOpenPositionProps {
  setUpdateJob: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedJob: React.Dispatch<React.SetStateAction<Job | null>>;
  selectedJob: Job;
}

const UpdateOpenPostionComponetForm: React.FC<UpdateOpenPositionProps> = ({
  setUpdateJob,
  setSelectedJob,
  selectedJob,
}) => {
  const [formData, setFormData] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const jobTypeOptions = [
    "Full Time",
    "Internship",
    "Part Time",
    "Contract",
    "Freelance",
  ];

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const getToken = (): string | null => {
    const token = localStorage.getItem("token");
    return token ? `Bearer ${token}` : null;
  };

  // ✅ Load initial values when modal opens
  useEffect(() => {
    if (selectedJob) setFormData({ ...selectedJob });
  }, [selectedJob]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) throw new Error("Not authenticated");

      const res = await axios.put(
        `${baseUrl}/api/v2/job/update/${formData._id}`,
        {
          job_title: formData.job_title,
          domain: formData.domain,
          description: formData.description,
          location: formData.location,
          job_type: formData.job_type,
          confirm_details: formData.confirm_details,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data?.success) {
        alert("✅ Job updated successfully, Refresh Page To See Updates ");
        setUpdateJob(false);
        setSelectedJob(null);
      } else {
        setError("Failed to update job. Please try again.");
      }
    } catch (err) {
      console.error("Error updating job:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!formData) return null; // safety check

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center backdrop-blur-sm bg-black/50">
      <div className="bg-[#223658] rounded-xl shadow-2xl p-8 w-[90%] max-w-lg relative animate-fadeIn font-poppins">
        <button
          onClick={() => {
            setUpdateJob(false);
            setSelectedJob(null);
          }}
          className="absolute top-5 right-5 text-white hover:text-black text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-outfit flex justify-center items-center gap-3 font-medium mb-6 text-white">
          <span className="font-medium">Update : </span> {selectedJob.job_title}
        </h2>

        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Job Title</label>
            <input
              name="job_title"
              type="text"
              value={formData.job_title}
              onChange={handleChange}
              className="w-full border border-gray-300 text-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#223658]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Domain</label>
            <input
              name="domain"
              type="text"
              value={formData.domain}
              onChange={handleChange}
              className="w-full border border-gray-300 text-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#223658]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              className="w-full border border-gray-300 text-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#223658]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Job Type</label>
            <select
              name="job_type"
              value={formData.job_type}
              onChange={handleChange}
              className="w-full border border-gray-300 text-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#223658]"
            >
              <option value="" disabled>
                Select Job Type
              </option>
              {jobTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 text-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#223658]"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "bg-gray-400" : "bg-black hover:bg-[#1a2945]"
            } text-white rounded-md py-2 font-medium transition-all duration-200`}
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateOpenPostionComponetForm;

// import React from "react";

// interface Job {
//   _id: string;
//   job_title: string;
//   domain: string;
//   description: string;
//   location: string;
//   job_type: string;
//   confirm_details: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// interface UpdateOpenPositionProps {
//   setUpdateJob: React.Dispatch<React.SetStateAction<boolean>>;
//   setSelectedJob: React.Dispatch<React.SetStateAction<Job | null>>;
//   selectedJob: Job;
// }

// const UpdateOpenPostionComponetForm: React.FC<UpdateOpenPositionProps> = ({
//   setUpdateJob,
//   setSelectedJob,
//   selectedJob,
// }) => {

//   return (
//     <div className="fixed inset-0 z-50 flex justify-center items-center backdrop-blur-sm bg-black/50">
//       <div className="bg-white rounded-xl shadow-2xl p-8 w-[90%] max-w-lg relative animate-fadeIn font-poppins">
//         <button
//           onClick={() => {
//             setUpdateJob(false);
//             setSelectedJob(null);
//           }}
//           className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
//         >
//           ✕
//         </button>

//         <h2 className="text-2xl font-outfit font-semibold mb-6 text-[#223658]">
//           <span className="text-black">Update Job :</span> {selectedJob.job_title}
//         </h2>

//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             // TODO: handle job update API call here
//             console.log("Updating job:", selectedJob);
//             setUpdateJob(false);
//           }}
//           className="flex flex-col gap-4"
//         >
//           <div>
//             <label className="block text-sm font-medium mb-1">Job Title</label>
//             <input
//               type="text"
//               value={selectedJob.job_title}
//               onChange={(e) =>
//                 setSelectedJob({
//                   ...selectedJob,
//                   job_title: e.target.value,
//                 })
//               }
//               className="w-full border border-gray-300 text-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#223658]"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Location</label>
//             <input
//               type="text"
//               value={selectedJob.location}
//               onChange={(e) =>
//                 setSelectedJob({
//                   ...selectedJob,
//                   location: e.target.value,
//                 })
//               }
//               className="w-full border border-gray-300 text-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#223658]"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Description
//             </label>
//             <textarea
//               value={selectedJob.description}
//               onChange={(e) =>
//                 setSelectedJob({
//                   ...selectedJob,
//                   description: e.target.value,
//                 })
//               }
//               rows={4}
//               className="w-full border border-gray-300 text-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#223658]"
//             />
//           </div>

//           <button
//             type="submit"
//             className="bg-[#223658] text-white rounded-md py-2 font-medium hover:bg-[#1a2945] transition-all duration-200"
//           >
//             Save Changes
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UpdateOpenPostionComponetForm;
