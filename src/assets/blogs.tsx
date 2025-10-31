// "use client";

// import { useState, useCallback, useEffect, useRef } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import { supabase } from "@/lib/supabase";
// import { Eye, Upload, Delete, Loader2 } from "lucide-react";
// import UpdatePdfModal from "@/components/UpdatePdfModal";
// import { v4 as uuidv4 } from "uuid";
// import toast from "react-hot-toast";
// import Image from 'next/image';

// import "react-pdf/dist/esm/Page/AnnotationLayer.css";
// import "react-pdf/dist/esm/Page/TextLayer.css";

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// interface PdfData {
//   id: string;
//   link: string;
//   "image-identifier": string;
//   "section-title": string;
//   "cover-page"?: string;
// }

// export default function Blogs() {
//   // State
//   const [pdfList, setPdfList] = useState<PdfData[]>([]);
//   const [selectedPdf, setSelectedPdf] = useState<PdfData | null>(null);
//   const [numPages, setNumPages] = useState<number | null>(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [viewportWidth, setViewportWidth] = useState<number | null>(null);

//   // Uploading state
//   const [newPdfTitle, setNewPdfTitle] = useState("");
//   const [newPdfFile, setNewPdfFile] = useState<File | null>(null);
//   const [newCoverPage, setNewCoverPage] = useState<File | null>(null);
//   const [isUploading, setIsUploading] = useState(false);

//   // Modal update state
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedImageIdentifier, setSelectedImageIdentifier] = useState<string | null>(null);
//   const [selectedPdfTitle, setSelectedPdfTitle] = useState<string>("");
//   const [selectedImageLink, setSelectedImageLink] = useState<string>("");

//   // Refs
//   const pdfInputRef = useRef<HTMLInputElement>(null);
//   const coverInputRef = useRef<HTMLInputElement>(null);

//   // Resize handling
//   const handleResize = useCallback(() => {
//     if (typeof window !== "undefined") setViewportWidth(window.innerWidth);
//   }, []);

//   useEffect(() => {
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [handleResize]);

//   // PDF Load Success
//   const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
//     setNumPages(numPages);
//     setPageNumber(1);
//   }, []);

//   const showSuccess = () => {
//     toast.success("PDF uploaded successfully!");
//   };

//   // Fetch PDFs
//   const fetchPdfs = async () => {
//     const toastId = toast.loading("Loading PDFs...");

//     try {
//       const { data, error } = await supabase
//         .from("website-images")
//         .select("*")
//         .eq("page-name", "blogs");

//       if (error) {
//         toast.error("Failed to load PDFs");
//         console.error("Error fetching PDFs:", error);
//         return;
//       }

//       const sorted = (data as PdfData[]).sort((a, b) => {
//         const aNum = parseInt(a["image-identifier"].split("_")[1]);
//         const bNum = parseInt(b["image-identifier"].split("_")[1]);
//         return aNum - bNum;
//       });

//       setPdfList(sorted);
//       toast.success("PDFs loaded successfully");
//     } catch (error) {
//       toast.error("An error occurred while loading PDFs");
//       console.error("Error in fetchPdfs:", error);
//     } finally {
//       toast.dismiss(toastId);
//     }
//   };

//   useEffect(() => {
//     fetchPdfs();
//   }, []);

//   // Upload new PDF
//   const handleAddPdf = async () => {
//     if (!newPdfFile || !newPdfTitle) return;

//     setIsUploading(true);
//     const toastId = toast.loading("Uploading PDF...");

//     try {
//       const pdfUniqueName = `${uuidv4()}_${newPdfFile.name}`;
//       const { error: pdfError } = await supabase.storage
//         .from("images")
//         .upload(pdfUniqueName, newPdfFile);

//       if (pdfError) {
//         toast.error("Failed to upload PDF file");
//         console.error("Error uploading PDF:", pdfError);
//         return;
//       }

//       const { data: pdfUrlData } = await supabase.storage.from("images").getPublicUrl(pdfUniqueName);
//       const pdfPublicUrl = pdfUrlData?.publicUrl ?? "";

//       let coverUrl = "";
//       if (newCoverPage) {
//         toast.loading("Uploading cover image...", { id: toastId });
//         const coverUniqueName = `${uuidv4()}_${newCoverPage.name}`;
//         const { error: coverError } = await supabase.storage
//           .from("images")
//           .upload(coverUniqueName, newCoverPage);
//         if (coverError) {
//           toast.error("Failed to upload cover image");
//           console.error("Error uploading cover page:", coverError);
//           return;
//         }

//         const { data: coverData } = await supabase.storage.from("images").getPublicUrl(coverUniqueName);
//         coverUrl = coverData?.publicUrl ?? "";
//       }

//       toast.loading("Saving to database...", { id: toastId });
//       const { data, error: insertError } = await supabase
//         .from("website-images")
//         .insert([
//           {
//             link: pdfPublicUrl,
//             "section-name": 1,
//             "image-identifier": `b1_${pdfList.length + 1}`,
//             "section-title": newPdfTitle,
//             "page-name": "blogs",
//             "cover-page": coverUrl || null,
//           },
//         ])
//         .select();

