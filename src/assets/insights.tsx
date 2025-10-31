// "use client"

// import { useState, useCallback, useEffect, useRef } from "react"
// import { Document, Page, pdfjs } from "react-pdf"
// import { supabase } from "@/lib/supabase"
// import { Eye, Upload, Delete, Loader2, Filter, BarChart, PieChart } from "lucide-react"
// import { v4 as uuidv4 } from "uuid"
// import toast from "react-hot-toast"
// import Image from "next/image"

// import "react-pdf/dist/esm/Page/AnnotationLayer.css"
// import "react-pdf/dist/esm/Page/TextLayer.css"

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

// // Initial country lists
// const INITIAL_COUNTRIES = [
//   "Global",
//   "United States",
//   "United Kingdom",
//   "Canada",
//   "Australia",
//   "Germany",
//   "France",
//   "Japan",
//   "China",
//   "India",
//   "Poland",
// ]

// // Define the Insight type
// interface Insight {
//   insights_id: string
//   title: string
//   media_url: string
//   keys: string[]
//   country: string
//   cover_image?: string
//   created_at?: string
// }

// // Modified PdfData interface to align with our display needs
// interface PdfData {
//   id: string
//   link: string
//   "image-identifier": string
//   "section-title": string
//   "cover-page"?: string
//   cover_image?: string
//   keyPoints: string[]
//   country: string
// }

// // Function to fetch insights grouped by country with proper insertion order
// const fetchInsightsGrouped = async (
//   filterCountry?: string,
// ): Promise<{ grouped: Record<string, Insight[]>; insertionOrder: string[] }> => {
//   let query = supabase.from("insights").select("*").order("created_at", { ascending: true })

//   if (filterCountry && filterCountry !== "All") {
//     query = query.eq("country", filterCountry)
//   }

//   const { data, error } = await query

//   if (error) {
//     console.error("Error fetching insights:", error.message)
//     throw error
//   }

//   console.log("Fetched insights data:\n", JSON.stringify(data, null, 2))

//   // Group insights by country and track insertion order based on first occurrence
//   const groupedByCountry: Record<string, Insight[]> = {}
//   const insertionOrder: string[] = []
//   const countryFirstSeen: Record<string, Date> = {}

//   // First pass: determine when each country was first seen
//   data?.forEach((insight: Insight) => {
//     const createdAt = new Date(insight.created_at || Date.now())
//     if (!countryFirstSeen[insight.country] || createdAt < countryFirstSeen[insight.country]) {
//       countryFirstSeen[insight.country] = createdAt
//     }
//   })

//   // Sort countries by their first appearance
//   const sortedCountries = Object.entries(countryFirstSeen)
//     .sort(([, dateA], [, dateB]) => dateA.getTime() - dateB.getTime())
//     .map(([country]) => country)

//   // Second pass: group insights and maintain sorted order
//   data?.forEach((insight: Insight) => {
//     if (!groupedByCountry[insight.country]) {
//       groupedByCountry[insight.country] = []
//     }
//     groupedByCountry[insight.country].push(insight)
//   })

//   // Set insertion order based on sorted countries
//   sortedCountries.forEach((country) => {
//     if (groupedByCountry[country] && groupedByCountry[country].length > 0) {
//       insertionOrder.push(country)
//     }
//   })

//   return { grouped: groupedByCountry, insertionOrder }
// }

// // Function to get unique countries from local storage
// const getStoredCountries = (): string[] => {
//   if (typeof window === "undefined") return INITIAL_COUNTRIES

//   const storedCountries = localStorage.getItem("customCountries")
//   return storedCountries ? JSON.parse(storedCountries) : INITIAL_COUNTRIES
// }

// // Function to save countries to local storage
// const saveCountriesToStorage = (countries: string[]) => {
//   if (typeof window !== "undefined") {
//     localStorage.setItem("customCountries", JSON.stringify(countries))
//   }
// }

// export default function Insights() {
//   // State
//   const [pdfList, setPdfList] = useState<PdfData[]>([])
//   const [groupedInsights, setGroupedInsights] = useState<Record<string, Insight[]>>({})
//   const [selectedPdf, setSelectedPdf] = useState<PdfData | null>(null)
//   const [numPages, setNumPages] = useState<number | null>(null)
//   const [pageNumber, setPageNumber] = useState(1)
//   const [viewportWidth, setViewportWidth] = useState<number | null>(null)
//   const [showCounters, setShowCounters] = useState(true)

//   // Countries state
//   const [countries, setCountries] = useState<string[]>(INITIAL_COUNTRIES)
//   const [countryInsertionOrder, setCountryInsertionOrder] = useState<string[]>([])
//   const [selectedCountry, setSelectedCountry] = useState<string>("All")
//   const [isFilterOpen, setIsFilterOpen] = useState(false)

//   // Uploading state
//   const [newPdfTitle, setNewPdfTitle] = useState("")
//   const [newPdfFile, setNewPdfFile] = useState<File | null>(null)
//   const [newCoverPage, setNewCoverPage] = useState<File | null>(null)
//   const [isUploading, setIsUploading] = useState(false)
//   const [newKeyPoints, setNewKeyPoints] = useState<string[]>(["", ""])
//   const [newCountry, setNewCountry] = useState<string>("Global")

//   // Modal update state
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [selectedImageIdentifier, setSelectedImageIdentifier] = useState<string | null>(null)
//   const [selectedPdfTitle, setSelectedPdfTitle] = useState<string>("")
//   const [selectedImageLink, setSelectedImageLink] = useState<string>("")
//   const [selectedKeyPoints, setSelectedKeyPoints] = useState<string[]>([])
//   const [selectedCountryForEdit, setSelectedCountryForEdit] = useState<string>("")

//   // Custom country support
//   const [useCustomCountry, setUseCustomCountry] = useState(false)
//   const [customCountry, setCustomCountry] = useState("")
//   const [useCustomCountryForEdit, setUseCustomCountryForEdit] = useState(false)
//   const [customCountryForEdit, setCustomCountryForEdit] = useState("")
//   const [isLoading, setIsLoading] = useState(false)

//   // Refs
//   const pdfInputRef = useRef<HTMLInputElement>(null)
//   const coverInputRef = useRef<HTMLInputElement>(null)

//   // Load countries from localStorage on mount
//   useEffect(() => {
//     setCountries(getStoredCountries())
//   }, [])

//   // Resize handling
//   const handleResize = useCallback(() => {
//     if (typeof window !== "undefined") setViewportWidth(window.innerWidth)
//   }, [])

//   useEffect(() => {
//     handleResize()
//     window.addEventListener("resize", handleResize)
//     return () => window.removeEventListener("resize", handleResize)
//   }, [handleResize])

//   // PDF Load Success
//   const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
//     setNumPages(numPages)
//     setPageNumber(1)
//   }, [])

//   const fetchPdfs = async () => {
//     const toastId = toast.loading("Loading insights...")

//     try {
//       const { grouped, insertionOrder } = await fetchInsightsGrouped(
//         selectedCountry !== "All" ? selectedCountry : undefined,
//       )

//       console.log("Insertion order:", insertionOrder)

//       setGroupedInsights(grouped)
//       setCountryInsertionOrder(insertionOrder)

//       const allInsights: PdfData[] = []
//       Object.entries(grouped).forEach(([, insights]) => {
//         insights.forEach((insight) => {
//           allInsights.push({
//             id: insight.insights_id,
//             link: insight.media_url,
//             "image-identifier": insight.insights_id,
//             "section-title": insight.title,
//             "cover-page": insight.cover_image,
//             keyPoints: insight.keys || [],
//             country: insight.country,
//           })
//         })
//       })

//       setPdfList(allInsights)
//       toast.success("Insights loaded successfully")
//     } catch (error) {
//       console.error("❌ Error fetching insights:", error)
//       toast.error("Failed to load insights")
//     } finally {
//       toast.dismiss(toastId)
//     }
//   }

//   useEffect(() => {
//     fetchPdfs()
//   }, [selectedCountry])

//   // Handle key point changes
//   const handleKeyPointChange = (index: number, value: string) => {
//     const updated = [...newKeyPoints]
//     updated[index] = value
//     setNewKeyPoints(updated)
//   }

//   // Add another key point field
//   const addKeyPointField = () => {
//     setNewKeyPoints([...newKeyPoints, ""])
//   }

//   const getInsightStats = () => {
//     const totalInsights = Object.values(groupedInsights).reduce((acc, insights) => acc + insights.length, 0)

//     const countByCountry = countryInsertionOrder
//       .map((country) => ({
//         country,
//         count: groupedInsights[country]?.length || 0,
//         percentage: Math.round(((groupedInsights[country]?.length || 0) / totalInsights) * 100) || 0,
//       }))
//       .filter((item) => item.count > 0)

//     return { totalInsights, countByCountry }
//   }

//   const uploadInsightsData = async () => {
//     if (!newPdfFile || !newPdfTitle) {
//       toast.error("Please provide a title and PDF file")
//       return
//     }

//     const keyPoints = newKeyPoints.filter((point) => point.trim() !== "")
//     const countryToUse = useCustomCountry ? customCountry : newCountry

//     if (useCustomCountry && !customCountry.trim()) {
//       toast.error("Please enter a country name")
//       return
//     }

//     setIsUploading(true)
//     const toastId = toast.loading("Uploading insight...")

//     try {
//       const pdfUniqueName = `insights/${uuidv4()}_${newPdfFile.name}`

//       const { error: pdfError } = await supabase.storage.from("insights-data").upload(pdfUniqueName, newPdfFile)

//       if (pdfError) {
//         console.error("Error uploading PDF:", pdfError)
//         toast.error(`Failed to upload PDF: ${pdfError.message}`)
//         return
//       }

//       const { data: pdfUrlData } = await supabase.storage.from("insights-data").getPublicUrl(pdfUniqueName)
//       const pdfPublicUrl = pdfUrlData?.publicUrl ?? ""

//       let coverUrl = ""
//       if (newCoverPage) {
//         toast.loading("Uploading cover image...", { id: toastId })
//         const coverUniqueName = `insights/${uuidv4()}_${newCoverPage.name}`

//         const { error: coverError } = await supabase.storage.from("insights-data").upload(coverUniqueName, newCoverPage)

//         if (coverError) {
//           console.error("Error uploading cover:", coverError)
//           toast.error(`Failed to upload cover: ${coverError.message}`)
//           return
//         }

//         const { data: coverData } = await supabase.storage.from("insights-data").getPublicUrl(coverUniqueName)
//         coverUrl = coverData?.publicUrl ?? ""
//       }

//       toast.loading("Saving to database...", { id: toastId })

//       const { data, error: insertError } = await supabase
//         .from("insights")
//         .insert([
//           {
//             title: newPdfTitle,
//             media_url: pdfPublicUrl,
//             keys: keyPoints,
//             country: countryToUse,
//             cover_image: coverUrl || null,
//           },
//         ])
//         .select()

//       if (insertError) {
//         console.error("Error inserting insight:", insertError)
//         toast.error(`Failed to save insight: ${insertError.message || "Unknown error"}`)
//         return
//       }

//       const inserted = data?.[0]
//       const newInsight = {
//         id: inserted.insights_id,
//         link: pdfPublicUrl,
//         "image-identifier": inserted.insights_id,
//         "section-title": newPdfTitle,
//         "cover-page": coverUrl || undefined,
//         keyPoints: keyPoints,
//         country: countryToUse,
//       }

//       setPdfList((prev) => [...prev, newInsight])

//       // Update grouped insights and maintain insertion order
//       setGroupedInsights((prev) => {
//         const updated = { ...prev }
//         if (!updated[countryToUse]) {
//           updated[countryToUse] = []
//         }
//         updated[countryToUse].push(inserted)
//         return updated
//       })

//       // Update insertion order - add new country at the end if not present
//       setCountryInsertionOrder((prev) => {
//         if (!prev.includes(countryToUse)) {
//           const newOrder = [...prev, countryToUse]
//           console.log("Updated insertion order:", newOrder)
//           return newOrder
//         }
//         return prev
//       })

//       if (useCustomCountry && customCountry && !countries.includes(customCountry)) {
//         const shouldAdd = window.confirm(
//           `Would you like to add "${customCountry}" to your countries list for future use?`,
//         )
//         if (shouldAdd) {
//           const updatedCountries = [...countries, customCountry]
//           setCountries(updatedCountries)
//           saveCountriesToStorage(updatedCountries)
//           toast.success(`Added "${customCountry}" to countries list`)
//         }
//       }

//       resetForm()
//       toast.success(`"${newPdfTitle}" uploaded successfully!`, { id: toastId })
//     } catch (error) {
//       console.error("Upload process failed:", error)
//       toast.error("Upload process failed")
//     } finally {
//       setIsUploading(false)
//     }
//   }

//   // Delete PDF
//   const handleDeletePdf = async (pdf: PdfData) => {
//     if (!confirm(`Delete "${pdf["section-title"]}"?`)) return

