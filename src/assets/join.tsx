"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";
import UpdateImageModal from "@/components/UpdateImageModal";
import { Upload } from "lucide-react";
import { ImageData } from "@/types";

const JoinNetwork = () => {
    const [images, setImages] = useState<ImageData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIdentifier, setSelectedImageIdentifier] = useState<
    string | null
  >(null);
  const [selectedImageLink, setSelectedImageLink] = useState<string>("");
const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;


const fetchImages = useCallback(async () => {
  try {
    const res = await fetch(`${baseURL}/api/v1/website-img/images-list?page_name=partnerships`, {
      method: "GET"
    });

    if (!res.ok) throw new Error("Failed to fetch images");

    const result = await res.json();
    setImages(result.data || []);
  } catch (error) {
    console.error("Error fetching images:", error);
  }
}, [baseURL]); // <-- include deps here



  // Fetch images whenever the selected page changes
useEffect(() => {
  fetchImages();
}, [fetchImages]);


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
      // Update image link in the database
      const updatedImages = images.map((img) => {
        if (img["image_identifier"] === selectedImageIdentifier) {
          return { ...img, link: newLink };
        }
        return img;
      });

      setImages(updatedImages);
      handleCloseModal();
    }
  };

  // Function to get image by section
const getImageBySection = (section: number, identifier: string) => {
  return images.find(
    (img) =>
      Number(img.section_name) === section &&
      img.image_identifier === identifier
  )?.media.url;
};

  return (
    <div className="flex xl:px-32 px-8 w-full py-12">
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
        <main className="w-full md:w-3/4 px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center text-blue-950">
            Join Our Network
          </h1>

          <p className="text-lg md:text-xl mb-8 text-center">
            {`Join us in revolutionizing urban commuting. Together, we can tackle the pressing challenges of city traffic and create a more sustainable future. By partnering with us, you'll help inspire a more sustainable urban mobility solution, making your cities cleaner and healthier for everyone.`}
          </p>

          <div className="mb-8 flex justify-center relative group">
            <Image
              src={getImageBySection(1, "p1_1") || ""}
              alt="ezpedal team with bicycles"
              width={1200}
              height={600}
              className="rounded-lg w-full max-w-md md:max-w-full group-hover:opacity-20"
            />
            <button
              className="absolute top-1/2 right-1/2 bg-white bg-opacity-75 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() =>
                handleOpenModal("p1_1", getImageBySection(1, "p1_1") || "")
              }
            >
              <Upload className="text-blue-500" />
            </button>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <UpdateImageModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          currentLink={selectedImageLink}
          imageId={selectedImageIdentifier!}
          onUpdate={handleUpdateImage}
        />
      )}
    </div>
  );
};

export default JoinNetwork;
