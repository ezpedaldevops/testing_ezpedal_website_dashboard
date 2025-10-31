import Image from "next/image";
import { useEffect, useState } from "react";

interface MediaFormReviewAllFormProps {
  formData: {
    title: string;
    abstract: string;
    author: string;
    fileUrl: string;
    tags: string;
    dateOfPublish: string;
    fileType?: string;
    file?: File | null;
    coverImage?: File | null;
    seo: {
      title: string;
      description: string;
      author: string;
      subject: string;
      creator: string;
      keywords: string[];
      lang: string;
      canonical_url: string;
      published_time: string;
    };
  };
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error?: string | null;
  loading: boolean;
}

const MediaFormReviewAllForm: React.FC<MediaFormReviewAllFormProps> = ({
  formData,
  onSubmit,
  loading,
  error,
}) => {
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // generate previews when files change
  useEffect(() => {
    if (formData.file) {
      const previewUrl = URL.createObjectURL(formData.file);
      setFilePreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    } else {
      setFilePreview(null);
    }
  }, [formData.file]);

  useEffect(() => {
    if (formData.coverImage) {
      const previewUrl = URL.createObjectURL(formData.coverImage);
      setCoverPreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    } else {
      setCoverPreview(null);
    }
  }, [formData.coverImage]);

  const autoSeoTitle = `${formData.title
    ?.trim()
    .replace(/\s+/g, "-")
    .toLowerCase()}`;
  const canonicalUrl = `https://ezpedal.in/learn/${autoSeoTitle}`;
  const creator = "eZpedal Rideshare Private Limited";

  return (
    <>
      <form
        onSubmit={onSubmit}
        className="flex flex-col justify-center items-start gap-5 w-full"
      >
        <h3 className="text-xl font-outfit text-black">Step 4</h3>
        <h1 className="text-5xl font-outfit text-black">Review & Submit</h1>

        <div className="flex flex-col gap-5 w-full">
          <div className="flex gap-x-5 w-full">
            <div className="flex flex-col w-1/2">
              <label htmlFor="title" className="font-outfit text-black  mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
                required
              />
            </div>
            <div className="flex flex-col w-1/2">
              <label htmlFor="title" className="font-outfit text-black  mb-2">
                Author
              </label>
              <input
                type="text"
                value={formData.author}
                className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="flex gap-x-5 w-full">
            <div className="flex flex-col w-1/2">
              <label htmlFor="title" className="font-outfit text-black  mb-2">
                Date of Publishing
              </label>
              <input
                type="text"
                value={formData.dateOfPublish}
                className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
                required
              />
              <p className="text-xs font-thin m-2">
                Note : The website will show the date you enter here regardless
                of upload date.
              </p>
            </div>
            <div className="flex flex-col w-1/2">
              <label htmlFor="title" className="font-outfit text-black  mb-2">
                Tag
              </label>
              <input
                type="text"
                value={formData.tags}
                className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
                required
              />
              <p className="text-xs font-thin m-2">
                Note : This will appear below the document to indicate the topic
                and help sort the data
              </p>
            </div>
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="title" className="font-outfit text-black  mb-2">
              Abstract
            </label>
            <textarea
              value={formData.abstract}
              rows={3}
              className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
              required
            />
            <p className="text-xs font-thin m-2">
              Note : Character Limits is between 300-500 char.
            </p>
          </div>
          {/* ----------------------------------------------------------- */}
          <div className="flex gap-x-5 w-full">
            <div className="flex flex-col w-1/2">
              <label
                htmlFor="seo-title"
                className="font-outfit text-black mb-2"
              >
                SEO Title
              </label>
              <input
                type="text"
                id="seo-title"
                name="title"
                value={autoSeoTitle}
                disabled
                className="px-3 py-2 rounded-xl border border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>
            <div className="flex flex-col w-1/2">
              <label htmlFor="title" className="font-outfit text-black  mb-2">
                Subject
              </label>
              <input
                type="text"
                value={formData.seo.subject}
                className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
                required
              />
            </div>
          </div>
        </div>
        <div className="flex gap-x-5 w-full">
          <div className="flex flex-col w-1/2">
            <label htmlFor="title" className="font-outfit text-black  mb-2">
              Select Language
            </label>
            <input
              type="text"
              value={formData.seo.lang}
              className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
              required
            />
          </div>
          <div className="flex flex-col w-1/2">
            <label
              htmlFor="seo-creator"
              className="font-outfit text-black mb-2"
            >
              Creator
            </label>
            <input
              type="text"
              id="seo-creator"
              name="creator"
              value={creator}
              disabled
              className="px-3 py-2 rounded-xl border border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>
        </div>
        <div className="flex gap-x-5 w-full">
          <div className="flex flex-col w-1/2">
            <label htmlFor="title" className="font-outfit text-black  mb-2">
              SEO Keywords
            </label>
            <input
              type="text"
              id="seo-title"
              value={formData.seo.keywords}
              name="seo-title"
              className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
              required
            />
            <p className="text-xs font-thin m-2">
              Note : Limit the number of key words to less than 5 ideally.
            </p>
          </div>
          <div className="flex flex-col w-1/2">
            <label
              htmlFor="seo-canonical"
              className="font-outfit text-black mb-2"
            >
              Canonical URL
            </label>
            <input
              type="text"
              id="seo-canonical"
              name="canonical_url"
              value={canonicalUrl}
              disabled
              className="px-3 py-2 rounded-xl border border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>
        </div>
        <div className="flex flex-col w-full">
          <label
            htmlFor="seo-description"
            className="font-outfit text-black mb-2"
          >
            SEO Description
          </label>
          <textarea
            id="seo-description"
            name="description"
            value={formData.abstract || ""}
            disabled
            rows={3}
            className="px-3 py-2 rounded-xl border border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
          />
          <p className="text-xs font-thin m-2">
            Auto-filled from abstract. Character limit: 300–500.
          </p>
        </div>
        {/* ----------------------------------------------------------- */}
        <div className="flex flex-col gap-4 mt-4">
          {/* COVER IMAGE PREVIEW */}
          {coverPreview && (
            <div>
              <h3 className="text-sm font-semibold text-[#223658] mb-2">
                Cover Image Preview
              </h3>
              <Image
                src={coverPreview}
                alt="Cover Preview"
                height={250}
                width={400}
                className="w-[400px] h-[250px] object-cover rounded-lg border"
              />
            </div>
          )}

          {/* FILE PREVIEW */}
          {formData.fileType !== "link" && filePreview && (
            <div>
              <h3 className="text-sm font-semibold text-[#223658] mb-2">
                File Preview
              </h3>
              {formData.fileType === "pdf" && (
                <embed
                  src={filePreview}
                  type="application/pdf"
                  width="400"
                  height="300"
                />
              )}

              {formData.fileType === "mp4" && (
                <video src={filePreview} width="400" height="250" controls />
              )}

              {formData.fileType === "mp3" && (
                <audio src={filePreview} controls />
              )}

              {(formData.fileType === "doc" ||
                formData.fileType === "docx") && (
                <p className="text-gray-600 italic">
                  Document selected: {formData.file?.name}
                </p>
              )}
            </div>
          )}

          {/* LINK PREVIEW */}
          {formData.fileType === "link" && formData.fileUrl && (
            <div>
              <h3 className="text-sm font-semibold text-[#223658] mb-2">
                Link Preview
              </h3>
              <a
                href={formData.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {formData.fileUrl}
              </a>
            </div>
          )}
        </div>
        <div className="flex justify-end items-end gap-5 w-full">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 w-full bg-[#223658] text-white rounded-xl hover:bg-[#1a2946] transition"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-2 font-poppins">{error}</p>
        )}
      </form>
    </>
  );
};

