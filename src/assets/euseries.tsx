// "use client";

// import { useState, useCallback, useEffect, useRef } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import { supabase } from "@/lib/supabase";
// import { Eye, Upload, Delete, Loader2 } from "lucide-react";
// import UpdatePdfModal from "@/components/UpdatePdfModal";
// import { v4 as uuidv4 } from "uuid";
// import Image from 'next/image';

// import "react-pdf/dist/esm/Page/AnnotationLayer.css";
// import "react-pdf/dist/esm/Page/TextLayer.css";

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// interface PdfData {
//     id: string;
//     link: string;
//     section_name: number;
//     image_identifier: string;
//     section_title: string;
//     page_name: string;
//     cover_page?: string;
// }

// export default function Enride() {
//     // State
//     const [pdfList, setPdfList] = useState<PdfData[]>([]);
//     const [selectedPdf, setSelectedPdf] = useState<PdfData | null>(null);
//     const [numPages, setNumPages] = useState<number | null>(null);
//     const [pageNumber, setPageNumber] = useState(1);
//     const [viewportWidth, setViewportWidth] = useState<number | null>(null);
//     const [, setIsLoading] = useState(true);

//     // Uploading state
//     const [newPdfTitle, setNewPdfTitle] = useState("");
//     const [newPdfFile, setNewPdfFile] = useState<File | null>(null);
//     const [newCoverPage, setNewCoverPage] = useState<File | null>(null);
//     const [isUploading, setIsUploading] = useState(false);

//     // Modal update state
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedImageIdentifier, setSelectedImageIdentifier] = useState<string | null>(null);
//     const [selectedPdfTitle, setSelectedPdfTitle] = useState<string>("");
//     const [selectedImageLink, setSelectedImageLink] = useState<string>("");

//     // Toast state
//     const [toast, setToast] = useState<{ visible: boolean, message: string, type: 'success' | 'error' }>({
//         visible: false,
//         message: '',
//         type: 'success'
//     });

//     // Refs
//     const pdfInputRef = useRef<HTMLInputElement>(null);
//     const coverInputRef = useRef<HTMLInputElement>(null);

//     // Resize handling
//     const handleResize = useCallback(() => {
//         if (typeof window !== "undefined") setViewportWidth(window.innerWidth);
//     }, []);

//     useEffect(() => {
//         handleResize();
//         window.addEventListener("resize", handleResize);
//         return () => window.removeEventListener("resize", handleResize);
//     }, [handleResize]);

//     // Auto-hide toast after 3 seconds
//     useEffect(() => { 
//         if (toast.visible) {
//             const timer = setTimeout(() => {
//                 setToast(prev => ({ ...prev, visible: false }));
//             }, 3000);
//             return () => clearTimeout(timer);
//         }
//     }, [toast.visible]);

//     // PDF Load Success
//     const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
//         setNumPages(numPages);
//         setPageNumber(1);
//     }, []);

//     const showToastMessage = (message: string, type: 'success' | 'error') => {
//         setToast({
//             visible: true,
//             message,
//             type
//         });
//     };

//     // Fetch PDFs
//     const fetchPdfs = async () => {
//         setIsLoading(true);

//         try {
//             const { data, error } = await supabase
//                 .from("eu_images")
//                 .select("*")
//                 .eq("page_name", "enride");

//             if (error) {
//                 showToastMessage("Failed to load PDFs", "error");
//                 console.error("Error fetching PDFs:", error);
//                 return;
//             }

//             const sorted = (data as PdfData[]).sort((a, b) => {
//                 const aNum = parseInt(a.image_identifier.split("_")[1]);
//                 const bNum = parseInt(b.image_identifier.split("_")[1]);
//                 return aNum - bNum;
//             });

//             setPdfList(sorted);
//         } catch (error) {
//             showToastMessage("An error occurred while loading PDFs", "error");
//             console.error("Error in fetchPdfs:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchPdfs();
//     }, []);

//     // Upload new PDF
//     const handleAddPdf = async () => {
//         if (!newPdfFile || !newPdfTitle) {
//             showToastMessage("Please provide both a title and PDF file", "error");
//             return;
//         }

//         setIsUploading(true);

//         try {
//             // Upload PDF file
//             const pdfUniqueName = `${uuidv4()}_${newPdfFile.name}`;
//             const { error: pdfError } = await supabase.storage
//                 .from("images")
//                 .upload(pdfUniqueName, newPdfFile);

//             if (pdfError) {
//                 showToastMessage("Failed to upload PDF file", "error");
//                 console.error("Error uploading PDF:", pdfError);
//                 return;
//             }

//             const { data: pdfUrlData } = await supabase.storage.from("images").getPublicUrl(pdfUniqueName);
//             const pdfPublicUrl = pdfUrlData?.publicUrl ?? "";

//             // Upload cover image if provided 
//             let coverUrl = "";
//             if (newCoverPage) {
//                 const coverUniqueName = `${uuidv4()}_${newCoverPage.name}`;
//                 const { error: coverError } = await supabase.storage
//                     .from("images")
//                     .upload(coverUniqueName, newCoverPage);

