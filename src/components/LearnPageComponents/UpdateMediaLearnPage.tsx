"use client"
import Image from "next/image"
import React, { useState } from "react"

interface Media {
  _id: string
  title: string
  abstract: string
  authorOfDocument?: string
  dateOfPublish?: string
  tags?: string[]
  fileType?: string
  fileUrl?: string
  seo?: {
    title: string
    description: string
    author: string
    subject: string
    creator: string
    keywords: string[]
    lang: string
    slug: string
    canonical_url: string
    published_time?: string
  }
  coverImageUrl?: string
}

interface Props {
  selectedMedia: Media
  closeModal: () => void
}

const fileTypeOptions = [
  { value: "pdf", label: "Document .pdf" },
  { value: "doc", label: "Document .doc/.docx" },
  { value: "mp3", label: "Audio .mp3" },
  { value: "mp4", label: "Video .mp4" },
  { value: "link", label: "Paste Active Link" },
]

const UpdateMediaLearnPage = ({ selectedMedia, closeModal }: Props) => {
  const [title, setTitle] = useState(selectedMedia.title)
  const [abstract, setAbstract] = useState(selectedMedia.abstract)
  const [authorOfDocument, setAuthorOfDocument] = useState(selectedMedia.authorOfDocument || "")
  const [dateOfPublish, setDateOfPublish] = useState(selectedMedia.dateOfPublish?.split("T")[0] || "")
  const [tags, setTags] = useState(selectedMedia.tags?.join(",") || "")
  const [fileType, setFileType] = useState(selectedMedia.fileType || "pdf")
  const [fileUrl, setFileUrl] = useState(selectedMedia.fileUrl || "")
  const [file, setFile] = useState<File | null>(null)
  const [coverImage, setCoverImage] = useState<File | null>(null)

  const [seo, setSeo] = useState(
    selectedMedia.seo || {
      title: "",
      description: "",
      author: "",
      subject: "",
      creator: "eZpedal Rideshare Private Limited",
      keywords: [],
      lang: "en",
      slug: "",
      canonical_url: "",
      published_time: "",
    },
  )

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL

  // Preview helpers
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  React.useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file)
      setFilePreview(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setFilePreview(null)
    }
  }, [file])

  React.useEffect(() => {
    if (coverImage) {
      const url = URL.createObjectURL(coverImage)
      setCoverPreview(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setCoverPreview(null)
    }
  }, [coverImage])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      if (!title.trim() || !abstract.trim()) {
        throw new Error("Title and abstract are required")
      }

      if (fileType === "link" && !fileUrl.trim()) {
        throw new Error("File URL is required for link type")
      }

      const formData = new FormData()
      formData.append("title", title)
      formData.append("abstract", abstract)
      formData.append("authorOfDocument", authorOfDocument)
      formData.append("dateOfPublish", dateOfPublish)

      formData.append(
        "tags",
        JSON.stringify(
          tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        ),
      )

      formData.append("fileType", fileType)

      if (fileType === "link") {
        formData.append("fileUrl", fileUrl)
      } else if (file) {
        formData.append("file", file)
      }

      if (coverImage) {
        formData.append("coverImage", coverImage)
      }

      formData.append(
        "seo",
        JSON.stringify({
          title: seo.title,
          description: seo.description,
          author: seo.author,
          subject: seo.subject,
          creator: seo.creator,
          keywords: Array.isArray(seo.keywords) ? seo.keywords.map((k) => k.trim()).filter(Boolean) : [],
          lang: seo.lang,
          slug: seo.slug,
          canonical_url: seo.canonical_url,
          published_time: seo.published_time || undefined,
        }),
      )

      const response = await fetch(`${baseURL}/api/v2/learn-media/update-category-media/${selectedMedia._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      setSuccess(true)
      setTimeout(() => {
        closeModal()
      }, 1500)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update media"
      setError(errorMessage)
      console.error("Update error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-[#223658] rounded-2xl shadow-lg w-full max-w-3xl p-10 px-14 relative overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-3 right-3 bg-white rounded-full p-2 px-4 text-red-500 hover:text-black text-xl font-extrabold"
          onClick={closeModal}
        >
          ✕
        </button>
        <h2 className="text-2xl font-semibold text-center text-white mb-4">Edit Media</h2>

        {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            Media updated successfully!
          </div>
        )}

        <form className="flex flex-col gap-6 bg-[#223658]" onSubmit={handleSubmit}>
          {/* Title, Author, Abstract, Date, Tags */}
          <div>
            <label className="text-white font-semibold block mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border px-3 py-2 rounded-2xl w-full"
              required
            />
          </div>

          <div>
            <label className="text-white font-semibold block mb-2">Author Of Document</label>
            <input
              type="text"
              value={authorOfDocument}
              onChange={(e) => setAuthorOfDocument(e.target.value)}
              className="border px-3 py-2 rounded-2xl w-full"
            />
          </div>

          <div>
            <label className="text-white font-semibold block mb-2">Date Of Publish</label>
            <input
              type="date"
              value={dateOfPublish}
              onChange={(e) => setDateOfPublish(e.target.value)}
              className="border px-3 py-2 rounded-2xl w-full"
            />
          </div>

          <div>
            <label className="text-white font-semibold block mb-2">Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="border px-3 py-2 rounded-2xl w-full"
              placeholder="e.g., rideshare, bicycle, india"
            />
          </div>

          <div>
            <label className="text-white font-semibold block mb-2">Abstract</label>
            <textarea
              value={abstract}
              rows={3}
              onChange={(e) => setAbstract(e.target.value)}
              className="border px-3 py-2 rounded-2xl w-full"
              required
            />
          </div>

          {/* File Type */}
          <div>
            <label className="text-white font-semibold block mb-2">File Type</label>
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              className="border px-3 py-2 rounded-2xl w-full"
              required
            >
              {fileTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* File or Link */}
          {fileType === "link" ? (
            <div>
              <label className="text-white font-semibold block mb-2">File URL</label>
              <input
                type="url"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                className="border px-3 py-2 rounded-2xl w-full text-white"
                placeholder="https://example.com"
                required
              />
            </div>
          ) : (
            <div>
              <label className="text-white font-semibold block mb-2">Upload New File</label>
              <input
                type="file"
                accept={
                  fileType === "pdf"
                    ? "application/pdf"
                    : fileType === "doc"
                      ? ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      : fileType === "mp3"
                        ? "audio/mpeg"
                        : fileType === "mp4"
                          ? "video/mp4"
                          : undefined
                }
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full text-white"
              />
              {filePreview && (
                <div className="mt-3 p-3 bg-white rounded-lg">
                  {fileType === "pdf" ? (
                    <embed src={filePreview} type="application/pdf" width="100%" height="300" />
                  ) : fileType === "mp4" ? (
                    <video src={filePreview} width="100%" height="250" controls />
                  ) : fileType === "mp3" ? (
                    <audio src={filePreview} controls className="w-full" />
                  ) : fileType === "doc" ? (
                    <p className="text-gray-600 italic">Document selected: {file?.name}</p>
                  ) : null}
                </div>
              )}
            </div>
          )}

          {/* Cover Image */}
          <div>
            <label className="text-white font-semibold block mb-2">Upload New Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
              className="w-full text-white"
            />
            {coverPreview && (
              <div className="mt-3">
                <Image
                  src={coverPreview || "/placeholder.svg"}
                  alt="Cover Preview"
                  height={250}
                  width={400}
                  className="w-40 h-40 object-cover rounded border"
                />
              </div>
            )}
          </div>

          {/* SEO Fields */}
          <div className="flex flex-col gap-4 border rounded p-4 bg-[#223658]">
            <h3 className="font-semibold text-xl text-center text-white">SEO Fields</h3>

            <div>
              <label className="text-white font-semibold block mb-2">SEO Title</label>
              <input
                type="text"
                value={seo.title}
                onChange={(e) => setSeo({ ...seo, title: e.target.value })}
                className="border px-3 py-2 rounded-xl w-full"
              />
            </div>

            <div>
              <label className="text-white font-semibold block mb-2">SEO Description</label>
              <textarea
                value={seo.description}
                rows={2}
                onChange={(e) => setSeo({ ...seo, description: e.target.value })}
                className="border px-3 py-2 rounded-xl w-full"
              />
            </div>

            <div>
              <label className="text-white font-semibold block mb-2">SEO Author</label>
              <input
                type="text"
                value={seo.author}
                onChange={(e) => setSeo({ ...seo, author: e.target.value })}
                className="border px-3 py-2 rounded-xl w-full"
              />
            </div>

            <div>
              <label className="text-white font-semibold block mb-2">SEO Subject</label>
              <input
                type="text"
                value={seo.subject}
                onChange={(e) => setSeo({ ...seo, subject: e.target.value })}
                className="border px-3 py-2 rounded-xl w-full"
              />
            </div>

            <div>
              <label className="text-white font-semibold block mb-2">SEO Creator</label>
              <input
                type="text"
                value={seo.creator}
                onChange={(e) => setSeo({ ...seo, creator: e.target.value })}
                className="border px-3 py-2 rounded-xl w-full"
              />
            </div>

            <div>
              <label className="text-white font-semibold block mb-2">SEO Keywords (comma separated)</label>
              <input
                type="text"
                value={seo.keywords.join(",")}
                onChange={(e) =>
                  setSeo({
                    ...seo,
                    keywords: e.target.value.split(",").map((k) => k.trim()),
                  })
                }
                className="border px-3 py-2 rounded-xl w-full"
              />
            </div>

            <div>
              <label className="text-white font-semibold block mb-2">Content Language</label>
              <select
                value={seo.lang}
                onChange={(e) => setSeo({ ...seo, lang: e.target.value })}
                className="border px-3 py-2 rounded-xl w-full"
              >
                <option value="en">English</option>
                <option value="de">German</option>
                <option value="hi">Hindi</option>
                <option value="mr">Marathi</option>
              </select>
            </div>

            <div>
              <label className="text-white font-semibold block mb-2">URL Slug</label>
              <input
                type="text"
                value={seo.slug}
                onChange={(e) => setSeo({ ...seo, slug: e.target.value })}
                className="border px-3 py-2 rounded-xl w-full"
              />
            </div>

            <div>
              <label className="text-white font-semibold block mb-2">Canonical URL</label>
              <input
                type="text"
                value={seo.canonical_url}
                onChange={(e) => setSeo({ ...seo, canonical_url: e.target.value })}
                className="border px-3 py-2 rounded-xl w-full"
              />
            </div>

            <div>
              <label className="text-white font-semibold block mb-2">Published Time</label>
              <input
                type="datetime-local"
                value={seo.published_time || ""}
                onChange={(e) => setSeo({ ...seo, published_time: e.target.value })}
                className="border px-3 py-2 rounded-xl w-full"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[white] text-[#223658] px-6 py-3 rounded-full hover:text-black disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors mt-4"
          >
            {loading ? "Updating..." : "Update Changes"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default UpdateMediaLearnPage
























// "use client";
// import Image from "next/image";
// import React, { useState } from "react";

// interface Media {
//   _id: string;
//   title: string;
//   abstract: string;
//   authorOfDocument?: string;
//   dateOfPublish?: string;
//   tags?: string[];
//   fileType?: string;
//   fileUrl?: string;
//   seo?: {
//     title: string;
//     description: string;
//     author: string;
//     subject: string;
//     creator: string;
//     keywords: string[];
//     lang: string;
//     slug: string;
//     canonical_url: string;
//     published_time?: string;
//   };
//   coverImageUrl?: string;
// }

// interface Props {
//   selectedMedia: Media;
//   closeModal: () => void;
// }

// const fileTypeOptions = [
//   { value: "pdf", label: "Document .pdf" },
//   { value: "doc", label: "Document .doc/.docx" },
//   { value: "mp3", label: "Audio .mp3" },
//   { value: "mp4", label: "Video .mp4" },
//   { value: "link", label: "Paste Active Link" },
// ];

// const UpdateMediaLearnPage = ({ selectedMedia, closeModal }: Props) => {
//   const [title, setTitle] = useState(selectedMedia.title);
//   const [abstract, setAbstract] = useState(selectedMedia.abstract);
//   const [authorOfDocument, setAuthorOfDocument] = useState(
//     selectedMedia.authorOfDocument || ""
//   );
//   const [dateOfPublish, setDateOfPublish] = useState(
//     selectedMedia.dateOfPublish?.split("T")[0] || ""
//   );
//   const [tags, setTags] = useState(selectedMedia.tags?.join(",") || "");
//   const [fileType, setFileType] = useState(selectedMedia.fileType || "pdf");
//   const [fileUrl, setFileUrl] = useState(selectedMedia.fileUrl || "");
//   const [file, setFile] = useState<File | null>(null);
//   const [coverImage, setCoverImage] = useState<File | null>(null);

//   const [seo, setSeo] = useState(
//     selectedMedia.seo || {
//       title: "",
//       description: "",
//       author: "",
//       subject: "",
//       creator: "eZpedal Rideshare Private Limited",
//       keywords: [],
//       lang: "en",
//       slug: "",
//       canonical_url: "",
//       published_time: "",
//     }
//   );

//   const [loading, setLoading] = useState(false);
//   const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

//   // Preview helpers
//   const [filePreview, setFilePreview] = useState<string | null>(null);
//   const [coverPreview, setCoverPreview] = useState<string | null>(null);

//   React.useEffect(() => {
//     if (file) {
//       const url = URL.createObjectURL(file);
//       setFilePreview(url);
//       return () => URL.revokeObjectURL(url);
//     } else {
//       setFilePreview(null);
//     }
//   }, [file]);

//   React.useEffect(() => {
//     if (coverImage) {
//       const url = URL.createObjectURL(coverImage);
//       setCoverPreview(url);
//       return () => URL.revokeObjectURL(url);
//     } else {
//       setCoverPreview(null);
//     }
//   }, [coverImage]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append("title", title);
//       formData.append("abstract", abstract);
//       formData.append("authorOfDocument", authorOfDocument);
//       formData.append("dateOfPublish", dateOfPublish);

//       // Tags as JSON array
//       formData.append(
//         "tags",
//         JSON.stringify(
//           tags
//             .split(",")
//             .map((t) => t.trim())
//             .filter(Boolean)
//         )
//       );

//       formData.append("fileType", fileType);

//       // File or link logic
//       if (fileType === "link") {
//         formData.append("fileUrl", fileUrl);
//       } else if (file) {
//         formData.append("file", file);
//       }

//       if (coverImage) formData.append("coverImage", coverImage);

//       // SEO fields
//       // formData.append(
//       //   "seo",
//       //   JSON.stringify({
//       //     ...seo,
//       //     keywords:
//       //       typeof seo.keywords === "string"
//       //         ? seo.keywords
//       //             .split(",")
//       //             .map((k: string) => k.trim()) // <--- add type here
//       //             .filter(Boolean)
//       //         : seo.keywords,
//       //   })
//       // );
//       formData.append(
//         "seo",
//         JSON.stringify({
//           ...seo,
//           keywords: seo.keywords.map((k) => k.trim()).filter(Boolean),
//         })
//       );

//       const res = await fetch(
//         `${baseURL}/api/v2/learn-media/update-category-media/${selectedMedia._id}`,
//         {
//           method: "PATCH",
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//           body: formData,
//         }
//       );

//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.error || "Failed to update media");
//       }
//       alert("Media updated successfully!");
//       closeModal();
//     } catch (err: unknown) {
//       alert( "Error updating media.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
//       <div className="bg-slate-200 rounded-2xl shadow-lg w-full max-w-3xl p-10 px-14 relative overflow-y-auto max-h-[90vh]">
//         <button
//           className="absolute top-3 right-3 bg-white rounded-full p-2 px-4 text-red-500 hover:text-black text-xl font-extrabold"
//           onClick={closeModal}
//         >
//           ✕
//         </button>
//         <h2 className="text-2xl font-semibold mb-4">Edit Media</h2>
//         <form
//           className="flex flex-col gap-6 bg-slate-200"
//           onSubmit={handleSubmit}
//         >
//           {/* Title, Author, Abstract, Date, Tags */}
//           <label className="text-white font-semibold">Title</label>
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="border px-3 py-2 rounded-2xl"
//             required
//           />

//           <label className="text-white font-semibold">Author Of Document</label>
//           <input
//             type="text"
//             value={authorOfDocument}
//             onChange={(e) => setAuthorOfDocument(e.target.value)}
//             className="border px-3 py-2 rounded-2xl"
//             required
//           />

//           <label className="text-white font-semibold">Date Of Publish</label>
//           <input
//             type="date"
//             value={dateOfPublish}
//             onChange={(e) => setDateOfPublish(e.target.value)}
//             className="border px-3 py-2 rounded-2xl"
//             required
//           />

//           <label className="text-white font-semibold">Tags (comma separated)</label>
//           <input
//             type="text"
//             value={tags}
//             onChange={(e) => setTags(e.target.value)}
//             className="border px-3 py-2 rounded-2xl"
//             required
//           />

//           <label className="text-white font-semibold">Abstract</label>
//           <textarea
//             value={abstract}
//             rows={3}
//             onChange={(e) => setAbstract(e.target.value)}
//             className="border px-3 py-2 rounded-2xl"
//             required
//           />

//           {/* File Type */}
//           <label className="text-white font-semibold">File Type</label>
//           <select
//             value={fileType}
//             onChange={(e) => setFileType(e.target.value)}
//             className="border px-3 py-2 rounded-2xl"
//             required
//           >
//             {fileTypeOptions.map((opt) => (
//               <option key={opt.value} value={opt.value}>
//                 {opt.label}
//               </option>
//             ))}
//           </select>

//           {/* File or Link */}
//           {fileType === "link" ? (
//             <>
//               <label className="text-white font-semibold">File URL (for link type)</label>
//               <input
//                 type="url"
//                 value={fileUrl}
//                 onChange={(e) => setFileUrl(e.target.value)}
//                 className="border px-3 py-2 rounded-2xl"
//                 required
//               />
//             </>
//           ) : (
//             <>
//               <label className="text-white font-semibold">Upload New File</label>
//               <input
//                 type="file"
//                 accept={
//                   fileType === "pdf"
//                     ? "application/pdf"
//                     : fileType === "doc"
//                     ? ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//                     : fileType === "mp3"
//                     ? "audio/mpeg"
//                     : fileType === "mp4"
//                     ? "video/mp4"
//                     : undefined
//                 }
//                 onChange={(e) => setFile(e.target.files?.[0] || null)}
//               />
//               {filePreview && (
//                 <div className="mt-2">
//                   {fileType === "pdf" ? (
//                     <embed
//                       src={filePreview}
//                       type="application/pdf"
//                       width="400"
//                       height="300"
//                     />
//                   ) : fileType === "mp4" ? (
//                     <video
//                       src={filePreview}
//                       width="400"
//                       height="250"
//                       controls
//                     />
//                   ) : fileType === "mp3" ? (
//                     <audio src={filePreview} controls />
//                   ) : fileType === "doc" ? (
//                     <p className="text-gray-600 italic">
//                       Document selected: {file?.name}
//                     </p>
//                   ) : null}
//                 </div>
//               )}
//             </>
//           )}

//           {/* Cover Image */}
//           <label className="text-white font-semibold">Upload New Cover Image</label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
//           />
//           {coverPreview && (
//             <div className="mt-2">
//               <Image
//                 src={coverPreview}
//                 alt="Cover Preview"
//                 height={250}
//                 width={400}
//                 className="w-40 h-40 object-cover rounded border"
//               />
//             </div>
//           )}

//           {/* SEO Fields */}
//           <div className="flex flex-col gap-6 border rounded p-4 bg-white">
//             <h3 className="flex justify-center items-center font-semibold mb-2 text-2xl">
//               SEO Fields
//             </h3>
//             <label className="text-white font-semibold">SEO Title</label>
//             <input
//               type="text"
//               value={seo.title}
//               onChange={(e) => setSeo({ ...seo, title: e.target.value })}
//               className="border px-3 py-2 rounded-xl"
//             />

//             <label className="text-white font-semibold">SEO Description</label>
//             <textarea
//               value={seo.description}
//               rows={2}
//               onChange={(e) => setSeo({ ...seo, description: e.target.value })}
//               className="border px-3 py-2 rounded-xl"
//             />

//             <label className="text-white font-semibold">SEO Author</label>
//             <input
//               type="text"
//               value={seo.author}
//               onChange={(e) => setSeo({ ...seo, author: e.target.value })}
//               className="border px-3 py-2 rounded-xl"
//             />

//             <label className="text-white font-semibold">SEO Subject</label>
//             <input
//               type="text"
//               value={seo.subject}
//               onChange={(e) => setSeo({ ...seo, subject: e.target.value })}
//               className="border px-3 py-2 rounded-xl"
//             />

//             <label className="text-white font-semibold">SEO Creator</label>
//             <input
//               type="text"
//               value={seo.creator}
//               onChange={(e) => setSeo({ ...seo, creator: e.target.value })}
//               className="border px-3 py-2 rounded-xl"
//             />

//             <label className="text-white font-semibold">
//               SEO Keywords (comma separated)
//             </label>
//             <input
//               type="text"
//               value={seo.keywords.join(",")} // display as comma-separated
//               onChange={(e) =>
//                 setSeo({
//                   ...seo,
//                   keywords: e.target.value.split(",").map((k) => k.trim()),
//                 })
//               }
//               className="border px-3 py-2 rounded-xl"
//             />

//             <label className="text-white font-semibold">Content Language</label>
//             <select
//               value={seo.lang}
//               onChange={(e) => setSeo({ ...seo, lang: e.target.value })}
//               className="border px-3 py-2 rounded-xl"
//             >
//               <option value="en">English</option>
//               <option value="de">Germany</option>
//               <option value="hi">Hindi</option>
//               <option value="mr">Marathi</option>
//             </select>

//             <label className="text-white font-semibold">Canonical URL</label>
//             <input
//               type="text"
//               value={seo.canonical_url}
//               onChange={(e) =>
//                 setSeo({ ...seo, canonical_url: e.target.value })
//               }
//               className="border px-3 py-2 rounded-xl"
//             />

//             <label className="text-white font-semibold">Published Time</label>
//             <input
//               type="datetime-local"
//               value={seo.published_time || ""}
//               onChange={(e) =>
//                 setSeo({ ...seo, published_time: e.target.value })
//               }
//               className="border px-3 py-2 rounded-xl"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-[#223658] text-white px-6 py-2 rounded-full hover:bg-blue-600 disabled:opacity-50 mt-4"
//           >
//             {loading ? "Updating..." : "Update Changes"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UpdateMediaLearnPage;




























// "use client";
// import React, { useState } from "react";

// interface Media {
//   _id: string;
//   title: string;
//   abstract: string;
//   authorOfDocument?: string;
//   dateOfPublish?: string;
//   tags?: string[];
//   fileType?: string;
//   seo?: {
//     title: string;
//     description: string;
//     author: string;
//     subject: string;
//     creator: string;
//     keywords: string[];
//     slug: string;
//     canonical_url: string;
//   };
// }

// interface Props {
//   selectedMedia: Media;
//   closeModal: () => void;
// }

// const UpdateMediaLearnPage = ({ selectedMedia, closeModal }: Props) => {
//   const [title, setTitle] = useState(selectedMedia.title);
//   const [abstract, setAbstract] = useState(selectedMedia.abstract);
//   const [authorOfDocument, setAuthorOfDocument] = useState(
//     selectedMedia.authorOfDocument || ""
//   );
//   const [dateOfPublish, setDateOfPublish] = useState(
//     selectedMedia.dateOfPublish?.split("T")[0] || ""
//   );
//   const [tags, setTags] = useState(selectedMedia.tags?.join(",") || "");
//   const [fileType, setFileType] = useState(selectedMedia.fileType || "jpg");
//   const [seo, setSeo] = useState(
//     selectedMedia.seo || {
//       title: "",
//       description: "",
//       author: "",
//       subject: "",
//       creator: "",
//       keywords: [],
//       slug: "",
//       canonical_url: "",
//     }
//   );

//   const [file, setFile] = useState<File | null>(null);
//   const [coverImage, setCoverImage] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append("title", title);
//       formData.append("abstract", abstract);
//       formData.append("authorOfDocument", authorOfDocument);
//       formData.append("dateOfPublish", dateOfPublish);
//       formData.append("tags", JSON.stringify(tags.split(",")));
//       formData.append("fileType", fileType);
//       formData.append("seo", JSON.stringify(seo));
//       if (file) formData.append("file", file);
//       if (coverImage) formData.append("coverImage", coverImage);

//       const res = await fetch(
//         `${baseURL}/api/v2/learn-media/update-category-media/${selectedMedia._id}`,
//         {
//           method: "PATCH",
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`, // make sure token is stored in LS or context
//           },
//           body: formData,
//         }
//       );

//       if (!res.ok) throw new Error("Failed to update media");
//       alert("Media updated successfully!");
//       closeModal();
//     } catch (err) {
//       console.error(err);
//       alert("Error updating media.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
//       <div className="bg-slate-200 rounded-2xl shadow-lg w-full max-w-3xl p-10 px-14 relative overflow-y-auto max-h-[90vh]">
//         {/* Close button */}
//         <button
//           className="absolute top-3 right-3 bg-white rounded-full p-2 px-4 text-red-500 hover:text-black text-xl font-extrabold"
//           onClick={closeModal}
//         >
//           ✕
//         </button>

//         <h2 className="text-2xl font-semibold mb-4">Edit Media</h2>

//         <form className="flex flex-col gap-6 bg-slate-200" onSubmit={handleSubmit}>
//           <label className="text-white font-semibold">Update Title</label>
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="border px-3 py-2 rounded-2xl"
//             placeholder="Title"
//           />
//           <label className="text-white font-semibold">Update Abstract</label>
//           <textarea
//             value={abstract}
//             rows={3}
//             onChange={(e) => setAbstract(e.target.value)}
//             className="border px-3 py-2 rounded-2xl"
//             placeholder="Abstract"
//           />
//           <label className="text-white font-semibold">Update Author Of Document</label>
//           <input
//             type="text"
//             value={authorOfDocument}
//             onChange={(e) => setAuthorOfDocument(e.target.value)}
//             className="border px-3 py-2 rounded-2xl"
//             placeholder="Author"
//           />
//           <label className="text-white font-semibold">Update Date Of Publish</label>
//           <input
//             type="date"
//             value={dateOfPublish}
//             onChange={(e) => setDateOfPublish(e.target.value)}
//             className="border px-3 py-2 rounded-2xl"
//           />
//           <label className="text-white font-semibold">Update Tags</label>
//           <input
//             type="text"
//             value={tags}
//             onChange={(e) => setTags(e.target.value)}
//             className="border px-3 py-2 rounded-2xl"
//             placeholder="Comma-separated tags"
//           />
//           <label className="text-white font-semibold">Update File Type</label>
//           <input
//             type="text"
//             value={fileType}
//             onChange={(e) => setFileType(e.target.value)}
//             className="border px-3 py-2 rounded-2xl"
//             placeholder="File type"
//           />

//           {/* File Uploads */}
//           <label className="text-white font-semibold">Update New File</label>
//           <input
//             type="file"
//             accept="image/*,application/pdf"
//             onChange={(e) => setFile(e.target.files?.[0] || null)}
//           />

//           {file && (
//             <div className="mt-2">
//               {file.type.startsWith("image/") ? (
//                 <img
//                   src={URL.createObjectURL(file)}
//                   alt="File Preview"
//                   className="w-40 h-40 object-cover rounded border"
//                 />
//               ) : file.type === "application/pdf" ? (
//                 <iframe
//                   src={URL.createObjectURL(file)}
//                   className="w-full h-64 border rounded"
//                 />
//               ) : (
//                 <p className="text-sm text-gray-600">Preview not available</p>
//               )}
//             </div>
//           )}

//           <label className="text-white font-semibold mt-4">Update New Cover Image</label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
//           />

//           {coverImage && (
//             <div className="mt-2">
//               <img
//                 src={URL.createObjectURL(coverImage)}
//                 alt="Cover Preview"
//                 className="w-40 h-40 object-cover rounded border"
//               />
//             </div>
//           )}

//           {/* SEO JSON Fields */}
//           <div className="flex flex-col gap-6 border rounded">
//             <h3 className="flex justify-center items-center font-semibold mb-2 text-2xl">SEO Fields</h3>
//             <div>
//               <label className="text-white font-semibold">Update SEO Title</label>
//               <input
//                 type="text"
//                 value={seo.title}
//                 onChange={(e) => setSeo({ ...seo, title: e.target.value })}
//                 className="border px-3 py-2 rounded-full my-4 mb-2 w-full"
//                 placeholder="SEO Title"
//               />
//             </div>
//             <div>
//               <label className="text-white font-semibold">Update SEO Description</label>
//               <input
//                 type="text"
//                 value={seo.description}
//                 onChange={(e) =>
//                   setSeo({ ...seo, description: e.target.value })
//                 }
//                 className="border px-3 py-2 rounded-full my-4 mb-2 w-full"
//                 placeholder="SEO Description"
//               />
//             </div>
//             <div>
//               <label className="text-white font-semibold">Update Slug</label>
//               <input
//                 type="text"
//                 value={seo.slug}
//                 onChange={(e) => setSeo({ ...seo, slug: e.target.value })}
//                 className="border px-3 py-2 rounded-full my-4 mb-2 w-full"
//                 placeholder="Slug"
//               />
//             </div>
//             <div>
//               <label className="text-white font-semibold">Update Canonical URL</label>
//               <input
//                 type="text"
//                 value={seo.canonical_url}
//                 onChange={(e) =>
//                   setSeo({ ...seo, canonical_url: e.target.value })
//                 }
//                 className="border px-3 py-2 rounded-full my-4 mb-2 w-full"
//                 placeholder="Canonical URL"
//               />
//             </div>
//             <div>
//               <label className="text-white font-semibold">Update Author Name</label>
//               <input
//                 type="text"
//                 value={seo.author}
//                 onChange={(e) => setSeo({ ...seo, author: e.target.value })}
//                 className="border px-3 py-2 rounded-full my-4 mb-2 w-full"
//                 placeholder="Author Name"
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-[#223658] text-white px-6 py-2 rounded-full hover:bg-blue-600 disabled:opacity-50"
//           >
//             {loading ? "Updating..." : "Update Changes"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UpdateMediaLearnPage;
