"use client";
import Header from "@/components/Header";
import type React from "react";
import { notFound } from "next/navigation";
import Head from "next/head";
import { useEffect, useState } from "react";
import LearnPageSectionNewItemAddForm from "@/components/LearnPageComponents/LearnPageAddNewItemCategoryComp/LearnPageSectionNewItemAddForm";
import LearnPageSectionNewItemShowData from "@/components/LearnPageComponents/LearnPageAddNewItemCategoryComp/LearnPageSectionNewItemShowData";

interface Props {
  params: { slug: string };
}

const LearnPCategoryPageForm = ({ params }: Props) => {
  const { slug } = params;
  const [coverPreview, ] = useState<string | null>(null);
  const [filePreview, ] = useState<string | null>(null);



  const [categoryId, slugTitle] = slug.split(/-(.+)/);


  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [coverPreview, filePreview]);

  if (!slug) return notFound();



  return (
    <>
      <div className="min-h-screen bg-gray-100 my-5">
        <Head>
          <title>
            Learn / {toTitleCase(slugTitle.replace(/-/g, " "))} - Ezpedal
          </title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header />
        <main className="flex flex-col  w-full ">
          <LearnPageSectionNewItemAddForm toTitleCase={toTitleCase} slugTitle={slugTitle} categoryId={categoryId}/>
          <LearnPageSectionNewItemShowData toTitleCase={toTitleCase} slugTitle={slugTitle} categoryId={categoryId}/>
        </main>
      </div>
    </>

    // <>
    // <div className="min-h-screen bg-gray-100 my-5">
    //   <Head>
    //     <title>
    //       Learn / {toTitleCase(slugTitle.replace(/-/g, " "))} - Ezpedal
    //     </title>
    //     <link rel="icon" href="/favicon.ico" />
    //   </Head>

    //   <Header />

    //     <main className="flex flex-col xl:px-32 md:px-16 px-4 w-full ">
    //       <section>
    //         <div className="flex flex-col mt-10">
    //           <h1 className="text-4xl text-[#223658] font-Poppins">
    //             {toTitleCase(slugTitle.replace(/-/g, " "))}
    //           </h1>
    //           <h3 className="font-Poppins my-2 text-lg">
    //             Add New File to {toTitleCase(slugTitle.replace(/-/g, " "))}{" "}
    //             Category
    //           </h3>
    //         </div>

    //         {error && (
    //           <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
    //             {error}
    //           </div>
    //         )}

    //         <div className="p-6">
    //           <form
    //             onSubmit={handleSubmit}
    //             className="rounded-2xl gap-y-5 p-9 flex flex-col justify-center items-center transition hover:shadow-lg  shadow-md bg-gradient-to-r from-[#A7AFBC66] to-[#DDE2EB]"
    //           >
    //             {/* Title of Category */}
    //             <div className="flex flex-col w-full">
    //               <label
    //                 htmlFor="title"
    //                 className="text-lg font-medium text-[#223658] mb-4"
    //               >
    //                 Title
    //               </label>
    //               <input
    //                 type="text"
    //                 id="title"
    //                 name="title"
    //                 placeholder="Enter category title"
    //                 className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
    //                 required
    //               />
    //             </div>

    //             {/* Description of Category */}
    //             <div className="flex flex-col w-full gap-y-4">
    //               <label
    //                 htmlFor="description"
    //                 className="text-lg font-medium text-[#223658] mb-1"
    //               >
    //                 Abstract
    //               </label>
    //               <textarea
    //                 id="abstract"
    //                 name="abstract"
    //                 placeholder="Enter category abstract (Maximum 300 Character.)"
    //                 className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none resize-none"
    //                 rows={3}
    //                 required
    //               />
    //               <p className="text-xs font-thin px-5 my-[-5px]">
    //                 Maximum 300 Character.
    //               </p>
    //             </div>

    //             {/* Add Cover Image */}
    //             <div className="flex flex-col w-full gap-y-4">
    //               <label
    //                 htmlFor="coverImage"
    //                 className="text-lg font-medium text-[#223658] mb-1"
    //               >
    //                 Add Cover Image
    //               </label>
    //               <div className="mt-2 flex justify-center items-center">
    //                 {coverPreview && (
    //                   <Image
    //                     src={coverPreview || "/placeholder.svg"}
    //                     width={300}
    //                     height={200}
    //                     alt="Cover Preview"
    //                     className="max-h-40 rounded-xl shadow"
    //                   />
    //                 )}
    //               </div>

    //               {/* Custom upload box */}
    //               <label
    //                 htmlFor="coverImage"
    //                 className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#223658] rounded-xl cursor-pointer bg-white hover:bg-white/60 transition"
    //               >
    //                 <span className="text-[#223658] text-xl font-thin">
    //                   Add Cover +
    //                 </span>
    //                 <span className="text-xs font-thin text-gray-500">
    //                   Click to upload or drag & drop
    //                 </span>
    //               </label>

    //               {/* Hidden file input */}
    //               <input
    //                 id="coverImage"
    //                 name="coverImage"
    //                 type="file"
    //                 accept="image/*"
    //                 className="hidden"
    //                 required
    //                 onChange={(e) => {
    //                   const file = e.target.files?.[0];
    //                   if (file) {
    //                     setCoverPreview(URL.createObjectURL(file));
    //                   }
    //                 }}
    //               />

    //               <p className="text-xs font-thin px-5 my-[-5px]">
    //                 Size : W x H = 1440 px X 552 px
    //               </p>
    //             </div>

    //             <div className="flex flex-col w-full gap-y-4">
    //               <label
    //                 htmlFor="fileType"
    //                 className="text-lg font-medium text-[#223658] "
    //               >
    //                 Select File Type
    //               </label>

    //               {/* Select dropdown */}
    //               <select
    //                 id="fileType"
    //                 onChange={handleFileTypeChange}
    //                 className="px-3 py-2 rounded-xl border-2 border-dashed border-[#223658]"
    //               >
    //                 <option value="image">JPEG</option>
    //                 <option value="image">WEBP</option>
    //                 <option value="image">JPG</option>
    //                 <option value="image">PNG</option>
    //                 <option value="image">SVG</option>
    //                 <option value="video">MP4</option>
    //                 <option value="pdf">PDF</option>
    //               </select>
    //             </div>

    //             <div className="flex flex-col w-full gap-y-4">
    //               <label
    //                 htmlFor="addFile"
    //                 className="text-lg font-medium text-[#223658] mb-1"
    //               >
    //                 Add File
    //               </label>
    //               {filePreview && (
    //                 <div className="mt-2 flex justify-center items-center">
    //                   {fileType.startsWith("image") && (
    //                     <Image
    //                       src={filePreview || "/placeholder.svg"}
    //                       width={300}
    //                       height={200}
    //                       alt="File Preview"
    //                       className="max-h-40 rounded-xl shadow"
    //                     />
    //                   )}
    //                   {fileType.startsWith("video") && (
    //                     <video
    //                       src={filePreview}
    //                       controls
    //                       className="max-h-40 rounded-xl shadow"
    //                     />
    //                   )}
    //                   {fileType === "application/pdf" && (
    //                     <embed
    //                       src={filePreview}
    //                       type="application/pdf"
    //                       className="max-h-40 rounded-xl shadow"
    //                     />
    //                   )}
    //                 </div>
    //               )}

    //               {/* Custom upload box */}
    //               <label
    //                 htmlFor="addFile"
    //                 className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#223658] rounded-xl cursor-pointer bg-white hover:bg-white/60 transition"
    //               >
    //                 <span className="text-[#223658] text-xl font-thin">
    //                   Add File +
    //                 </span>
    //                 <span className="text-xs font-thin text-gray-500">
    //                   Click to upload or drag & drop
    //                 </span>
    //               </label>

    //               {/* Hidden file input */}
    //               <input
    //                 id="addFile"
    //                 name="addFile"
    //                 type="file"
    //                 accept={fileType} // <-- respect your dropdown selection
    //                 className="hidden"
    //                 required
    //                 onChange={(e) => {
    //                   const file = e.target.files?.[0];
    //                   if (file) {
    //                     setFilePreview(URL.createObjectURL(file));
    //                   }
    //                 }}
    //               />
    //             </div>

    //             <div className="flex flex-col w-full gap-y-4">
    //               <label
    //                 htmlFor="authorOfDocumentFile"
    //                 className="text-lg font-medium text-[#223658] "
    //               >
    //                 Author of Document/File
    //               </label>
    //               <input
    //                 id="authorOfDocumentFile"
    //                 name="authorOfDocumentFile"
    //                 type="text"
    //                 className="px-3 py-2 rounded-xl border-2 border-dashed border-[#223658]"
    //                 required
    //               />
    //             </div>

    //             <div className="flex flex-col w-full gap-y-4">
    //               <label
    //                 htmlFor="dateOfPublishing"
    //                 className="text-lg font-medium text-[#223658] "
    //               >
    //                 Date of Publishing
    //               </label>
    //               <input
    //                 id="dateOfPublishing"
    //                 name="dateOfPublishing"
    //                 type="date"
    //                 className="px-3 py-2 rounded-xl border-2 border-dashed border-[#223658]"
    //                 required
    //               />
    //             </div>
    //             <div className="flex flex-col w-full gap-y-4">
    //               <label
    //                 htmlFor="tags"
    //                 className="text-lg font-medium text-[#223658] "
    //               >
    //                 Tags
    //               </label>
    //               <input
    //                 id="tags"
    //                 name="tags"
    //                 type="text"
    //                 placeholder="Enter as a Comma Seperated format => Red, Yellow, Blue"
    //                 className="px-3 py-2 rounded-xl border-2 border-dashed border-[#223658]"
    //                 required
    //               />
    //             </div>

    //             <LearnPageMediaFormSEOComponents ref={seoFormRef} />

    //             {/* Submit Button */}
    //             <button
    //               type="submit"
    //               disabled={loading}
    //               className="mt-4 w-full bg-[#223658] text-white py-2 px-4 rounded-full hover:bg-[#1a2947] transition disabled:opacity-50 disabled:cursor-not-allowed"
    //             >
    //               {loading ? "Creating..." : "Create"}
    //             </button>
    //           </form>
    //         </div>
    //       </section>
    //     </main>
    //     {/* show all data */}
    //     <ShowPdfsDataLearnPage slugTitle={slugTitle} categoryId={categoryId} />
    //     {/* show all data */}
    //   </div>
    // </>
  );
};

export default LearnPCategoryPageForm;
