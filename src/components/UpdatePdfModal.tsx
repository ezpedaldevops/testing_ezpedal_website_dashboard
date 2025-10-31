// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";
// import { v4 as uuidv4 } from "uuid";
// import { Document, Page } from 'react-pdf'; // Import react-pdf components
// import { pdfjs } from "react-pdf";

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


// interface UpdatePDFModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     pdfId: string;
//     currentLink: string;
//     onUpdate: (newLink: string, newTitle: string) => void;
//     title: string;
// }

// const UpdatePDFModal: React.FC<UpdatePDFModalProps> = ({
//     isOpen,
//     onClose,
//     pdfId,
//     title,
//     currentLink,
//     onUpdate,
// }) => {
//     const [selectedFile, setSelectedFile] = useState<File | null>(null);
//     const [newPdfUrl, setNewPdfUrl] = useState<string | null>(null);
//     const [isUploading, setIsUploading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [isConfirmed, setIsConfirmed] = useState(false);
//     const [newPdfTitle, setNewPdfTitle] = useState<string>(title);

//     useEffect(() => {
//         setNewPdfTitle(title);
//     }, [title]);

//     if (!isOpen) return null;

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files[0]) {
//             const file = e.target.files[0];
//             if (file.type === "application/pdf") {
//                 setSelectedFile(file);
//                 setNewPdfUrl(URL.createObjectURL(file)); // Display preview of new PDF
//                 setIsConfirmed(false); // Reset confirmation state when a new file is selected
//             } else {
//                 setError("Please select a valid PDF file.");
//             }
//         }
//     };

//     const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setNewPdfTitle(e.target.value);
//     }


//     const handleUpload = async () => {
//         if (!selectedFile) {
//             setError("Please select a file to upload.");
//             return;
//         }

//         setIsUploading(true);
//         setError(null);

//         try {
//             // Generate a unique file name
//             const uniqueFileName = `${uuidv4()}-${selectedFile.name}`;

//             // Upload the file to the storage bucket
//             const { error: uploadError } = await supabase.storage
//                 .from("pdfs")
//                 .upload(uniqueFileName, selectedFile);

//             if (uploadError) throw uploadError;

//             // Get the public URL of the uploaded PDF
//             const { data: fileData } = await supabase.storage
//                 .from("pdfs")
//                 .getPublicUrl(uniqueFileName);

//             if (!fileData) {
//                 throw new Error("Could not retrieve public URL for the uploaded PDF.");
//             }

//             setNewPdfUrl(fileData.publicUrl);
//             setSelectedFile(null);
//             // Ask user for confirmation to save changes
//             setIsConfirmed(true);
//         } catch (err) {
//             if (err instanceof Error) {
//                 setError(err.message || "An error occurred during upload.");
//             } else {
//                 setError("An unknown error occurred during upload.");
//             }
//         } finally {
//             setIsUploading(false);
//         }
//     };

//     const handleSaveChanges = async () => {
//         if (!isConfirmed && newPdfTitle === title) {
//             setError("Please confirm the new PDF before saving changes.");
//             return;
//         }

//         setIsUploading(true);
//         setError(null);

//         //check if only the title has been changed
//         if (newPdfTitle !== title && !newPdfUrl) {
//             try {
//                 // Update the database with the new title
//                 const { error: updateError } = await supabase
//                     .from("website-images")
//                     .update({ "section-title": newPdfTitle })
//                     .eq("image-identifier", pdfId);

//                 if (updateError) throw updateError;

//                 // Call the onUpdate callback to update the parent state
//                 onUpdate(newPdfUrl as string, newPdfTitle as string);
//                 onClose();
//             } catch (err: unknown) {
//                 if (err instanceof Error) {
//                     setError(err.message || "An error occurred while updating the database.");
//                 } else {
//                     setError("An unknown error occurred while updating the database.");
//                 }
//             } finally {
//                 setIsUploading(false);
//                 setIsConfirmed(false);
//                 setNewPdfUrl(null);
//                 setNewPdfTitle("");
//             }
//             return;
//         }

//         // delete the old PDF
//         const { data: oldPdf, error: oldPdfError } = await supabase
//             .from("website-images")
//             .select("link")
//             .eq("image-identifier", pdfId);

//         if (oldPdfError) {
//             setError(oldPdfError.message || "An error occurred while fetching the old PDF.");
//             return;
//         }

//         const oldPdfUrl = oldPdf?.[0]?.link;

//         if (oldPdfUrl) {
//             const oldPdfName = oldPdfUrl.split("/").pop();
//             const { error: deleteError } = await supabase.storage
//                 .from("images")
//                 .remove([oldPdfName.replace(/%20/g, " ")]);

//             if (deleteError) {
//                 setError(deleteError.message || "An error occurred while deleting the old PDF.");
//                 return;
//             }
//         }


//         try {
//             // Update the database with the new link
//             const { error: updateError } = await supabase
//                 .from("website-images")
//                 .update({ link: newPdfUrl, "section-title": newPdfTitle })
//                 .eq("image-identifier", pdfId);

//             if (updateError) throw updateError;

//             // Call the onUpdate callback to update the parent state
//             onUpdate(newPdfUrl as string, newPdfTitle as string);
//             onClose();
//         } catch (err: unknown) {
//             if (err instanceof Error) {
//                 setError(err.message || "An error occurred while updating the database.");
//             } else {
//                 setError("An unknown error occurred while updating the database.");
//             }
//         } finally {
//             setIsUploading(false);
//             setIsConfirmed(false);
//             setNewPdfUrl(null);
//             setNewPdfTitle("");
//         }

//     };

//     return (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//             <div className="bg-white p-6 rounded-lg w-96">
//                 <h2 className="text-xl font-bold mb-4">Update PDF</h2>
//                 <Document file={currentLink}>
//                     <Page pageNumber={1} width={250} />
//                     {/* You can add more pages as needed */}
//                 </Document>
//                 <input value={newPdfTitle} onChange={handleTitleChange} className="border p-2 w-full mb-4" />


//                 {newPdfUrl && (
//                     <div className="mb-4">
//                         <Document file={newPdfUrl}>
//                             <Page pageNumber={1} width={250} />
//                             {/* You can add more pages as needed */}
//                         </Document>
//                     </div>
//                 )}
//                 <div>
//                     <input
//                         type="file"
//                         accept="application/pdf"
//                         onChange={handleFileChange}
//                         className="mb-4"
//                     />
//                 </div>
//                 {error && <p className="text-red-500 mt-2">{error}</p>}
//                 <div className="mt-4 flex justify-end">
//                     <button
//                         onClick={() => {
//                             onClose();
//                             setSelectedFile(null);
//                             setNewPdfUrl(null);
//                             setIsConfirmed(false);
//                             setError(null);
//                         }}
//                         className={`px-4 py-2 bg-gray-300 rounded mr-2 ${isUploading ? "hover:cursor-not-allowed" : ""}`}
//                         disabled={isUploading}
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         onClick={handleUpload}
//                         className={`px-4 py-2 bg-blue-500 text-white rounded ${isUploading || !selectedFile ? "hover:cursor-not-allowed" : ""}`}
//                         disabled={isUploading || !selectedFile}
//                     >
//                         {isUploading ? "Uploading..." : isConfirmed ? "Uploaded" : "Upload"}
//                     </button>
//                     {(newPdfTitle !== title || newPdfUrl) && (
//                         <button
//                             onClick={handleSaveChanges}
//                             className={`px-4 py-2 bg-green-500 text-white rounded ml-2 ${isUploading || (!isConfirmed && newPdfTitle === title) ? "hover:cursor-not-allowed" : ""}`}
//                             disabled={isUploading || (!isConfirmed && newPdfTitle === title)}
//                         >
//                             Save Changes
//                         </button>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UpdatePDFModal;


















// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";
// import { v4 as uuidv4 } from "uuid";
// import { Document, Page } from 'react-pdf';
// import { pdfjs } from "react-pdf";

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// interface UpdatePDFModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     pdfId: string;
//     currentLink: string;
//     onUpdate: (
//         newLink: string,
//         newTitle: string,
//         newKeyField1: string,
//         newKeyField2: string
//     ) => void;
//     title: string;
// }

// const UpdatePDFModal: React.FC<UpdatePDFModalProps> = ({
//     isOpen,
//     onClose,
//     pdfId,
//     title,
//     currentLink,
//     onUpdate,
// }) => {
//     const [selectedFile, setSelectedFile] = useState<File | null>(null);
//     const [newPdfUrl, setNewPdfUrl] = useState<string | null>(null);
//     const [isUploading, setIsUploading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [isConfirmed, setIsConfirmed] = useState(false);
//     const [newPdfTitle, setNewPdfTitle] = useState<string>(title);
//     const [keyField1, setKeyField1] = useState<string>("");
//     const [keyField2, setKeyField2] = useState<string>("");

//     useEffect(() => {
//         setNewPdfTitle(title);
//     }, [title]);

//     if (!isOpen) return null;

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files[0]) {
//             const file = e.target.files[0];
//             if (file.type === "application/pdf") {
//                 setSelectedFile(file);
//                 setNewPdfUrl(URL.createObjectURL(file));
//                 setIsConfirmed(false);
//             } else {
//                 setError("Please select a valid PDF file.");
//             }
//         }
//     };

//     const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setNewPdfTitle(e.target.value);
//     };

//     const handleUpload = async () => {
//         if (!selectedFile) {
//             setError("Please select a file to upload.");
//             return;
//         }

//         setIsUploading(true);
//         setError(null);

//         try {
//             const uniqueFileName = `${uuidv4()}-${selectedFile.name}`;
//             const { error: uploadError } = await supabase.storage
//                 .from("pdfs")
//                 .upload(uniqueFileName, selectedFile);

//             if (uploadError) throw uploadError;

//             const { data: fileData } = await supabase.storage
//                 .from("pdfs")
//                 .getPublicUrl(uniqueFileName);

//             if (!fileData) throw new Error("Could not retrieve public URL for the uploaded PDF.");

//             setNewPdfUrl(fileData.publicUrl);
//             setSelectedFile(null);
//             setIsConfirmed(true);
//         } catch (err) {
//             setError(err instanceof Error ? err.message : "An unknown error occurred during upload.");
//         } finally {
//             setIsUploading(false);
//         }
//     };

//     const handleSaveChanges = async () => {
//         if (!isConfirmed && newPdfTitle === title) {
//             setError("Please confirm the new PDF before saving changes.");
//             return;
//         }

//         setIsUploading(true);
//         setError(null);

//         if (newPdfTitle !== title && !newPdfUrl) {
//             try {
//                 const { error: updateError } = await supabase
//                     .from("website-images")
//                     .update({ "section-title": newPdfTitle })
//                     .eq("image-identifier", pdfId);

//                 if (updateError) throw updateError;

//                 onUpdate(currentLink, newPdfTitle, keyField1, keyField2);
//                 onClose();
//             } catch (err: unknown) {
//                 setError(err instanceof Error ? err.message : "An unknown error occurred while updating the database.");
//             } finally {
//                 setIsUploading(false);
//                 setIsConfirmed(false);
//                 setNewPdfUrl(null);
//                 setNewPdfTitle("");
//             }
//             return;
//         }

//         const { data: oldPdf, error: oldPdfError } = await supabase
//             .from("website-images")
//             .select("link")
//             .eq("image-identifier", pdfId);

//         if (oldPdfError) {
//             setError(oldPdfError.message || "An error occurred while fetching the old PDF.");
//             return;
//         }

//         const oldPdfUrl = oldPdf?.[0]?.link;

//         if (oldPdfUrl) {
//             const oldPdfName = oldPdfUrl.split("/").pop();
//             const { error: deleteError } = await supabase.storage
//                 .from("images")
//                 .remove([oldPdfName.replace(/%20/g, " ")]);

//             if (deleteError) {
//                 setError(deleteError.message || "An error occurred while deleting the old PDF.");
//                 return;
//             }
//         }

//         try {
//             const { error: updateError } = await supabase
//                 .from("website-images")
//                 .update({ link: newPdfUrl, "section-title": newPdfTitle })
//                 .eq("image-identifier", pdfId);

//             if (updateError) throw updateError;

//             onUpdate(newPdfUrl as string, newPdfTitle, keyField1, keyField2);
//             onClose();
//         } catch (err: unknown) {
//             setError(err instanceof Error ? err.message : "An unknown error occurred while updating the database.");
//         } finally {
//             setIsUploading(false);
//             setIsConfirmed(false);
//             setNewPdfUrl(null);
//             setNewPdfTitle("");
//         }
//     };

//     return (
//         <div className="fixed inset-0 overflow-auto bg-black bg-opacity-50 z-50 flex items-center justify-center">

//             <div className="bg-white p-6 rounded-lg w-96">
//                 <h2 className="text-xl font-bold mb-4">Update PDF</h2>

//                 <Document file={currentLink}>
//                     <Page pageNumber={1} width={250} />
//                 </Document>

//                 <input
//                     value={newPdfTitle}
//                     onChange={handleTitleChange}
//                     className="border p-2 w-full mb-2"
//                     placeholder="PDF Title"
//                 />

//                 <input
//                     value={keyField1}
//                     onChange={(e) => setKeyField1(e.target.value)}
//                     placeholder="Key Field 1"
//                     className="border p-2 w-full mb-2"
//                 />

//                 <input
//                     value={keyField2}
//                     onChange={(e) => setKeyField2(e.target.value)}
//                     placeholder="Key Field 2"
//                     className="border p-2 w-full mb-4"
//                 />

//                 {newPdfUrl && (
//                     <div className="mb-4">
//                         <Document file={newPdfUrl}>
//                             <Page pageNumber={1} width={250} />
//                         </Document>
//                     </div>
//                 )}

//                 <input
//                     type="file"
//                     accept="application/pdf"
//                     onChange={handleFileChange}
//                     className="mb-4"
//                 />

//                 {error && <p className="text-red-500 mt-2">{error}</p>}

//                 <div className="mt-4 flex justify-end">
//                     <button
//                         onClick={() => {
//                             onClose();
//                             setSelectedFile(null);
//                             setNewPdfUrl(null);
//                             setIsConfirmed(false);
//                             setError(null);
//                         }}
//                         className={`px-4 py-2 bg-gray-300 rounded mr-2 ${isUploading ? "hover:cursor-not-allowed" : ""}`}
//                         disabled={isUploading}
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         onClick={handleUpload}
//                         className={`px-4 py-2 bg-blue-500 text-white rounded ${isUploading || !selectedFile ? "hover:cursor-not-allowed" : ""}`}
//                         disabled={isUploading || !selectedFile}
//                     >
//                         {isUploading ? "Uploading..." : isConfirmed ? "Uploaded" : "Upload"}
//                     </button>
//                     {(newPdfTitle !== title || newPdfUrl) && (
//                         <button
//                             onClick={handleSaveChanges}
//                             className={`px-4 py-2 bg-green-500 text-white rounded ml-2 ${isUploading || (!isConfirmed && newPdfTitle === title) ? "hover:cursor-not-allowed" : ""}`}
//                             disabled={isUploading || (!isConfirmed && newPdfTitle === title)}
//                         >
//                             Save Changes
//                         </button>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UpdatePDFModal;
























// "use client"

// import { useState, useEffect, useRef } from "react"
// import { X, Plus, Minus, Loader2 } from "lucide-react"
// import toast from "react-hot-toast"
// import { useRouter } from "next/navigation"

// interface SEOData {
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
//   updated_time?: string
// }

// interface PdfData {
//   _id: string
//   section_name: string
//   page_name: string
//   image_identifier: string
//   section_title: string
//   cover_page?: string
//   media: {
//     url: string
//     contentType: string
//     size: number
//   }
//   seo?: SEOData
// }

// interface UpdatePdfModalProps {
//   isOpen: boolean
//   onClose: () => void
//   onUpdate: (updatedData: Partial<PdfData>) => void
//   pdfData: PdfData | null
//   imageIdentifier: string
// }
// const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
// const API_BASE_URL = `${baseURL}/api/v1`

// export default function UpdatePdfModal({ isOpen, onClose, onUpdate, pdfData, imageIdentifier }: UpdatePdfModalProps) {
//   const [newPdfFile, setNewPdfFile] = useState<File | null>(null)
//   const [newCoverPage, setNewCoverPage] = useState<File | null>(null)
//   const [isUpdating, setIsUpdating] = useState(false)
//       const router = useRouter();

//   const getToken = () => localStorage.getItem("token");

//   const handleAuthError = () => {
//     localStorage.removeItem("token");
//     router.push("/");
//   };

//   const [seoData, setSeoData] = useState<SEOData>({
//     title: "",
//     description: "",
//     author: "",
//     subject: "",
//     creator: "",
//     keywords: [],
//     lang: "en",
//     slug: "",
//     canonical_url: "",
//   })

//   const pdfInputRef = useRef<HTMLInputElement>(null)
//   const coverInputRef = useRef<HTMLInputElement>(null)

//   useEffect(() => {
//     if (pdfData && isOpen) {
//       setSeoData({
//         title: pdfData.seo?.title || "",
//         description: pdfData.seo?.description || "",
//         author: pdfData.seo?.author || "",
//         subject: pdfData.seo?.subject || "",
//         creator: pdfData.seo?.creator || "",
//         keywords: pdfData.seo?.keywords || [],
//         lang: pdfData.seo?.lang || "en",
//         slug: pdfData.seo?.slug || "",
//         canonical_url: pdfData.seo?.canonical_url || "",
//       })
//     }
//   }, [pdfData, isOpen])

//   const handleUpdate = async () => {
//         const token = getToken();
//     if (!token) return handleAuthError();
//     if (!imageIdentifier) return

//     setIsUpdating(true)
//     const toastId = toast.loading("Updating PDF...")

//     try {
//       const formData = new FormData()

//       if (newPdfFile) {
//         formData.append("file", newPdfFile)
//       }

//       if (newCoverPage) {
//         formData.append("cover_page", newCoverPage)
//       }

//       // Add SEO data
//       Object.entries(seoData).forEach(([key, value]) => {
//         if (key === "keywords") {
//           // Handle keywords array
//           ;(value as string[]).forEach((keyword, index) => {
//             formData.append(`seo[keywords][${index}]`, keyword)
//           })
//         } else {
//           formData.append(`seo[${key}]`, value as string)
//         }
//       })

//       const response = await fetch(`${API_BASE_URL}/website-img/update-ui-image/${imageIdentifier}`, {
//         method: "PATCH",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       })

//       if (!response.ok) {
//         throw new Error("Failed to update PDF")
//       }

//       const result = await response.json()

//       if (result.success) {
//         onUpdate(result.data)
//         toast.success("PDF updated successfully", { id: toastId })
//         handleClose()
//       } else {
//         toast.error("Failed to update PDF")
//       }
//     } catch (error) {
//       toast.error("Update process failed")
//       console.error("Update process failed:", error)
//     } finally {
//       setIsUpdating(false)
//     }
//   }

//   const handleClose = () => {
//     setNewPdfFile(null)
//     setNewCoverPage(null)
//     setSeoData({
//       title: "",
//       description: "",
//       author: "",
//       subject: "",
//       creator: "",
//       keywords: [],
//       lang: "en",
//       slug: "",
//       canonical_url: "",
//     })
//     if (pdfInputRef.current) pdfInputRef.current.value = ""
//     if (coverInputRef.current) coverInputRef.current.value = ""
//     onClose()
//   }

//   const handleSeoChange = (field: keyof SEOData, value: string) => {
//     setSeoData((prev) => ({
//       ...prev,
//       [field]: value,
//     }))
//   }

//   const addKeyword = () => {
//     setSeoData((prev) => ({
//       ...prev,
//       keywords: [...prev.keywords, ""],
//     }))
//   }

//   const removeKeyword = (index: number) => {
//     setSeoData((prev) => ({
//       ...prev,
//       keywords: prev.keywords.filter((_, i) => i !== index),
//     }))
//   }

//   const updateKeyword = (index: number, value: string) => {
//     setSeoData((prev) => ({
//       ...prev,
//       keywords: prev.keywords.map((keyword, i) => (i === index ? value : keyword)),
//     }))
//   }

//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
//         <div className="p-6 border-b flex justify-between items-center">
//           <h2 className="text-xl font-semibold">Update PDF</h2>
//           <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
//             <X size={24} />
//           </button>
//         </div>

//         <div className="p-6 space-y-6">
//           {/* Current PDF Info */}
//           {pdfData && (
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h3 className="font-medium mb-2">Current PDF: {pdfData.section_title}</h3>
//               <p className="text-sm text-gray-600">ID: {pdfData.image_identifier}</p>
//             </div>
//           )}

//           {/* File Upload Fields */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="flex flex-col space-y-2">
//               <label className="font-medium">New PDF File (Optional)</label>
//               <input
//                 ref={pdfInputRef}
//                 type="file"
//                 accept="application/pdf"
//                 onChange={(e) => setNewPdfFile(e.target.files?.[0] || null)}
//                 className="border rounded px-3 py-2"
//               />
//             </div>

//             <div className="flex flex-col space-y-2">
//               <label className="font-medium">New Cover Image (Optional)</label>
//               <input
//                 ref={coverInputRef}
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => setNewCoverPage(e.target.files?.[0] || null)}
//                 className="border rounded px-3 py-2"
//               />
//             </div>
//           </div>