//                 if (coverError) {
//                     showToastMessage("Failed to upload cover image", "error");
//                     console.error("Error uploading cover page:", coverError);
//                     return;
//                 }

//                 const { data: coverData } = await supabase.storage.from("images").getPublicUrl(coverUniqueName);
//                 coverUrl = coverData?.publicUrl ?? "";
//             }

//             // Save to database
//             const { data, error: insertError } = await supabase
//                 .from("eu_images")
//                 .insert([
//                     {
//                         link: pdfPublicUrl,
//                         section_name: 1,
//                         image_identifier: `b1_${pdfList.length + 1}`,
//                         section_title: newPdfTitle,
//                         page_name: "enride",
//                         cover_page: coverUrl || null,
//                     },
//                 ])
//                 .select();

//             if (insertError) {
//                 showToastMessage("Failed to save PDF information", "error");
//                 console.error("Error inserting PDF:", insertError);
//                 return;
//             }

//             setPdfList((prev) => [
//                 ...prev,
//                 {
//                     id: data?.[0]?.id, // coming from DB auto-gen
//                     link: pdfPublicUrl,
//                     section_name: 1,
//                     image_identifier: `b1_${pdfList.length + 1}`,
//                     section_title: newPdfTitle,
//                     page_name: "enride",
//                     cover_page: coverUrl || undefined,
//                 },
//             ]);

//             resetForm();
//             showToastMessage(`"${newPdfTitle}" uploaded successfully!`, "success");
//         } catch (error) {
//             showToastMessage("Upload process failed", "error");
//             console.error("Upload process failed:", error);
//         } finally {
//             setIsUploading(false);
//         }
//     };

//     // Delete PDF
//     const handleDeletePdf = async (pdf: PdfData) => {
//         if (!confirm(`Delete "${pdf.section_title}"?`)) return;

//         try {
//             // Delete the file from storage
//             const pdfPath = pdf.link.split("/").pop()?.split("?")[0];
//             const coverPath = pdf.cover_page?.split("/").pop()?.split("?")[0];

//             if (pdfPath) await supabase.storage.from("images").remove([pdfPath]);
//             if (coverPath) await supabase.storage.from("images").remove([coverPath]);

//             // Delete from database
//             const { error } = await supabase.from("eu_images").delete().eq("id", pdf.id);
//             if (error) {
//                 showToastMessage("Failed to delete PDF", "error");
//                 console.error("Error deleting entry:", error);
//                 return;
//             }

//             setPdfList((prev) => prev.filter((item) => item.id !== pdf.id));
//             showToastMessage(`"${pdf.section_title}" deleted successfully`, "success");
//         } catch (error) {
//             showToastMessage("Delete process failed", "error");
//             console.error("Error in delete process:", error);
//         }
//     };

//     // Update PDF
//     const handleUpdateImage = async (newLink: string, newTitle: string) => {
//         if (!selectedImageIdentifier) return;

//         try {
//             // First, update in the database
//             const { error } = await supabase
//                 .from("eu_images")
//                 .update({
//                     link: newLink || selectedImageLink,
//                     section_title: newTitle
//                 })
//                 .eq("image_identifier", selectedImageIdentifier);

//             if (error) {
//                 showToastMessage("Failed to update database", "error");
//                 console.error("Error updating database:", error);
//                 return;
//             }

//             // Then update local state
//             const updatedList = pdfList.map((item) =>
//                 item.image_identifier === selectedImageIdentifier
//                     ? { ...item, link: newLink || item.link, section_title: newTitle }
//                     : item
//             );

//             setPdfList(updatedList);
//             handleCloseModal();
//             showToastMessage("PDF updated successfully", "success");
//         } catch (error) {
//             showToastMessage("Failed to update PDF", "error");
//             console.error("Error updating PDF:", error);
//         }
//     };

//     const resetForm = () => {
//         setNewPdfTitle("");
//         setNewPdfFile(null);
//         setNewCoverPage(null);
//         if (pdfInputRef.current) pdfInputRef.current.value = "";
//         if (coverInputRef.current) coverInputRef.current.value = "";
//     };

//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//         setSelectedImageIdentifier(null);
//         setSelectedImageLink("");
//         setSelectedPdfTitle("");
//     };

//     const getPageDimensions = () => {
//         if ((viewportWidth ?? 0) <= 640) return { width: 300, scale: 0.8 };
//         if ((viewportWidth ?? 0) <= 768) return { width: 500, scale: 1 };
//         return { width: 850, scale: 1 };
//     };

//     const { width, scale } = getPageDimensions();

//     return (
//         <div className="flex flex-col px-8 xl:px-32 pt-8 pb-12">
//             <h2 className="text-2xl font-semibold mb-4">Insights</h2>

