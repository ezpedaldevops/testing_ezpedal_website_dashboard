// "use client";

// import { useEffect, useState, useRef } from "react";
// import Image, { StaticImageData } from "next/image";
// // import { supabase } from "@/lib/supabase";
// import UpdateImageModal from "@/components/UpdateImageModal";
// import { PlusCircle, Trash, Upload } from "lucide-react";
// import { v4 as uuid4 } from "uuid"
// import { convertFileToWebP } from "@/lib/utils";

// interface GalleryImage {
//   id: string;
//   src: StaticImageData | string;
//   alt: string;
//   width: number;
//   height: number;
// }

// interface GallerySection {
//   id: string;
//   title: string;
//   images: GalleryImage[];
// }

// export default function Gallery() {
//   const [images, setImages] = useState<GallerySection[]>([]);
//   const [newSectionTitle, setNewSectionTitle] = useState("");
//   const [newSectionImages, setNewSectionImages] = useState<File[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedImageIdentifier, setSelectedImageIdentifier] = useState<string | null>(null);
//   const [selectedImageLink, setSelectedImageLink] = useState<string | StaticImageData>("");
//   const fileRef = useRef<HTMLInputElement>(null);
//   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<{
//     isOpen: boolean;
//     sectionId: string | null;
//     imageId: string | null;
//   }>({
//     isOpen: false,
//     sectionId: null,
//     imageId: null
//   });


//   useEffect(() => {
//     setIsConfirmModalOpen({ isOpen: false, sectionId: null, imageId: null });
//   }, []);

//   // const fetchImages = async () => {
//   //   const { data, error } = await supabase
//   //     .from("website-images")
//   //     .select("*")
//   //     .eq("page-name", "gallery");

//   //   if (error) {
//   //     console.error("Error fetching images:", error);
//   //   } else if (data) {
//   //     const sections = data.reduce(
//   //       (acc: Record<string, GallerySection>, image: { id: number; link: string | StaticImageData; "image-identifier": string; "section-name": string; "section-title": string }) => {
//   //         const sectionId = image["section-name"];
//   //         if (!acc[sectionId]) {
//   //           acc[sectionId] = {
//   //             id: sectionId,
//   //             title: image["section-title"], // Default title from section-name, can be updated later
//   //             images: [],
//   //           };
//   //         }
//   //         acc[sectionId].images.push({
//   //           id: image["image-identifier"],
//   //           src: image.link,
//   //           alt: image["image-identifier"],
//   //           width: 1920,
//   //           height: 1080,
//   //         });
//   //         return acc;
//   //       },
//   //       {}
//   //     );

//   //     // Sort images by `image-identifier` in each section
//   //     Object.values(sections).forEach((section) => {
//   //       (section as GallerySection).images.sort((a, b) => {
//   //         const aNumber = parseInt(a.alt.split('_')[1], 10); // Extract the image number
//   //         const bNumber = parseInt(b.alt.split('_')[1], 10); // Extract the image number
//   //         return aNumber - bNumber;
//   //       });
//   //     });
//   //     setImages(Object.values(sections));
//   //   }
//   // };

//   // useEffect(() => {
//   //   fetchImages();
//   // }, []);

//   // const handleImageDelete = async (sectionId: string, imageId: string) => {
//   //   console.log("sectionId for delete image", sectionId)
//   //   console.log("imageId", imageId)
//   //   const section = images.find((section) => section.id === sectionId);
//   //   if (!section) {
//   //     return;
//   //   }

//   //   const image = section.images.find((img) => img.id === imageId);
//   //   if (!image) {
//   //     return;
//   //   }

//   //   try {

//   //     const { error: deleteError } = await supabase.storage.from("images").remove([`${image.src.toString().split('images')[1].substring(1).replace(/%20/g, ' ')}`]);
//   //     if (deleteError) {
//   //       console.error("Error deleting image:", deleteError);
//   //       return;
//   //     }

//   //     const { error } = await supabase.from("website-images").delete().eq("image-identifier", imageId);
//   //     if (error) {
//   //       console.error("Error deleting image:", error);
//   //       return;
//   //     }

//   //     setImages((prevSections) =>
//   //       prevSections
//   //         .map((section) =>
//   //           section.id === sectionId
//   //             ? {
//   //               ...section,
//   //               images: section.images.filter((img) => img.id !== imageId),
//   //             }
//   //             : section
//   //         )
//   //         .filter((section) => section.images.length > 0) // filter out sections with no images
//   //     );

