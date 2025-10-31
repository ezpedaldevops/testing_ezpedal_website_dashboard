"use client";
import Header from "@/components/Header";
import Head from "next/head";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import MediaFormItemDetails from "@/components/LearnPageComponents/LearnPageMediaFormPartsComp/MediaFormItemDetails";
import MediaFormSeoSettings from "@/components/LearnPageComponents/LearnPageMediaFormPartsComp/MediaFormSeoSettings";
import MediaFormUploadsFile from "@/components/LearnPageComponents/LearnPageMediaFormPartsComp/MediaFormUploadsFile";
import MediaFormReviewAllForm from "@/components/LearnPageComponents/LearnPageMediaFormPartsComp/MediaFormReviewAllForm";
import { useRouter } from "next/navigation";

const MediaFormPage = () => {
  const { slug } = useParams();
  const router = useRouter();
  const [categoryId, slugTitle] = (slug as string).split(/-(.+)/);
  const getToken = (): string | null => {
    const token = localStorage.getItem("token");
    return token ? `Bearer ${token}` : null;
  };
  const toTitleCase = (str: string) =>
    str
      .toLowerCase()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  // ----- Step Management -----
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    author: "",
    dateOfPublish: "",
    tags: "",
    file: null as File | null,
    coverImage: null as File | null,
    fileUrl: "",
    fileType: "pdf", // default
    seo: {
      title: "",
      description: "",
      author: "",
      subject: "",
      creator: "",
      keywords: [] as string[],
      lang: "en",
      canonical_url: "",
      published_time: new Date().toISOString(),
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ----- Step Handlers -----
  const handleNext = () => setStep((s) => Math.min(s + 1, totalSteps));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));
  const stepTitles = [
    "Item Details",
    "SEO Settings",
    "Upload File",
    "Review & Submit",
  ];
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
    }
  };

  const handleFileTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, fileType: e.target.value }));
  };

  const handleSeoChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        [name]:
          name === "keywords" ? value.split(",").map((k) => k.trim()) : value,
      },
    }));
  };

  // ----- Submit Logic -----
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) throw new Error("Not authenticated");

      const apiFormData = new FormData();

      // Validate basics
      const {
        title,
        abstract,
        author,
        dateOfPublish,
        tags,
        fileType,
        file,
        coverImage,
        fileUrl,
        seo,
      } = formData;

      if (!title || !abstract || !author || !dateOfPublish || !tags)
        throw new Error("All fields are required");

      // Add base fields
      apiFormData.append("title", title);
      apiFormData.append("abstract", abstract);
      apiFormData.append("authorOfDocument", author);
      apiFormData.append("dateOfPublish", dateOfPublish);
      apiFormData.append(
        "tags",
        JSON.stringify(tags.split(",").map((t) => t.trim()))
      );
      apiFormData.append("fileType", fileType);
      apiFormData.append("seo", JSON.stringify(seo));

      // File or Link
      if (fileType === "link") {
        if (!fileUrl) throw new Error("fileUrl required for link type");
        apiFormData.append("fileUrl", fileUrl);
      } else {
        if (!file) throw new Error("File upload required");
        apiFormData.append("file", file);
      }

      if (!coverImage) throw new Error("Cover image required");
      apiFormData.append("coverImage", coverImage);

      // Send
      const res = await fetch(
        `${baseURL}/api/v2/learn-media/create-category-media/${categoryId}`,
        {
          method: "POST",
          headers: { Authorization: token },
          body: apiFormData,
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errText}`);
      }

      router.push(`/learn/${categoryId}-${slugTitle}`);
    } catch (err: unknown) {
      console.error("❌ Submission failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen font-outfit font-medium text-4xl bg-white">
        Media Data Is In Process, Please Wait . . . 🚴
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Head>
          <title>{toTitleCase(slugTitle)} - Ezpedal</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header />

        <main className="flex flex-col xl:px-32 md:px-16 px-4 w-full py-8">
          <section>
            <h1 className="text-4xl font-medium font-outfit text-black mb-10">
              {toTitleCase(slugTitle)}
            </h1>
            <div className="relative flex items-center justify-between w-full mb-10">
              {/* Background line — starts from first circle center and ends at last circle center */}
              <div className="absolute top-[30%] left-[calc(5rem/2)] right-[calc(5rem/2)] h-[3px] bg-gray-300 -translate-y-1/2"></div>

              {/* Step indicators */}
              {stepTitles.map((title, i) => {
                const index = i + 1;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center relative z-10"
                  >
                    <div
                      className={`w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold ${
                        step >= index
                          ? "bg-[#1a2947] text-white"
                          : "bg-gray-300 text-gray-600"
                      } transition-all duration-300`}
                    ></div>
                    <p
                      className={`mt-2 text-[9px] font-poppins text-center w-24 ${
                        step >= index ? "text-[#1a2947]" : "text-gray-500"
                      }`}
                    >
                      {title}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* ---- Form Step Components ---- */}
            {/* Form wrapper */}
            <div>
              {step === 1 && (
                <MediaFormItemDetails
                  formData={formData}
                  handleChange={handleChange}
                />
              )}
              {step === 2 && (
                <MediaFormSeoSettings
                  formData={formData}
                  handleSeoChange={handleSeoChange}
                />
              )}
              {step === 3 && (
                <MediaFormUploadsFile
                  formData={formData}
                  handleChange={handleChange}
                  handleFileChange={handleFileChange}
                  handleFileTypeChange={handleFileTypeChange}
                />
              )}
              {step === 4 && (
                <MediaFormReviewAllForm
                  formData={formData}
                  onSubmit={(e) => handleSubmit(e)}
                  loading={loading}
                  error={error}
                />
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-10">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="px-6 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
                  >
                    Previous
                  </button>
                )}
                {step < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="ml-auto px-6 py-2 bg-[#1a2947] text-white rounded-md hover:bg-[#0d182b]"
                  >
                    Next
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default MediaFormPage;

// "use client";
// import Header from "@/components/Header";
// import Head from "next/head";
// import React, { useState } from "react";
// import { useParams } from "next/navigation";
// import MediaFormItemDetails from "@/components/LearnPageComponents/LearnPageMediaFormPartsComp/MediaFormItemDetails";
// import MediaFormSeoSettings from "@/components/LearnPageComponents/LearnPageMediaFormPartsComp/MediaFormSeoSettings";
// import MediaFormUploadsFile from "@/components/LearnPageComponents/LearnPageMediaFormPartsComp/MediaFormUploadsFile";
// import MediaFormReviewAllForm from "@/components/LearnPageComponents/LearnPageMediaFormPartsComp/MediaFormReviewAllForm";

// const MediaFormPage = () => {
//   const { slug } = useParams();
//   const [categoryId, slugTitle] = (slug as string).split(/-(.+)/);

//   const toTitleCase = (str: string) =>
//     str
//       .toLowerCase()
//       .split(" ")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ");

//   // ---- STEP MANAGEMENT ----
//   const [step, setStep] = useState(1);
//   const totalSteps = 4;
//   const stepTitles = [
//     "Item Details",
//     "SEO Settings",
//     "Upload File",
//     "Review & Submit",
//   ];

//   // ---- FORM DATA ----
//   const [formData, setFormData] = useState({
//     title: "",
//     abstract: "",
//     author: "",
//     fileUrl: "",
//     tags: "",
//     dateOfPublish: "",
//     seo: {
//       title: "",
//       description: "",
//       author: "",
//       subject: "",
//       creator: "",
//       keywords: [],
//       lang: "en",
//       slug: "",
//       canonical_url: "",
//       published_time: "",
//     },
//   });

//   const handleNext = () => setStep((prev) => Math.min(prev + 1, totalSteps));
//   const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async () => {
//     console.log("Submitting form:", formData);
//     alert("Form submitted successfully!");
//     // TODO: integrate backend API here
//   };

//   return (
//     <>
//       <div className="min-h-screen bg-gray-100">
//         <Head>
//           <title>{toTitleCase(slugTitle)} - Ezpedal</title>
//           <link rel="icon" href="/favicon.ico" />
//         </Head>
//         <Header />

//         <main className="flex flex-col xl:px-32 md:px-16 px-4 w-full py-8">
//           <section>
//             <h1 className="text-4xl font-medium font-outfit text-black mb-10">
//               {toTitleCase(slugTitle)}
//             </h1>
//             <div className="relative flex items-center justify-between w-full mb-10">
//               {/* Background line — starts from first circle center and ends at last circle center */}
//               <div className="absolute top-[30%] left-[calc(5rem/2)] right-[calc(5rem/2)] h-[3px] bg-gray-300 -translate-y-1/2"></div>

//               {/* Step indicators */}
//               {stepTitles.map((title, i) => {
//                 const index = i + 1;
//                 return (
//                   <div
//                     key={index}
//                     className="flex flex-col items-center relative z-10"
//                   >
//                     <div
//                       className={`w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold ${
//                         step >= index
//                           ? "bg-[#1a2947] text-white"
//                           : "bg-gray-300 text-gray-600"
//                       } transition-all duration-300`}
//                     ></div>
//                     <p
//                       className={`mt-2 text-[9px] font-poppins text-center w-24 ${
//                         step >= index ? "text-[#1a2947]" : "text-gray-500"
//                       }`}
//                     >
//                       {title}
//                     </p>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* ---- Form Step Components ---- */}
//             {step === 1 && (
//               <MediaFormItemDetails
//                 formData={formData}
//                 handleChange={handleChange}
//               />
//             )}

//             {step === 2 && (
//               <MediaFormSeoSettings
//                 formData={formData}
//                 handleChange={handleChange}
//               />
//             )}

//             {step === 3 && (
//               <MediaFormUploadsFile
//                 formData={formData}
//                 handleChange={handleChange}
//               />
//             )}

//             {/* Example: add other step components here */}
//             {step === 4 && (
//               <MediaFormReviewAllForm
//                 formData={formData}
//                 handleChange={handleChange}
//               />
//             )}

//             {/* ---- Navigation Buttons ---- */}
//             <div className="flex justify-between mt-10">
//               {step > 1 && (
//                 <button
//                   onClick={handlePrev}
//                   className="px-6 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
//                 >
//                   Previous
//                 </button>
//               )}
//               {step < totalSteps ? (
//                 <button
//                   onClick={handleNext}
//                   className="ml-auto px-6 py-2 bg-[#1a2947] text-white rounded-md hover:bg-[#0d182b]"
//                 >
//                   Next
//                 </button>
//               ) : (
//                 <button
//                   onClick={handleSubmit}
//                   className="ml-auto px-6 py-2 bg-black text-white rounded-md hover:bg-green-700"
//                 >
//                   Submit
//                 </button>
//               )}
//             </div>
//           </section>
//         </main>
//       </div>
//     </>
//   );
// };

// export default MediaFormPage;