//             {/* PDF List */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {pdfList.map((pdf, index) => (
//                     <div key={pdf.id} className="group overflow-hidden border shadow-md relative">
//                         <div className="bg-gray-100 h-auto flex justify-center items-center">
//                             {pdf.cover_page ? (
//                                 <Image
//                                     src={pdf.cover_page}
//                                     alt="cover_image"
//                                     width={500}
//                                     height={300}
//                                     className="w-full group-hover:opacity-20"
//                                     style={{ objectFit: 'cover' }}
//                                 />
//                             ) : (
//                                 <Document file={pdf.link} onLoadSuccess={onDocumentLoadSuccess}>
//                                     <div className="flex">
//                                         <Page pageNumber={1} width={width / 2 - 10} renderTextLayer={false} />
//                                         <Page pageNumber={2} width={width / 2 - 10} renderTextLayer={false} />
//                                     </div>
//                                 </Document>
//                             )}
//                             <div className="absolute top-1/2 right-1/2 bg-white bg-opacity-75 rounded-full p-2 opacity-0 group-hover:opacity-100 flex gap-3">
//                                 <Upload
//                                     className="cursor-pointer"
//                                     onClick={() => {
//                                         setIsModalOpen(true);
//                                         setSelectedImageIdentifier(pdf.image_identifier);
//                                         setSelectedImageLink(pdf.link);
//                                         setSelectedPdfTitle(pdf.section_title);
//                                     }}
//                                 />
//                                 <Eye
//                                     className="cursor-pointer"
//                                     onClick={() => setSelectedPdf(pdf)}
//                                 />
//                                 <Delete
//                                     className="text-red-600 cursor-pointer"
//                                     onClick={() => handleDeletePdf(pdf)}
//                                 />
//                             </div>
//                         </div>
//                         <h3 className="p-4 text-lg font-medium">{index + 1}. {pdf.section_title}</h3>
//                     </div>
//                 ))}
//             </div>

//             {/* PDF Viewer Modal*/}
//             {selectedPdf && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//                     <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
//                         <div className="p-4 border-b flex justify-between items-center">
//                             <h2 className="text-xl font-semibold">{selectedPdf.section_title}</h2>
//                             <button onClick={() => setSelectedPdf(null)} className="text-2xl">&times;</button>
//                         </div>
//                         <div className="p-4">
//                             <Document file={selectedPdf.link} onLoadSuccess={onDocumentLoadSuccess}>
//                                 <Page
//                                     pageNumber={pageNumber}
//                                     width={width}
//                                     scale={scale}
//                                     renderTextLayer={false}
//                                 />
//                             </Document>
//                             <div className="flex justify-between items-center p-4 bg-gray-100">
//                                 <button
//                                     className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
//                                     onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
//                                     disabled={pageNumber <= 1}
//                                 >
//                                     Previous
//                                 </button>
//                                 <span>Page {pageNumber} of {numPages || "..."}</span>
//                                 <button
//                                     className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
//                                     onClick={() => setPageNumber((p) => Math.min((numPages || 1), p + 1))}
//                                     disabled={pageNumber >= (numPages || 1)}
//                                 >
//                                     Next
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Add New PDF Section */}
//             <div className="mt-10 space-y-4">
//                 <h2 className="text-xl font-semibold">Add New PDF</h2>

//                 <div className="flex flex-col space-y-2">
//                     <label>Title</label>
//                     <input className="border rounded px-2 py-1" value={newPdfTitle} onChange={(e) => setNewPdfTitle(e.target.value)} />
//                 </div>

//                 <div className="flex flex-col space-y-2">
//                     <label>PDF File</label>
//                     <input ref={pdfInputRef} type="file" accept="application/pdf" onChange={(e) => setNewPdfFile(e.target.files?.[0] || null)} />
//                 </div>

//                 <div className="flex flex-col space-y-2">
//                     <label>Cover Image (Optional)</label>
//                     <input ref={coverInputRef} type="file" accept="image/*" onChange={(e) => setNewCoverPage(e.target.files?.[0] || null)} />
//                 </div>

//                 <div className="flex space-x-4">
//                     <button
//                         className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50 flex items-center justify-center"
//                         disabled={!newPdfFile || !newPdfTitle || isUploading}
//                         onClick={handleAddPdf}
//                     >
//                         {isUploading ? (
//                             <>
//                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                 Uploading...
//                             </>
//                         ) : (
//                             "Upload PDF"
//                         )}
//                     </button>
//                     <button
//                         className="bg-gray-300 text-black px-4 py-2 rounded"
//                         onClick={resetForm}
//                         disabled={(!newPdfFile && !newPdfTitle && !newCoverPage) || isUploading}
//                     >
//                         Cancel
//                     </button>
//                 </div>
//             </div>

//             {/* Modal */}
//             <UpdatePdfModal
//                 isOpen={isModalOpen}
//                 onClose={handleCloseModal}
//                 currentLink={selectedImageLink}
//                 onUpdate={handleUpdateImage}
//                 pdfId={selectedImageIdentifier!}
//                 title={selectedPdfTitle}
//             />
//         </div>
//     );
// }

