//       if (insertError) {
//         toast.error("Failed to save PDF information");
//         console.error("Error inserting PDF:", insertError);
//         return;
//       }

//       setPdfList((prev) => [
//         ...prev,
//         {
//           id: data?.[0]?.id, // coming from DB auto-gen
//           link: pdfPublicUrl,
//           "image-identifier": `b1_${pdfList.length + 1}`,
//           "section-title": newPdfTitle,
//           "cover-page": coverUrl || undefined,
//         },
//       ]);

//       resetForm();
//       toast.success(`"${newPdfTitle}" uploaded successfully!`, { id: toastId });
//     } catch (error) {
//       toast.error("Upload process failed");
//       console.error("Upload process failed:", error);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   // Delete PDF
//   const handleDeletePdf = async (pdf: PdfData) => {
//     if (!confirm(`Delete "${pdf["section-title"]}"?`)) return;

//     const toastId = toast.loading(`Deleting "${pdf["section-title"]}"...`);

//     try {
//       const pdfPath = pdf.link.split("/").pop()?.split("?")[0];
//       const coverPath = pdf["cover-page"]?.split("/").pop()?.split("?")[0];

//       if (pdfPath) await supabase.storage.from("images").remove([pdfPath]);
//       if (coverPath) await supabase.storage.from("images").remove([coverPath]);

//       const { error } = await supabase.from("website-images").delete().eq("id", pdf.id);
//       if (error) {
//         toast.error("Failed to delete PDF");
//         console.error("Error deleting entry:", error);

//         return;
//       }

//       setPdfList((prev) => prev.filter((item) => item.id !== pdf.id));
//       toast.success(`"${pdf["section-title"]}" deleted successfully`, { id: toastId });
//     } catch (error) {
//       toast.error("Delete process failed");
//       console.error("Error in delete process:", error);
//     }
//   };

//   // Update PDF
//   const handleUpdateImage = async (newLink: string, newTitle: string) => {
//     if (!selectedImageIdentifier) return;

//     const toastId = toast.loading("Updating PDF information...");

//     try {
//       const updatedList = pdfList.map((item) =>
//         item["image-identifier"] === selectedImageIdentifier
//           ? { ...item, link: newLink || item.link, "section-title": newTitle }
//           : item
//       );

//       setPdfList(updatedList);
//       handleCloseModal();
//       toast.success("PDF updated successfully", { id: toastId });
//     } catch (error) {
//       toast.error("Failed to update PDF");
//       console.error("Error updating PDF:", error);
//     }
//   };

//   const resetForm = () => {
//     setNewPdfTitle("");
//     setNewPdfFile(null);
//     setNewCoverPage(null);
//     if (pdfInputRef.current) pdfInputRef.current.value = "";
//     if (coverInputRef.current) coverInputRef.current.value = "";
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedImageIdentifier(null);
//     setSelectedImageLink("");
//     setSelectedPdfTitle("");
//   };

//   const getPageDimensions = () => {
//     if ((viewportWidth ?? 0) <= 640) return { width: 300, scale: 0.8 };
//     if ((viewportWidth ?? 0) <= 768) return { width: 500, scale: 1 };
//     return { width: 850, scale: 1 };
//   };

//   const { width, scale } = getPageDimensions();

//   // UI Rendering
//   return (
//     <div className="flex flex-col px-8 xl:px-32 pt-8 pb-12">
//       <h2 className="text-2xl font-semibold mb-4">Blogs</h2>

//       {/* PDF List */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {pdfList.map((pdf, index) => (
//           <div key={pdf.id} className="group overflow-hidden border shadow-md relative">
//             <div className="bg-gray-100 h-auto flex justify-center items-center">
//               {/* {pdf["cover-page"] ? (
//                 <Image src={pdf["cover-page"]} alt="cover_imge" className="w-full group-hover:opacity-20" />
//               ) : (
//                 <Document file={pdf.link} onLoadSuccess={onDocumentLoadSuccess}>
//                   <div className="flex">
//                     <Page pageNumber={1} width={width / 2 - 10} renderTextLayer={false} />
//                     <Page pageNumber={2} width={width / 2 - 10} renderTextLayer={false} />
//                   </div>
//                 </Document> */}
//               {pdf["cover-page"] ? (
//                 <Image
//                   src={pdf["cover-page"]}
//                   alt="cover_image"
//                   width={500}  // Add a default width
//                   height={300} // Add a default height
//                   className="w-full group-hover:opacity-20"
//                   style={{ objectFit: 'cover' }}  // Ensure proper scaling
//                 />
//               ) : (
//                 <Document file={pdf.link} onLoadSuccess={onDocumentLoadSuccess}>
//                   <div className="flex">
//                     <Page pageNumber={1} width={width / 2 - 10} renderTextLayer={false} />
//                     <Page pageNumber={2} width={width / 2 - 10} renderTextLayer={false} />
//                   </div>
//                 </Document>

