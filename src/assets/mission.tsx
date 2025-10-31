"use client";

import Image from "next/image";
import DivWithLeftBorder from "@/components/DivWithLeftBorder";
// import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useState } from "react";
import { Upload } from "lucide-react";
import UpdateImageModal from "@/components/UpdateImageModal";
import { ImageData } from "@/types";

export default function MissionAndVision() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIdentifier, setSelectedImageIdentifier] = useState<
    string | null
  >(null);

  const [selectedImageLink, setSelectedImageLink] = useState<string>("");
const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;


const fetchImages = useCallback(async () => {
  try {
    const res = await fetch(`${baseURL}/api/v1/website-img/images-list?page_name=mission-vision`, {
      method: "GET"
    });

    if (!res.ok) throw new Error("Failed to fetch images");

    const result = await res.json();
    setImages(result.data || []);
  } catch (error) {
    console.error("Error fetching images:", error);
  }
}, [baseURL]);

useEffect(() => {
  fetchImages();
}, [fetchImages]);

  const handleOpenModal = (imageId: string, currentLink: string) => {
    setSelectedImageIdentifier(imageId);
    setSelectedImageLink(currentLink);
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImageIdentifier(null);
    setSelectedImageLink("");
  };

  // Handle image update
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
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full">
        <main className="w-full md:w-3/4 px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 flex justify-center text-center text-blue-950">
            Mission and Vision
          </h1>

          <p className="text-lg md:text-xl mb-8 text-center">
            We are here to change the way India travels first mile and the last
            mile. Promote eco-friendly transportation and healthy living, and
            create a sustainable urban mobility ecosystem.
          </p>

          <div className="mb-8 flex justify-center">
            <div className="relative group">
              <Image
                src={getImageBySection(1, "mv1_1")!}
                alt="Cyclists with Indian flags"
                width={800}
                height={400}
                className="rounded-lg w-full max-w-md md:max-w-full group-hover:opacity-20"
              />
              <button
                className="absolute top-1/2 right-1/2 bg-white bg-opacity-75 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity
                  "
                onClick={() =>
                  handleOpenModal("mv1_1", getImageBySection(1, "mv1_1")!)
                }
              >
                <Upload className="text-blue-500" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {["Convenient", "Eco-Friendly", "Healthy", "Affordable"].map(
              (feature, index) => (
                <div key={index} className="">
                  <DivWithLeftBorder className="p-2">
                    <h3 className="font-semibold text-sm md:text-lg">
                      {feature}
                    </h3>
                  </DivWithLeftBorder>
                </div>
              )
            )}
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
}
