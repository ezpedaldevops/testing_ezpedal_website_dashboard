// "use client";
// import Image from "next/image";
// import Link from "next/link";
// import { ImageData } from "@/types";
// import { useState, useEffect } from "react";
// // import { supabase } from "@/lib/supabase";
// import { Upload } from "lucide-react";
// import UpdateImageModal from "@/components/UpdateImageModal";

// export default function PricingPage() {

//     const [images, setImages] = useState<ImageData[]>([]);
//     const [playStoreLink, setPlayStoreLink] = useState<string>("");
//     const [appStoreLink, setAppStoreLink] = useState<string>("");
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedImageIdentifier, setSelectedImageIdentifier] = useState<string | null>(null);
//     const [selectedImageLink, setSelectedImageLink] = useState<string>("");

//     const initialPlayStoreLink = images.find((img) => img["image-identifier"] === "play-store")?.link ?? "#";
//     const initialAppStoreLink = images.find((img) => img["image-identifier"] === "app-store")?.link ?? "#";

//     // Fetch the image data from Supabase
//     useEffect(() => {
//         const fetchImages = async () => {
//             const { data, error } = await supabase
//                 .from("website-images")
//                 .select("*")
//                 .eq("page-name", "pricing");

//             if (error) {
//                 console.error("Error fetching images:", error);
//             } else {
//                 setImages(data);
//             }
//         };

//         fetchImages();
//     }, []);

//     useEffect(() => {
//         setPlayStoreLink(images.find((img) => img["image-identifier"] === "play-store")?.link ?? "#");
//         setAppStoreLink(images.find((img) => img["image-identifier"] === "app-store")?.link ?? "#");
//     }, []);


//     const handleUpdateLinks = async (playStore = false, appStore = false) => {
//         if (playStore) {
//             const { error } = await supabase.from("website-images").update({ link: playStoreLink }).eq("image-identifier", "play-store");
//             if (error) {
//                 console.error("Error updating Play Store Link:", error);
//             }

//         }
//         if (appStore) {
//             const { error } = await supabase.from("website-images").update({ link: appStoreLink }).eq("image-identifier", "app-store");
//             if (error) {
//                 console.error("Error updating App Store Link:", error);
//             }
//         }

//     }

//     const handleOpenModal = (imageId: string, currentLink: string) => {
//         setSelectedImageIdentifier(imageId);
//         setSelectedImageLink(currentLink);
//         setIsModalOpen(true);
//     };

//     // Handle closing the modal
//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//         setSelectedImageIdentifier(null);
//         setSelectedImageLink("");
//     };

//     // Handle image update
//     const handleUpdateImage = async (newLink: string) => {
//         if (selectedImageIdentifier !== null) {
//             // Update image link in the database
//             const updatedImages = images.map((img) => {
//                 if (img["image-identifier"] === selectedImageIdentifier) {
//                     return { ...img, link: newLink };
//                 }
//                 return img;
//             });

//             setImages(updatedImages);
//             handleCloseModal();
//         }
//     };

//     return (
//         <div className="flex flex-col xl:px-32 px-8 w-full py-12">
//             <h1
//                 className="text-3xl sm:text-4xl font-bold text-center text-blue-950 mb-6 sm:mb-8"

//             >
//                 Pricing and Plans
//             </h1>

//             <h2
//                 className="text-xl sm:text-2xl font-semibold text-center text-gray-700 mb-8 sm:mb-12"

//             >
//                 User App - Regular Use
//             </h2>


//             <div id="rent" className="flex flex-col md:flex-row md:justify-between justify-center gap-8 md:gap-12 mb-12 sm:mb-16 shadow-xl bg-gray-100 rounded-lg">
//                 <div className="flex flex-col items-center justify-between py-20 w-full">
//                     <h2
//                         className="text-2xl sm:text-4xl font-semibold text-center text-gray-700 mb-8 sm:mb-12 max-w-xl"

//                     >
//                         Download the app from Playstore and Appstore and explore more
//                     </h2>