//           {/* SEO Fields */}
//           <div className="border-t pt-6">
//             <h3 className="text-lg font-semibold mb-4">SEO Information</h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="flex flex-col space-y-2">
//                 <label className="font-medium">SEO Title</label>
//                 <input
//                   className="border rounded px-3 py-2"
//                   value={seoData.title}
//                   onChange={(e) => handleSeoChange("title", e.target.value)}
//                   placeholder="Enter SEO title"
//                 />
//               </div>

//               <div className="flex flex-col space-y-2">
//                 <label className="font-medium">Author</label>
//                 <input
//                   className="border rounded px-3 py-2"
//                   value={seoData.author}
//                   onChange={(e) => handleSeoChange("author", e.target.value)}
//                   placeholder="Enter author name"
//                 />
//               </div>

//               <div className="flex flex-col space-y-2 md:col-span-2">
//                 <label className="font-medium">Description</label>
//                 <textarea
//                   className="border rounded px-3 py-2 h-24"
//                   value={seoData.description}
//                   onChange={(e) => handleSeoChange("description", e.target.value)}
//                   placeholder="Enter SEO description"
//                 />
//               </div>

//               <div className="flex flex-col space-y-2">
//                 <label className="font-medium">Subject</label>
//                 <input
//                   className="border rounded px-3 py-2"
//                   value={seoData.subject}
//                   onChange={(e) => handleSeoChange("subject", e.target.value)}
//                   placeholder="Enter subject"
//                 />
//               </div>

