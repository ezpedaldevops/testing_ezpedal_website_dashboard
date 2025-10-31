// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState } from "react";
// // import { supabase } from "@/lib/supabase";

// interface UpdateImageModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   imageId: string;
//   currentLink: string;
//   onUpdate: (newLink: string) => void;
// }

// const AddImageModal: React.FC<UpdateImageModalProps> = ({
//   isOpen,
//   onClose,
//   currentLink
// }) => {
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [newImageUrl, setNewImageUrl] = useState<string | null>(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isConfirmed, setIsConfirmed] = useState(false);

//   if (!isOpen) return null;

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setSelectedFile(e.target.files[0]);
//       setNewImageUrl(URL.createObjectURL(e.target.files[0])); // Display preview of new image
//       setIsConfirmed(false); // Reset confirmation state when a new file is selected
//     }
//   };

//   // const handleUpload = async () => {
//   //   if (!selectedFile) {
//   //     setError("Please select a file to upload.");
//   //     return;
//   //   }

//   //   setIsUploading(true);
//   //   setError(null);

//   //   try {
//   //     // Generate a unique file name
//   //     const uniqueFileName = `${uuidv4()}-${selectedFile.name}`;

//   //     // Upload the file to Supabase Storage
//   //     const { error: uploadError } = await supabase.storage
//   //       .from("images") // Ensure your bucket name is 'images'
//   //       .upload(uniqueFileName, selectedFile, {
//   //         cacheControl: "3600",
//   //         upsert: false,
//   //       });

//   //     if (uploadError) throw uploadError;

//   //     // Get the public URL of the uploaded file
//   //     const {
//   //       data: { publicUrl },
        
//   //     } = supabase.storage.from("images").getPublicUrl(uniqueFileName);

//   //     if (!publicUrl) {
//   //       throw new Error("Failed to get public URL.");
//   //     }

//   //     setNewImageUrl(publicUrl); // Update the preview URL

//   //     // Ask user for confirmation to save changes
//   //     setIsConfirmed(true);
//   //   } catch (err: any) {
//   //     setError(err.message || "An error occurred during upload.");
//   //   } finally {
//   //     setIsUploading(false);
//   //   }
//   // };

//   // const handleSaveChanges = async () => {
//   //   if (!isConfirmed) {
//   //     setError("Please confirm the new image before saving changes.");
//   //     return;
//   //   }

//   //   setIsUploading(true);
//   //   setError(null);

//   //   try {
//   //     // Update the database with the new link
//   //     const { error: updateError } = await supabase
//   //       .from("website-images")
//   //       .update({ link: newImageUrl })
//   //       .eq("image-identifier", imageId);

//   //     if (updateError) throw updateError;

//   //     // Call the onUpdate callback to update the parent state
//   //     onUpdate(newImageUrl as string);
//   //     onClose();
//   //   } catch (err: any) {
//   //     setError(err.message || "An error occurred while updating the database.");
//   //   } finally {
//   //     setIsUploading(false);
//   //   }
//   // };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//       <div className="bg-white p-6 rounded-lg w-96">
//         <h2 className="text-xl font-bold mb-4">Update Image</h2>
//         <div className="mb-4">
//           <img src={currentLink} alt="Current" className="w-full h-auto mb-2" />
//           {newImageUrl && (
//             <img src={newImageUrl} alt="New" className="w-full h-auto mb-2" />
//           )}
//         </div>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleFileChange}
//           className="mb-4"
//         />
//         {error && <p className="text-red-500 mt-2">{error}</p>}
//         <div className="mt-4 flex justify-end">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-300 rounded mr-2"
//             disabled={isUploading}
//           >
//             Cancel
//           </button>
//           <button
//             // onClick={handleUpload}
//             className="px-4 py-2 bg-blue-500 text-white rounded"
//             disabled={isUploading}
//           >
//             {isUploading ? "Uploading..." : "Upload"}
//           </button>
//           {newImageUrl && (
//             <button
//               // onClick={handleSaveChanges}
//               className="px-4 py-2 bg-green-500 text-white rounded ml-2"
//               disabled={isUploading}
//             >
//               Save Changes
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddImageModal;