// "use client"

// import { useState, useCallback, useEffect, useRef } from "react"
// import { Document, Page, pdfjs } from "react-pdf"
// import { Eye, Upload, Delete, Loader2 } from "lucide-react"
// import UpdatePdfModal from "@/components/UpdatePdfModalEu"
// import Image from "next/image"
// import "react-pdf/dist/esm/Page/AnnotationLayer.css"
// import "react-pdf/dist/esm/Page/TextLayer.css"
// import { useRouter } from "next/navigation"


// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

// interface SEOData {
//   title: string
//   description: string
//   author: string
//   subject: string
//   creator: string
//   keywords: string
//   slug: string
//   canonical_url: string
// }

// interface PdfData {
//   _id: string
//   section_name: number
//   image_identifier: string
//   section_title: string
//   page_name: string
//   cover_page?: string
//   inserted_at: string
//   media: {
//     url: string
//     contentType: string
//     size: number
//   }
//   seo: SEOData
// }

// interface ApiResponse {
//   fromCache: boolean
//   data: PdfData[]
// }
// const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
// export default function Enride() {
//   // API Configuration
//   const API_BASE_URL = `${baseURL}/api/v1`
//     const router = useRouter();

//   const getToken = () => localStorage.getItem("token");

// const handleAuthError = useCallback(() => {
//   localStorage.removeItem("token");
//   router.push("/");
// }, [router]);



//   // State
//   const [pdfList, setPdfList] = useState<PdfData[]>([])
//   const [selectedPdf, setSelectedPdf] = useState<PdfData | null>(null)
//   const [numPages, setNumPages] = useState<number | null>(null)
//   const [pageNumber, setPageNumber] = useState(1)
//   const [viewportWidth, setViewportWidth] = useState<number | null>(null)
//   const [isLoading, setIsLoading] = useState(true)

//   // Uploading state
//   const [newPdfTitle, setNewPdfTitle] = useState("")
//   const [newPdfFile, setNewPdfFile] = useState<File | null>(null)
//   const [newCoverPage, setNewCoverPage] = useState<File | null>(null)
//   const [isUploading, setIsUploading] = useState(false)

//   // SEO Fields State
//   const [seoData, setSeoData] = useState<SEOData>({
//     title: "",
//     description: "",
//     author: "",
//     subject: "",
//     creator: "",
//     keywords: "",
//     slug: "",
//     canonical_url: "",
//   })

//   // Modal update state
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [selectedImageIdentifier, setSelectedImageIdentifier] = useState<string | null>(null)
//   const [selectedPdfTitle, setSelectedPdfTitle] = useState<string>("")
//   const [selectedImageLink, setSelectedImageLink] = useState<string>("")

//   // Toast state
//   const [toast, setToast] = useState<{ visible: boolean; message: string; type: "success" | "error" }>({
//     visible: false,
//     message: "",
//     type: "success",
//   })

//   // Refs
//   const pdfInputRef = useRef<HTMLInputElement>(null)
//   const coverInputRef = useRef<HTMLInputElement>(null)

//   // Resize handling
//   const handleResize = useCallback(() => {
//     if (typeof window !== "undefined") setViewportWidth(window.innerWidth)
//   }, [])

//   useEffect(() => {
//     handleResize()
//     window.addEventListener("resize", handleResize)
//     return () => window.removeEventListener("resize", handleResize)
//   }, [handleResize])

//   // Auto-hide toast after 3 seconds
//   useEffect(() => {
//     if (toast.visible) {
//       const timer = setTimeout(() => {
//         setToast((prev) => ({ ...prev, visible: false }))
//       }, 3000)
//       return () => clearTimeout(timer)
//     }
//   }, [toast.visible])

//   // PDF Load Success
//   const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
//     setNumPages(numPages)
//     setPageNumber(1)
//   }, [])

//   const showToastMessage = (message: string, type: "success" | "error") => {
//     setToast({
//       visible: true,
//       message,
//       type,
//     })
//   }

//   // Fetch PDFs from custom API
// const fetchPdfs = useCallback(async () => {
//   const token = getToken();
//   if (!token) return handleAuthError();
//   setIsLoading(true);

//   try {
//     const response = await fetch(`${API_BASE_URL}/insight-pdf/insights`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const result: ApiResponse = await response.json();

//     if (result.data) {
//       const filteredData = result.data.filter((item) => item.page_name === "enride");

//       const sorted = filteredData.sort((a, b) => {
//         const aNum = Number.parseInt(a.image_identifier.split("_")[1] || "0");
//         const bNum = Number.parseInt(b.image_identifier.split("_")[1] || "0");
//         return aNum - bNum;
//       });

//       setPdfList(sorted);
//     }
//   } catch (error) {
//     showToastMessage("Failed to load PDFs", "error");
//     console.error("Error fetching PDFs:", error);
//   } finally {
//     setIsLoading(false);
//   }
// }, [API_BASE_URL,handleAuthError]); 