//     const toastId = toast.loading(`Deleting "${pdf["section-title"]}"...`)

//     try {
//       const pdfPath = pdf.link.split("/").pop()?.split("?")[0]
//       const coverPath = pdf["cover-page"]?.split("/").pop()?.split("?")[0]

//       if (pdfPath) await supabase.storage.from("insights-data").remove([`insights/${pdfPath}`])
//       if (coverPath) await supabase.storage.from("insights-data").remove([`insights/${coverPath}`])

//       const { error } = await supabase.from("insights").delete().eq("insights_id", pdf.id)
//       if (error) {
//         console.error("Error deleting entry:", error)
//         toast.error(`Failed to delete insight: ${error.message}`)
//         return
//       }

//       setPdfList((prev) => prev.filter((item) => item.id !== pdf.id))

//       // Update grouped insights and clean up empty countries
//       setGroupedInsights((prev) => {
//         const updated = { ...prev }
//         if (updated[pdf.country]) {
//           updated[pdf.country] = updated[pdf.country].filter((insight) => insight.insights_id !== pdf.id)
//           if (updated[pdf.country].length === 0) {
//             delete updated[pdf.country]
//           }
//         }
//         return updated
//       })

//       // Update insertion order - remove country if no more insights
//       setCountryInsertionOrder((prev) => {
//         const remainingInsights =
//           groupedInsights[pdf.country]?.filter((insight) => insight.insights_id !== pdf.id) || []
//         if (remainingInsights.length === 0) {
//           return prev.filter((country) => country !== pdf.country)
//         }
//         return prev
//       })

//       toast.success(`"${pdf["section-title"]}" deleted successfully`, { id: toastId })
//     } catch (error) {
//       console.error("Error in delete process:", error)
//       toast.error("Delete process failed")
//     }
//   }

//   const handleUpdateInsight = async (
//     newLink: string,
//     newTitle: string,
//     newKeyPoints: string[],
//     newCountry: string,
//     useCustom: boolean,
//     customCountry: string,
//     newPdfFile: File | null,
//     newCoverPage: File | null,
//   ) => {
//     if (!selectedImageIdentifier) return

//     const countryToUse = useCustom ? customCountry : newCountry

//     if (useCustom && !customCountry.trim()) {
//       toast.error("Please enter a country name")
//       return
//     }

//     const toastId = toast.loading("Updating insight information...")
//     setIsUploading(true)

//     try {
//       const insightToUpdate = pdfList.find((item) => item.id === selectedImageIdentifier)
//       const oldCountry = insightToUpdate?.country || ""

//       let pdfPublicUrl = newLink || selectedImageLink
//       let coverUrl = insightToUpdate?.["cover-page"] || ""

//       if (newPdfFile) {
//         toast.loading("Uploading new PDF file...", { id: toastId })
//         const pdfUniqueName = `insights/${uuidv4()}_${newPdfFile.name}`

//         const { error: pdfError } = await supabase.storage.from("insights-data").upload(pdfUniqueName, newPdfFile)

//         if (pdfError) {
//           console.error("Error uploading new PDF:", pdfError)
//           toast.error(`Failed to upload new PDF: ${pdfError.message}`)
//           setIsUploading(false)
//           return
//         }

//         const { data: pdfUrlData } = await supabase.storage.from("insights-data").getPublicUrl(pdfUniqueName)
//         pdfPublicUrl = pdfUrlData?.publicUrl || pdfPublicUrl
//       }

//       if (newCoverPage) {
//         toast.loading("Uploading new cover image...", { id: toastId })
//         const coverUniqueName = `insights/${uuidv4()}_${newCoverPage.name}`

//         const { error: coverError } = await supabase.storage.from("insights-data").upload(coverUniqueName, newCoverPage)

//         if (coverError) {
//           console.error("Error uploading new cover:", coverError)
//           toast.error(`Failed to upload new cover: ${coverError.message}`)
//           setIsUploading(false)
//           return
//         }

//         const { data: coverData } = await supabase.storage.from("insights-data").getPublicUrl(coverUniqueName)
//         coverUrl = coverData?.publicUrl || coverUrl
//       }

//       toast.loading("Saving changes to database...", { id: toastId })
//       const { error } = await supabase
//         .from("insights")
//         .update({
//           title: newTitle,
//           media_url: pdfPublicUrl,
//           keys: newKeyPoints.filter((point) => point.trim() !== ""),
//           country: countryToUse,
//           cover_image: coverUrl,
//         })
//         .eq("insights_id", selectedImageIdentifier)

//       if (error) {
//         console.error("Error updating insight:", error)
//         toast.error(`Failed to update insight: ${error.message}`)
//         setIsUploading(false)
//         return
//       }

//       // Update flat list
//       const updatedList = pdfList.map((item) =>
//         item.id === selectedImageIdentifier
//           ? {
//             ...item,
//             link: pdfPublicUrl,
//             "section-title": newTitle,
//             "cover-page": coverUrl || item["cover-page"],
//             keyPoints: newKeyPoints.filter((point) => point.trim() !== ""),
//             country: countryToUse,
//           }
//           : item,
//       )
//       setPdfList(updatedList)

//       // Update grouped insights with proper country handling
//       setGroupedInsights((prev) => {
//         const updated = { ...prev }

//         // Remove from old group
//         if (updated[oldCountry]) {
//           updated[oldCountry] = updated[oldCountry].filter((insight) => insight.insights_id !== selectedImageIdentifier)
//           if (updated[oldCountry].length === 0) {
//             delete updated[oldCountry]
//           }
//         }

//         // Add to new group
//         if (!updated[countryToUse]) {
//           updated[countryToUse] = []
//         }

//         updated[countryToUse].push({
//           insights_id: selectedImageIdentifier,
//           title: newTitle,
//           media_url: pdfPublicUrl,
//           keys: newKeyPoints.filter((point) => point.trim() !== ""),
//           country: countryToUse,
//           cover_image: coverUrl,
//         })

//         return updated
//       })

//       // Update insertion order when country changes
//       if (oldCountry !== countryToUse) {
//         setCountryInsertionOrder((prev) => {
//           let newOrder = [...prev]

//           // Remove old country if it has no more insights
//           const oldCountryInsights =
//             groupedInsights[oldCountry]?.filter((insight) => insight.insights_id !== selectedImageIdentifier) || []
//           if (oldCountryInsights.length === 0) {
//             newOrder = newOrder.filter((country) => country !== oldCountry)
//           }

//           // Add new country if not present
//           if (!newOrder.includes(countryToUse)) {
//             newOrder.push(countryToUse)
//           }

//           console.log("Updated insertion order after edit:", newOrder)
//           return newOrder
//         })
//       }

//       if (useCustom && customCountry && !countries.includes(customCountry)) {
//         const shouldAdd = window.confirm(
//           `Would you like to add "${customCountry}" to your countries list for future use?`,
//         )
//         if (shouldAdd) {
//           const updatedCountries = [...countries, customCountry]
//           setCountries(updatedCountries)
//           saveCountriesToStorage(updatedCountries)
//           toast.success(`Added "${customCountry}" to countries list`)
//         }
//       }

//       handleCloseModal()
//       toast.success("Insight updated successfully", { id: toastId })
//     } catch (error) {
//       console.error("Error updating insight:", error)
//       toast.error("Failed to update insight")
//     } finally {
//       setIsUploading(false)
//     }
//   }

//   const resetForm = () => {
//     setNewPdfTitle("")
//     setNewPdfFile(null)
//     setNewCoverPage(null)
//     setNewKeyPoints(["", ""])
//     setNewCountry("Global")
//     setUseCustomCountry(false)
//     setCustomCountry("")

//     if (pdfInputRef.current) pdfInputRef.current.value = ""
//     if (coverInputRef.current) coverInputRef.current.value = ""
//   }

//   const handleCloseModal = () => {
//     setIsModalOpen(false)
//     setSelectedImageIdentifier(null)
//     setSelectedImageLink("")
//     setSelectedPdfTitle("")
//     setSelectedKeyPoints([])
//     setSelectedCountryForEdit("")
//     setUseCustomCountryForEdit(false)
//     setCustomCountryForEdit("")
//   }

//   const getPageDimensions = () => {
//     if ((viewportWidth ?? 0) <= 640) return { width: 300, scale: 0.8 }
//     if ((viewportWidth ?? 0) <= 768) return { width: 500, scale: 1 }
//     return { width: 850, scale: 1 }
//   }

//   const { width, scale } = getPageDimensions()

//   return (
//     <div className="flex flex-col px-8 xl:px-32 pt-8 pb-12">
//       <h2 className="text-2xl font-semibold mb-4">EURideshareSeries</h2>

//       {/* Filter Section */}
//       <div className="mb-6 flex items-center flex-wrap gap-2">
//         <button
//           onClick={() => setIsFilterOpen(!isFilterOpen)}
//           className="flex items-center px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
//         >
//           <Filter className="mr-2 h-4 w-4" />
//           Filter by Country
//         </button>

//         {isFilterOpen && (
//           <div className="flex items-center">
//             <label className="mr-2">Country:</label>
//             <select
//               value={selectedCountry}
//               onChange={(e) => setSelectedCountry(e.target.value)}
//               className="border rounded px-2 py-1"
//             >
//               <option value="All">All Countries</option>
//               {countries.map((country) => (
//                 <option key={country} value={country}>
//                   {country}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}
//       </div>

//       {/* Counters Section */}
//       <div className="mb-6">
//         <div className="flex items-center mb-2">
//           <button
//             onClick={() => setShowCounters(!showCounters)}
//             className="flex items-center px-3 py-2 bg-gray-200 text-gray-800 rounded mr-2 hover:bg-gray-300 transition-colors"
//           >
//             {showCounters ? "Hide Stats" : "Show Stats"}
//             {showCounters ? <BarChart className="ml-2 h-4 w-4" /> : <PieChart className="ml-2 h-4 w-4" />}
//           </button>
//           <h3 className="text-lg font-medium">EU Statistics</h3>
//         </div>

//         {showCounters && (
//           <div className="bg-white rounded-lg shadow p-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="bg-blue-50 p-4 rounded-lg">
//                 <h4 className="text-lg font-medium text-blue-700">Total Insights</h4>
//                 <p className="text-3xl font-bold text-blue-800">{getInsightStats().totalInsights}</p>
//               </div>

//               <div className="bg-blue-50 p-4 rounded-lg">
//                 <h4 className="text-lg font-medium text-blue-700">Countries</h4>
//                 <p className="text-3xl font-bold text-blue-800">{countryInsertionOrder.length}</p>
//               </div>
//             </div>

//             {getInsightStats().countByCountry.length > 0 && (
//               <div className="mt-4">
//                 <h4 className="text-lg font-medium mb-2">Distribution by Country (Insertion Order)</h4>
//                 <div className="space-y-2">
//                   {getInsightStats().countByCountry.map(({ country, count, percentage }) => (
//                     <div key={country} className="flex items-center">
//                       <div className="w-32 font-medium truncate">{country}</div>
//                       <div className="flex-1 mx-2">
//                         <div className="bg-gray-200 h-4 rounded-full overflow-hidden">
//                           <div className="bg-blue-500 h-full rounded-full" style={{ width: `${percentage}%` }}></div>
//                         </div>
//                       </div>
//                       <div className="text-sm text-gray-600 w-16 text-right">
//                         {count} ({percentage}%)
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Debug info - remove in production */}
//       <div className="mb-4 p-2 bg-gray-100 rounded text-sm">
//         <strong>Current insertion order:</strong> {countryInsertionOrder.join(" → ")}
//       </div>

