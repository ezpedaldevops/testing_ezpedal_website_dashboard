"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";
import UpdateImageModal from "@/components/UpdateImageModal"; // Import the modal component
import { Upload } from "lucide-react";
// import AddImageModal from "@/components/AddImageModal";
import { ImageData } from "@/types";

export default function PedelecPage() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIdentifier, setSelectedImageIdentifier] = useState<
    string | null
  >(null);
  const [selectedImageLink, setSelectedImageLink] = useState<string>("");
  // const [addImageModalOpen, setAddImageModalOpen] = useState(false);
const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

const fetchImages = useCallback(async () => {
  try {
    const res = await fetch(`${baseURL}/api/v1/website-img/images-list?page_name=products`, {
      method: "GET",
    });

    if (!res.ok) throw new Error("Failed to fetch images");

    const result = await res.json();
    setImages(result.data || []);
  } catch (error) {
    console.error("Error fetching images:", error);
  }
}, [baseURL]); // <-- add any dependencies here

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

  // const handleAddModal = () => {
  //   setAddImageModalOpen(true);
  // };

  // const handleAddCloseModal = () => {
  //   setAddImageModalOpen(false);
  // };

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
    <div className="flex xl:px-32 px-8 w-full py-8">
      <div className="flex flex-col">
        <main className="mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center justify-center text-blue-950">
            Pedelec
          </h1>
          <p className="mb-36 w-full sm:w-2/3 mx-auto text-lg md:text-2xl text-center">
            Premium quality electrical bicycle based on European standards, the
            first of its kind docked bicycle and pedelec ride sharing in{" "}
            <span className="text-orange-600">India.</span>
          </p>

          <section>
            <div className="space-y-24 sm:space-y-48">
              {images.map((product, index) => (
                <div
                  key={product.image_identifier}
                  className="relative flex items-center justify-center group"
                >
                  <div className="w-full sm:w-2/3">
                    <Image
                      src={product.media.url}
                      alt={"product" + index}
                      width={400}
                      height={300}
                      className="w-full h-auto group-hover:opacity-20"
                    />
                    <button
                      className="absolute top-1/2 right-1/2 bg-white bg-opacity-75 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() =>
                        handleOpenModal(
                          product["image_identifier"],
                          product.media.url
                        )
                      }
                    >
                      <Upload className="text-blue-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* <div className="flex justify-center">
              <button onClick={handleAddModal} className="bg-blue-950 text-white rounded-xl mt-8 p-4">Add Image</button>
            </div> */}
          </section>
        </main>
      </div>
      <>
        {isModalOpen && (
          <UpdateImageModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            currentLink={selectedImageLink}
            imageId={selectedImageIdentifier!}
            onUpdate={handleUpdateImage}
          />
        )}
      </>
      {/* <>
        {addImageModalOpen && (
          <AddImageModal
            isOpen={addImageModalOpen}
            onClose={handleAddCloseModal}
            currentLink={selectedImageLink}
            imageId={selectedImageIdentifier!}
            onUpdate={handleUpdateImage}
          />
        )}
      </> */}
    </div>
  );
}