//               <div className="flex flex-col space-y-2">
//                 <label className="font-medium">Creator</label>
//                 <input
//                   className="border rounded px-3 py-2"
//                   value={seoData.creator}
//                   onChange={(e) => handleSeoChange("creator", e.target.value)}
//                   placeholder="Enter creator name"
//                 />
//               </div>

//               <div className="flex flex-col space-y-2">
//                 <label className="font-medium">Language</label>
//                 <select
//                   className="border rounded px-3 py-2"
//                   value={seoData.lang}
//                   onChange={(e) => handleSeoChange("lang", e.target.value)}
//                 >
//                   <option value="en">English</option>
//                   <option value="es">Spanish</option>
//                   <option value="fr">French</option>
//                   <option value="de">German</option>
//                   <option value="hi">Hindi</option>
//                 </select>
//               </div>

//               <div className="flex flex-col space-y-2">
//                 <label className="font-medium">Slug</label>
//                 <input
//                   className="border rounded px-3 py-2"
//                   value={seoData.slug}
//                   onChange={(e) => handleSeoChange("slug", e.target.value)}
//                   placeholder="Enter URL slug"
//                 />
//               </div>

//               <div className="flex flex-col space-y-2 md:col-span-2">
//                 <label className="font-medium">Canonical URL</label>
//                 <input
//                   className="border rounded px-3 py-2"
//                   value={seoData.canonical_url}
//                   onChange={(e) => handleSeoChange("canonical_url", e.target.value)}
//                   placeholder="Enter canonical URL"
//                 />
//               </div>
//             </div>