//   //   } catch (error) {
//   //     console.error("Error deleting image:", error);
//   //   }
//   // }

//   // const handleSectionDelete = async (sectionId: string) => {
//   //   const section = images.find((section) => section.id === sectionId);
//   //   if (!section) {
//   //     return;
//   //   }

//   //   try {

//   //     // Delete all images in the section
//   //     for (const image of section.images) {
//   //       const { error: deleteError } = await supabase.storage.from("images").remove([
//   //         `${image.src.toString().split('images')[1].substring(1).replace(/%20/g, ' ')}`,
//   //       ]);
//   //       if (deleteError) {
//   //         console.error("Error deleting image:", deleteError);
//   //         return;
//   //       }
//   //     }

//   //     const { error } = await supabase.from("website-images").delete().eq("section-name", sectionId);
//   //     if (error) {
//   //       console.error("Error deleting section:", error);
//   //       return;
//   //     }

//   //     setImages((prevSections) =>
//   //       prevSections.filter((section) => section.id !== sectionId)
//   //     );
//   //   } catch (error) {
//   //     console.error("Error deleting section:", error);
//   //   }
//   // }

//   // const handleAddNewSection = async () => {
//   //   if (newSectionTitle && newSectionImages.length > 0) {
//   //     // Iterate over all selected images
//   //     for (const newSectionImage of newSectionImages) {
//   //       const fileName = `${uuid4()}_${newSectionImage.name.split(".")[0]}.webp`;

//   //       // convert the images to webp format
//   //       const webpFile = await convertFileToWebP(newSectionImage) ?? newSectionImage;


//   //       const { error: uploadError } = await supabase.storage
//   //         .from("images")
//   //         .upload(fileName, webpFile);

//   //       if (uploadError) {
//   //         console.error("Upload error:", uploadError);
//   //         continue; // Skip this image and move to the next one
//   //       }

//   //       const { data: { publicUrl } } = supabase.storage
//   //         .from("images")
//   //         .getPublicUrl(`${fileName}`);

//   //       if (!publicUrl) {
//   //         console.error("URL generation error:");
//   //         continue; // Skip this image and move to the next one
//   //       }

//   //       const { error: dbError } = await supabase.from("website-images").insert({
//   //         link: publicUrl,
//   //         "image-identifier": `g${images.length + 1}_${newSectionImages.indexOf(newSectionImage) + 1}`,
//   //         "section-name": images.length + 1,
//   //         "section-title": newSectionTitle,
//   //         "page-name": "gallery",
//   //       });

//   //       // console.log({
//   //       //   name: fileName,
//   //       //   link: "abc@123.com",
//   //       //   "image-identifier": `g${images.length + 1}_${newSectionImages.indexOf(newSectionImage) + 1}`,
//   //       //   "section-name": newSectionTitle,
//   //       //   "page-name": "gallery",
//   //       // })

//   //       if (dbError) {
//   //         console.error("Database error:", dbError);
//   //         continue; // Log the error but proceed with other images
//   //       }
//   //     }

//   //     // Clear the form fields after successful upload
//   //     setNewSectionTitle("");
//   //     setNewSectionImages([]); // Clear all selected images
//   //     if (fileRef.current) {
//   //       fileRef.current.value = ''
//   //     }
//   //     setImages((prev) => {
//   //       return [
//   //         ...prev,
//   //         {
//   //           id: (prev.length + 1).toString(),
//   //           title: newSectionTitle,
//   //           images: newSectionImages.map((img, index) => ({
//   //             id: `g${prev.length + 1}_${index + 1}`,
//   //             src: URL.createObjectURL(img),
//   //             alt: `g${prev.length + 1}_${index + 1}`,
//   //             width: 1920,
//   //             height: 1080,
//   //           })),
//   //         },
//   //       ];
//   //     })
//   //   }
//   // };

//   // const handleAddNewImageInSection = async (sectionId: string, newImage: File) => {
//   //   const fileName = `${uuid4()}_${newImage.name.split(".")[0]}.webp`;

//   //   // convert the images to webp format
//   //   const webpFile = await convertFileToWebP(newImage) ?? newImage;

//   //   const { error: uploadError } = await supabase.storage
//   //     .from("images")
//   //     .upload(fileName, webpFile);

//   //   if (uploadError) {
//   //     console.error("Upload error:", uploadError);
//   //     return;
//   //   }

