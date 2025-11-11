import React from "react";

interface MediaFormSeoSettingsProps {
  formData: {
    title: string; // from main form
    abstract: string; // from main form
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
  handleSeoChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
}

const MediaFormSeoSettings: React.FC<MediaFormSeoSettingsProps> = ({
  formData,
  handleSeoChange,
}) => {
  const autoSeoTitle = `${formData.title
    ?.trim()
    .replace(/\s+/g, "-")
    .toLowerCase()}`;
  const canonicalUrl = `https://ezpedal.in/learn/${autoSeoTitle}`;
  const creator = "eZpedal Rideshare Private Limited";

  return (
    <div className="flex flex-col justify-center items-start gap-5">
      <h3 className="text-xl font-outfit text-black">Step 2</h3>
      <h1 className="text-5xl font-outfit text-black">SEO Settings</h1>

      <div className="flex flex-col gap-5 w-[60%]">
        {/* Row 1: SEO Title (auto) + Subject */}
        <div className="flex gap-x-5 w-full">
          <div className="flex flex-col w-1/2">
            <label htmlFor="seo-title" className="font-outfit text-black mb-2">
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
            <label htmlFor="seo-subject" className="font-outfit text-black mb-2">
              Subject
            </label>
            <input
              type="text"
              id="seo-subject"
              name="subject"
              value={formData.seo.subject}
              onChange={handleSeoChange}
              className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Row 2: Language + Creator */}
        <div className="flex gap-x-5 w-full">
          <div className="flex flex-col w-1/2">
            <label htmlFor="seo-lang" className="font-outfit text-black mb-2">
              Select Language
            </label>
            <select
              id="seo-lang"
              name="lang"
              value={formData.seo.lang}
              onChange={handleSeoChange}
              className="px-3 py-2 rounded-xl border border-gray-300"
            >
              <option value="">select</option>
              <option value="en">English</option>
              <option value="de">German</option>
              <option value="hi">Hindi</option>
              <option value="mr">Marathi</option>
            </select>
          </div>

          <div className="flex flex-col w-1/2">
            <label htmlFor="seo-creator" className="font-outfit text-black mb-2">
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

        {/* Row 3: Keywords + Canonical URL */}
        <div className="flex gap-x-5 w-full">
          <div className="flex flex-col w-1/2">
            <label htmlFor="seo-keywords" className="font-outfit text-black mb-2">
              SEO Keywords
            </label>
            <input
              type="text"
              id="seo-keywords"
              name="keywords"
              value={formData.seo.keywords.join(", ")}
              onChange={handleSeoChange}
              className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
            />
            <p className="text-[10px] font-poppins font-thin m-2">
              Note: Limit to 5 keywords or fewer.{" "}comma separated
            </p>
          </div>

          <div className="flex flex-col w-1/2">
            <label htmlFor="seo-canonical" className="font-outfit text-black mb-2">
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

        {/* Row 4: Description (Auto from Abstract) */}
        <div className="flex flex-col w-full">
          <label htmlFor="seo-description" className="font-outfit text-black mb-2">
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
          <p className="text-[10px] font-poppins font-thin m-2">
            Auto-filled from abstract. Character limit: 300–500.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MediaFormSeoSettings;














// import React from "react";

// interface MediaFormSeoSettingsProps {
//   formData: {
//     seo: {
//       title: string;
//       description: string;
//       author: string;
//       subject: string;
//       creator: string;
//       keywords: string[];
//       lang: string;
//       canonical_url: string;
//       published_time: string;
//     };
//   };
//   handleSeoChange: (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => void;
// }

// const MediaFormSeoSettings: React.FC<MediaFormSeoSettingsProps> = ({
//   formData,
//   handleSeoChange,
// }) => {
//   return (
//     <div className="flex flex-col justify-center items-start gap-5">
//       <h3 className="text-xl font-outfit text-black">Step 2</h3>
//       <h1 className="text-5xl font-outfit text-black">SEO Settings</h1>

//       <div className="flex flex-col gap-5 w-full">

//         {/* Row 1: Title + Subject */}
//         <div className="flex gap-x-5 w-full">
//           <div className="flex flex-col w-1/2">
//             <label htmlFor="seo-title" className="font-outfit text-black mb-2">
//               SEO Title
//             </label>
//             <input
//               type="text"
//               id="seo-title"
//               name="title"
//               value={formData.seo.title}
//               onChange={handleSeoChange}
//               className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
//               required
//             />
//           </div>

//           <div className="flex flex-col w-1/2">
//             <label htmlFor="seo-subject" className="font-outfit text-black mb-2">
//               Subject
//             </label>
//             <input
//               type="text"
//               id="seo-subject"
//               name="subject"
//               value={formData.seo.subject}
//               onChange={handleSeoChange}
//               className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
//               required
//             />
//           </div>
//         </div>

//         {/* Row 2: Language + Creator */}
//         <div className="flex gap-x-5 w-full">
//           <div className="flex flex-col w-1/2">
//             <label htmlFor="seo-lang" className="font-outfit text-black mb-2">
//               Select Language
//             </label>
//             <select
//               id="seo-lang"
//               name="lang"
//               value={formData.seo.lang}
//               onChange={handleSeoChange}
//               className="px-3 py-2 rounded-xl border border-gray-300"
//             >
//               <option value="">select</option>
//               <option value="en">English</option>
//               <option value="de">German</option>
//               <option value="hi">Hindi</option>
//               <option value="mr">Marathi</option>
//             </select>
//           </div>

//           <div className="flex flex-col w-1/2">
//             <label htmlFor="seo-creator" className="font-outfit text-black mb-2">
//               Creator
//             </label>
//             <input
//               type="text"
//               id="seo-creator"
//               name="creator"
//               value={formData.seo.creator}
//               onChange={handleSeoChange}
//               className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
//             />
//           </div>
//         </div>

//         {/* Row 3: Keywords + Canonical URL */}
//         <div className="flex gap-x-5 w-full">
//           <div className="flex flex-col w-1/2">
//             <label htmlFor="seo-keywords" className="font-outfit text-black mb-2">
//               SEO Keywords (comma separated)
//             </label>
//             <input
//               type="text"
//               id="seo-keywords"
//               name="keywords"
//               value={formData.seo.keywords.join(", ")}
//               onChange={handleSeoChange}
//               className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
//             />
//             <p className="text-xs font-thin m-2">
//               Note: Limit the number of keywords to 5 or fewer.
//             </p>
//           </div>

//           <div className="flex flex-col w-1/2">
//             <label htmlFor="seo-canonical" className="font-outfit text-black mb-2">
//               Canonical URL
//             </label>
//             <input
//               type="text"
//               id="seo-canonical"
//               name="canonical_url"
//               value={formData.seo.canonical_url}
//               onChange={handleSeoChange}
//               className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
//               required
//             />
//           </div>
//         </div>

//         {/* Row 4: Description */}
//         <div className="flex flex-col w-full">
//           <label htmlFor="seo-description" className="font-outfit text-black mb-2">
//             SEO Description
//           </label>
//           <textarea
//             id="seo-description"
//             name="description"
//             value={formData.seo.description}
//             onChange={handleSeoChange}
//             rows={3}
//             className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
//             required
//           />
//           <p className="text-xs font-thin m-2">
//             Note: Character limit should be 300–500.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MediaFormSeoSettings;