//                     <div className="flex flex-col justify-center items-center md:items-end md:justify-end gap-6 sm:gap-8 p-8">
//                         {/* Google Play Link */}
//                         <Link href={initialPlayStoreLink || "#"}>
//                             <div className="group">
//                                 <Image
//                                     src="/playstore.png"
//                                     alt="Google Play"
//                                     width={150}
//                                     height={60}
//                                     className="w-36 sm:w-48"
//                                 />
//                                 {/* Input for Play Store Link */}
//                                 <label
//                                     htmlFor="play-store-link"
//                                     className=""
//                                 >
//                                     Play Store Link
//                                 </label>

//                                 <input
//                                     type="text"
//                                     value={playStoreLink}
//                                     className="w-full h-full bg-opacity-50 border"
//                                     onChange={(e) => setPlayStoreLink(e.target.value)}
//                                 />
//                                 <button
//                                     className={`bg-green-500 text-white p-1 rounded-lg ${playStoreLink !== initialPlayStoreLink ? "block" : "hidden"
//                                         }`}
//                                     onClick={() => {
//                                         // Handle updating the link in the database
//                                         handleUpdateLinks(true, false);
//                                     }}
//                                 >
//                                     Save Changes
//                                 </button>
//                             </div>
//                         </Link>

//                         {/* App Store Link */}
//                         <Link href={initialAppStoreLink || "#"}>
//                             <div className="group">
//                                 <Image
//                                     src="/appstore.png"
//                                     alt="App Store"
//                                     width={150}
//                                     height={60}
//                                     className="w-36 sm:w-48"
//                                 />
//                                 {/* Input for App Store Link */}
//                                 <label
//                                     htmlFor="app-store-link"
//                                     className=""
//                                 >
//                                     App Store Link
//                                 </label>
//                                 <input
//                                     type="text"
//                                     value={appStoreLink}
//                                     className="w-full h-full bg-opacity-50 border"
//                                     onChange={(e) => setAppStoreLink(e.target.value)}
//                                 />
//                                 <button
//                                     className={`bg-green-500 text-white p-1 rounded-lg ${appStoreLink !== initialAppStoreLink ? "block" : "hidden"
//                                         }`}
//                                     onClick={() => {
//                                         // Handle updating the link in the database
//                                         handleUpdateLinks(false, true);
//                                     }}
//                                 >
//                                     Save Changes
//                                 </button>
//                             </div>
//                         </Link>
//                     </div>
//                 </div>
//                 <div
//                     className="relative w-full group"

//                 >
//                     <Image
//                         src={images.find((img) => img["image-identifier"] === "pg1_1")?.link ?? "/1.png"}
//                         alt="Smartphone with Expedal app"
//                         width={2160}
//                         height={1080}
//                         className="object-cover flex mx-auto w-full h-auto max-w-lg group-hover:opacity-20"
//                         quality={100}
//                     />
//                     <button
//                         className="absolute top-1/2 right-1/2 bg-white bg-opacity-75 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity
//                   "
//                         onClick={() =>
//                             handleOpenModal("pg1_1", images.find((img) => img["image-identifier"] === "pg1_1")?.link ?? "/1.png")
//                         }
//                     >
//                         <Upload className="text-blue-500" />
//                     </button>

//                 </div>
//             </div>
//             {isModalOpen && (
//                 <UpdateImageModal
//                     isOpen={isModalOpen}
//                     onClose={handleCloseModal}
//                     currentLink={selectedImageLink}
//                     imageId={selectedImageIdentifier!}
//                     onUpdate={handleUpdateImage}
//                 />
//             )}
//         </div>
//     );
// }








"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Upload } from "lucide-react";
import UpdateImageModal from "@/components/UpdateImageModal";



interface ImageData {
  _id: string;
  page_name: string;
  section_name?: string | number;
  image_identifier: string;
  media: {
    url: string;
    contentType: string;
    size: number;
  };
}

export default function PricingPage() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [playStoreLink, setPlayStoreLink] = useState<string>("");
  const [appStoreLink, setAppStoreLink] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIdentifier, setSelectedImageIdentifier] = useState<string | null>(null);
  const [selectedImageLink, setSelectedImageLink] = useState<string>("");
const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  // Fetch images from your API
const fetchImages = useCallback(async () => {
  try {
    const res = await fetch(`${baseURL}/api/v1/website-img/images-list?page_name=pricing`);

    if (!res.ok) throw new Error("Failed to fetch images");

    const result = await res.json();
    setImages(result.data || []);
  } catch (err) {
    console.error("Fetch error:", err);
  }
}, [baseURL]); // Include baseURL if it's dynamic or from props