//   //   const { data: { publicUrl } } = supabase.storage
//   //     .from("images")
//   //     .getPublicUrl(`${fileName}`);

//   //   if (!publicUrl) {
//   //     console.error("URL generation error:");
//   //     return;
//   //   }

//   //   const { error } = await supabase.from("website-images").insert({
//   //     link: publicUrl,
//   //     "image-identifier": `g${sectionId}_${(images.find((section) => section.id === sectionId)?.images.length ?? 0) + 1}`,
//   //     "section-name": sectionId,
//   //     "section-title": images.find((section) => section.id === sectionId)?.title,
//   //     "page-name": "gallery",
//   //   });

//   //   if (error) {
//   //     console.error("Database error:", error);
//   //     return;
//   //   }


//   //   setImages((prevSections) =>
//   //     prevSections.map((section) =>
//   //       section.id === sectionId
//   //         ? {
//   //           ...section,
//   //           images: [
//   //             ...section.images,
//   //             {
//   //               id: `g${sectionId}_${section.images.length + 1}`,
//   //               src: URL.createObjectURL(newImage),
//   //               alt: `g${sectionId}_${section.images.length + 1}`,
//   //               width: 1920,
//   //               height: 1080,
//   //             },
//   //           ],
//   //         }
//   //         : section
//   //     )
//   //   );
//   // }

//   const handleOpenModal = (imageId: string, currentLink: string | StaticImageData) => {
//     console.log("imageId", imageId)
//     setSelectedImageIdentifier(imageId);
//     setSelectedImageLink(currentLink);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedImageIdentifier(null);
//     setSelectedImageLink("");
//   };

//   const handleUpdateImage = async (newLink: string) => {
//     if (selectedImageIdentifier !== null) {
//       const updatedImages = images.map(section => ({
//         ...section,
//         images: section.images.map(img =>
//           img.alt === selectedImageIdentifier ? { ...img, src: newLink } : img
//         )
//       }));
//       setImages(updatedImages);
//       handleCloseModal(); // Close the modal after updating
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       <main className="flex-grow flex flex-col xl:px-32 px-8 w-full py-8 space-y-16">
//         {images.map((section) => (
//           <div key={section.id}>
//             {/* Title with option to edit */}
//             <div className="flex justify-center mb-4">
//               <div
//                 className="text-center text-3xl md:text-4xl font-bold mb-8 text-blue-950"
//               >
//                 {section.title}
//               </div>
//               <button
//                 onClick={() => setIsConfirmModalOpen({
//                   isOpen: true,
//                   sectionId: section.id,
//                   imageId: null
//                 })
//                 }
//                 className="bg-red-500 text-white flex items-center rounded ml-4 h-8 p-1"
//               >
//                 <Trash />
//               </button>

//               <input
//                 type="file"
//                 /*onChange={(e) => handleAddNewImageInSection(section.id, e.target.files![0])}*/
//                 className="hidden"
//                 id={`newImage${section.id}`}
//               />
//               <PlusCircle className="bg-blue-500 w-8 text-white flex items-center rounded ml-4 h-8 p-1"
//                 onClick={() => document.getElementById(`newImage${section.id}`)?.click()}
//               />



//             </div>

//             {/* Images Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {section.images.map((image) => (
//                 <div
//                   key={image.id}
//                   className="relative cursor-pointer overflow-hidden rounded-lg shadow-lg group"
//                 >
//                   <Image
//                     src={image.src}
//                     alt={image.alt}
//                     width={image.width}
//                     height={image.height}
//                     className="w-full h-auto object-cover group-hover:opacity-20"
//                   />

//                   {/* Update image on hover */}
//                   <button
//                     className="absolute top-1/2 right-2/3 bg-white bg-opacity-75 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity
//                   "
//                     onClick={() =>
//                       handleOpenModal(image.id, image.src)
//                     }
//                   >
//                     <Upload className="text-blue-500" />
//                   </button>

//                   {/* Delete image */}
//                   <button
//                     className="absolute top-1/2 left-2/3 bg-white bg-opacity-75 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
//                     onClick={() => {
//                       setIsConfirmModalOpen({
//                         isOpen: true,
//                         sectionId: section.id,
//                         imageId: image.id
//                       });
//                     }}
//                   >
//                     <Trash className="text-red-500" />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}

