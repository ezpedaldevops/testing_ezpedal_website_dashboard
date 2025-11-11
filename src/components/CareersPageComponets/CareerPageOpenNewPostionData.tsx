"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Clock4, MapPin, Pencil, Trash } from "lucide-react";
import UpdateOpenPostionComponetForm from "./UpdateOpenPostionComponetForm";

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

const CareerPageOpenNewPostionData = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string>("All");
  const [updateJob, setUpdateJob] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/v2/job/get-all`);
        const jobList = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];

        setJobs(jobList);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Unable to load job positions. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [baseUrl]);

  const handleDelete = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      const token = localStorage.getItem("token"); // or replace with your secure getToken() util
      if (!token) throw new Error("Not authenticated");

      await axios.delete(`${baseUrl}/api/v2/job/delete/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove job locally
      setJobs((prev) => prev.filter((job) => job._id !== jobId));

      alert("✅ Job deleted successfully!");
    } catch (err) {
      console.error("Error deleting job:", err);
    }
  };

  // Derive unique domains dynamically
  const uniqueDomains = [
    "All",
    ...Array.from(new Set(jobs.map((job) => job.domain.trim()))),
  ];

  // Apply filter
  const filteredJobs =
    selectedDomain === "All"
      ? jobs
      : jobs.filter((job) => job.domain === selectedDomain);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-[300px]">
        <p className="text-xl font-poppins text-gray-600 animate-pulse">
          Loading open positions...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center w-full h-[300px]">
        <p className="text-xl font-poppins text-red-600">{error}</p>
      </div>
    );
  }

    if (jobs.length === 0) {
  return (
    <div className="flex justify-center items-center text-center w-full h-[400px]">
          <div className="flex flex-col justify-center text-center items-center gap-y-3">
            {/* <h3 className="font-poppins font-medium">Opportunities</h3> */}
            <h2 className="font-outfit font-medium text-5xl">
              No Open Position
            </h2>
            {/* <h4 className="font-poppins max-w-md">
              Hey there! Thanks for checking us out! Unfortunately, we don’t have any openings at the moment, but keep an eye out for future opportunities!
            </h4> */}
          </div>
    </div>
  );
}

  return (
    <div className="flex flex-col justify-center items-start w-full xl:px-32 md:px-16 px-4 pt-10">
      <div className="grid grid-cols-2 gap-10 w-full">
        {/* Section Header */}
        <div className="col-span-1 flex flex-col justify-start items-start gap-y-3">
          <h3 className="font-poppins font-medium">Opportunities</h3>
          <h2 className="font-outfit font-medium text-5xl">
            Current Open Positions
          </h2>
          <h4 className="font-poppins">
            Present open positions in Career section
          </h4>
        </div>

        {/* Job Cards Section */}
        <div className="col-span-1 w-full">
          {/* Dynamic Filters */}
          <div className="flex flex-wrap justify-start items-center gap-4 mb-8">
            {uniqueDomains.map((domain) => (
              <span
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className={`font-poppins p-2 px-5 rounded-md cursor-pointer transition-all duration-200 font-medium shadow-md ${
                  selectedDomain === domain
                    ? "bg-[#223658] text-white"
                    : "bg-[#dcd7d7] text-black hover:bg-[#223658]/70 hover:text-white"
                }`}
              >
                {domain}
              </span>
            ))}
          </div>

          {/* Jobs List */}
          <div className="py-5 flex flex-col gap-5">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div
                  key={job._id}
                  className="relative bg-[#223658] min-h-[250px] p-10 w-full text-white font-poppins flex flex-col gap-y-5 shadow-lg"
                >
                  {/* Title + Domain */}
                  <div className="flex justify-between items-start">
                    <div className="flex justify-center items-center gap-5">
                      <h1 className="text-white font-outfit font-medium text-3xl mb-2">
                        {job.job_title}
                      </h1>
                      <h5 className="bg-white/20 inline-block p-1 px-3 rounded-md text-xs">
                        {job.domain}
                      </h5>
                    </div>
                    <div className="flex gap-4">
                      <button
                        className="text-white hover:text-gray-300"
                        onClick={() => {
                          setSelectedJob(job);
                          setUpdateJob(true);
                        }}
                      >
                        <Pencil />
                      </button>

                      <button
                        className="text-white hover:text-red-400"
                        onClick={() => handleDelete(job._id)}
                      >
                        <Trash />
                      </button>
                    </div>
                  </div>

                  {/* Update Job Popup */}
                  {updateJob && selectedJob && (
                    <UpdateOpenPostionComponetForm
                      setUpdateJob={setUpdateJob}
                      setSelectedJob={setSelectedJob}
                      selectedJob={selectedJob}
                    />
                  )}

                  {/* Description */}
                  <p className="font-poppins text-lg leading-snug">
                    {job.description.length > 150
                      ? job.description.slice(0, 150) + "..."
                      : job.description}
                  </p>

                  {/* Location + Job Type */}
                  <div className="flex justify-start items-center gap-x-10 mt-2">
                    <p className="flex justify-start items-center gap-x-2 text-lg">
                      <MapPin size={20} />
                      {job.location}
                    </p>
                    <p className="flex justify-start items-center gap-x-2 text-lg">
                      <Clock4 size={20} />
                      {job.job_type}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-lg font-poppins">
                No open positions available for{" "}
                <strong>{selectedDomain}</strong>.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerPageOpenNewPostionData;