// useEffect(() => {
//   fetchPdfs();
// }, [fetchPdfs]);



//   // Upload new PDF using custom API
//   const handleAddPdf = async () => {
//         const token = getToken();
//     if (!token) return handleAuthError();
//     if (!newPdfFile || !newPdfTitle) {
//       showToastMessage("Please provide both a title and PDF file", "error")
//       return
//     }

//     setIsUploading(true)
//     try {
//       const formData = new FormData()

//       // Generate unique image identifier
//       const imageIdentifier = `b1_${Date.now()}`

//       formData.append("page_name", "enride")
//       formData.append("section_name", "1")
//       formData.append("image_identifier", imageIdentifier)
//       formData.append("section_title", newPdfTitle)
//       formData.append("file", newPdfFile)

//       if (newCoverPage) {
//         formData.append("cover_image", newCoverPage)
//       }

//       // Add SEO data as JSON string
//       formData.append("seo", JSON.stringify(seoData))

//       const response = await fetch(`${API_BASE_URL}/insight-pdf/upload-insights-page`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       })

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }

//       // const result = await response.json()

//       // Refresh the PDF list
//       await fetchPdfs()

//       resetForm()
//       showToastMessage(`"${newPdfTitle}" uploaded successfully!`, "success")
//     } catch (error) {
//       showToastMessage("Upload process failed", "error")
//       console.error("Upload process failed:", error)
//     } finally {
//       setIsUploading(false)
//     }
//   }

//   // Delete PDF using custom API
//   const handleDeletePdf = async (pdf: PdfData) => {
//         const token = getToken();
//     if (!token) return handleAuthError();
//     if (!confirm(`Delete "${pdf.section_title}"?`)) return

//     try {
//       const response = await fetch(`${API_BASE_URL}/insight-pdf/delete-insights-page/${pdf.image_identifier}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }

//       setPdfList((prev) => prev.filter((item) => item._id !== pdf._id))
//       showToastMessage(`"${pdf.section_title}" deleted successfully`, "success")
//     } catch (error) {
//       showToastMessage("Delete process failed", "error")
//       console.error("Error in delete process:", error)
//     }
//   }

//   // Update PDF using custom API
//   const handleUpdateImage = async (newLink: string, newTitle: string, newSeoData?: SEOData) => {
//         const token = getToken();
//     if (!token) return handleAuthError();
//     if (!selectedImageIdentifier) return

//     try {
//       const formData = new FormData()

//       const currentPdf = pdfList.find((pdf) => pdf.image_identifier === selectedImageIdentifier)
//       if (!currentPdf) return

//       formData.append("page_name", currentPdf.page_name)
//       formData.append("section_name", currentPdf.section_name.toString())
//       formData.append("image_identifier", selectedImageIdentifier)
//       formData.append("section_title", newTitle)

//       // Add SEO data
//       const seoToUpdate = newSeoData || currentPdf.seo
//       formData.append("seo", JSON.stringify(seoToUpdate))

//       const response = await fetch(`${API_BASE_URL}/insight-pdf/update-insights-page/${selectedImageIdentifier}`, {
//         method: "PATCH",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       })

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }

//       // Refresh the PDF list
//       await fetchPdfs()

//       handleCloseModal()
//       showToastMessage("PDF updated successfully", "success")
//     } catch (error) {
//       showToastMessage("Failed to update PDF", "error")
//       console.error("Error updating PDF:", error)
//     }
//   }

//   const resetForm = () => {
//     setNewPdfTitle("")
//     setNewPdfFile(null)
//     setNewCoverPage(null)
//     setSeoData({
//       title: "",
//       description: "",
//       author: "",
//       subject: "",
//       creator: "",
//       keywords: "",
//       slug: "",
//       canonical_url: "",
//     })
//     if (pdfInputRef.current) pdfInputRef.current.value = ""
//     if (coverInputRef.current) coverInputRef.current.value = ""
//   }

//   const handleCloseModal = () => {
//     setIsModalOpen(false)
//     setSelectedImageIdentifier(null)
//     setSelectedImageLink("")
//     setSelectedPdfTitle("")
//   }

//   const getPageDimensions = () => {
//     if ((viewportWidth ?? 0) <= 640) return { width: 300, scale: 0.8 }
//     if ((viewportWidth ?? 0) <= 768) return { width: 500, scale: 1 }
//     return { width: 850, scale: 1 }
//   }

//   const { width, scale } = getPageDimensions()

//   return (
//     <div className="flex flex-col px-8 xl:px-32 pt-8 pb-12">
//       {/* Toast Notification */}
//       {toast.visible && (
//         <div
//           className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
//             toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
//           }`}
//         >
//           {toast.message}
//         </div>
//       )}

//       <h2 className="text-2xl font-semibold mb-4">Insights</h2>

//       {/* Loading State */}
//       {isLoading && (
//         <div className="flex justify-center items-center py-8">
//           <Loader2 className="h-8 w-8 animate-spin" />
//           <span className="ml-2">Loading PDFs...</span>
//         </div>
//       )}