//             {/* Keywords Section */}
//             <div className="mt-4">
//               <div className="flex items-center justify-between mb-2">
//                 <label className="font-medium">Keywords</label>
//                 <button
//                   type="button"
//                   onClick={addKeyword}
//                   className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
//                 >
//                   <Plus size={16} />
//                   Add Keyword
//                 </button>
//               </div>

//               <div className="space-y-2">
//                 {seoData.keywords.map((keyword, index) => (
//                   <div key={index} className="flex gap-2">
//                     <input
//                       className="border rounded px-3 py-2 flex-1"
//                       value={keyword}
//                       onChange={(e) => updateKeyword(index, e.target.value)}
//                       placeholder={`Keyword ${index + 1}`}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removeKeyword(index)}
//                       className="text-red-500 hover:text-red-700 p-2"
//                     >
//                       <Minus size={16} />
//                     </button>
//                   </div>
//                 ))}

//                 {seoData.keywords.length === 0 && (
//                   <p className="text-gray-500 text-sm">No keywords added yet. Click Add Keyword to add some.</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="p-6 border-t flex justify-end space-x-4">
//           <button
//             onClick={handleClose}
//             className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
//             disabled={isUpdating}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleUpdate}
//             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 flex items-center"
//             disabled={isUpdating}
//           >
//             {isUpdating ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Updating...
//               </>
//             ) : (
//               "Update PDF"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }















