export default MediaFormReviewAllForm;

// interface MediaFormItemDetailsProps {
//   formData: {
//     title: string;
//     abstract: string;
//     author: string;
//     fileUrl: string;
//     tags: string;
//     dateOfPublish: string;
//     seo: {
//       title: "";
//       description: "";
//       author: "";
//       subject: "";
//       creator: "";
//       keywords: [];
//       lang: "en";
//       canonical_url: "";
//       published_time: "";
//     };
//   };
//   handleChange: (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => void;
// }

// const MediaFormReviewAllForm: React.FC<MediaFormItemDetailsProps> = ({
//   formData,
//   handleChange,
// }) => {
//   return (
//     <>
//       <div className="flex flex-col justify-center items-start gap-5">
//         <h3 className="text-xl font-outfit text-black">Step 4</h3>
//         <h1 className="text-5xl font-outfit text-black">Review & Submit</h1>
//         <div className="flex flex-col gap-5 w-full">
//           <div className="flex gap-x-5 w-full">
//             <div className="flex flex-col w-1/2">
//               <label htmlFor="title" className="font-outfit text-black  mb-2">
//                 Title
//               </label>
//               <input
//                 type="text"
//
//                 value={formData.title}
//                 // onChange={handleChange}
//
//                 className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
//                 required
//               />
//             </div>
//             <div className="flex flex-col w-1/2">
//               <label htmlFor="title" className="font-outfit text-black  mb-2">
//                 Author
//               </label>
//               <input
//                 type="text"
//
//                 value={formData.author}
//                 // onChange={handleChange}
//
//                 className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
//                 required
//               />
//             </div>
//           </div>

