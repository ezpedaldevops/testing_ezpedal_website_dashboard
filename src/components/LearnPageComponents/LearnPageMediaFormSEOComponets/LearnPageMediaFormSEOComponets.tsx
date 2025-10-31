// "use client"

// import { forwardRef, useImperativeHandle, useState } from "react"

// export interface SEOFormData {
//   title: string
//   description: string
//   author: string
//   subject: string
//   creator: string
//   keywords: string[]
//   lang: string
//   slug: string
//   canonical_url: string
//   published_time?: string
// }

// export interface SEOFormRef {
//   getSEOData: () => SEOFormData
//   resetForm: () => void
// }

// const LearnPageMediaFormSEOComponents = forwardRef<SEOFormRef>((props, ref) => {
//   const [seoData, setSeoData] = useState<SEOFormData>({
//     title: "",
//     description: "",
//     author: "",
//     subject: "",
//     creator: "",
//     keywords: [],
//     lang: "en",
//     slug: "",
//     canonical_url: "",
//     published_time: "",
//   })

//   useImperativeHandle(ref, () => ({
//     getSEOData: () => seoData,
//     resetForm: () =>
//       setSeoData({
//         title: "",
//         description: "",
//         author: "",
//         subject: "",
//         creator: "",
//         keywords: [],
//         lang: "en",
//         slug: "",
//         canonical_url: "",
//         published_time: "",
//       }),
//   }))

//   const handleInputChange = (field: keyof SEOFormData, value: string) => {
//     setSeoData((prev) => ({
//       ...prev,
//       [field]:
//         field === "keywords"
//           ? value
//               .split(",")
//               .map((k) => k.trim())
//               .filter((k) => k)
//           : value,
//     }))
//   }

//   return (
//     <section className="w-full rounded-2xl p-9 flex flex-col gap-y-8">
//       <h1 className="text-4xl flex justify-center items-center text-[#223658] font-Poppins text-center md:text-left">
//         SEO Fields
//       </h1>

//       {/* Form Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
//         {/* Title */}
//         <div className="flex flex-col gap-y-2">
//           <label htmlFor="seo-title" className="text-lg font-medium text-[#223658]">
//             SEO Title
//           </label>
//           <input
//             id="seo-title"
//             name="seo-title"
//             type="text"
//             value={seoData.title}
//             onChange={(e) => handleInputChange("title", e.target.value)}
//             className="px-3 py-2 rounded-xl border-2 border-dashed border-[#223658]"
//           />
//         </div>

//         {/* Description */}
//         <div className="flex flex-col gap-y-2">
//           <label htmlFor="description" className="text-lg font-medium text-[#223658]">
//             Description
//           </label>
//           <textarea
//             id="description"
//             name="description"
//             placeholder="(Maximum 300 Character.)"
//             rows={2}
//             value={seoData.description}
//             onChange={(e) => handleInputChange("description", e.target.value)}
//             className="px-3 py-2 rounded-xl border-2 border-dashed border-[#223658]"
//           />
//         </div>

//         {/* Author */}
//         <div className="flex flex-col gap-y-2">
//           <label htmlFor="author" className="text-lg font-medium text-[#223658]">
//             Author
//           </label>
//           <input
//             id="author"
//             name="author"
//             type="text"
//             value={seoData.author}
//             onChange={(e) => handleInputChange("author", e.target.value)}
//             className="px-3 py-2 rounded-xl border-2 border-dashed border-[#223658]"
//           />
//         </div>

//         {/* Subject */}
//         <div className="flex flex-col gap-y-2">
//           <label htmlFor="subject" className="text-lg font-medium text-[#223658]">
//             Subject
//           </label>
//           <input
//             id="subject"
//             name="subject"
//             type="text"
//             value={seoData.subject}
//             onChange={(e) => handleInputChange("subject", e.target.value)}
//             className="px-3 py-2 rounded-xl border-2 border-dashed border-[#223658]"
//           />
//         </div>

//         {/* Creator */}
//         <div className="flex flex-col gap-y-2">
//           <label htmlFor="creator" className="text-lg font-medium text-[#223658]">
//             Creator
//           </label>
//           <input
//             id="creator"
//             name="creator"
//             type="text"
//             value={seoData.creator}
//             onChange={(e) => handleInputChange("creator", e.target.value)}
//             className="px-3 py-2 rounded-xl border-2 border-dashed border-[#223658]"
//           />
//         </div>