//               )}
//               <div className="absolute top-1/2 right-1/2 bg-white bg-opacity-75 rounded-full p-2 opacity-0 group-hover:opacity-100 flex gap-3">
//                 <Upload
//                   className="cursor-pointer"
//                   onClick={() => {
//                     setIsModalOpen(true);
//                     setSelectedImageIdentifier(pdf["image-identifier"]);
//                     setSelectedImageLink(pdf.link);
//                     setSelectedPdfTitle(pdf["section-title"]);
//                   }}
//                 />
//                 <Eye
//                   className="cursor-pointer"
//                   onClick={() => setSelectedPdf(pdf)}
//                 />
//                 <Delete
//                   className="text-red-600 cursor-pointer"
//                   onClick={() => handleDeletePdf(pdf)}
//                 />
//               </div>
//             </div>
//             <h3 className="p-4 text-lg font-medium">{index + 1}. {pdf["section-title"]}</h3>
//           </div>
//         ))}
//       </div>

//       {/* PDF Viewer Modal */}
//       {selectedPdf && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
//             <div className="p-4 border-b flex justify-between items-center">
//               <h2 className="text-xl font-semibold">{selectedPdf["section-title"]}</h2>
//               <button onClick={() => setSelectedPdf(null)} className="text-2xl">&times;</button>
//             </div>
//             <div className="p-4">
//               <Document file={selectedPdf.link} onLoadSuccess={onDocumentLoadSuccess}>
//                 <Page
//                   pageNumber={pageNumber}
//                   width={width}
//                   scale={scale}
//                   renderTextLayer={false}
//                 />
//               </Document>
//               <div className="flex justify-between items-center p-4 bg-gray-100">
//                 <button
//                   className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
//                   onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
//                   disabled={pageNumber <= 1}
//                 >
//                   Previous
//                 </button>
//                 <span>Page {pageNumber} of {numPages || "..."}</span>
//                 <button
//                   className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
//                   onClick={() => setPageNumber((p) => Math.min((numPages || 1), p + 1))}
//                   disabled={pageNumber >= (numPages || 1)}
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add New PDF Section */}
//       <div className="mt-10 space-y-4">
//         <h2 className="text-xl font-semibold">Add New PDF</h2>

//         <div className="flex flex-col space-y-2">
//           <label>Title</label>
//           <input className="border rounded px-2 py-1" value={newPdfTitle} onChange={(e) => setNewPdfTitle(e.target.value)} />
//         </div>

//         <div className="flex flex-col space-y-2">
//           <label>PDF File</label>
//           <input ref={pdfInputRef} type="file" accept="application/pdf" onChange={(e) => setNewPdfFile(e.target.files?.[0] || null)} />
//         </div>

//         <div className="flex flex-col space-y-2">
//           <label>Cover Image (Optional)</label>
//           <input ref={coverInputRef} type="file" accept="image/*" onChange={(e) => setNewCoverPage(e.target.files?.[0] || null)} />
//         </div>

//         <div className="flex space-x-4">
//           <button
//             className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50 flex items-center justify-center"
//             disabled={!newPdfFile || !newPdfTitle || isUploading}
//             onClick={handleAddPdf}
//           >
//             {isUploading ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Uploading....
//                 {showSuccess}
//               </>

//             ) : (
//               "Upload PDF"

//             )}
//           </button>
//           <button
//             className="bg-gray-300 text-black px-4 py-2 rounded"
//             onClick={resetForm}
//             disabled={(!newPdfFile && !newPdfTitle && !newCoverPage) || isUploading}
//           >
//             Cancel
//           </button>

//         </div>
//       </div>

//       {/* Modal */}
//       <UpdatePdfModal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         currentLink={selectedImageLink}
//         onUpdate={handleUpdateImage}
//         pdfId={selectedImageIdentifier!}
//         title={selectedPdfTitle}

//       />
//     </div>
//   );
// }




















// "use client";

// import { useState, useCallback, useEffect, useRef } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import { Eye, Upload, Delete, Loader2, Plus, Minus } from "lucide-react";
// import UpdatePdfModal from "@/components/UpdatePdfModal";
// import toast from "react-hot-toast";
// import Image from "next/image";
// import "react-pdf/dist/esm/Page/AnnotationLayer.css";
// import "react-pdf/dist/esm/Page/TextLayer.css";

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// interface SEOData {
//   title: string;
//   description: string;
//   author: string;
//   subject: string;
//   creator: string;
//   keywords: string[];
//   lang: string;
//   slug: string;
//   canonical_url: string;
//   published_time?: string;
//   updated_time?: string;
// }

// interface PdfData {
//   _id: string;
//   section_name: string;
//   page_name: string;
//   image_identifier: string;
//   section_title: string;
//   cover_page?: string;
//   media: {
//     url: string;
//     contentType: string;
//     size: number;
//   };
//   seo?: SEOData;
// }

// const API_BASE_URL = "${baseURL}/api/v1";
// const AUTH_TOKEN =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzBkYjA1NTA5ZDEyYTE2OTkzNTNlOSIsImVtYWlsIjoiZGV2b3BzQGV6cGVkYWwuaW4iLCJpYXQiOjE3NTI5MTc0MzUsImV4cCI6MTc1MjkyMTAzNX0.2krxKdUSmShJl1aws2OKfQn4g3Ri-Z-pLgzGn9kbXuA";

// export default function Blogs() {
//   // State
//   const [pdfList, setPdfList] = useState<PdfData[]>([]);
//   const [selectedPdf, setSelectedPdf] = useState<PdfData | null>(null);
//   const [numPages, setNumPages] = useState<number | null>(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [viewportWidth, setViewportWidth] = useState<number | null>(null);