//       {/* PDF List */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {pdfList.map((pdf, index) => (
//           <div key={pdf._id} className="group overflow-hidden border shadow-md relative">
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
//                 <Document file={pdf.media.url} onLoadSuccess={onDocumentLoadSuccess}>
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
//                     setIsModalOpen(true)
//                     setSelectedImageIdentifier(pdf.image_identifier)
//                     setSelectedImageLink(pdf.media.url)
//                     setSelectedPdfTitle(pdf.section_title)
//                   }}
//                 />
//                 <Eye className="cursor-pointer" onClick={() => setSelectedPdf(pdf)} />
//                 <Delete className="text-red-600 cursor-pointer" onClick={() => handleDeletePdf(pdf)} />
//               </div>
//             </div>
//             <div className="p-4">
//               <h3 className="text-lg font-medium mb-2">
//                 {index + 1}. {pdf.section_title}
//               </h3>
//               {pdf.seo.title && <p className="text-sm text-gray-600 mb-1">SEO Title: {pdf.seo.title}</p>}
//               {pdf.seo.description && <p className="text-sm text-gray-600">Description: {pdf.seo.description}</p>}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* PDF Viewer Modal*/}
//       {selectedPdf && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
//             <div className="p-4 border-b flex justify-between items-center">
//               <h2 className="text-xl font-semibold">{selectedPdf.section_title}</h2>
//               <button onClick={() => setSelectedPdf(null)} className="text-2xl">
//                 &times;
//               </button>
//             </div>
//             <div className="p-4">
//               <Document file={selectedPdf.media.url} onLoadSuccess={onDocumentLoadSuccess}>
//                 <Page pageNumber={pageNumber} width={width} scale={scale} renderTextLayer={false} />
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
//                   onClick={() => setPageNumber((p) => Math.min(numPages || 1, p + 1))}
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
//         </div>

//         {/* File Uploads */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
//           <div className="flex flex-col space-y-2">
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
//         <div className="border-t pt-4">
//           <h3 className="text-lg font-medium mb-4">SEO Information</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="flex flex-col space-y-2">
//               <label className="font-medium">SEO Title</label>
//               <input
//                 className="border rounded px-3 py-2"
//                 value={seoData.title}
//                 onChange={(e) => setSeoData({ ...seoData, title: e.target.value })}
//                 placeholder="Enter SEO title"
//               />
//             </div>
//             <div className="flex flex-col space-y-2">
//               <label className="font-medium">Author</label>
//               <input
//                 className="border rounded px-3 py-2"
//                 value={seoData.author}
//                 onChange={(e) => setSeoData({ ...seoData, author: e.target.value })}
//                 placeholder="Enter author name"
//               />
//             </div>
//             <div className="flex flex-col space-y-2">
//               <label className="font-medium">Subject</label>
//               <input
//                 className="border rounded px-3 py-2"
//                 value={seoData.subject}
//                 onChange={(e) => setSeoData({ ...seoData, subject: e.target.value })}
//                 placeholder="Enter subject"
//               />
//             </div>
//             <div className="flex flex-col space-y-2">
//               <label className="font-medium">Creator</label>
//               <input
//                 className="border rounded px-3 py-2"
//                 value={seoData.creator}
//                 onChange={(e) => setSeoData({ ...seoData, creator: e.target.value })}
//                 placeholder="Enter creator"
//               />
//             </div>
//             <div className="flex flex-col space-y-2">
//               <label className="font-medium">Keywords</label>
//               <input
//                 className="border rounded px-3 py-2"
//                 value={seoData.keywords}
//                 onChange={(e) => setSeoData({ ...seoData, keywords: e.target.value })}
//                 placeholder="Enter keywords (comma separated)"
//               />
//             </div>
//             <div className="flex flex-col space-y-2">
//               <label className="font-medium">Slug</label>
//               <input
//                 className="border rounded px-3 py-2"
//                 value={seoData.slug}
//                 onChange={(e) => setSeoData({ ...seoData, slug: e.target.value })}
//                 placeholder="Enter URL slug"
//               />
//             </div>
//             <div className="flex flex-col space-y-2 md:col-span-2">
//               <label className="font-medium">Description</label>
//               <textarea
//                 className="border rounded px-3 py-2 h-20"
//                 value={seoData.description}
//                 onChange={(e) => setSeoData({ ...seoData, description: e.target.value })}
//                 placeholder="Enter SEO description"
//               />
//             </div>
//             <div className="flex flex-col space-y-2 md:col-span-2">
//               <label className="font-medium">Canonical URL</label>
//               <input
//                 className="border rounded px-3 py-2"
//                 value={seoData.canonical_url}
//                 onChange={(e) => setSeoData({ ...seoData, canonical_url: e.target.value })}
//                 placeholder="Enter canonical URL"
//               />
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
//   )
// }
