"use client"
import { useState, useEffect, useRef } from "react"
import { X, Plus, Minus, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

interface SEOData {
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
  updated_time?: string
}

interface PdfData {
  _id: string
  section_name: string
  page_name: string
  image_identifier: string
  section_title: string
  cover_page?: string
  media: {
    url: string
    contentType: string
    size: number
  }
  seo?: SEOData
}

interface UpdatePdfModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: (updatedData: Partial<PdfData>) => void
  pdfData: PdfData | null
  imageIdentifier: string
}

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
const API_BASE_URL = `${baseURL}/api/v1`

export default function UpdatePdfModal({ isOpen, onClose, onUpdate, pdfData, imageIdentifier }: UpdatePdfModalProps) {
  const [newPdfFile, setNewPdfFile] = useState<File | null>(null)
  const [newCoverPage, setNewCoverPage] = useState<File | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [sectionTitle, setSectionTitle] = useState("")

  const router = useRouter()
  const getToken = () => localStorage.getItem("token")
  const handleAuthError = () => {
    localStorage.removeItem("token")
    router.push("/")
  }

  const [seoData, setSeoData] = useState<SEOData>({
    title: "",
    description: "",
    author: "",
    subject: "",
    creator: "",
    keywords: [],
    lang: "en",
    slug: "",
    canonical_url: "",
  })

  const pdfInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (pdfData && isOpen) {
      // Set section title
      setSectionTitle(pdfData.section_title || "")

      // Set SEO data
      setSeoData({
        title: pdfData.seo?.title || "",
        description: pdfData.seo?.description || "",
        author: pdfData.seo?.author || "",
        subject: pdfData.seo?.subject || "",
        creator: pdfData.seo?.creator || "",
        keywords: pdfData.seo?.keywords || [],
        lang: pdfData.seo?.lang || "en",
        slug: pdfData.seo?.slug || "",
        canonical_url: pdfData.seo?.canonical_url || "",
      })
    }
  }, [pdfData, isOpen])

  const handleUpdate = async () => {
    const token = getToken()
    if (!token) return handleAuthError()
    if (!imageIdentifier) return

    setIsUpdating(true)
    const toastId = toast.loading("Updating PDF...")

    try {
      const formData = new FormData()

      if (newPdfFile) {
        formData.append("file", newPdfFile)
      }

      if (newCoverPage) {
        formData.append("cover_page", newCoverPage)
      }

      // Add section title
      if (sectionTitle.trim()) {
        formData.append("section_title", sectionTitle.trim())
      }

      // Add SEO data
      Object.entries(seoData).forEach(([key, value]) => {
        if (key === "keywords") {
          // Handle keywords array
          ;(value as string[]).forEach((keyword, index) => {
            formData.append(`seo[keywords][${index}]`, keyword)
          })
        } else {
          formData.append(`seo[${key}]`, value as string)
        }
      })

      const response = await fetch(`${API_BASE_URL}/website-img/update-ui-image/${imageIdentifier}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to update PDF")
      }

      const result = await response.json()
      if (result.success) {
        onUpdate(result.data)
        toast.success("PDF updated successfully", { id: toastId })
        handleClose()
      } else {
        toast.error("Failed to update PDF")
      }
    } catch (error) {
      toast.error("Update process failed")
      console.error("Update process failed:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleClose = () => {
    setNewPdfFile(null)
    setNewCoverPage(null)
    setSectionTitle("")
    setSeoData({
      title: "",
      description: "",
      author: "",
      subject: "",
      creator: "",
      keywords: [],
      lang: "en",
      slug: "",
      canonical_url: "",
    })
    if (pdfInputRef.current) pdfInputRef.current.value = ""
    if (coverInputRef.current) coverInputRef.current.value = ""
    onClose()
  }

  const handleSeoChange = (field: keyof SEOData, value: string) => {
    setSeoData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const addKeyword = () => {
    setSeoData((prev) => ({
      ...prev,
      keywords: [...prev.keywords, ""],
    }))
  }

  const removeKeyword = (index: number) => {
    setSeoData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index),
    }))
  }

  const updateKeyword = (index: number, value: string) => {
    setSeoData((prev) => ({
      ...prev,
      keywords: prev.keywords.map((keyword, i) => (i === index ? value : keyword)),
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Update PDF</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Current PDF Info */}
          {pdfData && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Current PDF: {pdfData.section_title}</h3>
              <p className="text-sm text-gray-600">ID: {pdfData.image_identifier}</p>
            </div>
          )}

          {/* Section Title Field */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4">Section Information</h3>
            <div className="flex flex-col space-y-2">
              <label className="font-medium">Section Title</label>
              <input
                className="border rounded px-3 py-2"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                placeholder="Enter section title"
              />
              <p className="text-sm text-gray-500">Current title: {pdfData?.section_title || "No title set"}</p>
            </div>
          </div>

          {/* File Upload Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <label className="font-medium">New PDF File (Optional)</label>
              <input
                ref={pdfInputRef}
                type="file"
                accept="application/pdf"
                onChange={(e) => setNewPdfFile(e.target.files?.[0] || null)}
                className="border rounded px-3 py-2"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-medium">New Cover Image (Optional)</label>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => setNewCoverPage(e.target.files?.[0] || null)}
                className="border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* SEO Fields */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">SEO Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <label className="font-medium">SEO Title</label>
                <input
                  className="border rounded px-3 py-2"
                  value={seoData.title}
                  onChange={(e) => handleSeoChange("title", e.target.value)}
                  placeholder="Enter SEO title"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="font-medium">Author</label>
                <input
                  className="border rounded px-3 py-2"
                  value={seoData.author}
                  onChange={(e) => handleSeoChange("author", e.target.value)}
                  placeholder="Enter author name"
                />
              </div>
              <div className="flex flex-col space-y-2 md:col-span-2">
                <label className="font-medium">Description</label>
                <textarea
                  className="border rounded px-3 py-2 h-24"
                  value={seoData.description}
                  onChange={(e) => handleSeoChange("description", e.target.value)}
                  placeholder="Enter SEO description"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="font-medium">Subject</label>
                <input
                  className="border rounded px-3 py-2"
                  value={seoData.subject}
                  onChange={(e) => handleSeoChange("subject", e.target.value)}
                  placeholder="Enter subject"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="font-medium">Creator</label>
                <input
                  className="border rounded px-3 py-2"
                  value={seoData.creator}
                  onChange={(e) => handleSeoChange("creator", e.target.value)}
                  placeholder="Enter creator name"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="font-medium">Language</label>
                <select
                  className="border rounded px-3 py-2"
                  value={seoData.lang}
                  onChange={(e) => handleSeoChange("lang", e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>
              <div className="flex flex-col space-y-2">
                <label className="font-medium">Slug</label>
                <input
                  className="border rounded px-3 py-2"
                  value={seoData.slug}
                  onChange={(e) => handleSeoChange("slug", e.target.value)}
                  placeholder="Enter URL slug"
                />
              </div>
              <div className="flex flex-col space-y-2 md:col-span-2">
                <label className="font-medium">Canonical URL</label>
                <input
                  className="border rounded px-3 py-2"
                  value={seoData.canonical_url}
                  onChange={(e) => handleSeoChange("canonical_url", e.target.value)}
                  placeholder="Enter canonical URL"
                />
              </div>
            </div>

            {/* Keywords Section */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="font-medium">Keywords</label>
                <button
                  type="button"
                  onClick={addKeyword}
                  className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
                >
                  <Plus size={16} />
                  Add Keyword
                </button>
              </div>
              <div className="space-y-2">
                {seoData.keywords.map((keyword, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      className="border rounded px-3 py-2 flex-1"
                      value={keyword}
                      onChange={(e) => updateKeyword(index, e.target.value)}
                      placeholder={`Keyword ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeKeyword(index)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <Minus size={16} />
                    </button>
                  </div>
                ))}
                {seoData.keywords.length === 0 && (
                  <p className="text-gray-500 text-sm">No keywords added yet. Click Add Keyword to add some.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t flex justify-end space-x-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            disabled={isUpdating}
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 flex items-center"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update PDF"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