//   // Uploading state
//   const [newPdfTitle, setNewPdfTitle] = useState("");
//   const [newPdfFile, setNewPdfFile] = useState<File | null>(null);
//   const [newCoverPage, setNewCoverPage] = useState<File | null>(null);
//   const [isUploading, setIsUploading] = useState(false);

//   // SEO state
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
//   });

//   // Modal update state
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedImageIdentifier, setSelectedImageIdentifier] = useState<
//     string | null
//   >(null);
//   const [selectedPdfData, setSelectedPdfData] = useState<PdfData | null>(null);

//   // Refs
//   const pdfInputRef = useRef<HTMLInputElement>(null);
//   const coverInputRef = useRef<HTMLInputElement>(null);

//   // Resize handling
//   const handleResize = useCallback(() => {
//     if (typeof window !== "undefined") setViewportWidth(window.innerWidth);
//   }, []);

//   useEffect(() => {
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [handleResize]);

//   // PDF Load Success
//   const onDocumentLoadSuccess = useCallback(
//     ({ numPages }: { numPages: number }) => {
//       setNumPages(numPages);
//       setPageNumber(1);
//     },
//     []
//   );

//   // Fetch PDFs from your API
//   const fetchPdfs = async () => {
//     const toastId = toast.loading("Loading PDFs...");
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/website-img/images-list?page_name=blogs`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch PDFs");
//       }

//       const result = await response.json();

//       if (result.success) {
//         const sorted = result.data.sort((a: PdfData, b: PdfData) => {
//           const aNum = Number.parseInt(a.image_identifier.split("_")[1] || "0");
//           const bNum = Number.parseInt(b.image_identifier.split("_")[1] || "0");
//           return aNum - bNum;
//         });
//         setPdfList(sorted);
//         toast.success("PDFs loaded successfully");
//       } else {
//         toast.error("Failed to load PDFs");
//       }
//     } catch (error) {
//       toast.error("An error occurred while loading PDFs");
//       console.error("Error in fetchPdfs:", error);
//     } finally {
//       toast.dismiss(toastId);
//     }
//   };

//   useEffect(() => {
//     fetchPdfs();
//   }, []);

//   // Upload new PDF
//   const handleAddPdf = async () => {
//     if (!newPdfFile || !newPdfTitle) {
//       toast.error("Please provide both title and PDF file");
//       return;
//     }

//     setIsUploading(true);
//     const toastId = toast.loading("Uploading PDF...");

//     try {
//       const formData = new FormData();
//       formData.append("page_name", "blogs");
//       formData.append("section_name", "1");
//       formData.append("image_identifier", `b1_${Date.now()}`);
//       formData.append("file", newPdfFile);
//       formData.append(
//         "seo",
//         JSON.stringify({
//           ...seoData,
//           keywords: seoData.keywords.join(","),
//         })
//       );
//       console.log("req.body", formData);

//       if (newCoverPage) {
//         formData.append("cover_page", newCoverPage);
//       }

//       const response = await fetch(
//         `${API_BASE_URL}/website-img/upload-ui-image`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${AUTH_TOKEN}`,
//           },
//           body: formData,
//         }
//       );
//       console.log("response", response);
//       if (!response.ok) {
//         throw new Error("Failed to upload PDF");
//       }

//       const result = await response.json();

//       if (result.success) {
//         await fetchPdfs(); // Refresh the list
//         resetForm();
//         toast.success(`"${newPdfTitle}" uploaded successfully!`, {
//           id: toastId,
//         });
//       } else {
//         toast.error("Failed to upload PDF");
//       }
//     } catch (error) {
//       toast.error("Upload process failed");
//       console.error("Upload process failed:", error);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   // Delete PDF
//   const handleDeletePdf = async (pdf: PdfData) => {
//     if (!confirm(`Delete "${pdf.section_title}"?`)) return;

//     const toastId = toast.loading(`Deleting "${pdf.section_title}"...`);
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/website-img/delete-ui-image/${pdf.image_identifier}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${AUTH_TOKEN}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to delete PDF");
//       }

//       const result = await response.json();

//       if (result.success) {
//         setPdfList((prev) => prev.filter((item) => item._id !== pdf._id));
//         toast.success(`"${pdf.section_title}" deleted successfully`, {
//           id: toastId,
//         });
//       } else {
//         toast.error("Failed to delete PDF");
//       }
//     } catch (error) {
//       toast.error("Delete process failed");
//       console.error("Error in delete process:", error);
//     }
//   };

//   // Update PDF
//   const handleUpdatePdf = async (updatedData: Partial<PdfData>) => {
//     if (!selectedImageIdentifier) return;

//     await fetchPdfs(); // Refresh the list
//     handleCloseModal();
//     toast.success("PDF updated successfully");
//   };

//   const resetForm = () => {
//     setNewPdfTitle("");
//     setNewPdfFile(null);
//     setNewCoverPage(null);
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
//     });
//     if (pdfInputRef.current) pdfInputRef.current.value = "";
//     if (coverInputRef.current) coverInputRef.current.value = "";
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedImageIdentifier(null);
//     setSelectedPdfData(null);
//   };

