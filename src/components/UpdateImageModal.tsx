// "use client";

// import { useState } from "react";
// import Image from "next/image";
// // import { supabase } from "@/lib/supabase";
// import { v4 as uuidv4 } from "uuid";
// import { StaticImageData } from "next/image";
// import { convertFileToWebP } from "@/lib/utils";

// interface UpdateImageModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   imageId: string;
//   currentLink: string | StaticImageData;
//   onUpdate: (newLink: string) => void;
// }

// const UpdateImageModal: React.FC<UpdateImageModalProps> = ({
//   isOpen,
//   onClose,
//   imageId,
//   currentLink,
//   onUpdate,
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
//   //     const uniqueFileName = `${uuidv4()}-${selectedFile.name.split(".")[0]}.webp`; // Convert to webp

//   //     const webpFile = await convertFileToWebP(selectedFile);
//   //     if (!webpFile) {
//   //       throw new Error("Could not convert the selected file to WebP format.");
//   //     }

//   //     // Upload the file to the storage bucket
//   //     const { error: uploadError } = await supabase.storage
//   //       .from("images")
//   //       .upload(uniqueFileName, webpFile);

//   //     if (uploadError) throw uploadError;

//   //     // Get the public URL of the uploaded image
//   //     const { data: fileData } = await supabase.storage
//   //       .from("images")
//   //       .getPublicUrl(uniqueFileName);

//   //     if (!fileData) {
//   //       throw new Error("Could not retrieve public URL for the uploaded image.");
//   //     }

//   //     setNewImageUrl(fileData.publicUrl);
//   //     setSelectedFile(null);
//   //     // Ask user for confirmation to save changes
//   //     setIsConfirmed(true);
//   //   } catch (err) {
//   //     if (err instanceof Error) {
//   //       setError(err.message || "An error occurred during upload.");
//   //     } else {
//   //       setError("An unknown error occurred during upload.");
//   //     }
//   //   } finally {
//   //     setIsUploading(false);
//   //   }
//   // };

//   const AUTH_TOKEN =
//     "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzBkYjA1NTA5ZDEyYTE2OTkzNTNlOSIsImVtYWlsIjoiZGV2b3BzQGV6cGVkYWwuaW4iLCJpYXQiOjE3NTI5MTc0MzUsImV4cCI6MTc1MjkyMTAzNX0.2krxKdUSmShJl1aws2OKfQn4g3Ri-Z-pLgzGn9kbXuA";

//   const handleUpload = async () => {
//     if (!selectedFile) {
//       setError("Please select a file to upload.");
//       return;
//     }

//     setIsUploading(true);
//     setError(null);

//     try {
//       const formData = new FormData();
//       formData.append("file", selectedFile);