//           <div className="flex gap-x-5 w-full">
//             <div className="flex flex-col w-1/2">
//               <label htmlFor="title" className="font-outfit text-black  mb-2">
//                 Date of Publishing
//               </label>
//               <input
//                 type="text"
//
//                 value={formData.author}
//                 // onChange={handleChange}
//
//                 className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
//                 required
//               />
//               <p className="text-xs font-thin m-2">
//                 Note : The website will show the date you enter here regardless
//                 of upload date.
//               </p>
//             </div>
//             <div className="flex flex-col w-1/2">
//               <label htmlFor="title" className="font-outfit text-black  mb-2">
//                 Tag
//               </label>
//               <input
//                 type="text"
//
//                 value={formData.tags}
//                 // onChange={handleChange}
//
//                 className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
//                 required
//               />
//               <p className="text-xs font-thin m-2">
//                 Note : This will appear below the document to indicate the topic
//                 and help sort the data
//               </p>
//             </div>
//           </div>

//           <div className="flex flex-col w-full">
//             <label htmlFor="title" className="font-outfit text-black  mb-2">
//               Abstract
//             </label>
//             <textarea
//
//               value={formData.abstract}
//               // onChange={handleChange}
//
//               rows={3}
//               className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
//               required
//             />
//             <p className="text-xs font-thin m-2">
//               Note : Character Limits is between 300-500 char.
//             </p>
//           </div>
//           {/* ----------------------------------------------------------- */}
//           <div className="flex gap-x-5 w-full">
//             <div className="flex flex-col w-1/2">
//               <label htmlFor="title" className="font-outfit text-black  mb-2">
//                 SEO Title
//               </label>
//               <input
//                 type="text"
//                 id="seo-title"
//                 // value={formData.seo.title}
//                 // onChange={handleChange}
//                 name="seo-title"
//                 className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
//                 required
//               />
//             </div>
//             <div className="flex flex-col w-1/2">
//               <label htmlFor="title" className="font-outfit text-black  mb-2">
//                 Subject
//               </label>
//               <input
//                 type="text"
//
//                 // value={formData.seo.subject}
//                 // onChange={handleChange}
//
//                 className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
//                 required
//               />
//             </div>
//           </div>
//         </div>
//         <div className="flex gap-x-5 w-full">
//           <div className="flex flex-col w-1/2">
//             <label htmlFor="title" className="font-outfit text-black  mb-2">
//               Select Language
//             </label>
//             <select
//               id="language"
//               // value={seoData.lang}
//               // onChange={(e) => handleInputChange("lang", e.target.value)}
//               className="px-3 py-2 rounded-xl"
//             >
//               <option value="en">English</option>
//               <option value="de">Germany</option>
//               <option value="hi">Hindi</option>
//               <option value="mr">Marathi</option>
//             </select>
//           </div>
//           <div className="flex flex-col w-1/2">
//             <label htmlFor="title" className="font-outfit text-black  mb-2">
//               Creator
//             </label>
//             <input
//               type="text"
//               id="creator"
//               value="eZpedal Rideshare Private Limited"
//               name="creator"
//               className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
//               required
//             />
//           </div>
//         </div>
//         <div className="flex gap-x-5 w-full">
//           <div className="flex flex-col w-1/2">
//             <label htmlFor="title" className="font-outfit text-black  mb-2">
//               SEO Keywords
//             </label>
//             <input
//               type="text"
//               id="seo-title"
//               // value={formData.seo.title}
//               // onChange={handleChange}
//               name="seo-title"
//               className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
//               required
//             />
//             <p className="text-xs font-thin m-2">
//               Note : Limit the number of key words to less than 5 ideally.
//             </p>
//           </div>
//           <div className="flex flex-col w-1/2">
//             <label htmlFor="title" className="font-outfit text-black  mb-2">
//               Canonical URL
//             </label>
//             <input
//               type="text"
//
//               // value={formData.seo.subject}
//               // onChange={handleChange}
//
//               className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
//               required
//             />
//           </div>
//         </div>
//         <div className="flex flex-col w-full">
//           <label htmlFor="title" className="font-outfit text-black  mb-2">
//             SEO Description
//           </label>
//           <textarea
//
//             // value={formData.abstract}
//             // onChange={handleChange}
//
//             rows={3}
//             className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
//             required
//           />
//           <p className="text-xs font-thin m-2">
//             Note : Character Limits is between 300-500 char.
//           </p>
//         </div>
//       </div>
//       {/* ----------------------------------------------------------- */}
//       {/* Add Cover Image */}
//         <div className="mt-5 flex flex-col w-full gap-y-4">
//           <label
//             htmlFor="coverImage"
//             className=" font-poppins"
//           >
//             Add Cover Image
//           </label>
//           {/* <div className=" flex justify-center items-center">
//             {coverPreview && (
//               <Image
//                 src={coverPreview || "/placeholder.svg"}
//                 width={300}
//                 height={200}
//                 alt="Cover Preview"
//                 className="max-h-40 rounded-xl shadow"
//               />
//             )}
//           </div> */}