//       {/* Insights grouped by country - following insertion order */}
//       {countryInsertionOrder.length > 0 ? (
//         countryInsertionOrder
//           .filter((country) => groupedInsights[country] && groupedInsights[country].length > 0)
//           .map((country, index) => {
//             const insights = groupedInsights[country]
//             return (
//               <div key={country} className="mb-8">
//                 <h3 className="text-xl font-semibold mb-4 bg-gray-100 p-2 rounded flex items-center">
//                   <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
//                     {index + 1}
//                   </span>
//                   {country}
//                   <span className="ml-2 text-sm text-gray-600">({insights.length} insights)</span>
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {insights.map((insight) => {
//                     const pdfItem = pdfList.find((pdf) => pdf.id === insight.insights_id) || {
//                       id: insight.insights_id,
//                       link: insight.media_url,
//                       "image-identifier": insight.insights_id,
//                       "section-title": insight.title,
//                       "cover-page": insight.cover_image,
//                       keyPoints: insight.keys || [],
//                       country: insight.country,
//                     }

//                     return (
//                       <div
//                         key={insight.insights_id}
//                         className="group overflow-hidden border shadow-md relative rounded-lg"
//                       >
//                         <div className="bg-gray-100 h-64 flex justify-center items-center relative">
//                           {pdfItem["cover-page"] ? (
//                             <Image
//                               src={pdfItem["cover-page"] || "/placeholder.svg"}
//                               alt={pdfItem["section-title"]}
//                               fill
//                               className="object-cover group-hover:opacity-20 transition-opacity"
//                             />
//                           ) : (
//                             <Document file={pdfItem.link} onLoadSuccess={onDocumentLoadSuccess}>
//                               <div className="flex">
//                                 <Page pageNumber={1} width={width / 2 - 10} renderTextLayer={false} />
//                                 <Page pageNumber={2} width={width / 2 - 10} renderTextLayer={false} />
//                               </div>
//                             </Document>
//                           )}
//                           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-90 rounded-full p-2 opacity-0 group-hover:opacity-100 flex gap-3 transition-opacity">
//                             <Upload
//                               className="cursor-pointer hover:text-blue-600 transition-colors"
//                               onClick={() => {
//                                 setIsModalOpen(true)
//                                 setSelectedImageIdentifier(insight.insights_id)
//                                 setSelectedImageLink(insight.media_url)
//                                 setSelectedPdfTitle(insight.title)
//                                 setSelectedKeyPoints(insight.keys || [])
//                                 setSelectedCountryForEdit(insight.country)
//                               }}
//                             />

//                             <Eye
//                               className="cursor-pointer hover:text-green-600 transition-colors"
//                               onClick={() => setSelectedPdf(pdfItem)}
//                             />
//                             <Delete
//                               className="text-red-600 cursor-pointer hover:text-red-800 transition-colors"
//                               onClick={() => handleDeletePdf(pdfItem)}
//                             />
//                           </div>
//                         </div>
//                         <div className="p-4">
//                           <h3 className="text-lg font-medium">{insight.title}</h3>

//                           {insight.keys && insight.keys.length > 0 && (
//                             <div className="mt-2 text-sm text-gray-600">
//                               <ul className="list-disc pl-5">
//                                 {insight.keys.slice(0, 2).map((point, i) => (
//                                   <li key={i}>{point}</li>
//                                 ))}
//                                 {insight.keys.length > 2 && (
//                                   <li className="text-blue-500">+{insight.keys.length - 2} more points</li>
//                                 )}
//                               </ul>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     )
//                   })}
//                 </div>
//               </div>
//             )
//           })
//       ) : (
//         <div className="text-center py-8 text-gray-500">
//           {selectedCountry !== "All"
//             ? `No insights found for ${selectedCountry}.`
//             : "No insights found. Add your first insight below!"}
//         </div>
//       )}

//       {/* PDF Viewer Modal */}
//       {selectedPdf && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
//             <div className="p-4 border-b flex justify-between items-center">
//               <div>
//                 <h2 className="text-xl font-semibold">{selectedPdf["section-title"]}</h2>
//                 <div className="flex items-center mt-1">
//                   <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{selectedPdf.country}</span>
//                 </div>
//               </div>
//               <button onClick={() => setSelectedPdf(null)} className="text-2xl hover:text-red-600">
//                 &times;
//               </button>
//             </div>

//             {selectedPdf.keyPoints && selectedPdf.keyPoints.length > 0 && (
//               <div className="p-4 bg-gray-50 border-b">
//                 <h3 className="text-md font-medium mb-2">Key Points:</h3>
//                 <ul className="list-disc pl-5">
//                   {selectedPdf.keyPoints.map((point, i) => (
//                     <li key={i}>{point}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             <div className="p-4">
//               <Document file={selectedPdf.link} onLoadSuccess={onDocumentLoadSuccess}>
//                 <Page pageNumber={pageNumber} width={width} scale={scale} renderTextLayer={false} />
//               </Document>
//             </div>

//             <div className="flex justify-between items-center p-4 bg-gray-100">
//               <button
//                 className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600 transition-colors"
//                 onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
//                 disabled={pageNumber <= 1}
//               >
//                 Previous
//               </button>
//               <span>
//                 Page {pageNumber} of {numPages || "..."}
//               </span>
//               <button
//                 className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600 transition-colors"
//                 onClick={() => setPageNumber((p) => Math.min(numPages || 1, p + 1))}
//                 disabled={pageNumber >= (numPages || 1)}
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add New PDF Section */}
//       <div className="mt-10 space-y-4 bg-white p-6 rounded-lg shadow">
//         <h2 className="text-xl font-semibold">Add New EU Insight</h2>

//         <div className="flex flex-col space-y-2">
//           <label className="font-medium">Title</label>
//           <input
//             className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={newPdfTitle}
//             onChange={(e) => setNewPdfTitle(e.target.value)}
//             placeholder="Insight title"
//           />
//         </div>

//         <div className="flex flex-col space-y-2">
//           <label className="font-medium">Country</label>
//           <div className="flex items-center mb-2">
//             <input
//               type="checkbox"
//               id="use-custom-country"
//               checked={useCustomCountry}
//               onChange={() => {
//                 setUseCustomCountry(!useCustomCountry)
//                 if (useCustomCountry) {
//                   setNewCountry("Global")
//                 } else {
//                   setCustomCountry("")
//                 }
//               }}
//               className="mr-2"
//             />
//             <label htmlFor="use-custom-country" className="text-sm">
//               Enter custom country
//             </label>
//           </div>

//           {useCustomCountry ? (
//             <input
//               className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={customCountry}
//               onChange={(e) => setCustomCountry(e.target.value)}
//               placeholder="Enter country name"
//             />
//           ) : (
//             <select
//               value={newCountry}
//               onChange={(e) => setNewCountry(e.target.value)}
//               className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               {INITIAL_COUNTRIES.map((country) => (
//                 <option key={country} value={country}>
//                   {country}
//                 </option>
//               ))}
//             </select>
//           )}
//         </div>

//         <div className="flex flex-col space-y-2">
//           <label className="font-medium">Key Points</label>
//           {newKeyPoints.map((point, index) => (
//             <input
//               key={index}
//               className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={point}
//               onChange={(e) => handleKeyPointChange(index, e.target.value)}
//               placeholder={`Key point ${index + 1}`}
//             />
//           ))}
//           <button
//             type="button"
//             onClick={addKeyPointField}
//             className="bg-gray-200 text-gray-800 px-4 py-2 mt-2 rounded self-start hover:bg-gray-300 transition-colors"
//           >
//             + Add another key point
//           </button>
//         </div>

//         <div className="flex flex-col space-y-2">
//           <label className="font-medium">PDF File</label>
//           <input
//             ref={pdfInputRef}
//             type="file"
//             accept="application/pdf"
//             onChange={(e) => setNewPdfFile(e.target.files?.[0] || null)}
//             className="border rounded px-3 py-2"
//           />
//         </div>

//         <div className="flex flex-col space-y-2">
//           <label className="font-medium">Cover Image (Optional)</label>
//           <input
//             ref={coverInputRef}
//             type="file"
//             accept="image/*"
//             onChange={(e) => setNewCoverPage(e.target.files?.[0] || null)}
//             className="border rounded px-3 py-2"
//           />
//         </div>

//         <div className="flex space-x-4">
//           <button
//             className="bg-green-500 text-white px-6 py-2 rounded disabled:opacity-50 flex items-center justify-center hover:bg-green-600 transition-colors"
//             disabled={!newPdfFile || !newPdfTitle || isUploading}
//             onClick={uploadInsightsData}
//           >
//             {isUploading ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Uploading...
//               </>
//             ) : (
//               "Upload Insight"
//             )}
//           </button>
//           <button
//             className="bg-gray-300 text-black px-6 py-2 rounded hover:bg-gray-400 transition-colors"
//             onClick={resetForm}
//             disabled={(!newPdfFile && !newPdfTitle && !newCoverPage && newKeyPoints.every((p) => !p)) || isUploading}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>

//       {/* Update Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-auto">
//             <div className="p-4 border-b flex justify-between items-center">
//               <h2 className="text-xl font-semibold">Update EU Insight</h2>
//               <button onClick={handleCloseModal} className="text-2xl hover:text-red-600">
//                 &times;
//               </button>
//             </div>

//             <div className="p-4 space-y-4">
//               <div className="flex flex-col space-y-2">
//                 <label className="font-medium">Title</label>
//                 <input
//                   className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={selectedPdfTitle}
//                   onChange={(e) => setSelectedPdfTitle(e.target.value)}
//                 />
//               </div>

//               <div className="flex flex-col space-y-2">
//                 <label className="font-medium">Country</label>
//                 <div className="flex items-center mb-2">
//                   <input
//                     type="checkbox"
//                     id="use-custom-country-edit"
//                     checked={useCustomCountryForEdit}
//                     onChange={() => {
//                       setUseCustomCountryForEdit(!useCustomCountryForEdit)
//                       if (useCustomCountryForEdit) {
//                         setSelectedCountryForEdit("Global")
//                       } else {
//                         setCustomCountryForEdit("")
//                       }
//                     }}
//                     className="mr-2"
//                   />
//                   <label htmlFor="use-custom-country-edit" className="text-sm">
//                     Enter custom country
//                   </label>
//                 </div>

//                 {useCustomCountryForEdit ? (
//                   <input
//                     className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     value={customCountryForEdit}
//                     onChange={(e) => setCustomCountryForEdit(e.target.value)}
//                     placeholder="Enter country name"
//                   />
//                 ) : (
//                   <select
//                     value={selectedCountryForEdit}
//                     onChange={(e) => setSelectedCountryForEdit(e.target.value)}
//                     className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     {INITIAL_COUNTRIES.map((country) => (
//                       <option key={country} value={country}>
//                         {country}
//                       </option>
//                     ))}
//                   </select>
//                 )}
//               </div>

//               <div className="flex flex-col space-y-2">
//                 <label className="font-medium">Key Points</label>
//                 {selectedKeyPoints.map((point, index) => (
//                   <input
//                     key={index}
//                     className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     value={point}
//                     onChange={(e) => {
//                       const updated = [...selectedKeyPoints]
//                       updated[index] = e.target.value
//                       setSelectedKeyPoints(updated)
//                     }}
//                     placeholder={`Key point ${index + 1}`}
//                   />
//                 ))}
//                 <button
//                   type="button"
//                   onClick={() => setSelectedKeyPoints([...selectedKeyPoints, ""])}
//                   className="bg-gray-200 text-gray-800 px-4 py-2 mt-2 rounded self-start hover:bg-gray-300 transition-colors"
//                 >
//                   + Add another key point
//                 </button>
//               </div>

//               <div className="flex flex-col space-y-2">
//                 <label className="font-medium">Upload New PDF (optional)</label>
//                 <input
//                   type="file"
//                   accept="application/pdf"
//                   onChange={(e) => setNewPdfFile(e.target.files?.[0] || null)}
//                   className="border rounded px-3 py-2"
//                 />
//               </div>

//               <div className="flex flex-col space-y-2">
//                 <label className="font-medium">Upload New Cover Image (optional)</label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => setNewCoverPage(e.target.files?.[0] || null)}
//                   className="border rounded px-3 py-2"
//                 />
//               </div>

//               <div className="flex space-x-4 mt-6">
//                 <button
//                   className={`bg-blue-500 text-white px-6 py-2 rounded flex items-center justify-center hover:bg-blue-600 transition-colors ${isLoading ? "opacity-70 cursor-not-allowed" : ""
//                     }`}
//                   onClick={async () => {
//                     setIsLoading(true)
//                     try {
//                       await handleUpdateInsight(
//                         selectedImageLink,
//                         selectedPdfTitle,
//                         selectedKeyPoints,
//                         selectedCountryForEdit,
//                         useCustomCountryForEdit,
//                         customCountryForEdit,
//                         newPdfFile,
//                         newCoverPage,
//                       )
//                     } catch (error) {
//                       console.error(error)
//                       toast.error("Failed to update insight.")
//                     } finally {
//                       setIsLoading(false)
//                     }
//                   }}
//                   disabled={isLoading}
//                 >
//                   {isLoading ? (
//                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   ) : (
//                     "Update Insight"
//                   )}
//                 </button>

//                 <button
//                   className="bg-gray-300 text-black px-6 py-2 rounded hover:bg-gray-400 transition-colors"
//                   onClick={handleCloseModal}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }





















// "use client"

// import { useState, useCallback, useEffect, useRef } from "react"
// import { Document, Page, pdfjs } from "react-pdf"
// import { Eye, Upload, Delete, Loader2, Filter, BarChart, PieChart } from "lucide-react"
// import toast from "react-hot-toast"
// import Image from "next/image"
// import "react-pdf/dist/esm/Page/AnnotationLayer.css"
// import "react-pdf/dist/esm/Page/TextLayer.css"

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

// // API Configuration
// const API_BASE_URL = "${baseURL}/api/v1/eurideshare-pdf"
// const AUTH_TOKEN ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzBkYjA1NTA5ZDEyYTE2OTkzNTNlOSIsImVtYWlsIjoiZGV2b3BzQGV6cGVkYWwuaW4iLCJpYXQiOjE3NTI5MTc0MzUsImV4cCI6MTc1MjkyMTAzNX0.2krxKdUSmShJl1aws2OKfQn4g3Ri-Z-pLgzGn9kbXuA"

// // Initial country lists
// const INITIAL_COUNTRIES = [
//   "Global",
//   "United States",
//   "United Kingdom",
//   "Canada",
//   "Australia",
//   "Germany",
//   "France",
//   "Japan",
//   "China",
//   "India",
//   "Poland",
// ]

// // Updated Insight interface to match your API response
// interface Insight {
//   _id: string
//   title: string
//   country: string
//   keys: string[]
//   cover_image: string
//   created_at: string
//   media: {
//     url: string
//     contentType: string
//     size: number
//   }
//   seo: {
//     title: string
//     author: string
//     subject: string
//     creator: string
//     description: string
//     keywords: string[]
//     lang: string
//     slug: string
//   }
// }

// // Modified PdfData interface to align with our display needs
// interface PdfData {
//   id: string
//   link: string
//   "image-identifier": string
//   "section-title": string
//   "cover-page"?: string
//   cover_image?: string
//   keyPoints: string[]
//   country: string
// }

// // API Functions
// const apiCall = async (endpoint: string, options: RequestInit = {}) => {
//   const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//     ...options,
//     headers: {
//       ...options.headers,
//     },
//   })

//   if (!response.ok) {
//     throw new Error(`API call failed: ${response.status} ${response.statusText}`)
//   }

//   return response.json()
// }

// const fetchInsightsFromAPI = async (): Promise<Insight[]> => {
//   try {
//     const response = await apiCall("/contries-insights", {
//       method: "POST",
//       body: "",
//     })
//     return response.data || []
//   } catch (error) {
//     console.error("Error fetching insights:", error)
//     throw error
//   }
// }

// const createInsightAPI = async (formData: FormData) => {
//   const response = await fetch(`${API_BASE_URL}/upload-insights`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${AUTH_TOKEN}`,
//     },
//     body: formData,
//   })

//   if (!response.ok) {
//     throw new Error(`Failed to create insight: ${response.status} ${response.statusText}`)
//   }

//   return response.json()
// }

// const updateInsightAPI = async (id: string, formData: FormData) => {
//   const response = await fetch(`${API_BASE_URL}/update-insights/${id}`, {
//     method: "PATCH",
//     headers: {
//       Authorization: `Bearer ${AUTH_TOKEN}`,
//     },
//     body: formData,
//   })

//   if (!response.ok) {
//     throw new Error(`Failed to update insight: ${response.status} ${response.statusText}`)
//   }

//   return response.json()
// }

// const deleteInsightAPI = async (id: string) => {
//   const response = await fetch(`${API_BASE_URL}/delete-insights/${id}`, {
//     method: "DELETE",
//     headers: {
//       Authorization: `Bearer ${AUTH_TOKEN}`,
//     },
//   })

//   if (!response.ok) {
//     throw new Error(`Failed to delete insight: ${response.status} ${response.statusText}`)
//   }

//   return response.json()
// }

// // Function to fetch insights grouped by country with proper insertion order
// const fetchInsightsGrouped = async (
//   filterCountry?: string,
// ): Promise<{ grouped: Record<string, Insight[]>; insertionOrder: string[] }> => {
//   const data = await fetchInsightsFromAPI()

//   console.log("Fetched insights data:\n", JSON.stringify(data, null, 2))

//   // Filter by country if specified
//   const filteredData =
//     filterCountry && filterCountry !== "All" ? data.filter((insight) => insight.country === filterCountry) : data

//   // Group insights by country and track insertion order based on first occurrence
//   const groupedByCountry: Record<string, Insight[]> = {}
//   const insertionOrder: string[] = []
//   const countryFirstSeen: Record<string, Date> = {}

//   // First pass: determine when each country was first seen
//   filteredData.forEach((insight: Insight) => {
//     const createdAt = new Date(insight.created_at || Date.now())
//     if (!countryFirstSeen[insight.country] || createdAt < countryFirstSeen[insight.country]) {
//       countryFirstSeen[insight.country] = createdAt
//     }
//   })

//   // Sort countries by their first appearance
//   const sortedCountries = Object.entries(countryFirstSeen)
//     .sort(([, dateA], [, dateB]) => dateA.getTime() - dateB.getTime())
//     .map(([country]) => country)

//   // Second pass: group insights and maintain sorted order
//   filteredData.forEach((insight: Insight) => {
//     if (!groupedByCountry[insight.country]) {
//       groupedByCountry[insight.country] = []
//     }
//     groupedByCountry[insight.country].push(insight)
//   })

//   // Set insertion order based on sorted countries
//   sortedCountries.forEach((country) => {
//     if (groupedByCountry[country] && groupedByCountry[country].length > 0) {
//       insertionOrder.push(country)
//     }
//   })

//   return { grouped: groupedByCountry, insertionOrder }
// }

// // Function to get unique countries from local storage
// const getStoredCountries = (): string[] => {
//   if (typeof window === "undefined") return INITIAL_COUNTRIES
//   const storedCountries = localStorage.getItem("customCountries")
//   return storedCountries ? JSON.parse(storedCountries) : INITIAL_COUNTRIES
// }

// // Function to save countries to local storage
// const saveCountriesToStorage = (countries: string[]) => {
//   if (typeof window !== "undefined") {
//     localStorage.setItem("customCountries", JSON.stringify(countries))
//   }
// }

// export default function Insights() {
//   // State
//   const [pdfList, setPdfList] = useState<PdfData[]>([])
//   const [groupedInsights, setGroupedInsights] = useState<Record<string, Insight[]>>({})
//   const [selectedPdf, setSelectedPdf] = useState<PdfData | null>(null)
//   const [numPages, setNumPages] = useState<number | null>(null)
//   const [pageNumber, setPageNumber] = useState(1)
//   const [viewportWidth, setViewportWidth] = useState<number | null>(null)
//   const [showCounters, setShowCounters] = useState(true)

//   // Countries state
//   const [countries, setCountries] = useState<string[]>(INITIAL_COUNTRIES)
//   const [countryInsertionOrder, setCountryInsertionOrder] = useState<string[]>([])
//   const [selectedCountry, setSelectedCountry] = useState<string>("All")
//   const [isFilterOpen, setIsFilterOpen] = useState(false)

//   // Uploading state
//   const [newPdfTitle, setNewPdfTitle] = useState("")
//   const [newPdfFile, setNewPdfFile] = useState<File | null>(null)
//   const [newCoverPage, setNewCoverPage] = useState<File | null>(null)
//   const [isUploading, setIsUploading] = useState(false)
//   const [newKeyPoints, setNewKeyPoints] = useState<string[]>(["", ""])
//   const [newCountry, setNewCountry] = useState<string>("Global")

//   // Modal update state
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [selectedImageIdentifier, setSelectedImageIdentifier] = useState<string | null>(null)
//   const [selectedPdfTitle, setSelectedPdfTitle] = useState<string>("")
//   const [selectedImageLink, setSelectedImageLink] = useState<string>("")
//   const [selectedKeyPoints, setSelectedKeyPoints] = useState<string[]>([])
//   const [selectedCountryForEdit, setSelectedCountryForEdit] = useState<string>("")

//   // Custom country support
//   const [useCustomCountry, setUseCustomCountry] = useState(false)
//   const [customCountry, setCustomCountry] = useState("")
//   const [useCustomCountryForEdit, setUseCustomCountryForEdit] = useState(false)
//   const [customCountryForEdit, setCustomCountryForEdit] = useState("")
//   const [isLoading, setIsLoading] = useState(false)

//   // Refs
//   const pdfInputRef = useRef<HTMLInputElement>(null)
//   const coverInputRef = useRef<HTMLInputElement>(null)

//   // Load countries from localStorage on mount
//   useEffect(() => {
//     setCountries(getStoredCountries())
//   }, [])

//   // Resize handling
//   const handleResize = useCallback(() => {
//     if (typeof window !== "undefined") setViewportWidth(window.innerWidth)
//   }, [])

//   useEffect(() => {
//     handleResize()
//     window.addEventListener("resize", handleResize)
//     return () => window.removeEventListener("resize", handleResize)
//   }, [handleResize])

//   // PDF Load Success
//   const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
//     setNumPages(numPages)
//     setPageNumber(1)
//   }, [])

//   const fetchPdfs = async () => {
//     const toastId = toast.loading("Loading insights...")
//     try {
//       const { grouped, insertionOrder } = await fetchInsightsGrouped(
//         selectedCountry !== "All" ? selectedCountry : undefined,
//       )
//       console.log("Insertion order:", insertionOrder)
//       setGroupedInsights(grouped)
//       setCountryInsertionOrder(insertionOrder)

//       const allInsights: PdfData[] = []
//       Object.entries(grouped).forEach(([, insights]) => {
//         insights.forEach((insight) => {
//           allInsights.push({
//             id: insight._id,
//             link: insight.media.url,
//             "image-identifier": insight._id,
//             "section-title": insight.title,
//             "cover-page": insight.cover_image,
//             keyPoints: insight.keys || [],
//             country: insight.country,
//           })
//         })
//       })

//       setPdfList(allInsights)
//       toast.success("Insights loaded successfully")
//     } catch (error) {
//       console.error("❌ Error fetching insights:", error)
//       toast.error("Failed to load insights")
//     } finally {
//       toast.dismiss(toastId)
//     }
//   }

//   useEffect(() => {
//     fetchPdfs()
//   }, [selectedCountry])

//   // Handle key point changes
//   const handleKeyPointChange = (index: number, value: string) => {
//     const updated = [...newKeyPoints]
//     updated[index] = value
//     setNewKeyPoints(updated)
//   }

//   // Add another key point field
//   const addKeyPointField = () => {
//     setNewKeyPoints([...newKeyPoints, ""])
//   }

//   const getInsightStats = () => {
//     const totalInsights = Object.values(groupedInsights).reduce((acc, insights) => acc + insights.length, 0)
//     const countByCountry = countryInsertionOrder
//       .map((country) => ({
//         country,
//         count: groupedInsights[country]?.length || 0,
//         percentage: Math.round(((groupedInsights[country]?.length || 0) / totalInsights) * 100) || 0,
//       }))
//       .filter((item) => item.count > 0)

//     return { totalInsights, countByCountry }
//   }

//   const uploadInsightsData = async () => {
//     if (!newPdfFile || !newPdfTitle) {
//       toast.error("Please provide a title and PDF file")
//       return
//     }

//     const keyPoints = newKeyPoints.filter((point) => point.trim() !== "")
//     const countryToUse = useCustomCountry ? customCountry : newCountry

//     if (useCustomCountry && !customCountry.trim()) {
//       toast.error("Please enter a country name")
//       return
//     }

//     setIsUploading(true)
//     const toastId = toast.loading("Uploading insight...")

//     try {
//       const formData = new FormData()
//       formData.append("title", newPdfTitle)
//       formData.append("country", countryToUse)
//       formData.append("keys", keyPoints.join(","))
//       formData.append("file", newPdfFile)

//       // Create SEO object
//       const seoData = {
//         title: newPdfTitle,
//         description: keyPoints.join(", "),
//         author: "",
//         subject: "",
//         creator: "",
//         keywords: keyPoints.join(","),
//         slug: newPdfTitle.toLowerCase().replace(/\s+/g, "-"),
//         canonical_url: "",
//       }
//       formData.append("seo", JSON.stringify(seoData))

//       if (newCoverPage) {
//         formData.append("cover_image", newCoverPage)
//       }

//       const response = await createInsightAPI(formData)

//       // Refresh the data
//       await fetchPdfs()

//       if (useCustomCountry && customCountry && !countries.includes(customCountry)) {
//         const shouldAdd = window.confirm(
//           `Would you like to add "${customCountry}" to your countries list for future use?`,
//         )
//         if (shouldAdd) {
//           const updatedCountries = [...countries, customCountry]
//           setCountries(updatedCountries)
//           saveCountriesToStorage(updatedCountries)
//           toast.success(`Added "${customCountry}" to countries list`)
//         }
//       }

//       resetForm()
//       toast.success(`"${newPdfTitle}" uploaded successfully!`, { id: toastId })
//     } catch (error) {
//       console.error("Upload process failed:", error)
//       toast.error("Upload process failed")
//     } finally {
//       setIsUploading(false)
//     }
//   }

//   // Delete PDF
//   const handleDeletePdf = async (pdf: PdfData) => {
//     if (!confirm(`Delete "${pdf["section-title"]}"?`)) return

//     const toastId = toast.loading(`Deleting "${pdf["section-title"]}"...`)
//     try {
//       await deleteInsightAPI(pdf.id)

//       // Refresh the data
//       await fetchPdfs()

//       toast.success(`"${pdf["section-title"]}" deleted successfully`, { id: toastId })
//     } catch (error) {
//       console.error("Error in delete process:", error)
//       toast.error("Delete process failed")
//     }
//   }

//   const handleUpdateInsight = async (
//     newLink: string,
//     newTitle: string,
//     newKeyPoints: string[],
//     newCountry: string,
//     useCustom: boolean,
//     customCountry: string,
//     newPdfFile: File | null,
//     newCoverPage: File | null,
//   ) => {
//     if (!selectedImageIdentifier) return

//     const countryToUse = useCustom ? customCountry : newCountry

//     if (useCustom && !customCountry.trim()) {
//       toast.error("Please enter a country name")
//       return
//     }

//     const toastId = toast.loading("Updating insight information...")
//     setIsUploading(true)

//     try {
//       const formData = new FormData()
//       formData.append("title", newTitle)
//       formData.append("country", countryToUse)
//       formData.append("keys", newKeyPoints.filter((point) => point.trim() !== "").join(","))

//       // Create SEO object
//       const seoData = {
//         title: newTitle,
//         description: newKeyPoints.filter((point) => point.trim() !== "").join(", "),
//         author: "",
//         subject: "",
//         creator: "",
//         keywords: newKeyPoints.filter((point) => point.trim() !== "").join(","),
//         slug: newTitle.toLowerCase().replace(/\s+/g, "-"),
//         canonical_url: "",
//       }
//       formData.append("seo", JSON.stringify(seoData))

//       if (newPdfFile) {
//         formData.append("file", newPdfFile)
//       }

//       if (newCoverPage) {
//         formData.append("cover_image", newCoverPage)
//       }

//       await updateInsightAPI(selectedImageIdentifier, formData)

//       // Refresh the data
//       await fetchPdfs()

//       if (useCustom && customCountry && !countries.includes(customCountry)) {
//         const shouldAdd = window.confirm(
//           `Would you like to add "${customCountry}" to your countries list for future use?`,
//         )
//         if (shouldAdd) {
//           const updatedCountries = [...countries, customCountry]
//           setCountries(updatedCountries)
//           saveCountriesToStorage(updatedCountries)
//           toast.success(`Added "${customCountry}" to countries list`)
//         }
//       }

//       handleCloseModal()
//       toast.success("Insight updated successfully", { id: toastId })
//     } catch (error) {
//       console.error("Error updating insight:", error)
//       toast.error("Failed to update insight")
//     } finally {
//       setIsUploading(false)
//     }
//   }

//   const resetForm = () => {
//     setNewPdfTitle("")
//     setNewPdfFile(null)
//     setNewCoverPage(null)
//     setNewKeyPoints(["", ""])
//     setNewCountry("Global")
//     setUseCustomCountry(false)
//     setCustomCountry("")
//     if (pdfInputRef.current) pdfInputRef.current.value = ""
//     if (coverInputRef.current) coverInputRef.current.value = ""
//   }

//   const handleCloseModal = () => {
//     setIsModalOpen(false)
//     setSelectedImageIdentifier(null)
//     setSelectedImageLink("")
//     setSelectedPdfTitle("")
//     setSelectedKeyPoints([])
//     setSelectedCountryForEdit("")
//     setUseCustomCountryForEdit(false)
//     setCustomCountryForEdit("")
//   }

//   const getPageDimensions = () => {
//     if ((viewportWidth ?? 0) <= 640) return { width: 300, scale: 0.8 }
//     if ((viewportWidth ?? 0) <= 768) return { width: 500, scale: 1 }
//     return { width: 850, scale: 1 }
//   }

//   const { width, scale } = getPageDimensions()

//   return (
//     <div className="flex flex-col px-8 xl:px-32 pt-8 pb-12">
//       <h2 className="text-2xl font-semibold mb-4">EURideshareSeries</h2>

//       {/* Filter Section */}
//       <div className="mb-6 flex items-center flex-wrap gap-2">
//         <button
//           onClick={() => setIsFilterOpen(!isFilterOpen)}
//           className="flex items-center px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
//         >
//           <Filter className="mr-2 h-4 w-4" />
//           Filter by Country
//         </button>
//         {isFilterOpen && (
//           <div className="flex items-center">
//             <label className="mr-2">Country:</label>
//             <select
//               value={selectedCountry}
//               onChange={(e) => setSelectedCountry(e.target.value)}
//               className="border rounded px-2 py-1"
//             >
//               <option value="All">All Countries</option>
//               {countries.map((country) => (
//                 <option key={country} value={country}>
//                   {country}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}
//       </div>

//       {/* Counters Section */}
//       <div className="mb-6">
//         <div className="flex items-center mb-2">
//           <button
//             onClick={() => setShowCounters(!showCounters)}
//             className="flex items-center px-3 py-2 bg-gray-200 text-gray-800 rounded mr-2 hover:bg-gray-300 transition-colors"
//           >
//             {showCounters ? "Hide Stats" : "Show Stats"}
//             {showCounters ? <BarChart className="ml-2 h-4 w-4" /> : <PieChart className="ml-2 h-4 w-4" />}
//           </button>
//           <h3 className="text-lg font-medium">EU Statistics</h3>
//         </div>
//         {showCounters && (
//           <div className="bg-white rounded-lg shadow p-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="bg-blue-50 p-4 rounded-lg">
//                 <h4 className="text-lg font-medium text-blue-700">Total Insights</h4>
//                 <p className="text-3xl font-bold text-blue-800">{getInsightStats().totalInsights}</p>
//               </div>
//               <div className="bg-blue-50 p-4 rounded-lg">
//                 <h4 className="text-lg font-medium text-blue-700">Countries</h4>
//                 <p className="text-3xl font-bold text-blue-800">{countryInsertionOrder.length}</p>
//               </div>
//             </div>
//             {getInsightStats().countByCountry.length > 0 && (
//               <div className="mt-4">
//                 <h4 className="text-lg font-medium mb-2">Distribution by Country (Insertion Order)</h4>
//                 <div className="space-y-2">
//                   {getInsightStats().countByCountry.map(({ country, count, percentage }) => (
//                     <div key={country} className="flex items-center">
//                       <div className="w-32 font-medium truncate">{country}</div>
//                       <div className="flex-1 mx-2">
//                         <div className="bg-gray-200 h-4 rounded-full overflow-hidden">
//                           <div className="bg-blue-500 h-full rounded-full" style={{ width: `${percentage}%` }}></div>
//                         </div>
//                       </div>
//                       <div className="text-sm text-gray-600 w-16 text-right">
//                         {count} ({percentage}%)
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Debug info - remove in production */}
//       <div className="mb-4 p-2 bg-gray-100 rounded text-sm">
//         <strong>Current insertion order:</strong> {countryInsertionOrder.join(" → ")}
//       </div>

//       {/* Insights grouped by country - following insertion order */}
//       {countryInsertionOrder.length > 0 ? (
//         countryInsertionOrder
//           .filter((country) => groupedInsights[country] && groupedInsights[country].length > 0)
//           .map((country, index) => {
//             const insights = groupedInsights[country]
//             return (
//               <div key={country} className="mb-8">
//                 <h3 className="text-xl font-semibold mb-4 bg-gray-100 p-2 rounded flex items-center">
//                   <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
//                     {index + 1}
//                   </span>
//                   {country}
//                   <span className="ml-2 text-sm text-gray-600">({insights.length} insights)</span>
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {insights.map((insight) => {
//                     const pdfItem = pdfList.find((pdf) => pdf.id === insight._id) || {
//                       id: insight._id,
//                       link: insight.media.url,
//                       "image-identifier": insight._id,
//                       "section-title": insight.title,
//                       "cover-page": insight.cover_image,
//                       keyPoints: insight.keys || [],
//                       country: insight.country,
//                     }
//                     return (
//                       <div key={insight._id} className="group overflow-hidden border shadow-md relative rounded-lg">
//                         <div className="bg-gray-100 h-64 flex justify-center items-center relative">
//                           {pdfItem["cover-page"] ? (
//                             <Image
//                               src={pdfItem["cover-page"] || "/placeholder.svg"}
//                               alt={pdfItem["section-title"]}
//                               fill
//                               className="object-cover group-hover:opacity-20 transition-opacity"
//                             />
//                           ) : (
//                             <Document file={pdfItem.link} onLoadSuccess={onDocumentLoadSuccess}>
//                               <div className="flex">
//                                 <Page pageNumber={1} width={width / 2 - 10} renderTextLayer={false} />
//                                 <Page pageNumber={2} width={width / 2 - 10} renderTextLayer={false} />
//                               </div>
//                             </Document>
//                           )}
//                           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-90 rounded-full p-2 opacity-0 group-hover:opacity-100 flex gap-3 transition-opacity">
//                             <Upload
//                               className="cursor-pointer hover:text-blue-600 transition-colors"
//                               onClick={() => {
//                                 setIsModalOpen(true)
//                                 setSelectedImageIdentifier(insight._id)
//                                 setSelectedImageLink(insight.media.url)
//                                 setSelectedPdfTitle(insight.title)
//                                 setSelectedKeyPoints(insight.keys || [])
//                                 setSelectedCountryForEdit(insight.country)
//                               }}
//                             />
//                             <Eye
//                               className="cursor-pointer hover:text-green-600 transition-colors"
//                               onClick={() => setSelectedPdf(pdfItem)}
//                             />
//                             <Delete
//                               className="text-red-600 cursor-pointer hover:text-red-800 transition-colors"
//                               onClick={() => handleDeletePdf(pdfItem)}
//                             />
//                           </div>
//                         </div>
//                         <div className="p-4">
//                           <h3 className="text-lg font-medium">{insight.title}</h3>
//                           {insight.keys && insight.keys.length > 0 && (
//                             <div className="mt-2 text-sm text-gray-600">
//                               <ul className="list-disc pl-5">
//                                 {insight.keys.slice(0, 2).map((point, i) => (
//                                   <li key={i}>{point}</li>
//                                 ))}
//                                 {insight.keys.length > 2 && (
//                                   <li className="text-blue-500">+{insight.keys.length - 2} more points</li>
//                                 )}
//                               </ul>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     )
//                   })}
//                 </div>
//               </div>
//             )
//           })
//       ) : (
//         <div className="text-center py-8 text-gray-500">
//           {selectedCountry !== "All"
//             ? `No insights found for ${selectedCountry}.`
//             : "No insights found. Add your first insight below!"}
//         </div>
//       )}

//       {/* PDF Viewer Modal */}
//       {selectedPdf && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
//             <div className="p-4 border-b flex justify-between items-center">
//               <div>
//                 <h2 className="text-xl font-semibold">{selectedPdf["section-title"]}</h2>
//                 <div className="flex items-center mt-1">
//                   <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{selectedPdf.country}</span>
//                 </div>
//               </div>
//               <button onClick={() => setSelectedPdf(null)} className="text-2xl hover:text-red-600">
//                 &times;
//               </button>
//             </div>
//             {selectedPdf.keyPoints && selectedPdf.keyPoints.length > 0 && (
//               <div className="p-4 bg-gray-50 border-b">
//                 <h3 className="text-md font-medium mb-2">Key Points:</h3>
//                 <ul className="list-disc pl-5">
//                   {selectedPdf.keyPoints.map((point, i) => (
//                     <li key={i}>{point}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//             <div className="p-4">
//               <Document file={selectedPdf.link} onLoadSuccess={onDocumentLoadSuccess}>
//                 <Page pageNumber={pageNumber} width={width} scale={scale} renderTextLayer={false} />
//               </Document>
//             </div>
//             <div className="flex justify-between items-center p-4 bg-gray-100">
//               <button
//                 className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600 transition-colors"
//                 onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
//                 disabled={pageNumber <= 1}
//               >
//                 Previous
//               </button>
//               <span>
//                 Page {pageNumber} of {numPages || "..."}
//               </span>
//               <button
//                 className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600 transition-colors"
//                 onClick={() => setPageNumber((p) => Math.min(numPages || 1, p + 1))}
//                 disabled={pageNumber >= (numPages || 1)}
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add New PDF Section */}
//       <div className="mt-10 space-y-4 bg-white p-6 rounded-lg shadow">
//         <h2 className="text-xl font-semibold">Add New EU Insight</h2>
//         <div className="flex flex-col space-y-2">
//           <label className="font-medium">Title</label>
//           <input
//             className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={newPdfTitle}
//             onChange={(e) => setNewPdfTitle(e.target.value)}
//             placeholder="Insight title"
//           />
//         </div>
//         <div className="flex flex-col space-y-2">
//           <label className="font-medium">Country</label>
//           <div className="flex items-center mb-2">
//             <input
//               type="checkbox"
//               id="use-custom-country"
//               checked={useCustomCountry}
//               onChange={() => {
//                 setUseCustomCountry(!useCustomCountry)
//                 if (useCustomCountry) {
//                   setNewCountry("Global")
//                 } else {
//                   setCustomCountry("")
//                 }
//               }}
//               className="mr-2"
//             />
//             <label htmlFor="use-custom-country" className="text-sm">
//               Enter custom country
//             </label>
//           </div>
//           {useCustomCountry ? (
//             <input
//               className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={customCountry}
//               onChange={(e) => setCustomCountry(e.target.value)}
//               placeholder="Enter country name"
//             />
//           ) : (
//             <select
//               value={newCountry}
//               onChange={(e) => setNewCountry(e.target.value)}
//               className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               {INITIAL_COUNTRIES.map((country) => (
//                 <option key={country} value={country}>
//                   {country}
//                 </option>
//               ))}
//             </select>
//           )}
//         </div>
//         <div className="flex flex-col space-y-2">
//           <label className="font-medium">Key Points</label>
//           {newKeyPoints.map((point, index) => (
//             <input
//               key={index}
//               className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={point}
//               onChange={(e) => handleKeyPointChange(index, e.target.value)}
//               placeholder={`Key point ${index + 1}`}
//             />
//           ))}
//           <button
//             type="button"
//             onClick={addKeyPointField}
//             className="bg-gray-200 text-gray-800 px-4 py-2 mt-2 rounded self-start hover:bg-gray-300 transition-colors"
//           >
//             + Add another key point
//           </button>
//         </div>
//         <div className="flex flex-col space-y-2">
//           <label className="font-medium">PDF File</label>
//           <input
//             ref={pdfInputRef}
//             type="file"
//             accept="application/pdf"
//             onChange={(e) => setNewPdfFile(e.target.files?.[0] || null)}
//             className="border rounded px-3 py-2"
//           />
//         </div>
//         <div className="flex flex-col space-y-2">
//           <label className="font-medium">Cover Image (Optional)</label>
//           <input
//             ref={coverInputRef}
//             type="file"
//             accept="image/*"
//             onChange={(e) => setNewCoverPage(e.target.files?.[0] || null)}
//             className="border rounded px-3 py-2"
//           />
//         </div>
//         <div className="flex space-x-4">
//           <button
//             className="bg-green-500 text-white px-6 py-2 rounded disabled:opacity-50 flex items-center justify-center hover:bg-green-600 transition-colors"
//             disabled={!newPdfFile || !newPdfTitle || isUploading}
//             onClick={uploadInsightsData}
//           >
//             {isUploading ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Uploading...
//               </>
//             ) : (
//               "Upload Insight"
//             )}
//           </button>
//           <button
//             className="bg-gray-300 text-black px-6 py-2 rounded hover:bg-gray-400 transition-colors"
//             onClick={resetForm}
//             disabled={(!newPdfFile && !newPdfTitle && !newCoverPage && newKeyPoints.every((p) => !p)) || isUploading}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>

//       {/* Update Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-auto">
//             <div className="p-4 border-b flex justify-between items-center">
//               <h2 className="text-xl font-semibold">Update EU Insight</h2>
//               <button onClick={handleCloseModal} className="text-2xl hover:text-red-600">
//                 &times;
//               </button>
//             </div>
//             <div className="p-4 space-y-4">
//               <div className="flex flex-col space-y-2">
//                 <label className="font-medium">Title</label>
//                 <input
//                   className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={selectedPdfTitle}
//                   onChange={(e) => setSelectedPdfTitle(e.target.value)}
//                 />
//               </div>
//               <div className="flex flex-col space-y-2">
//                 <label className="font-medium">Country</label>
//                 <div className="flex items-center mb-2">
//                   <input
//                     type="checkbox"
//                     id="use-custom-country-edit"
//                     checked={useCustomCountryForEdit}
//                     onChange={() => {
//                       setUseCustomCountryForEdit(!useCustomCountryForEdit)
//                       if (useCustomCountryForEdit) {
//                         setSelectedCountryForEdit("Global")
//                       } else {
//                         setCustomCountryForEdit("")
//                       }
//                     }}
//                     className="mr-2"
//                   />
//                   <label htmlFor="use-custom-country-edit" className="text-sm">
//                     Enter custom country
//                   </label>
//                 </div>
//                 {useCustomCountryForEdit ? (
//                   <input
//                     className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     value={customCountryForEdit}
//                     onChange={(e) => setCustomCountryForEdit(e.target.value)}
//                     placeholder="Enter country name"
//                   />
//                 ) : (
//                   <select
//                     value={selectedCountryForEdit}
//                     onChange={(e) => setSelectedCountryForEdit(e.target.value)}
//                     className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     {INITIAL_COUNTRIES.map((country) => (
//                       <option key={country} value={country}>
//                         {country}
//                       </option>
//                     ))}
//                   </select>
//                 )}
//               </div>
//               <div className="flex flex-col space-y-2">
//                 <label className="font-medium">Key Points</label>
//                 {selectedKeyPoints.map((point, index) => (
//                   <input
//                     key={index}
//                     className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     value={point}
//                     onChange={(e) => {
//                       const updated = [...selectedKeyPoints]
//                       updated[index] = e.target.value
//                       setSelectedKeyPoints(updated)
//                     }}
//                     placeholder={`Key point ${index + 1}`}
//                   />
//                 ))}
//                 <button
//                   type="button"
//                   onClick={() => setSelectedKeyPoints([...selectedKeyPoints, ""])}
//                   className="bg-gray-200 text-gray-800 px-4 py-2 mt-2 rounded self-start hover:bg-gray-300 transition-colors"
//                 >
//                   + Add another key point
//                 </button>
//               </div>
//               <div className="flex flex-col space-y-2">
//                 <label className="font-medium">Upload New PDF (optional)</label>
//                 <input
//                   type="file"
//                   accept="application/pdf"
//                   onChange={(e) => setNewPdfFile(e.target.files?.[0] || null)}
//                   className="border rounded px-3 py-2"
//                 />
//               </div>
//               <div className="flex flex-col space-y-2">
//                 <label className="font-medium">Upload New Cover Image (optional)</label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => setNewCoverPage(e.target.files?.[0] || null)}
//                   className="border rounded px-3 py-2"
//                 />
//               </div>
//               <div className="flex space-x-4 mt-6">
//                 <button
//                   className={`bg-blue-500 text-white px-6 py-2 rounded flex items-center justify-center hover:bg-blue-600 transition-colors ${
//                     isLoading ? "opacity-70 cursor-not-allowed" : ""
//                   }`}
//                   onClick={async () => {
//                     setIsLoading(true)
//                     try {
//                       await handleUpdateInsight(
//                         selectedImageLink,
//                         selectedPdfTitle,
//                         selectedKeyPoints,
//                         selectedCountryForEdit,
//                         useCustomCountryForEdit,
//                         customCountryForEdit,
//                         newPdfFile,
//                         newCoverPage,
//                       )
//                     } catch (error) {
//                       console.error(error)
//                       toast.error("Failed to update insight.")
//                     } finally {
//                       setIsLoading(false)
//                     }
//                   }}
//                   disabled={isLoading}
//                 >
//                   {isLoading ? (
//                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   ) : (
//                     "Update Insight"
//                   )}
//                 </button>
//                 <button
//                   className="bg-gray-300 text-black px-6 py-2 rounded hover:bg-gray-400 transition-colors"
//                   onClick={handleCloseModal}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }



































"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Eye, Upload, Delete, Loader2, Filter, BarChart, PieChart } from "lucide-react"
import toast from "react-hot-toast"
import Image from "next/image"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import "react-pdf/dist/esm/Page/TextLayer.css"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
// API Configuration
const API_BASE_URL = `${baseURL}/api/v1/eurideshare-pdf`


// Initial country lists
const INITIAL_COUNTRIES = [
  "Global",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "China",
  "India",
  "Poland",
]

// Updated Insight interface to match your API response
interface Insight {
  _id: string
  title: string
  country: string
  keys: string[]
  cover_image: string
  created_at: string
  media: {
    url: string
    contentType: string
    size: number
  }
  seo: {
    title: string
    author: string
    subject: string
    creator: string
    description: string
    keywords: string[]
    lang: string
    slug: string
    canonical_url?: string;
  }
}

// Modified PdfData interface to align with our display needs
interface PdfData {
  id: string
  link: string
  "image-identifier": string
  "section-title": string
  "cover-page"?: string
  cover_image?: string
  keyPoints: string[]
  country: string
}

// API Functions
const apiCall = async (endpoint: string, options: RequestInit = {}) => {

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

const fetchInsightsFromAPI = async (): Promise<Insight[]> => {
  try {
    const response = await apiCall("/contries-insights", {
      method: "GET", // Use GET for fetching
    });
    return response.data || [];
  } catch (error) {
    console.error("Error fetching insights:", error);
    throw error;
  }
};


const createInsightAPI = async (formData: FormData) => {
    

  const getToken = () => localStorage.getItem("token");

  const handleAuthError = () => {
    localStorage.removeItem("token");
  };
    const token = getToken();
    if (!token) return handleAuthError();
  const response = await fetch(`${API_BASE_URL}/upload-insights`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Failed to create insight: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

const updateInsightAPI = async (id: string, formData: FormData) => {
   

  const getToken = () => localStorage.getItem("token");

  const handleAuthError = () => {
    localStorage.removeItem("token");
  
  };
    const token = getToken();
    if (!token) return handleAuthError();
  const response = await fetch(`${API_BASE_URL}/update-insights/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Failed to update insight: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

const deleteInsightAPI = async (id: string) => {
 

  const getToken = () => localStorage.getItem("token");

  const handleAuthError = () => {
    localStorage.removeItem("token");

  };
    const token = getToken();
    if (!token) return handleAuthError();
  const response = await fetch(`${API_BASE_URL}/delete-insights/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to delete insight: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// Function to fetch insights grouped by country with proper insertion order
const fetchInsightsGrouped = async (
  filterCountry?: string,
): Promise<{ grouped: Record<string, Insight[]>; insertionOrder: string[] }> => {
  const data = await fetchInsightsFromAPI()

  console.log("Fetched insights data:\n", JSON.stringify(data, null, 2))

  // Filter by country if specified
  const filteredData =
    filterCountry && filterCountry !== "All" ? data.filter((insight) => insight.country === filterCountry) : data

  // Group insights by country and track insertion order based on first occurrence
  const groupedByCountry: Record<string, Insight[]> = {}
  const insertionOrder: string[] = []
  const countryFirstSeen: Record<string, Date> = {}

  // First pass: determine when each country was first seen
  filteredData.forEach((insight: Insight) => {
    const createdAt = new Date(insight.created_at || Date.now())
    if (!countryFirstSeen[insight.country] || createdAt < countryFirstSeen[insight.country]) {
      countryFirstSeen[insight.country] = createdAt
    }
  })

  // Sort countries by their first appearance
  const sortedCountries = Object.entries(countryFirstSeen)
    .sort(([, dateA], [, dateB]) => dateA.getTime() - dateB.getTime())
    .map(([country]) => country)

  // Second pass: group insights and maintain sorted order
  filteredData.forEach((insight: Insight) => {
    if (!groupedByCountry[insight.country]) {
      groupedByCountry[insight.country] = []
    }
    groupedByCountry[insight.country].push(insight)
  })

  // Set insertion order based on sorted countries
  sortedCountries.forEach((country) => {
    if (groupedByCountry[country] && groupedByCountry[country].length > 0) {
      insertionOrder.push(country)
    }
  })

  return { grouped: groupedByCountry, insertionOrder }
}

// Function to get unique countries from local storage
const getStoredCountries = (): string[] => {
  if (typeof window === "undefined") return INITIAL_COUNTRIES
  const storedCountries = localStorage.getItem("customCountries")
  return storedCountries ? JSON.parse(storedCountries) : INITIAL_COUNTRIES
}

// Function to save countries to local storage
const saveCountriesToStorage = (countries: string[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("customCountries", JSON.stringify(countries))
  }
}

export default function Insights() {
  // State
  const [pdfList, setPdfList] = useState<PdfData[]>([])
  const [groupedInsights, setGroupedInsights] = useState<Record<string, Insight[]>>({})
  const [selectedPdf, setSelectedPdf] = useState<PdfData | null>(null)
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [viewportWidth, setViewportWidth] = useState<number | null>(null)
  const [showCounters, setShowCounters] = useState(true)

  // SEO fields state
  const [seoTitle, setSeoTitle] = useState("")
  const [seoDescription, setSeoDescription] = useState("")
  const [seoAuthor, setSeoAuthor] = useState("")
  const [seoSubject, setSeoSubject] = useState("")
  const [seoCreator, setSeoCreator] = useState("")
  const [seoKeywords, setSeoKeywords] = useState("")
  const [seoLang, setSeoLang] = useState("en")
  const [seoSlug, setSeoSlug] = useState("")
  const [seoCanonicalUrl, setSeoCanonicalUrl] = useState("")

  // SEO fields for edit modal
  const [editSeoTitle, setEditSeoTitle] = useState("")
  const [editSeoDescription, setEditSeoDescription] = useState("")
  const [editSeoAuthor, setEditSeoAuthor] = useState("")
  const [editSeoSubject, setEditSeoSubject] = useState("")
  const [editSeoCreator, setEditSeoCreator] = useState("")
  const [editSeoKeywords, setEditSeoKeywords] = useState("")
  const [editSeoLang, setEditSeoLang] = useState("en")
  const [editSeoSlug, setEditSeoSlug] = useState("")
  const [editSeoCanonicalUrl, setEditSeoCanonicalUrl] = useState("")

  // Countries state
  const [countries, setCountries] = useState<string[]>(INITIAL_COUNTRIES)
  const [countryInsertionOrder, setCountryInsertionOrder] = useState<string[]>([])
  const [selectedCountry, setSelectedCountry] = useState<string>("All")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Uploading state
  const [newPdfTitle, setNewPdfTitle] = useState("")
  const [newPdfFile, setNewPdfFile] = useState<File | null>(null)
  const [newCoverPage, setNewCoverPage] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [newKeyPoints, setNewKeyPoints] = useState<string[]>(["", ""])
  const [newCountry, setNewCountry] = useState<string>("Global")

  // Modal update state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImageIdentifier, setSelectedImageIdentifier] = useState<string | null>(null)
  const [selectedPdfTitle, setSelectedPdfTitle] = useState<string>("")
  const [selectedImageLink, setSelectedImageLink] = useState<string>("")
  const [selectedKeyPoints, setSelectedKeyPoints] = useState<string[]>([])
  const [selectedCountryForEdit, setSelectedCountryForEdit] = useState<string>("")

  // Custom country support
  const [useCustomCountry, setUseCustomCountry] = useState(false)
  const [customCountry, setCustomCountry] = useState("")
  const [useCustomCountryForEdit, setUseCustomCountryForEdit] = useState(false)
  const [customCountryForEdit, setCustomCountryForEdit] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Refs
  const pdfInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  // Load countries from localStorage on mount
  useEffect(() => {
    setCountries(getStoredCountries())
  }, [])

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

const fetchPdfs = useCallback(async () => {
  const toastId = toast.loading("Loading insights...");
  try {
    const { grouped, insertionOrder } = await fetchInsightsGrouped(
      selectedCountry !== "All" ? selectedCountry : undefined
    );

    console.log("Insertion order:", insertionOrder);
    setGroupedInsights(grouped);
    setCountryInsertionOrder(insertionOrder);

    const allInsights: PdfData[] = [];
    Object.entries(grouped).forEach(([, insights]) => {
      insights.forEach((insight) => {
        allInsights.push({
          id: insight._id,
          link: insight.media.url,
          "image-identifier": insight._id,
          "section-title": insight.title,
          "cover-page": insight.cover_image,
          keyPoints: insight.keys || [],
          country: insight.country,
        });
      });
    });

    setPdfList(allInsights);
    toast.success("Insights loaded successfully");
  } catch (error) {
    console.error("❌ Error fetching insights:", error);
    toast.error("Failed to load insights");
  } finally {
    toast.dismiss(toastId);
  }
}, [selectedCountry]);

useEffect(() => {
  fetchPdfs();
}, [fetchPdfs]);


  // Handle key point changes
  const handleKeyPointChange = (index: number, value: string) => {
    const updated = [...newKeyPoints]
    updated[index] = value
    setNewKeyPoints(updated)
  }

  // Add another key point field
  const addKeyPointField = () => {
    setNewKeyPoints([...newKeyPoints, ""])
  }

  const getInsightStats = () => {
    const totalInsights = Object.values(groupedInsights).reduce((acc, insights) => acc + insights.length, 0)
    const countByCountry = countryInsertionOrder
      .map((country) => ({
        country,
        count: groupedInsights[country]?.length || 0,
        percentage: Math.round(((groupedInsights[country]?.length || 0) / totalInsights) * 100) || 0,
      }))
      .filter((item) => item.count > 0)

    return { totalInsights, countByCountry }
  }

  const uploadInsightsData = async () => {
    if (!newPdfFile || !newPdfTitle) {
      toast.error("Please provide a title and PDF file")
      return
    }

    const keyPoints = newKeyPoints.filter((point) => point.trim() !== "")
    const countryToUse = useCustomCountry ? customCountry : newCountry

    if (useCustomCountry && !customCountry.trim()) {
      toast.error("Please enter a country name")
      return
    }

    setIsUploading(true)
    const toastId = toast.loading("Uploading insight...")

    try {
      const formData = new FormData()
      formData.append("title", newPdfTitle)
      formData.append("country", countryToUse)
      formData.append("keys", keyPoints.join(","))
      formData.append("file", newPdfFile)

      // Create comprehensive SEO object
      const seoData = {
        title: seoTitle || newPdfTitle,
        description: seoDescription || keyPoints.join(", "),
        author: seoAuthor,
        subject: seoSubject,
        creator: seoCreator,
        keywords: seoKeywords
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k),
        lang: seoLang,
        slug: seoSlug || newPdfTitle.toLowerCase().replace(/\s+/g, "-"),
        canonical_url: seoCanonicalUrl,
        published_time: new Date().toISOString(),
        updated_time: new Date().toISOString(),
      }
      formData.append("seo", JSON.stringify(seoData))

      if (newCoverPage) {
        formData.append("cover_image", newCoverPage)
      }

      await createInsightAPI(formData)

      // Refresh the data
      await fetchPdfs()

      if (useCustomCountry && customCountry && !countries.includes(customCountry)) {
        const shouldAdd = window.confirm(
          `Would you like to add "${customCountry}" to your countries list for future use?`,
        )
        if (shouldAdd) {
          const updatedCountries = [...countries, customCountry]
          setCountries(updatedCountries)
          saveCountriesToStorage(updatedCountries)
          toast.success(`Added "${customCountry}" to countries list`)
        }
      }

      resetForm()
      toast.success(`"${newPdfTitle}" uploaded successfully!`, { id: toastId })
    } catch (error) {
      console.error("Upload process failed:", error)
      toast.error("Upload process failed")
    } finally {
      setIsUploading(false)
    }
  }

  // Delete PDF
  const handleDeletePdf = async (pdf: PdfData) => {
    if (!confirm(`Delete "${pdf["section-title"]}"?`)) return

    const toastId = toast.loading(`Deleting "${pdf["section-title"]}"...`)
    try {
      await deleteInsightAPI(pdf.id)

      // Refresh the data
      await fetchPdfs()

      toast.success(`"${pdf["section-title"]}" deleted successfully`, { id: toastId })
    } catch (error) {
      console.error("Error in delete process:", error)
      toast.error("Delete process failed")
    }
  }

  const handleUpdateInsight = async (
    newLink: string,
    newTitle: string,
    newKeyPoints: string[],
    newCountry: string,
    useCustom: boolean,
    customCountry: string,
    newPdfFile: File | null,
    newCoverPage: File | null,
  ) => {
    if (!selectedImageIdentifier) return

    const countryToUse = useCustom ? customCountry : newCountry

    if (useCustom && !customCountry.trim()) {
      toast.error("Please enter a country name")
      return
    }

    const toastId = toast.loading("Updating insight information...")
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("title", newTitle)
      formData.append("country", countryToUse)
      formData.append("keys", newKeyPoints.filter((point) => point.trim() !== "").join(","))

      // Create comprehensive SEO object for update
      const seoData = {
        title: editSeoTitle || newTitle,
        description: editSeoDescription || newKeyPoints.filter((point) => point.trim() !== "").join(", "),
        author: editSeoAuthor,
        subject: editSeoSubject,
        creator: editSeoCreator,
        keywords: editSeoKeywords
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k),
        lang: editSeoLang,
        slug: editSeoSlug || newTitle.toLowerCase().replace(/\s+/g, "-"),
        canonical_url: editSeoCanonicalUrl,
        updated_time: new Date().toISOString(),
      }
      formData.append("seo", JSON.stringify(seoData))

      if (newPdfFile) {
        formData.append("file", newPdfFile)
      }

      if (newCoverPage) {
        formData.append("cover_image", newCoverPage)
      }

      await updateInsightAPI(selectedImageIdentifier, formData)

      // Refresh the data
      await fetchPdfs()

      if (useCustom && customCountry && !countries.includes(customCountry)) {
        const shouldAdd = window.confirm(
          `Would you like to add "${customCountry}" to your countries list for future use?`,
        )
        if (shouldAdd) {
          const updatedCountries = [...countries, customCountry]
          setCountries(updatedCountries)
          saveCountriesToStorage(updatedCountries)
          toast.success(`Added "${customCountry}" to countries list`)
        }
      }

      handleCloseModal()
      toast.success("Insight updated successfully", { id: toastId })
    } catch (error) {
      console.error("Error updating insight:", error)
      toast.error("Failed to update insight")
    } finally {
      setIsUploading(false)
    }
  }

  const resetForm = () => {
    setNewPdfTitle("")
    setNewPdfFile(null)
    setNewCoverPage(null)
    setNewKeyPoints(["", ""])
    setNewCountry("Global")
    setUseCustomCountry(false)
    setCustomCountry("")

    // Reset SEO fields
    setSeoTitle("")
    setSeoDescription("")
    setSeoAuthor("")
    setSeoSubject("")
    setSeoCreator("")
    setSeoKeywords("")
    setSeoLang("en")
    setSeoSlug("")
    setSeoCanonicalUrl("")

    if (pdfInputRef.current) pdfInputRef.current.value = ""
    if (coverInputRef.current) coverInputRef.current.value = ""
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedImageIdentifier(null)
    setSelectedImageLink("")
    setSelectedPdfTitle("")
    setSelectedKeyPoints([])
    setSelectedCountryForEdit("")
    setUseCustomCountryForEdit(false)
    setCustomCountryForEdit("")

    // Reset edit SEO fields
    setEditSeoTitle("")
    setEditSeoDescription("")
    setEditSeoAuthor("")
    setEditSeoSubject("")
    setEditSeoCreator("")
    setEditSeoKeywords("")
    setEditSeoLang("en")
    setEditSeoSlug("")
    setEditSeoCanonicalUrl("")
  }

  const getPageDimensions = () => {
    if ((viewportWidth ?? 0) <= 640) return { width: 300, scale: 0.8 }
    if ((viewportWidth ?? 0) <= 768) return { width: 500, scale: 1 }
    return { width: 850, scale: 1 }
  }

  const { width, scale } = getPageDimensions()

  return (
    <div className="flex flex-col px-8 xl:px-32 pt-8 pb-12">
      <h2 className="text-2xl font-semibold mb-4">EURideshareSeries</h2>

      {/* Filter Section */}
      <div className="mb-6 flex items-center flex-wrap gap-2">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filter by Country
        </button>
        {isFilterOpen && (
          <div className="flex items-center">
            <label className="mr-2">Country:</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="All">All Countries</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Counters Section */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <button
            onClick={() => setShowCounters(!showCounters)}
            className="flex items-center px-3 py-2 bg-gray-200 text-gray-800 rounded mr-2 hover:bg-gray-300 transition-colors"
          >
            {showCounters ? "Hide Stats" : "Show Stats"}
            {showCounters ? <BarChart className="ml-2 h-4 w-4" /> : <PieChart className="ml-2 h-4 w-4" />}
          </button>
          <h3 className="text-lg font-medium">EU Statistics</h3>
        </div>
        {showCounters && (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-blue-700">Total Insights</h4>
                <p className="text-3xl font-bold text-blue-800">{getInsightStats().totalInsights}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-blue-700">Countries</h4>
                <p className="text-3xl font-bold text-blue-800">{countryInsertionOrder.length}</p>
              </div>
            </div>
            {getInsightStats().countByCountry.length > 0 && (
              <div className="mt-4">
                <h4 className="text-lg font-medium mb-2">Distribution by Country (Insertion Order)</h4>
                <div className="space-y-2">
                  {getInsightStats().countByCountry.map(({ country, count, percentage }) => (
                    <div key={country} className="flex items-center">
                      <div className="w-32 font-medium truncate">{country}</div>
                      <div className="flex-1 mx-2">
                        <div className="bg-gray-200 h-4 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 w-16 text-right">
                        {count} ({percentage}%)
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Debug info - remove in production */}
      <div className="mb-4 p-2 bg-gray-100 rounded text-sm">
        <strong>Current insertion order:</strong> {countryInsertionOrder.join(" → ")}
      </div>

      {/* Insights grouped by country - following insertion order */}
      {countryInsertionOrder.length > 0 ? (
        countryInsertionOrder
          .filter((country) => groupedInsights[country] && groupedInsights[country].length > 0)
          .map((country, index) => {
            const insights = groupedInsights[country]
            return (
              <div key={country} className="mb-8">
                <h3 className="text-xl font-semibold mb-4 bg-gray-100 p-2 rounded flex items-center">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                    {index + 1}
                  </span>
                  {country}
                  <span className="ml-2 text-sm text-gray-600">({insights.length} insights)</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {insights.map((insight) => {
                    const pdfItem = pdfList.find((pdf) => pdf.id === insight._id) || {
                      id: insight._id,
                      link: insight.media.url,
                      "image-identifier": insight._id,
                      "section-title": insight.title,
                      "cover-page": insight.cover_image,
                      keyPoints: insight.keys || [],
                      country: insight.country,
                    }
                    return (
                      <div key={insight._id} className="group overflow-hidden border shadow-md relative rounded-lg">
                        <div className="bg-gray-100 h-64 flex justify-center items-center relative">
                          {pdfItem["cover-page"] ? (
                            <Image
                              src={pdfItem["cover-page"] || "/placeholder.svg"}
                              alt={pdfItem["section-title"]}
                              fill
                              className="object-cover group-hover:opacity-20 transition-opacity"
                            />
                          ) : (
                            <Document file={pdfItem.link} onLoadSuccess={onDocumentLoadSuccess}>
                              <div className="flex">
                                <Page pageNumber={1} width={width / 2 - 10} renderTextLayer={false} />
                                <Page pageNumber={2} width={width / 2 - 10} renderTextLayer={false} />
                              </div>
                            </Document>
                          )}
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-90 rounded-full p-2 opacity-0 group-hover:opacity-100 flex gap-3 transition-opacity">
                            <Upload
                              className="cursor-pointer hover:text-blue-600 transition-colors"
                              onClick={() => {
                                setIsModalOpen(true)
                                setSelectedImageIdentifier(insight._id)
                                setSelectedImageLink(insight.media.url)
                                setSelectedPdfTitle(insight.title)
                                setSelectedKeyPoints(insight.keys || [])
                                setSelectedCountryForEdit(insight.country)

                                // Populate SEO fields if available
                                if (insight.seo) {
                                  setEditSeoTitle(insight.seo.title || "")
                                  setEditSeoDescription(insight.seo.description || "")
                                  setEditSeoAuthor(insight.seo.author || "")
                                  setEditSeoSubject(insight.seo.subject || "")
                                  setEditSeoCreator(insight.seo.creator || "")
                                  setEditSeoKeywords(
                                    Array.isArray(insight.seo.keywords) ? insight.seo.keywords.join(", ") : "",
                                  )
                                  setEditSeoLang(insight.seo.lang || "en")
                                  setEditSeoSlug(insight.seo.slug || "")
                                  setEditSeoCanonicalUrl(insight.seo.canonical_url || "")
                                }
                              }}
                            />
                            <Eye
                              className="cursor-pointer hover:text-green-600 transition-colors"
                              onClick={() => setSelectedPdf(pdfItem)}
                            />
                            <Delete
                              className="text-red-600 cursor-pointer hover:text-red-800 transition-colors"
                              onClick={() => handleDeletePdf(pdfItem)}
                            />
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-medium">{insight.title}</h3>
                          {insight.keys && insight.keys.length > 0 && (
                            <div className="mt-2 text-sm text-gray-600">
                              <ul className="list-disc pl-5">
                                {insight.keys.slice(0, 2).map((point, i) => (
                                  <li key={i}>{point}</li>
                                ))}
                                {insight.keys.length > 2 && (
                                  <li className="text-blue-500">+{insight.keys.length - 2} more points</li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })
      ) : (
        <div className="text-center py-8 text-gray-500">
          {selectedCountry !== "All"
            ? `No insights found for ${selectedCountry}.`
            : "No insights found. Add your first insight below!"}
        </div>
      )}

      {/* PDF Viewer Modal */}
      {selectedPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{selectedPdf["section-title"]}</h2>
                <div className="flex items-center mt-1">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{selectedPdf.country}</span>
                </div>
              </div>
              <button onClick={() => setSelectedPdf(null)} className="text-2xl hover:text-red-600">
                &times;
              </button>
            </div>
            {selectedPdf.keyPoints && selectedPdf.keyPoints.length > 0 && (
              <div className="p-4 bg-gray-50 border-b">
                <h3 className="text-md font-medium mb-2">Key Points:</h3>
                <ul className="list-disc pl-5">
                  {selectedPdf.keyPoints.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="p-4">
              <Document file={selectedPdf.link} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={pageNumber} width={width} scale={scale} renderTextLayer={false} />
              </Document>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-100">
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600 transition-colors"
                onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                disabled={pageNumber <= 1}
              >
                Previous
              </button>
              <span>
                Page {pageNumber} of {numPages || "..."}
              </span>
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600 transition-colors"
                onClick={() => setPageNumber((p) => Math.min(numPages || 1, p + 1))}
                disabled={pageNumber >= (numPages || 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New PDF Section */}
      <div className="mt-10 space-y-4 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold">Add New EU Insight</h2>
        <div className="flex flex-col space-y-2">
          <label className="font-medium">Title</label>
          <input
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newPdfTitle}
            onChange={(e) => setNewPdfTitle(e.target.value)}
            placeholder="Insight title"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="font-medium">Country</label>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="use-custom-country"
              checked={useCustomCountry}
              onChange={() => {
                setUseCustomCountry(!useCustomCountry)
                if (useCustomCountry) {
                  setNewCountry("Global")
                } else {
                  setCustomCountry("")
                }
              }}
              className="mr-2"
            />
            <label htmlFor="use-custom-country" className="text-sm">
              Enter custom country
            </label>
          </div>
          {useCustomCountry ? (
            <input
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={customCountry}
              onChange={(e) => setCustomCountry(e.target.value)}
              placeholder="Enter country name"
            />
          ) : (
            <select
              value={newCountry}
              onChange={(e) => setNewCountry(e.target.value)}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {INITIAL_COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <label className="font-medium">Key Points</label>
          {newKeyPoints.map((point, index) => (
            <input
              key={index}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={point}
              onChange={(e) => handleKeyPointChange(index, e.target.value)}
              placeholder={`Key point ${index + 1}`}
            />
          ))}
          <button
            type="button"
            onClick={addKeyPointField}
            className="bg-gray-200 text-gray-800 px-4 py-2 mt-2 rounded self-start hover:bg-gray-300 transition-colors"
          >
            + Add another key point
          </button>
        </div>
        {/* SEO Fields Section */}
        <div className="flex flex-col space-y-2">
          <label className="font-medium">SEO Information</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-gray-50">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">SEO Title</label>
              <input
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="SEO title (defaults to main title)"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">SEO Description</label>
              <textarea
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="SEO description"
                rows={2}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Author</label>
              <input
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={seoAuthor}
                onChange={(e) => setSeoAuthor(e.target.value)}
                placeholder="Author name"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <input
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={seoSubject}
                onChange={(e) => setSeoSubject(e.target.value)}
                placeholder="Subject"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Creator</label>
              <input
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={seoCreator}
                onChange={(e) => setSeoCreator(e.target.value)}
                placeholder="Creator"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">SEO Keywords</label>
              <input
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Language</label>
              <select
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={seoLang}
                onChange={(e) => setSeoLang(e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
              </select>
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">URL Slug</label>
              <input
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={seoSlug}
                onChange={(e) => setSeoSlug(e.target.value)}
                placeholder="url-slug (auto-generated from title)"
              />
            </div>
            <div className="flex flex-col space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Canonical URL</label>
              <input
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={seoCanonicalUrl}
                onChange={(e) => setSeoCanonicalUrl(e.target.value)}
                placeholder="https://example.com/canonical-url"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <label className="font-medium">PDF File</label>
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
        <div className="flex space-x-4">
          <button
            className="bg-green-500 text-white px-6 py-2 rounded disabled:opacity-50 flex items-center justify-center hover:bg-green-600 transition-colors"
            disabled={!newPdfFile || !newPdfTitle || isUploading}
            onClick={uploadInsightsData}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Insight"
            )}
          </button>
          <button
            className="bg-gray-300 text-black px-6 py-2 rounded hover:bg-gray-400 transition-colors"
            onClick={resetForm}
            disabled={(!newPdfFile && !newPdfTitle && !newCoverPage && newKeyPoints.every((p) => !p)) || isUploading}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Update Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Update EU Insight</h2>
              <button onClick={handleCloseModal} className="text-2xl hover:text-red-600">
                &times;
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="font-medium">Title</label>
                <input
                  className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedPdfTitle}
                  onChange={(e) => setSelectedPdfTitle(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="font-medium">Country</label>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="use-custom-country-edit"
                    checked={useCustomCountryForEdit}
                    onChange={() => {
                      setUseCustomCountryForEdit(!useCustomCountryForEdit)
                      if (useCustomCountryForEdit) {
                        setSelectedCountryForEdit("Global")
                      } else {
                        setCustomCountryForEdit("")
                      }
                    }}
                    className="mr-2"
                  />
                  <label htmlFor="use-custom-country-edit" className="text-sm">
                    Enter custom country
                  </label>
                </div>
                {useCustomCountryForEdit ? (
                  <input
                    className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={customCountryForEdit}
                    onChange={(e) => setCustomCountryForEdit(e.target.value)}
                    placeholder="Enter country name"
                  />
                ) : (
                  <select
                    value={selectedCountryForEdit}
                    onChange={(e) => setSelectedCountryForEdit(e.target.value)}
                    className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {INITIAL_COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <label className="font-medium">Key Points</label>
                {selectedKeyPoints.map((point, index) => (
                  <input
                    key={index}
                    className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={point}
                    onChange={(e) => {
                      const updated = [...selectedKeyPoints]
                      updated[index] = e.target.value
                      setSelectedKeyPoints(updated)
                    }}
                    placeholder={`Key point ${index + 1}`}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => setSelectedKeyPoints([...selectedKeyPoints, ""])}
                  className="bg-gray-200 text-gray-800 px-4 py-2 mt-2 rounded self-start hover:bg-gray-300 transition-colors"
                >
                  + Add another key point
                </button>
              </div>
              {/* SEO Fields Section for Edit */}
              <div className="flex flex-col space-y-2">
                <label className="font-medium">SEO Information</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-gray-50">
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium">SEO Title</label>
                    <input
                      className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editSeoTitle}
                      onChange={(e) => setEditSeoTitle(e.target.value)}
                      placeholder="SEO title"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium">SEO Description</label>
                    <textarea
                      className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editSeoDescription}
                      onChange={(e) => setEditSeoDescription(e.target.value)}
                      placeholder="SEO description"
                      rows={2}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium">Author</label>
                    <input
                      className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editSeoAuthor}
                      onChange={(e) => setEditSeoAuthor(e.target.value)}
                      placeholder="Author name"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <input
                      className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editSeoSubject}
                      onChange={(e) => setEditSeoSubject(e.target.value)}
                      placeholder="Subject"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium">Creator</label>
                    <input
                      className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editSeoCreator}
                      onChange={(e) => setEditSeoCreator(e.target.value)}
                      placeholder="Creator"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium">SEO Keywords</label>
                    <input
                      className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editSeoKeywords}
                      onChange={(e) => setEditSeoKeywords(e.target.value)}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium">Language</label>
                    <select
                      className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editSeoLang}
                      onChange={(e) => setEditSeoLang(e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="it">Italian</option>
                      <option value="pt">Portuguese</option>
                    </select>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium">URL Slug</label>
                    <input
                      className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editSeoSlug}
                      onChange={(e) => setEditSeoSlug(e.target.value)}
                      placeholder="url-slug"
                    />
                  </div>
                  <div className="flex flex-col space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Canonical URL</label>
                    <input
                      className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editSeoCanonicalUrl}
                      onChange={(e) => setEditSeoCanonicalUrl(e.target.value)}
                      placeholder="https://example.com/canonical-url"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <label className="font-medium">Upload New PDF (optional)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setNewPdfFile(e.target.files?.[0] || null)}
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="font-medium">Upload New Cover Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewCoverPage(e.target.files?.[0] || null)}
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex space-x-4 mt-6">
                <button
                  className={`bg-blue-500 text-white px-6 py-2 rounded flex items-center justify-center hover:bg-blue-600 transition-colors ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  onClick={async () => {
                    setIsLoading(true)
                    try {
                      await handleUpdateInsight(
                        selectedImageLink,
                        selectedPdfTitle,
                        selectedKeyPoints,
                        selectedCountryForEdit,
                        useCustomCountryForEdit,
                        customCountryForEdit,
                        newPdfFile,
                        newCoverPage,
                        
                      )
                    } catch (error) {
                      console.error(error)
                      toast.error("Failed to update insight.")
                    } finally {
                      setIsLoading(false)
                    }
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Update Insight"
                  )}
                </button>
                <button
                  className="bg-gray-300 text-black px-6 py-2 rounded hover:bg-gray-400 transition-colors"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