//       const response = await fetch(
//         `${baseURL}/api/v1/website-img/update-ui-image/${imageId}`,
//         {
//           method: "PATCH",
//           headers: {
//             Authorization: AUTH_TOKEN,
//           },
//           body: formData,
//         }
//       );

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Upload failed: ${errorText}`);
//       }

//       const result = await response.json();
//       const updatedUrl = result?.data?.media?.url;

//       if (!updatedUrl) {
//         throw new Error("Image URL missing in API response.");
//       }

//       setNewImageUrl(updatedUrl);
//       setSelectedFile(null);
//       setIsConfirmed(true);
//     } catch (err: any) {
//       setError(err.message || "Upload error");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   // const handleSaveChanges = async () => {
//   //   if (!isConfirmed) {
//   //     setError("Please confirm the new image before saving changes.");
//   //     return;
//   //   }

//   //   setIsUploading(true);
//   //   setError(null);

//   //   // delete the old image
//   //   const { data: oldImage, error: oldImageError } = await supabase
//   //     .from("website-images")
//   //     .select("link")
//   //     .eq("image-identifier", imageId);

//   //   if (oldImageError) {
//   //     setError(oldImageError.message || "An error occurred while fetching the old image.");
//   //     return;
//   //   }

//   //   const oldImageUrl = oldImage?.[0]?.link;

//   //   if (oldImageUrl) {
//   //     const oldImageName = oldImageUrl.split("/").pop();
//   //     const { error: deleteError } = await supabase.storage
//   //       .from("images")
//   //       .remove([oldImageName.replace(/%20/g, " ")]);

//   //     if (deleteError) {
//   //       setError(deleteError.message || "An error occurred while deleting the old image.");
//   //       return;
//   //     }
//   //   }

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
//   //   } catch (err: unknown) {
//   //     if (err instanceof Error) {
//   //       setError(err.message || "An error occurred while updating the database.");
//   //     } else {
//   //       setError("An unknown error occurred while updating the database.");
//   //     }
//   //   } finally {
//   //     setIsUploading(false);
//   //     setIsConfirmed(false);
//   //     setNewImageUrl(null);
//   //   }
//   // };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto max-h-screen">
//       <div className="bg-white p-6 rounded-lg w-96">
//         <h2 className="text-xl font-bold mb-4">Update Image</h2>
//         {typeof currentLink === "string" ? (
//           <Image
//             src={currentLink}
//             alt="Current"
//             className="w-full h-auto mb-2"
//             layout="responsive"
//             width={500}
//             height={500}
//           />
//         ) : (
//           <Image
//             src={currentLink}
//             alt="Current"
//             className="w-full h-auto mb-2"
//             layout="responsive"
//             width={500}
//             height={500}
//           />
//         )}

//         {/* {newImageUrl && (
//           <Image src={newImageUrl} alt="New" className="w-full h-auto mb-2" width={500} height={500} />
//         )} */}

//         {newImageUrl && (
//           <button
//             onClick={() => {
//               onUpdate(newImageUrl);
//               onClose();
//             }}
//             className={`px-4 py-2 bg-green-500 text-white rounded ml-2 ${
//               isUploading || !isConfirmed ? "hover:cursor-not-allowed" : ""
//             }`}
//             disabled={isUploading || !isConfirmed}
//           >
//             Save Changes
//           </button>
//         )}

//         <div>
//           <input
//             type="file"
//             accept="image/*,svg"
//             onChange={handleFileChange}
//             className="mb-4"
//           />
//         </div>
//         {error && <p className="text-red-500 mt-2">{error}</p>}
//         <div className="mt-4 flex justify-end">
//           <button
//             onClick={onClose}
//             className={`px-4 py-2 bg-gray-300 rounded mr-2 ${
//               isUploading ? "hover:cursor-not-allowed" : ""
//             }`}
//             disabled={isUploading}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleUpload}
//             className={`px-4 py-2 bg-blue-500 text-white rounded ${
//               isUploading ? "hover:cursor-not-allowed" : ""
//             }`}
//             disabled={isUploading}
//           >
//             {isUploading ? "Uploading..." : isConfirmed ? "Uploaded" : "Upload"}
//           </button>
//           {/* {newImageUrl && (
//             <button
//               onClick={handleSaveChanges}
//               className={`px-4 py-2 bg-green-500 text-white rounded ml-2 ${isUploading || !isConfirmed ? "hover:cursor-not-allowed" : ""}`}
//               disabled={isUploading || !isConfirmed}
//             >
//               Save Changes
//             </button>
//           )} */}
//           {newImageUrl && (
//             <button
//               onClick={() => {
//                 onUpdate(newImageUrl);
//                 onClose();
//               }}
//               className={`px-4 py-2 bg-green-500 text-white rounded ml-2 ${
//                 isUploading || !isConfirmed ? "hover:cursor-not-allowed" : ""
//               }`}
//               disabled={isUploading || !isConfirmed}
//             >
//               Save Changes
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpdateImageModal;



"use client";

import { useState } from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";

interface UpdateImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageId: string;
  currentLink: string | StaticImageData;
  onUpdate: (newLink: string) => void;
}

const UpdateImageModal: React.FC<UpdateImageModalProps> = ({
  isOpen,
  onClose,
  imageId,
  currentLink,
  onUpdate,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional: validate image size/type
    if (!file.type.startsWith("image/")) {
      setError("Invalid file type. Only images allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setError("File too large. Max 5MB allowed.");
      return;
    }

    setSelectedFile(file);
    setNewImageUrl(URL.createObjectURL(file));
    setError(null);
    setIsConfirmed(false);
  };


  const getToken = () => localStorage.getItem("token");

  const handleAuthError = () => {
    localStorage.removeItem("token");

  };

  
  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {

    const token = getToken();
    if (!token) return handleAuthError();
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(
        `${baseURL}/api/v1/website-img/update-ui-image/${imageId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${errorText}`);
      }

      const result = await response.json();
      const updatedUrl = result?.data?.media?.url;

      if (!updatedUrl) throw new Error("Image URL missing in API response.");

      setNewImageUrl(updatedUrl);
      setSelectedFile(null);
      setIsConfirmed(true);
    } catch (err) {
      if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Upload error");
  }
  };
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto max-h-screen">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Update Image</h2>

        <Image
          src={currentLink}
          alt="Current"
          className="w-full h-auto mb-2"
          width={500}
          height={500}
        />

        {newImageUrl && (
          <Image
            src={newImageUrl}
            alt="New"
            className="w-full h-auto mb-2"
            width={500}
            height={500}
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4"
        />

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded mr-2"
            disabled={isUploading}
          >
            Cancel
          </button>

          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-500 text-white rounded"
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : isConfirmed ? "Uploaded" : "Upload"}
          </button>

          {newImageUrl && (
            <button
              onClick={() => {
                onUpdate(newImageUrl);
                onClose();
              }}
              className="px-4 py-2 bg-green-500 text-white rounded ml-2"
              disabled={isUploading || !isConfirmed}
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateImageModal;
