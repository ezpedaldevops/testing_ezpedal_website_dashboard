"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";
import DivWithLeftBorder from "@/components/DivWithLeftBorder";
import UpdateImageModal from "@/components/UpdateImageModal";
import { Upload } from "lucide-react"; // Install react-icons: npm install react-icons
import { ImageData } from "@/types";

export default function Home() {
  // const [images, setImages] = useState<ImageData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [images, setImages] = useState<ImageData[]>([]);
  const [selectedImageIdentifier, setSelectedImageIdentifier] = useState<
    string | null
  >(null);
  const [selectedImageLink, setSelectedImageLink] = useState<string>("");
const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

const fetchImages = useCallback(async () => {
  try {
    const res = await fetch(`${baseURL}/api/v1/website-img/images-list?page_name=home`, {
      method: "GET"
    });

    if (!res.ok) throw new Error("Failed to fetch images");

    const result = await res.json();
    setImages(result.data || []);
  } catch (error) {
    console.error("Error fetching images:", error);
  }
}, [baseURL]);



  // Fetch images whenever the selected page changes
useEffect(() => {
  fetchImages();
}, [fetchImages]);




const getImageBySection = (section: number, identifier: string) => {
  return images.find(
    (img) =>
      Number(img.section_name) === section &&
      img.image_identifier === identifier
  )?.media.url;
};



  // Handle opening the modal
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

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Section 1 */}
        <section className="container py-12 md:py-14 flex flex-col md:flex-row items-center relative">
          <div className="md:w-1/2 flex justify-center md:justify-start relative">
            {getImageBySection(1, "h1_1") && (
              <div className="relative group">
                <Image
                  src={getImageBySection(1, "h1_1")!}
                  alt="Electric Bike"
                  width={400}
                  height={100}
                  className="w-full max-w-xs md:max-w-2xl group-hover:opacity-20"
                />
                <button
                  className="absolute top-1/2 right-1/2 bg-white bg-opacity-75 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity
                  "
                  onClick={() =>
                    handleOpenModal("h1_1", getImageBySection(1, "h1_1")!)
                  }
                >
                  <Upload className="text-blue-500" />
                </button>
              </div>
            )}
          </div>
          <div className="md:w-1/2 mx-auto text-center md:text-left relative">
            <DivWithLeftBorder>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-blue-950">
                wheel the Change.
              </h1>
            </DivWithLeftBorder>
            <p className="text-gray-600 mb-4">
              {`Introducing India's first bike-share company, bringing European-built standards to the citizens of Pune.`}
            </p>
            <p className="text-gray-600">
              Your ultimate solution for seamless first-mile to last-mile
              connectivity.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="py-12 flex flex-col items-center justify-center">
          <div className="container mx-auto px-4 text-center py-12 md:py-24">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              we want you to <span className="text-orange-600">pedal</span>, not
              just sit and throttle
            </h2>
          </div>
        </section>

        {/* Section 3 */}
        <section className="container mx-auto px-4 py-12 md:py-24 flex flex-col-reverse md:flex-row items-center relative">
          <div className="md:w-1/2 mb-8 md:mb-0 text-center md:text-left relative">
            <DivWithLeftBorder>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                be a part of this Change
              </h2>
            </DivWithLeftBorder>
          </div>
          <div className="md:w-1/2 md:mb-0 mb-8 flex justify-center relative">
            {getImageBySection(2, "h2_1") && (
              <div className="relative group">
                <Image
                  src={getImageBySection(2, "h2_1")!}
                  alt="App and Bike"
                  width={800}
                  height={300}
                  className="w-full h-auto group-hover:opacity-20"
                />
                <button
                  className="absolute top-1/2 right-1/2 bg-white bg-opacity-75 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() =>
                    handleOpenModal("h2_1", getImageBySection(2, "h2_1")!)
                  }
                >
                  <Upload className="text-blue-500" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Section 4 */}
        <section className="container mx-auto px-4 py-12 md:py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 relative">
            {getImageBySection(2, "h2_2") && (
              <div className="relative group">
                <Image
                  src={getImageBySection(2, "h2_2")!}
                  alt="Rider"
                  width={400}
                  height={300}
                  className="w-full h-auto group-hover:opacity-20"
                />
                <button
                  className="absolute top-1/2 right-1/2 bg-white bg-opacity-75 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() =>
                    handleOpenModal("h2_2", getImageBySection(2, "h2_2")!)
                  }
                >
                  <Upload className="text-blue-500" />
                </button>
              </div>
            )}
          </div>
          <div className="md:w-1/2">
            <DivWithLeftBorder>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                catering all demographics
              </h2>
            </DivWithLeftBorder>
          </div>
        </section>

        {/* Section 5 */}
        <section className="container mx-auto px-4 py-12 md:py-24 flex flex-col-reverse md:flex-row items-center relative">
          <div className="md:w-1/2 mb-8 md:mb-0 relative">
            <DivWithLeftBorder>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                fun and cool way to ride
              </h2>
            </DivWithLeftBorder>
          </div>
          <div className="md:w-1/2 md:mb-0 flex justify-center relative">
            {getImageBySection(2, "h2_3") && (
              <div className="relative group">
                <Image
                  src={getImageBySection(2, "h2_3")!}
                  alt="Enjoy Riding"
                  width={800}
                  height={300}
                  className="w-full h-auto group-hover:opacity-20"
                />
                <button
                  className="absolute top-1/2 right-1/2 bg-white bg-opacity-75 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() =>
                    handleOpenModal("h2_3", getImageBySection(2, "h2_3")!)
                  }
                >
                  <Upload className="text-blue-500" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Section 6 */}
        <section className="bg-gray-100 py-12">
          <div className="container mx-auto px-4 md:px-0 max-w-full">
            {getImageBySection(3, "h3_1") && (
              <div className="relative group">
                <Image
                  src={getImageBySection(3, "h3_1")!}
                  alt="Team Photo"
                  width={1000}
                  height={400}
                  className="min-w-full h-auto mb-8 group-hover:opacity-20"
                />
                <button
                  className="absolute top-1/2 right-1/2 bg-white bg-opacity-75 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() =>
                    handleOpenModal("h3_1", getImageBySection(3, "h3_1")!)
                  }
                >
                  <Upload className="text-blue-500" />
                </button>
              </div>
            )}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8">
              Most exciting talk of town
            </h2>
            <div className="flex flex-wrap justify-center space-x-8">
              {getImageBySection(3, "h3_2") && (
                <div className="relative group">
                  <Image
                    src={getImageBySection(3, "h3_2")!}
                    alt="Partner 1"
                    width={100}
                    height={50}
                    className="max-w-xs group-hover:opacity-20"
                  />
                  <button
                    className="absolute top-1/2 right-1/2 bg-white bg-opacity-75 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() =>
                      handleOpenModal("h3_2", getImageBySection(3, "h3_2")!)
                    }
                  >
                    <Upload className="text-blue-500" />
                  </button>
                </div>
              )}
              {getImageBySection(3, "h3_3") && (
                <div className="relative group">
                  <Image
                    src={getImageBySection(3, "h3_3")!}
                    alt="Partner 2"
                    width={100}
                    height={50}
                    className="max-w-xs group-hover:opacity-20"
                  />
                  <button
                    className="absolute top-1/2 right-1/2 bg-white bg-opacity-75 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() =>
                      handleOpenModal("h3_3", getImageBySection(3, "h3_3")!)
                    }
                  >
                    <Upload className="text-blue-500" />
                  </button>
                </div>
              )}
              {getImageBySection(3, "h3_4") && (
                <div className="relative group">
                  <Image
                    src={getImageBySection(3, "h3_4")!}
                    alt="Partner 2"
                    width={100}
                    height={50}
                    className="max-w-xs group-hover:opacity-20"
                  />
                  <button
                    className="absolute top-1/2 right-1/2 bg-white bg-opacity-75 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() =>
                      handleOpenModal("h3_4", getImageBySection(3, "h3_4")!)
                    }
                  >
                    <Upload className="text-blue-500" />
                  </button>
                </div>
              )}
            </div>
            <div className="text-lg text-gray-400 font-semibold text-center mt-4">
              In collaboration with
            </div>
          </div>
        </section>
        <section className="container mx-auto px-4 py-12">
          {getImageBySection(4, "h4_1") && (
            <div className="relative group">
              <Image
                src={getImageBySection(4, "h4_1")!}
                alt="Team Photo"
                width={1000}
                height={400}
                className="w-full h-auto group-hover:opacity-20"
              />
              <button
                className="absolute top-1/2 right-1/2 bg-white bg-opacity-75 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() =>
                  handleOpenModal("h4_1", getImageBySection(4, "h4_1")!)
                }
              >
                <Upload className="text-blue-500" />
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Update Image Modal */}
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