"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Eye, Upload, Delete, Loader2 } from "lucide-react"
import UpdatePdfModal from "@/components/UpdatePdfModalEu"
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
  keywords: string
  slug: string
  canonical_url: string
}

interface PdfData {
  _id: string
  section_name: number
  image_identifier: string
  section_title: string
  page_name: string
  cover_page?: string
  inserted_at: string
  media: {
    url: string
    contentType: string
    size: number
  }
  seo: SEOData
}

interface ApiResponse {
  fromCache: boolean
  data: PdfData[]
}
const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
export default function Enride() {
  // API Configuration
  const API_BASE_URL = `${baseURL}/api/v1`
    const router = useRouter();

  const getToken = () => localStorage.getItem("token");

const handleAuthError = useCallback(() => {
  localStorage.removeItem("token");
  router.push("/");
}, [router]);



  // State
  const [pdfList, setPdfList] = useState<PdfData[]>([])
  const [selectedPdf, setSelectedPdf] = useState<PdfData | null>(null)
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [viewportWidth, setViewportWidth] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Uploading state
  const [newPdfTitle, setNewPdfTitle] = useState("")
  const [newPdfFile, setNewPdfFile] = useState<File | null>(null)
  const [newCoverPage, setNewCoverPage] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // SEO Fields State
  const [seoData, setSeoData] = useState<SEOData>({
    title: "",
    description: "",
    author: "",
    subject: "",
    creator: "",
    keywords: "",
    slug: "",
    canonical_url: "",
  })

  // Modal update state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImageIdentifier, setSelectedImageIdentifier] = useState<string | null>(null)
  const [selectedPdfTitle, setSelectedPdfTitle] = useState<string>("")
  const [selectedImageLink, setSelectedImageLink] = useState<string>("")

  // Toast state
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: "success" | "error" }>({
    visible: false,
    message: "",
    type: "success",
  })

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

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }))
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toast.visible])

  // PDF Load Success
  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setPageNumber(1)
  }, [])

  const showToastMessage = (message: string, type: "success" | "error") => {
    setToast({
      visible: true,
      message,
      type,
    })
  }

  // Fetch PDFs from custom API