//   const getPageDimensions = () => {
//     if ((viewportWidth ?? 0) <= 640) return { width: 300, scale: 0.8 };
//     if ((viewportWidth ?? 0) <= 768) return { width: 500, scale: 1 };
//     return { width: 850, scale: 1 };
//   };

//   const { width, scale } = getPageDimensions();

//   // SEO form handlers
//   const handleSeoChange = (field: keyof SEOData, value: string) => {
//     setSeoData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const addKeyword = () => {
//     setSeoData((prev) => ({
//       ...prev,
//       keywords: [...prev.keywords, ""],
//     }));
//   };

//   const removeKeyword = (index: number) => {
//     setSeoData((prev) => ({
//       ...prev,
//       keywords: prev.keywords.filter((_, i) => i !== index),
//     }));
//   };

//   const updateKeyword = (index: number, value: string) => {
//     setSeoData((prev) => ({
//       ...prev,
//       keywords: prev.keywords.map((keyword, i) =>
//         i === index ? value : keyword
//       ),
//     }));
//   };

//   return (
//     <div className="flex flex-col px-8 xl:px-32 pt-8 pb-12">
//       <h2 className="text-2xl font-semibold mb-4">Blogs</h2>

//       {/* PDF List */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {pdfList.map((pdf, index) => (
//           <div
//             key={pdf._id}
//             className="group overflow-hidden border shadow-md relative"
//           >
//             <div className="bg-gray-100 h-auto flex justify-center items-center">
//               {pdf.cover_page ? (
//                 <Image
//                   src={pdf.cover_page || "/placeholder.svg"}
//                   alt="cover_image"
//                   width={500}
//                   height={300}
//                   className="w-full group-hover:opacity-20"
//                   style={{ objectFit: "cover" }}
//                 />
//               ) : (
//                 <Document
//                   file={pdf.media.url}
//                   onLoadSuccess={onDocumentLoadSuccess}
//                 >
//                   <div className="flex">
//                     <Page
//                       pageNumber={1}
//                       width={width / 2 - 10}
//                       renderTextLayer={false}
//                     />
//                     <Page
//                       pageNumber={2}
//                       width={width / 2 - 10}
//                       renderTextLayer={false}
//                     />
//                   </div>
//                 </Document>
//               )}
//               <div className="absolute top-1/2 right-1/2 bg-white bg-opacity-75 rounded-full p-2 opacity-0 group-hover:opacity-100 flex gap-3">
//                 <Upload
//                   className="cursor-pointer"
//                   onClick={() => {
//                     setIsModalOpen(true);
//                     setSelectedImageIdentifier(pdf.image_identifier);
//                     setSelectedPdfData(pdf);
//                   }}
//                 />
//                 <Eye
//                   className="cursor-pointer"
//                   onClick={() => setSelectedPdf(pdf)}
//                 />
//                 <Delete
//                   className="text-red-600 cursor-pointer"
//                   onClick={() => handleDeletePdf(pdf)}
//                 />
//               </div>
//             </div>
//             <h3 className="p-4 text-lg font-medium">
//               {index + 1}. {pdf.section_title}
//             </h3>
//           </div>
//         ))}
//       </div>

//       {/* PDF Viewer Modal */}
//       {selectedPdf && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
//             <div className="p-4 border-b flex justify-between items-center">
//               <h2 className="text-xl font-semibold">
//                 {selectedPdf.section_title}
//               </h2>
//               <button onClick={() => setSelectedPdf(null)} className="text-2xl">
//                 &times;
//               </button>
//             </div>
//             <div className="p-4">
//               <Document
//                 file={selectedPdf.media.url}
//                 onLoadSuccess={onDocumentLoadSuccess}
//               >
//                 <Page
//                   pageNumber={pageNumber}
//                   width={width}
//                   scale={scale}
//                   renderTextLayer={false}
//                 />
//               </Document>
//               <div className="flex justify-between items-center p-4 bg-gray-100">
//                 <button
//                   className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
//                   onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
//                   disabled={pageNumber <= 1}
//                 >
//                   Previous
//                 </button>
//                 <span>
//                   Page {pageNumber} of {numPages || "..."}
//                 </span>
//                 <button
//                   className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
//                   onClick={() =>
//                     setPageNumber((p) => Math.min(numPages || 1, p + 1))
//                   }
//                   disabled={pageNumber >= (numPages || 1)}
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add New PDF Section */}
//       <div className="mt-10 space-y-6">
//         <h2 className="text-xl font-semibold">Add New PDF</h2>

//         {/* Basic Fields */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="flex flex-col space-y-2">
//             <label className="font-medium">Title *</label>
//             <input
//               className="border rounded px-3 py-2"
//               value={newPdfTitle}
//               onChange={(e) => setNewPdfTitle(e.target.value)}
//               placeholder="Enter PDF title"
//             />
//           </div>

//           <div className="flex flex-col space-y-2">
//             <label className="font-medium">PDF File *</label>
//             <input
//               ref={pdfInputRef}
//               type="file"
//               accept="application/pdf"
//               onChange={(e) => setNewPdfFile(e.target.files?.[0] || null)}
//               className="border rounded px-3 py-2"
//             />
//           </div>