useEffect(() => {
  fetchImages();
}, [fetchImages]);

  useEffect(() => {
    setPlayStoreLink(
      images.find((img) => img.image_identifier === "play-store")?.media.url ?? "#"
    );
    setAppStoreLink(
      images.find((img) => img.image_identifier === "app-store")?.media.url ?? "#"
    );
  }, [images]);

  const handleOpenModal = (imageId: string, currentLink: string) => {
    setSelectedImageIdentifier(imageId);
    setSelectedImageLink(currentLink);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImageIdentifier(null);
    setSelectedImageLink("");
  };

  const handleUpdateImage = async (newLink: string) => {
    if (selectedImageIdentifier !== null) {
      const updatedImages = images.map((img) =>
        img.image_identifier === selectedImageIdentifier
          ? { ...img, media: { ...img.media, url: newLink } }
          : img
      );
      setImages(updatedImages);
      handleCloseModal();
    }
  };

  return (
    <div className="flex flex-col xl:px-32 px-8 w-full py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-950 mb-6 sm:mb-8">
        Pricing and Plans
      </h1>

      <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-700 mb-8 sm:mb-12">
        User App - Regular Use
      </h2>

      <div
        id="rent"
        className="flex flex-col md:flex-row md:justify-between gap-8 md:gap-12 mb-12 sm:mb-16 shadow-xl bg-gray-100 rounded-lg"
      >
        <div className="flex flex-col items-center justify-between py-20 w-full">
          <h2 className="text-2xl sm:text-4xl font-semibold text-center text-gray-700 mb-8 sm:mb-12 max-w-xl">
            Download the app from Playstore and Appstore and explore more
          </h2>

          <div className="flex flex-col justify-center items-center md:items-end gap-6 sm:gap-8 p-8">
            {/* Google Play */}
            <Link href={playStoreLink || "#"}>
              <div className="group">
                <Image src="/playstore.png" alt="Google Play" width={150} height={60} className="w-36 sm:w-48" />
                <label htmlFor="play-store-link">Play Store Link</label>
                <input
                  type="text"
                  value={playStoreLink}
                  className="w-full border p-1"
                  onChange={(e) => setPlayStoreLink(e.target.value)}
                />
                <button
                  className={`bg-green-500 text-white p-1 rounded-lg mt-2 ${playStoreLink ? "block" : "hidden"}`}
                  onClick={() => console.log("Save to DB: Play Store link", playStoreLink)}
                >
                  Save Changes
                </button>
              </div>
            </Link>

            {/* App Store */}
            <Link href={appStoreLink || "#"}>
              <div className="group">
                <Image src="/appstore.png" alt="App Store" width={150} height={60} className="w-36 sm:w-48" />
                <label htmlFor="app-store-link">App Store Link</label>
                <input
                  type="text"
                  value={appStoreLink}
                  className="w-full border p-1"
                  onChange={(e) => setAppStoreLink(e.target.value)}
                />
                <button
                  className={`bg-green-500 text-white p-1 rounded-lg mt-2 ${appStoreLink ? "block" : "hidden"}`}
                  onClick={() => console.log("Save to DB: App Store link", appStoreLink)}
                >
                  Save Changes
                </button>
              </div>
            </Link>
          </div>
        </div>

        {/* Main App Image */}
        <div className="relative w-full group">
          <Image
            src={images.find((img) => img.image_identifier === "pg1_1")?.media.url ?? "/1.png"}
            alt="Smartphone with Ezpedal App"
            width={2160}
            height={1080}
            className="object-cover flex mx-auto w-full h-auto max-w-lg group-hover:opacity-20"
            quality={100}
          />
          <button
            className="absolute top-1/2 right-1/2 bg-white bg-opacity-75 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() =>
              handleOpenModal("pg1_1", images.find((img) => img.image_identifier === "pg1_1")?.media.url ?? "/1.png")
            }
          >
            <Upload className="text-blue-500" />
          </button>
        </div>
      </div>

      <UpdateImageModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        currentLink={selectedImageLink}
        imageId={selectedImageIdentifier!}
        onUpdate={handleUpdateImage}
      />
    </div>
  );
}