//         {/* Keywords */}
//         <div className="flex flex-col gap-y-2">
//           <label htmlFor="keywords" className="text-lg font-medium text-[#223658]">
//             Keywords
//           </label>
//           <input
//             id="keywords"
//             name="keywords"
//             type="text"
//             value={seoData.keywords.join(", ")}
//             onChange={(e) => handleInputChange("keywords", e.target.value)}
//             placeholder="Enter keywords separated by commas"
//             className="px-3 py-2 rounded-xl border-2 border-dashed border-[#223658]"
//           />
//         </div>

//         {/* Language */}
//         <div className="flex flex-col w-full gap-y-4">
//           <label htmlFor="language" className="text-lg font-medium text-[#223658] ">
//             Content Language
//           </label>

//           {/* Select dropdown */}
//           <select
//             id="language"
//             value={seoData.lang}
//             onChange={(e) => handleInputChange("lang", e.target.value)}
//             className="px-3 py-2 rounded-xl border-2 border-dashed border-[#223658]"
//           >
//             <option value="en">English</option>
//             <option value="de">Germany</option>
//             <option value="hi">Hindi</option>
//             <option value="mr">Marathi</option>
//           </select>
//         </div>

//         {/* Slug */}
//         <div className="flex flex-col gap-y-2">
//           <label htmlFor="slug" className="text-lg font-medium text-[#223658]">
//             Slug
//           </label>
//           <input
//             id="slug"
//             name="slug"
//             type="text"
//             value={seoData.slug}
//             onChange={(e) => handleInputChange("slug", e.target.value)}
//             className="px-3 py-2 rounded-xl border-2 border-dashed border-[#223658]"
//           />
//         </div>

//         {/* Canonical URL */}
//         <div className="flex flex-col gap-y-2">
//           <label htmlFor="canonical_url" className="text-lg font-medium text-[#223658]">
//             Canonical URL
//           </label>
//           <input
//             id="canonical_url"
//             name="canonical_url"
//             type="text"
//             value={seoData.canonical_url}
//             onChange={(e) => handleInputChange("canonical_url", e.target.value)}
//             className="px-3 py-2 rounded-xl border-2 border-dashed border-[#223658]"
//           />
//         </div>

//         {/* Published Time */}
//         <div className="flex flex-col gap-y-2">
//           <label htmlFor="published_time" className="text-lg font-medium text-[#223658]">
//             Published Time
//           </label>
//           <input
//             id="published_time"
//             name="published_time"
//             type="datetime-local"
//             value={seoData.published_time}
//             onChange={(e) => handleInputChange("published_time", e.target.value)}
//             className="px-3 py-2 rounded-xl border-2 border-dashed border-[#223658]"
//           />
//         </div>
//       </div>
//     </section>
//   )
// })

// LearnPageMediaFormSEOComponents.displayName = "LearnPageMediaFormSEOComponents";

// export default LearnPageMediaFormSEOComponents


























// // "use client"

// // const LearnPageMediaFormSEOComponets = () => {

// //   return (
// //     <section className="w-full rounded-2xl p-9 flex flex-col gap-y-8">
// //       <h1 className="text-4xl flex justify-center items-center text-[#223658] font-Poppins text-center md:text-left">
// //         SEO Fields
// //       </h1>

// //       {/* Form Grid */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
// //         {/* Title */}
// //         <div className="flex flex-col gap-y-2">
// //           <label
// //             htmlFor="seo-title"
// //             className="text-lg font-medium text-[#223658]"
// //           >
// //             SEO Title
// //           </label>
// //           <input
// //             id="seo-title"
// //             name="seo-title"
// //             type="text"
// //             className="px-3 py-2 rounded-xl border-2 border-dashed border-[#223658]"
// //             required
// //           />
// //         </div>

// //         {/* Description */}
// //         <div className="flex flex-col gap-y-2">
// //           <label
// //             htmlFor="description"
// //             className="text-lg font-medium text-[#223658]"
// //           >
// //             Description
// //           </label>
// //           <textarea
// //             id="description"
// //             name="description"
// //             rows={2}
// //             className="px-3 py-2 rounded-xl border-2 border-dashed border-[#223658]"
// //             required
// //           />
// //         </div>