//         {/* Add New Section */}
//         <div className="mt-8">
//           <h2 className="text-2xl font-bold mb-4">Add New Section</h2>
//           <input
//             type="text"
//             placeholder="Section Title"
//             value={newSectionTitle}
//             onChange={(e) => setNewSectionTitle(e.target.value)}
//             className="border p-2 mb-4 w-full"
//           />
//           <input
//             ref={fileRef}
//             type="file"
//             accept="image/*,svg"
//             multiple // Allows multiple images to be selected
//             onChange={(e) => setNewSectionImages(e.target.files ? Array.from(e.target.files) : [])}
//             className="mb-4"
//           />
//           <button
//             /*onClick={handleAddNewSection}*/
//             className={`bg-blue-600 text-white p-2 mt-2 rounded ${!newSectionImages.length || !newSectionTitle ? 'cursor-not-allowed' : ''}`}
//             disabled={!newSectionImages.length || !newSectionTitle}
//           >
//             Add Section
//           </button>
//           <button
//             type='reset'
//             onClick={() => {
//               setNewSectionTitle("");
//               setNewSectionImages([]);  // Clear all selected images
//               if (fileRef.current) {
//                 fileRef.current.value = ''
//               }
//             }}
//             className={`bg-gray-300 text-black rounded px-4 py-2 ml-2 ${!newSectionImages.length && !newSectionTitle ? 'cursor-not-allowed' : 'bg-red-500'}`}
//             disabled={!newSectionImages.length && !newSectionTitle}
//           >
//             Cancel
//           </button>
//         </div>
//       </main>

//       <UpdateImageModal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         currentLink={selectedImageLink}
//         onUpdate={handleUpdateImage}
//         imageId={selectedImageIdentifier!}
//       />

//       {
//         isConfirmModalOpen.isOpen && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//             <div className="bg-white p-6 rounded-lg w-96">
//               <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
//               <div className="mt-4 flex justify-end">
//                 <button
//                   onClick={() => setIsConfirmModalOpen({
//                     isOpen: false,
//                     sectionId: null,
//                     imageId: null
//                   })}
//                   className="px-4 py-2 bg-gray-300 rounded mr-2"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => {

//                     if (isConfirmModalOpen.sectionId && isConfirmModalOpen.imageId) {
//                       // console.log("calling handleImageDelete", isConfirmModalOpen.sectionId, isConfirmModalOpen.imageId)
//                       // handleImageDelete(isConfirmModalOpen.sectionId, isConfirmModalOpen.imageId);
//                     } else if (isConfirmModalOpen.sectionId) {
//                       // console.log("calling handleSectionDelete", isConfirmModalOpen.sectionId)
//                       // handleSectionDelete(isConfirmModalOpen.sectionId);
//                     }

//                     setIsConfirmModalOpen({
//                       isOpen: false,
//                       sectionId: null,
//                       imageId: null
//                     });
//                     // handleDelete();
//                   }}
//                   className="px-4 py-2 bg-red-500 text-white rounded"
//                 >
//                   Confirm
//                 </button>
//               </div>
//             </div>
//           </div>
//         )
//       }
//     </div>
//   );
// }


"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import Image, { type StaticImageData } from "next/image"
import UpdateImageModal from "@/components/UpdateImageModal"
import { PlusCircle, Trash, Upload } from "lucide-react"
import { convertFileToWebP } from "@/lib/utils"
import { fetchGalleryImages, deleteImageByIdentifier, deleteSectionByName, uploadImage, type ApiImage } from "@/lib/api"



interface GalleryImage {
  id: string
  src: StaticImageData | string
  alt: string
  width: number
  height: number
}

interface GallerySection {
  id: string
  title: string
  images: GalleryImage[]
}