const fetchPdfs = useCallback(async () => {
  const token = getToken();
  if (!token) return handleAuthError();
  setIsLoading(true);
  try {
    const response = await fetch(`${API_BASE_URL}/insight-pdf/insights`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse = await response.json();

    const filteredData = result.data?.filter(item => item.page_name === "enride") || [];

    const sorted = filteredData.sort((a, b) => {
      const aNum = Number.parseInt(a.image_identifier.split("_")[1] || "0");
      const bNum = Number.parseInt(b.image_identifier.split("_")[1] || "0");
      return aNum - bNum;
    });

    setPdfList(sorted);
  } catch (error) {
    showToastMessage("Failed to load PDFs", "error");
    console.error("Error fetching PDFs:", error);
  } finally {
    setIsLoading(false);
  }
}, [API_BASE_URL, handleAuthError]);

useEffect(() => {
  fetchPdfs();
}, [fetchPdfs]);


  // Upload new PDF using custom API
  const handleAddPdf = async () => {
        const token = getToken();
    if (!token) return handleAuthError();
    if (!newPdfFile || !newPdfTitle) {
      showToastMessage("Please provide both a title and PDF file", "error")
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()

      // Generate unique image identifier
      const imageIdentifier = `b1_${Date.now()}`

      formData.append("page_name", "enride")
      formData.append("section_name", "1")
      formData.append("image_identifier", imageIdentifier)
      formData.append("section_title", newPdfTitle)
      formData.append("file", newPdfFile)

      if (newCoverPage) {
        formData.append("cover_image", newCoverPage)
      }

      // Add SEO data as JSON string
      formData.append("seo", JSON.stringify(seoData))

      const response = await fetch(`${API_BASE_URL}/insight-pdf/upload-insights-page`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      await response.json()

      // Refresh the PDF list
      await fetchPdfs()

      resetForm()
      showToastMessage(`"${newPdfTitle}" uploaded successfully!`, "success")
    } catch (error) {
      showToastMessage("Upload process failed", "error")
      console.error("Upload process failed:", error)
    } finally {
      setIsUploading(false)
    }
  }

  // Delete PDF using custom API
  const handleDeletePdf = async (pdf: PdfData) => {
        const token = getToken();
    if (!token) return handleAuthError();
    if (!confirm(`Delete "${pdf.section_title}"?`)) return

    try {
      const response = await fetch(`${API_BASE_URL}/insight-pdf/delete-insights-page/${pdf.image_identifier}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setPdfList((prev) => prev.filter((item) => item._id !== pdf._id))
      showToastMessage(`"${pdf.section_title}" deleted successfully`, "success")
    } catch (error) {
      showToastMessage("Delete process failed", "error")
      console.error("Error in delete process:", error)
    }
  }

  // Update PDF using custom API
  const handleUpdateImage = async (newLink: string, newTitle: string, newSeoData?: SEOData) => {
        const token = getToken();
    if (!token) return handleAuthError();
    if (!selectedImageIdentifier) return

    try {
      const formData = new FormData()

      const currentPdf = pdfList.find((pdf) => pdf.image_identifier === selectedImageIdentifier)
      if (!currentPdf) return

      formData.append("page_name", currentPdf.page_name)
      formData.append("section_name", currentPdf.section_name.toString())
      formData.append("image_identifier", selectedImageIdentifier)
      formData.append("section_title", newTitle)

      // Add SEO data
      const seoToUpdate = newSeoData || currentPdf.seo
      formData.append("seo", JSON.stringify(seoToUpdate))

      const response = await fetch(`${API_BASE_URL}/insight-pdf/update-insights-page/${selectedImageIdentifier}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Refresh the PDF list
      await fetchPdfs()

      handleCloseModal()
      showToastMessage("PDF updated successfully", "success")
    } catch (error) {
      showToastMessage("Failed to update PDF", "error")
      console.error("Error updating PDF:", error)
    }
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
      keywords: "",
      slug: "",
      canonical_url: "",
    })
    if (pdfInputRef.current) pdfInputRef.current.value = ""
    if (coverInputRef.current) coverInputRef.current.value = ""
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedImageIdentifier(null)
    setSelectedImageLink("")
    setSelectedPdfTitle("")
  }

  const getPageDimensions = () => {
    if ((viewportWidth ?? 0) <= 640) return { width: 300, scale: 0.8 }
    if ((viewportWidth ?? 0) <= 768) return { width: 500, scale: 1 }
    return { width: 850, scale: 1 }
  }

  const { width, scale } = getPageDimensions()

  return (
    <div className="flex flex-col px-8 xl:px-32 pt-8 pb-12">
      {/* Toast Notification */}
      {toast.visible && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
            toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4">Insights</h2>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading PDFs...</span>
        </div>
      )}

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
                    setSelectedImageLink(pdf.media.url)
                    setSelectedPdfTitle(pdf.section_title)
                  }}
                />
                <Eye className="cursor-pointer" onClick={() => setSelectedPdf(pdf)} />
                <Delete className="text-red-600 cursor-pointer" onClick={() => handleDeletePdf(pdf)} />
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium mb-2">
                {index + 1}. {pdf.section_title}
              </h3>
              {pdf.seo.title && <p className="text-sm text-gray-600 mb-1">SEO Title: {pdf.seo.title}</p>}
              {pdf.seo.description && <p className="text-sm text-gray-600">Description: {pdf.seo.description}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* PDF Viewer Modal*/}
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
      <div className="mt-10 space-y-4">
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
        </div>

        {/* File Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="flex flex-col space-y-2">
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
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-4">SEO Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <label className="font-medium">SEO Title</label>
              <input
                className="border rounded px-3 py-2"
                value={seoData.title}
                onChange={(e) => setSeoData({ ...seoData, title: e.target.value })}
                placeholder="Enter SEO title"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-medium">Author</label>
              <input
                className="border rounded px-3 py-2"
                value={seoData.author}
                onChange={(e) => setSeoData({ ...seoData, author: e.target.value })}
                placeholder="Enter author name"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-medium">Subject</label>
              <input
                className="border rounded px-3 py-2"
                value={seoData.subject}
                onChange={(e) => setSeoData({ ...seoData, subject: e.target.value })}
                placeholder="Enter subject"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-medium">Creator</label>
              <input
                className="border rounded px-3 py-2"
                value={seoData.creator}
                onChange={(e) => setSeoData({ ...seoData, creator: e.target.value })}
                placeholder="Enter creator"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-medium">Keywords</label>
              <input
                className="border rounded px-3 py-2"
                value={seoData.keywords}
                onChange={(e) => setSeoData({ ...seoData, keywords: e.target.value })}
                placeholder="Enter keywords (comma separated)"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-medium">Slug</label>
              <input
                className="border rounded px-3 py-2"
                value={seoData.slug}
                onChange={(e) => setSeoData({ ...seoData, slug: e.target.value })}
                placeholder="Enter URL slug"
              />
            </div>
            <div className="flex flex-col space-y-2 md:col-span-2">
              <label className="font-medium">Description</label>
              <textarea
                className="border rounded px-3 py-2 h-20"
                value={seoData.description}
                onChange={(e) => setSeoData({ ...seoData, description: e.target.value })}
                placeholder="Enter SEO description"
              />
            </div>
            <div className="flex flex-col space-y-2 md:col-span-2">
              <label className="font-medium">Canonical URL</label>
              <input
                className="border rounded px-3 py-2"
                value={seoData.canonical_url}
                onChange={(e) => setSeoData({ ...seoData, canonical_url: e.target.value })}
                placeholder="Enter canonical URL"
              />
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

      {/* Modal */}
      <UpdatePdfModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        currentLink={selectedImageLink}
        onUpdate={handleUpdateImage}
        pdfId={selectedImageIdentifier!}
        title={selectedPdfTitle}
      />
    </div>
  )
}
