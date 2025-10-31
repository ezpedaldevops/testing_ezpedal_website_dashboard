// "use client";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// const UpdateNewCategoryForm = () => {
//   const router = useRouter();
//   const [title, setTitle] = useState("");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     // turn title into slug (e.g., "My Category" -> "my-category")
//     const slug = title
//       .toLowerCase()
//       .trim()
//       .replace(/[^a-z0-9]+/g, "-")
//       .replace(/(^-|-$)+/g, "");

//     // redirect to slug page
//     router.push(`/learn/${slug}`);
//   };

//   return (
//     <>
//       <div className="">
//         <h1 className="text-4xl text-[#223658] my-7">Update Category</h1>
//         <form
//           className="rounded-2xl gap-y-5 p-9 flex flex-col justify-center items-center transition hover:shadow-lg  shadow-md bg-gradient-to-r from-[#A7AFBC66] to-[#DDE2EB]"
//           onSubmit={handleSubmit}
//         >
//           {/* Title of Category */}
//           <div className="flex flex-col w-full">
//             <label
//               htmlFor="title"
//               className="text-lg font-medium text-[#223658] mb-4"
//             >
//               Title of Category
//             </label>
//             <input
//               type="text"
//               id="title"
//               value={title}
//               onChange={(e)=>setTitle(e.target.value)}
//               name="title"
//               placeholder="Enter category title"
//               className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
//               required
//             />
//           </div>

//           {/* Description of Category */}
//           <div className="flex flex-col w-full gap-y-4">
//             <label
//               htmlFor="description"
//               className="text-lg font-medium text-[#223658] mb-1"
//             >
//               Description of Category
//             </label>
//             <textarea
//               id="description"
//               name="description"
//               placeholder="Enter category description"
//               className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none resize-none"
//               rows={3}
//               required
//             />
//             <p className="text-xs font-thin px-5 my-[-5px]">
//               Maximum 300 Character.
//             </p>
//           </div>

//           {/* Add Cover Image */}
//           <div className="flex flex-col w-full gap-y-4">
//             <label
//               htmlFor="coverImage"
//               className="text-lg font-medium text-[#223658] mb-1"
//             >
//               Add Cover Image
//             </label>

//             {/* Custom upload box */}
//             <label
//               htmlFor="coverImage"
//               className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#223658] rounded-xl cursor-pointer bg-white/40 hover:bg-white/60 transition"
//             >
//               <span className="text-[#223658] text-xl font-thin">
//                 Add Cover +
//               </span>
//               <span className="text-xs font-thin text-gray-500">
//                 Click to upload or drag & drop
//               </span>
//             </label>

//             {/* Hidden file input */}
//             <input
//               id="coverImage"
//               name="coverImage"
//               type="file"
//               accept="image/*"
//               className="hidden"
             
//             />

//             <p className="text-xs font-thin px-5 my-[-5px]">
//               Size : W x H = 1440 px X 552 px
//             </p>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="mt-4 w-full bg-[#223658] text-white py-2 px-4 rounded-full hover:bg-[#1a2947] transition"
//           >
//             Update
//           </button>
//         </form>
//       </div>
//     </>
//   );
// };

// export default UpdateNewCategoryForm;