export default function Gallery() {
  const [images, setImages] = useState<GallerySection[]>([])
  const [newSectionTitle, setNewSectionTitle] = useState("")
  const [newSectionImages, setNewSectionImages] = useState<File[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImageIdentifier, setSelectedImageIdentifier] = useState<string | null>(null)
  const [selectedImageLink, setSelectedImageLink] = useState<string | StaticImageData>("")
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<{
    isOpen: boolean
    sectionId: string | null
    imageId: string | null
  }>({
    isOpen: false,
    sectionId: null,
    imageId: null,
  })


  useEffect(() => {
    setIsConfirmModalOpen({ isOpen: false, sectionId: null, imageId: null })
  }, [])

  // Transform API data to component format
  const transformApiDataToSections = (apiData: ApiImage[]): GallerySection[] => {
    const sections = apiData.reduce((acc: Record<string, GallerySection>, image: ApiImage) => {
      const sectionId = image.section_name
      if (!acc[sectionId]) {
        acc[sectionId] = {
          id: sectionId,
          title: image.section_title,
          images: [],
        }
      }
      acc[sectionId].images.push({
        id: image.image_identifier,
        src: image.media.url,
        alt: image.image_identifier,
        width: 1920,
        height: 1080,
      })
      return acc
    }, {})

    // Sort images by identifier in each section
    Object.values(sections).forEach((section) => {
      ;(section as GallerySection).images.sort((a, b) => {
        const aNumber = Number.parseInt(a.alt.split("_")[1], 10)
        const bNumber = Number.parseInt(b.alt.split("_")[1], 10)
        return aNumber - bNumber
      })
    })

    return Object.values(sections)
  }

const fetchImages = useCallback(async () => {
  setLoading(true);
  try {
    const apiData = await fetchGalleryImages();
    const sections = transformApiDataToSections(apiData);
    setImages(sections);
  } catch (error) {
    console.error("Error fetching images:", error);
  } finally {
    setLoading(false);
  }
}, []);


useEffect(() => {
  fetchImages();
}, [fetchImages]);


  const handleImageDelete = async (sectionId: string, imageId: string) => {
    console.log("sectionId for delete image", sectionId)
    console.log("imageId", imageId)

    try {
      const success = await deleteImageByIdentifier(imageId)

      if (success) {
        setImages((prevSections) =>
          prevSections
            .map((section) =>
              section.id === sectionId
                ? {
                    ...section,
                    images: section.images.filter((img) => img.id !== imageId),
                  }
                : section,
            )
            .filter((section) => section.images.length > 0),
        )
      } else {
        console.error("Failed to delete image")
        // You might want to show an error message to the user
      }
    } catch (error) {
      console.error("Error deleting image:", error)
    }
  }

  const handleSectionDelete = async (sectionId: string) => {
    try {
      const success = await deleteSectionByName(sectionId)

      if (success) {
        setImages((prevSections) => prevSections.filter((section) => section.id !== sectionId))
      } else {
        console.error("Failed to delete section")
        // You might want to show an error message to the user
      }
    } catch (error) {
      console.error("Error deleting section:", error)
    }
  }

  const handleAddNewSection = async () => {
    if (newSectionTitle && newSectionImages.length > 0) {
      setLoading(true)
      const newSectionId = (images.length + 1).toString()

      try {
        // Upload all images in the section
        for (let i = 0; i < newSectionImages.length; i++) {
          const newSectionImage = newSectionImages[i]
          const imageIdentifier = `g${newSectionId}_${i + 1}`

          // Convert to WebP if needed
          const webpFile = (await convertFileToWebP(newSectionImage)) ?? newSectionImage

          const success = await uploadImage("gallery", newSectionId, imageIdentifier, webpFile)

          if (!success) {
            console.error(`Failed to upload image ${i + 1}`)
            // Continue with other images even if one fails
          }
        }

        // Clear the form fields after upload
        setNewSectionTitle("")
        setNewSectionImages([])
        if (fileRef.current) {
          fileRef.current.value = ""
        }

        // Refresh the images from the server
        await fetchImages()
      } catch (error) {
        console.error("Error adding new section:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleAddNewImageInSection = async (sectionId: string, newImage: File) => {
    const section = images.find((section) => section.id === sectionId)
    if (!section) return

    setLoading(true)
    try {
      const imageIdentifier = `g${sectionId}_${section.images.length + 1}`

      // Convert to WebP if needed
      const webpFile = (await convertFileToWebP(newImage)) ?? newImage

      const success = await uploadImage("gallery", sectionId, imageIdentifier, webpFile)

      if (success) {
        // Refresh the images from the server
        await fetchImages()
      } else {
        console.error("Failed to upload image")
      }
    } catch (error) {
      console.error("Error adding image to section:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (imageId: string, currentLink: string | StaticImageData) => {
    console.log("imageId", imageId)
    setSelectedImageIdentifier(imageId)
    setSelectedImageLink(currentLink)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedImageIdentifier(null)
    setSelectedImageLink("")
  }

  const handleUpdateImage = async (newLink: string) => {
    if (selectedImageIdentifier !== null) {
      const updatedImages = images.map((section) => ({
        ...section,
        images: section.images.map((img) => (img.alt === selectedImageIdentifier ? { ...img, src: newLink } : img)),
      }))
      setImages(updatedImages)
      handleCloseModal()
    }
  }

  if (loading && images.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading gallery...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex flex-col xl:px-32 px-8 w-full py-8 space-y-16">
        {images.map((section) => (
          <div key={section.id}>
            {/* Title with option to edit */}
            <div className="flex justify-center mb-4">
              <div className="text-center text-3xl md:text-4xl font-bold mb-8 text-blue-950">{section.title}</div>
              <button
                onClick={() =>
                  setIsConfirmModalOpen({
                    isOpen: true,
                    sectionId: section.id,
                    imageId: null,
                  })
                }
                className="bg-red-500 text-white flex items-center rounded ml-4 h-8 p-1"
                disabled={loading}
              >
                <Trash />
              </button>
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleAddNewImageInSection(section.id, e.target.files[0])
                  }
                }}
                className="hidden"
                id={`newImage${section.id}`}
                accept="image/*"
                disabled={loading}
              />
              <PlusCircle
                className="bg-blue-500 w-8 text-white flex items-center rounded ml-4 h-8 p-1 cursor-pointer"
                onClick={() => !loading && document.getElementById(`newImage${section.id}`)?.click()}
              />
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.images.map((image) => (
                <div key={image.id} className="relative cursor-pointer overflow-hidden rounded-lg shadow-lg group">
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    className="w-full h-auto object-cover group-hover:opacity-20"
                  />
                  {/* Update image on hover */}
                  <button
                    className="absolute top-1/2 right-2/3 bg-white bg-opacity-75 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleOpenModal(image.id, image.src)}
                    disabled={loading}
                  >
                    <Upload className="text-blue-500" />
                  </button>
                  {/* Delete image */}
                  <button
                    className="absolute top-1/2 left-2/3 bg-white bg-opacity-75 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      setIsConfirmModalOpen({
                        isOpen: true,
                        sectionId: section.id,
                        imageId: image.id,
                      })
                    }}
                    disabled={loading}
                  >
                    <Trash className="text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Add New Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Add New Section</h2>
          <input
            type="text"
            placeholder="Section Title"
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            className="border p-2 mb-4 w-full"
            disabled={loading}
          />
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setNewSectionImages(e.target.files ? Array.from(e.target.files) : [])}
            className="mb-4"
            disabled={loading}
          />
          <button
            onClick={handleAddNewSection}
            className={`bg-blue-600 text-white p-2 mt-2 rounded ${
              !newSectionImages.length || !newSectionTitle || loading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={!newSectionImages.length || !newSectionTitle || loading}
          >
            {loading ? "Adding..." : "Add Section"}
          </button>
          <button
            type="reset"
            onClick={() => {
              setNewSectionTitle("")
              setNewSectionImages([])
              if (fileRef.current) {
                fileRef.current.value = ""
              }
            }}
            className={`bg-gray-300 text-black rounded px-4 py-2 ml-2 ${
              !newSectionImages.length && !newSectionTitle ? "cursor-not-allowed" : "bg-red-500"
            }`}
            disabled={(!newSectionImages.length && !newSectionTitle) || loading}
          >
            Cancel
          </button>
        </div>
      </main>

      <UpdateImageModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        currentLink={selectedImageLink}
        onUpdate={handleUpdateImage}
        imageId={selectedImageIdentifier!}
      />

      {isConfirmModalOpen.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
            <p className="mb-4 text-gray-600">
              {isConfirmModalOpen.imageId
                ? "This will permanently delete the selected image."
                : "This will permanently delete the entire section and all its images."}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() =>
                  setIsConfirmModalOpen({
                    isOpen: false,
                    sectionId: null,
                    imageId: null,
                  })
                }
                className="px-4 py-2 bg-gray-300 rounded mr-2"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (isConfirmModalOpen.sectionId && isConfirmModalOpen.imageId) {
                    await handleImageDelete(isConfirmModalOpen.sectionId, isConfirmModalOpen.imageId)
                  } else if (isConfirmModalOpen.sectionId) {
                    await handleSectionDelete(isConfirmModalOpen.sectionId)
                  }
                  setIsConfirmModalOpen({
                    isOpen: false,
                    sectionId: null,
                    imageId: null,
                  })
                }}
                className="px-4 py-2 bg-red-500 text-white rounded"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