//           <div className="flex flex-col space-y-2 md:col-span-2">
//             <label className="font-medium">Cover Image (Optional)</label>
//             <input
//               ref={coverInputRef}
//               type="file"
//               accept="image/*"
//               onChange={(e) => setNewCoverPage(e.target.files?.[0] || null)}
//               className="border rounded px-3 py-2"
//             />
//           </div>
//         </div>

//         {/* SEO Fields */}
//         <div className="border-t pt-6">
//           <h3 className="text-lg font-semibold mb-4">SEO Information</h3>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="flex flex-col space-y-2">
//               <label className="font-medium">SEO Title</label>
//               <input
//                 className="border rounded px-3 py-2"
//                 value={seoData.title}
//                 onChange={(e) => handleSeoChange("title", e.target.value)}
//                 placeholder="Enter SEO title"
//               />
//             </div>

//             <div className="flex flex-col space-y-2">
//               <label className="font-medium">Author</label>
//               <input
//                 className="border rounded px-3 py-2"
//                 value={seoData.author}
//                 onChange={(e) => handleSeoChange("author", e.target.value)}
//                 placeholder="Enter author name"
//               />
//             </div>

//             <div className="flex flex-col space-y-2 md:col-span-2">
//               <label className="font-medium">Description</label>
//               <textarea
//                 className="border rounded px-3 py-2 h-24"
//                 value={seoData.description}
//                 onChange={(e) => handleSeoChange("description", e.target.value)}
//                 placeholder="Enter SEO description"
//               />
//             </div>

//             <div className="flex flex-col space-y-2">
//               <label className="font-medium">Subject</label>
//               <input
//                 className="border rounded px-3 py-2"
//                 value={seoData.subject}
//                 onChange={(e) => handleSeoChange("subject", e.target.value)}
//                 placeholder="Enter subject"
//               />
//             </div>

//             <div className="flex flex-col space-y-2">
//               <label className="font-medium">Creator</label>
//               <input
//                 className="border rounded px-3 py-2"
//                 value={seoData.creator}
//                 onChange={(e) => handleSeoChange("creator", e.target.value)}
//                 placeholder="Enter creator name"
//               />
//             </div>

//             <div className="flex flex-col space-y-2">
//               <label className="font-medium">Language</label>
//               <select
//                 className="border rounded px-3 py-2"
//                 value={seoData.lang}
//                 onChange={(e) => handleSeoChange("lang", e.target.value)}
//               >
//                 <option value="en">English</option>
//                 <option value="es">Spanish</option>
//                 <option value="fr">French</option>
//                 <option value="de">German</option>
//                 <option value="hi">Hindi</option>
//               </select>
//             </div>

//             <div className="flex flex-col space-y-2">
//               <label className="font-medium">Slug</label>
//               <input
//                 className="border rounded px-3 py-2"
//                 value={seoData.slug}
//                 onChange={(e) => handleSeoChange("slug", e.target.value)}
//                 placeholder="Enter URL slug"
//               />
//             </div>

//             <div className="flex flex-col space-y-2 md:col-span-2">
//               <label className="font-medium">Canonical URL</label>
//               <input
//                 className="border rounded px-3 py-2"
//                 value={seoData.canonical_url}
//                 onChange={(e) =>
//                   handleSeoChange("canonical_url", e.target.value)
//                 }
//                 placeholder="Enter canonical URL"
//               />
//             </div>
//           </div>

//           {/* Keywords Section */}
//           <div className="mt-4">
//             <div className="flex items-center justify-between mb-2">
//               <label className="font-medium">Keywords</label>
//               <button
//                 type="button"
//                 onClick={addKeyword}
//                 className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
//               >
//                 <Plus size={16} />
//                 Add Keyword
//               </button>
//             </div>

//             <div className="space-y-2">
//               {seoData.keywords.map((keyword, index) => (
//                 <div key={index} className="flex gap-2">
//                   <input
//                     className="border rounded px-3 py-2 flex-1"
//                     value={keyword}
//                     onChange={(e) => updateKeyword(index, e.target.value)}
//                     placeholder={`Keyword ${index + 1}`}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeKeyword(index)}
//                     className="text-red-500 hover:text-red-700 p-2"
//                   >
//                     <Minus size={16} />
//                   </button>
//                 </div>
//               ))}

//               {seoData.keywords.length === 0 && (
//                 <p className="text-gray-500 text-sm">
//                   No keywords added yet. Click "Add Keyword" to add some.
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex space-x-4 pt-4">
//           <button
//             className="bg-green-500 text-white px-6 py-2 rounded disabled:opacity-50 flex items-center justify-center"
//             disabled={!newPdfFile || !newPdfTitle || isUploading}
//             onClick={handleAddPdf}
//           >
//             {isUploading ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Uploading...
//               </>
//             ) : (
//               "Upload PDF"
//             )}
//           </button>
//           <button
//             className="bg-gray-300 text-black px-6 py-2 rounded"
//             onClick={resetForm}
//             disabled={
//               (!newPdfFile && !newPdfTitle && !newCoverPage) || isUploading
//             }
//           >
//             Cancel
//           </button>
//         </div>
//       </div>