// //         {/* Author */}
// //         <div className="flex flex-col gap-y-2">
// //           <label
// //             htmlFor="author"
// //             className="text-lg font-medium text-[#223658]"
// //           >
// //             Author
// //           </label>
// //           <input
// //             id="author"
// //             name="author"
// //             type="text"
// //             className="px-3 py-2 rounded-xl border-2 border-dashed border-[#223658]"
// //             required
// //           />
// //         </div>

// //         {/* Subject */}
// //         <div className="flex flex-col gap-y-2">
// //           <label
// //             htmlFor="subject"
// //             className="text-lg font-medium text-[#223658]"
// //           >
// //             Subject
// //           </label>
// //           <input
// //             id="subject"
// //             name="subject"
// //             type="text"
// //             className="px-3 py-2 rounded-xl border-2 border-dashed border-[#223658]"
// //             required
// //           />
// //         </div>

// //         {/* Creator */}
// //         <div className="flex flex-col gap-y-2">
// //           <label
// //             htmlFor="creator"
// //             className="text-lg font-medium text-[#223658]"
// //           >
// //             Creator
// //           </label>
// //           <input
// //             id="creator"
// //             name="creator"
// //             type="text"
// //             className="px-3 py-2 rounded-xl border-2 border-dashed border-[#223658]"
// //             required
// //           />
// //         </div>

// //         {/* Keywords */}
// //         <div className="flex flex-col gap-y-2">
// //           <label
// //             htmlFor="keywords"
// //             className="text-lg font-medium text-[#223658]"
// //           >
// //             Keywords
// //           </label>
// //           <input
// //             id="keywords"
// //             name="keywords"
// //             type="text"
// //             className="px-3 py-2 rounded-xl border-2 border-dashed border-[#223658]"
// //             required
// //           />
// //         </div>

// //         {/* Language */}
// //         <div className="flex flex-col w-full gap-y-4">
// //           <label
// //             htmlFor="language"
// //             className="text-lg font-medium text-[#223658] "
// //           >
// //             Content Language
// //           </label>

// //           {/* Select dropdown */}
// //           <select
// //             id="language"
// //             className="px-3 py-2 rounded-xl border-2 border-dashed border-[#223658]"
// //           >
// //             <option value="image">Select</option>
// //             <option value="image">English</option>
// //             <option value="image">Germany</option>
// //             <option value="image">Hindi</option>
// //             <option value="image">Marathi</option>
// //           </select>
// //         </div>

// //         {/* Slug */}
// //         <div className="flex flex-col gap-y-2">
// //           <label htmlFor="slug" className="text-lg font-medium text-[#223658]">
// //             Slug
// //           </label>
// //           <input
// //             id="slug"
// //             name="slug"
// //             type="text"
// //             className="px-3 py-2 rounded-xl border-2 border-dashed border-[#223658]"
// //             required
// //           />
// //         </div>

// //         {/* Canonical URL */}
// //         <div className="flex flex-col gap-y-2">
// //           <label
// //             htmlFor="canonical_url"
// //             className="text-lg font-medium text-[#223658]"
// //           >
// //             Canonical URL
// //           </label>
// //           <input
// //             id="canonical_url"
// //             name="canonical_url"
// //             type="text"
// //             className="px-3 py-2 rounded-xl border-2 border-dashed border-[#223658]"
// //             required
// //           />
// //         </div>

// //         {/* Published Time */}
// //         <div className="flex flex-col gap-y-2">
// //           <label
// //             htmlFor="published_time"
// //             className="text-lg font-medium text-[#223658]"
// //           >
// //             Published Time
// //           </label>
// //           <input
// //             id="published_time"
// //             name="published_time"
// //             type="text"
// //             className="px-3 py-2 rounded-xl border-2 border-dashed border-[#223658]"
// //             required
// //           />
// //         </div>
// //       </div>
// //     </section>
// //   );
// // };

// // export default LearnPageMediaFormSEOComponets;

// // seo: {
// //     title: { type: String, default: "" },
// //     description: { type: String, default: "" },
// //     author: { type: String, default: "" },
// //     subject: { type: String, default: "" },
// //     creator: { type: String, default: "" },
// //     keywords: { type: [String], default: [] },
// //     lang: { type: String, default: "en" },
// //     slug: { type: String, default: "" },
// //     canonical_url: { type: String, default: "" },
// //     published_time: { type: Date },
// //     updated_time: { type: Date },
// //   }