//           {/* Custom upload box */}
//           <label
//             htmlFor="coverImage"
//             className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#223658] rounded-xl cursor-pointer bg-white hover:bg-white/60 transition"
//           >
//             <span className="text-[#223658] text-xl font-thin">
//               Add Cover +
//             </span>
//             <span className="text-xs font-thin text-gray-500">
//               Click to upload or drag & drop
//             </span>
//           </label>

//           {/* Hidden file input */}
//           <input
//             id="coverImage"
//             name="coverImage"
//             type="file"
//             accept="image/*"
//             className="hidden"
//             required
//             // onChange={(e) => {
//             //   const file = e.target.files?.[0];
//             //   if (file) {
//             //     setCoverPreview(URL.createObjectURL(file));
//             //   }
//             // }}
//           />

//           <p className="text-xs font-thin px-5 my-[-5px]">
//             Note : Optimal Cover Dimensions for Best Fit : W x H =  400 px  X 250 px
//           </p>
//         </div>

//         <div className="flex flex-col w-full gap-y-4 mt-5">
//           <label
//             htmlFor="fileType"
//             className=" font-poppins "
//           >
//             Select File Type
//           </label>

//           {/* Select dropdown */}
//           <select
//             id="fileType"
//             // onChange={handleFileTypeChange}
//             className="px-3 py-2 rounded-xl"
//           >
//             <option value="pdf">Document .pdf</option>
//             <option value="doc">Document .doc</option>
//             <option value="audio">Audio .mp3</option>
//             <option value="video">Video .mp4</option>
//             <option value="text">Paste Active Link</option>
//           </select>
//         </div>

//         <div className="flex flex-col w-full gap-y-4 mt-5">
//           <label
//             htmlFor="addFile"
//             className="font-poppins mb-1"
//           >
//             Add File
//           </label>
//           {/* {filePreview && (
//             <div className="mt-2 flex justify-center items-center">
//               {fileType.startsWith("image") && (
//                 <Image
//                   src={filePreview || "/placeholder.svg"}
//                   width={300}
//                   height={200}
//                   alt="File Preview"
//                   className="max-h-40 rounded-xl shadow"
//                 />
//               )}
//               {fileType.startsWith("video") && (
//                 <video
//                   src={filePreview}
//                   controls
//                   className="max-h-40 rounded-xl shadow"
//                 />
//               )}
//               {fileType === "application/pdf" && (
//                 <embed
//                   src={filePreview}
//                   type="application/pdf"
//                   className="max-h-40 rounded-xl shadow"
//                 />
//               )} */}
//             </div>

//           {/* Custom upload box */}
//           <label
//             htmlFor="addFile"
//             className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#223658] rounded-xl cursor-pointer bg-white hover:bg-white/60 transition"
//           >
//             <span className="text-[#223658] text-xl font-thin">Add File +</span>
//             <span className="text-xs font-thin text-gray-500">
//               Click to upload or drag & drop
//             </span>
//           </label>

//           {/* Hidden file input */}
//           <input
//             id="addFile"
//             name="addFile"
//             type="file"
//             // accept={fileType} // <-- respect your dropdown selection
//             className="hidden"
//             required
//             // onChange={(e) => {
//             //   const file = e.target.files?.[0];
//             //   if (file) {
//             //     setFilePreview(URL.createObjectURL(file));
//             //   }
//             // }}
//           />

//       {/* <div className="text-center text-lg font-semibold">
//         <p>Review your data before submission</p>
//         <pre>{JSON.stringify(formData, null, 2)}</pre>
//       </div> */}
//     </>
//   );
// };

// export default MediaFormReviewAllForm;