//       {/* Update Modal */}
//       <UpdatePdfModal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         onUpdate={handleUpdatePdf}
//         pdfData={selectedPdfData}
//         imageIdentifier={selectedImageIdentifier!}
//       />
//     </div>
//   );
// }





"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Eye, Upload, Delete, Loader2, Plus, Minus } from "lucide-react"
import UpdatePdfModal from "@/components/UpdatePdfModal"
import toast from "react-hot-toast"
import Image from "next/image"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import "react-pdf/dist/esm/Page/TextLayer.css"
import { useRouter } from "next/navigation"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

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
const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
const API_BASE_URL = `${baseURL}/api/v1`

export default function Blogs() {
  const router = useRouter();
    const getToken = () => localStorage.getItem("token");

  const handleAuthError = () => {
    localStorage.removeItem("token");
    router.push("/");
  };
  // State
  const [pdfList, setPdfList] = useState<PdfData[]>([])
  const [selectedPdf, setSelectedPdf] = useState<PdfData | null>(null)
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [viewportWidth, setViewportWidth] = useState<number | null>(null)

  // Uploading state
  const [newPdfTitle, setNewPdfTitle] = useState("")
  const [newPdfFile, setNewPdfFile] = useState<File | null>(null)
  const [newCoverPage, setNewCoverPage] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // SEO state
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

  // Modal update state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImageIdentifier, setSelectedImageIdentifier] = useState<string | null>(null)
  const [selectedPdfData, setSelectedPdfData] = useState<PdfData | null>(null)

  // Refs
  const pdfInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  // Resize handling
  const handleResize = useCallback(() => {
    if (typeof window !== "undefined") setViewportWidth(window.innerWidth)
  }, [])

  useEffect(() => {
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [handleResize])

  // PDF Load Success
  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setPageNumber(1)
  }, [])

  // Fetch PDFs from your API
  const fetchPdfs = async () => {
    const toastId = toast.loading("Loading PDFs...")
    try {
      const response = await fetch(`${API_BASE_URL}/website-img/images-list?page_name=blogs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch PDFs")
      }

      const result = await response.json()

      if (result.success) {
        const sorted = result.data.sort((a: PdfData, b: PdfData) => {
          const aNum = Number.parseInt(a.image_identifier.split("_")[1] || "0")
          const bNum = Number.parseInt(b.image_identifier.split("_")[1] || "0")
          return aNum - bNum
        })
        setPdfList(sorted)
        toast.success("PDFs loaded successfully")
      } else {
        toast.error("Failed to load PDFs")
      }
    } catch (error) {
      toast.error("An error occurred while loading PDFs")
      console.error("Error in fetchPdfs:", error)
    } finally {
      toast.dismiss(toastId)
    }
  }

  useEffect(() => {
    fetchPdfs()
  }, [])

  // Upload new PDF
  const handleAddPdf = async () => {
    const token = getToken();
    if (!token) return handleAuthError();
    if (!newPdfFile || !newPdfTitle) {
      toast.error("Please provide both title and PDF file")
      return
    }

    setIsUploading(true)
    const toastId = toast.loading("Uploading PDF...")

    try {
      const formData = new FormData()

      // Add required fields
      formData.append("page_name", "blogs")
      formData.append("section_name", "1") // This should be a string as per your backend
      formData.append("image_identifier", `b1_${Date.now()}`)
      formData.append("section_title", newPdfTitle) // This was missing!
      formData.append("file", newPdfFile)

      // Add SEO data as JSON string (matching your Postman request)
      const seoPayload = {
        title: seoData.title,
        description: seoData.description,
        author: seoData.author,
        subject: seoData.subject,
        creator: seoData.creator,
        keywords: seoData.keywords.filter((k) => k.trim() !== ""), // Filter out empty keywords
        lang: seoData.lang,
        slug: seoData.slug,
        canonical_url: seoData.canonical_url,
      }

      formData.append("seo", JSON.stringify(seoPayload))

      if (newCoverPage) {
        formData.append("cover_page", newCoverPage)
      }

      // Debug: Log FormData contents (this is the correct way to log FormData)
      console.log("FormData contents:")
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(key, ":", `File - ${value.name} (${value.size} bytes)`)
        } else {
          console.log(key, ":", value)
        }
      }

      const response = await fetch(`${API_BASE_URL}/website-img/upload-ui-image`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
          },
        body: formData,
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", response.headers)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response:", errorText)
        throw new Error(`Failed to upload PDF: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      console.log("Success response:", result)

      if (result.success) {
        await fetchPdfs() // Refresh the list
        resetForm()
        toast.success(`"${newPdfTitle}" uploaded successfully!`, {
          id: toastId,
        })
      } else {
        toast.error("Failed to upload PDF")
      }
    } catch (error) {
      toast.error("Upload process failed")
      console.error("Upload process failed:", error)
    } finally {
      setIsUploading(false)
    }
  }

  // Delete PDF
  const handleDeletePdf = async (pdf: PdfData) => {
        const token = getToken();
    if (!token) return handleAuthError();
    if (!confirm(`Delete "${pdf.section_title}"?`)) return

    const toastId = toast.loading(`Deleting "${pdf.section_title}"...`)
    try {
      const response = await fetch(`${API_BASE_URL}/website-img/delete-ui-image/${pdf.image_identifier}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete PDF")
      }

      const result = await response.json()

      if (result.success) {
        setPdfList((prev) => prev.filter((item) => item._id !== pdf._id))
        toast.success(`"${pdf.section_title}" deleted successfully`, { id: toastId })
      } else {
        toast.error("Failed to delete PDF")
      }
    } catch (error) {
      toast.error("Delete process failed")
      console.error("Error in delete process:", error)
    }
  }

  // Update PDF
  const handleUpdatePdf = async () => {
    if (!selectedImageIdentifier) return

    await fetchPdfs() // Refresh the list
    handleCloseModal()
    toast.success("PDF updated successfully")
  }

  const resetForm = () => {
    setNewPdfTitle("")
    setNewPdfFile(null)
    setNewCoverPage(null)
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
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedImageIdentifier(null)
    setSelectedPdfData(null)
  }

  const getPageDimensions = () => {
    if ((viewportWidth ?? 0) <= 640) return { width: 300, scale: 0.8 }
    if ((viewportWidth ?? 0) <= 768) return { width: 500, scale: 1 }
    return { width: 850, scale: 1 }
  }

  const { width, scale } = getPageDimensions()

  // SEO form handlers
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

  return (
    <div className="flex flex-col px-8 xl:px-32 pt-8 pb-12">
      <h2 className="text-2xl font-semibold mb-4">Blogs</h2>

      {/* PDF List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pdfList.map((pdf, index) => (
          <div key={pdf._id} className="group overflow-hidden border shadow-md relative">
            <div className="bg-gray-100 h-auto flex justify-center items-center">
              {pdf.cover_page ? (
                <Image
                  src={pdf.cover_page || "/placeholder.svg"}
                  alt="cover_image"
                  width={500}
                  height={300}
                  className="w-full group-hover:opacity-20"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <Document file={pdf.media.url} onLoadSuccess={onDocumentLoadSuccess}>
                  <div className="flex">
                    <Page pageNumber={1} width={width / 2 - 10} renderTextLayer={false} />
                    <Page pageNumber={2} width={width / 2 - 10} renderTextLayer={false} />
                  </div>
                </Document>
              )}
              <div className="absolute top-1/2 right-1/2 bg-white bg-opacity-75 rounded-full p-2 opacity-0 group-hover:opacity-100 flex gap-3">
                <Upload
                  className="cursor-pointer"
                  onClick={() => {
                    setIsModalOpen(true)
                    setSelectedImageIdentifier(pdf.image_identifier)
                    setSelectedPdfData(pdf)
                  }}
                />
                <Eye className="cursor-pointer" onClick={() => setSelectedPdf(pdf)} />
                <Delete className="text-red-600 cursor-pointer" onClick={() => handleDeletePdf(pdf)} />
              </div>
            </div>
            <h3 className="p-4 text-lg font-medium">
              {index + 1}. {pdf.section_title}
            </h3>
          </div>
        ))}
      </div>

      {/* PDF Viewer Modal */}
      {selectedPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">{selectedPdf.section_title}</h2>
              <button onClick={() => setSelectedPdf(null)} className="text-2xl">
                &times;
              </button>
            </div>
            <div className="p-4">
              <Document file={selectedPdf.media.url} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={pageNumber} width={width} scale={scale} renderTextLayer={false} />
              </Document>
              <div className="flex justify-between items-center p-4 bg-gray-100">
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
                  onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                  disabled={pageNumber <= 1}
                >
                  Previous
                </button>
                <span>
                  Page {pageNumber} of {numPages || "..."}
                </span>
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
                  onClick={() => setPageNumber((p) => Math.min(numPages || 1, p + 1))}
                  disabled={pageNumber >= (numPages || 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New PDF Section */}
      <div className="mt-10 space-y-6">
        <h2 className="text-xl font-semibold">Add New PDF</h2>

        {/* Basic Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <label className="font-medium">Title *</label>
            <input
              className="border rounded px-3 py-2"
              value={newPdfTitle}
              onChange={(e) => setNewPdfTitle(e.target.value)}
              placeholder="Enter PDF title"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-medium">PDF File *</label>
            <input
              ref={pdfInputRef}
              type="file"
              accept="application/pdf"
              onChange={(e) => setNewPdfFile(e.target.files?.[0] || null)}
              className="border rounded px-3 py-2"
            />
          </div>

          <div className="flex flex-col space-y-2 md:col-span-2">
            <label className="font-medium">Cover Image (Optional)</label>
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

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-4">
          <button
            className="bg-green-500 text-white px-6 py-2 rounded disabled:opacity-50 flex items-center justify-center"
            disabled={!newPdfFile || !newPdfTitle || isUploading}
            onClick={handleAddPdf}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload PDF"
            )}
          </button>
          <button
            className="bg-gray-300 text-black px-6 py-2 rounded"
            onClick={resetForm}
            disabled={(!newPdfFile && !newPdfTitle && !newCoverPage) || isUploading}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Update Modal */}
      <UpdatePdfModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdate={handleUpdatePdf}
        pdfData={selectedPdfData}
        imageIdentifier={selectedImageIdentifier!}
      />
    </div>
  )
}
