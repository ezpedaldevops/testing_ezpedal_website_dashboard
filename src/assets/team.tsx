"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Upload } from "lucide-react";
import UpdateImageModal from "@/components/UpdateImageModal";
import { Linkedin } from "lucide-react";
// import { supabase } from "@/lib/supabase";
import { ImageData } from "@/types";
import Link from "next/link";

const Team = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIdentifier, setSelectedImageIdentifier] = useState<
    string | null
  >(null);
  const [selectedImageLink, setSelectedImageLink] = useState<string>("");
const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

const fetchImages = useCallback(async () => {
  try {
    const res = await fetch(`${baseURL}/api/v1/website-img/images-list?page_name=team`, {
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

const getImageBySection = (section: number, identifier: string) => {
  return images.find(
    (img) =>
      Number(img.section_name) === section &&
      img.image_identifier === identifier
  )?.media.url;
};

  return (
    <div className="flex xl:px-32 px-8 w-full py-12">
      <div className="space-y-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-950">
            Our Team
          </h1>
          <p className="text-lg md:text-xl max-w-2xl md:max-w-4xl mx-auto">
            Our team is built with individuals who challenge the status quo and
            believe in creating a positive impact with their work. These are
            people who are crazy enough to think they can change the world in
            making a brighter future for human society.
          </p>
          <p className="mt-2 text-lg md:text-xl">
            If you think you fit in the block, join the revolution.
          </p>
        </div>

        <div className="w-1/2 mx-auto h-1 bg-gray-200" />

        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            Our Mentors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:mb-24 mb-8 md:mb-12 items-center justify-center xl:gap-0 gap-8">
              {['Hannes Neupert', 'Harmanjit Singh'].map((name, index) => (
                <div key={name} className="flex flex-col items-center">
                  {getImageBySection(1, `t1_${index + 1}`) && (
                    <div className="relative group">
                      <Image src={getImageBySection(1, `t1_${index + 1}`)!} alt={name} width={300} height={300} className="mb-4 group-hover:opacity-20" sizes="(max-width: 640px) 80vw, 40vw" />
                      <button
                  className="absolute top-1/2 right-1/2 bg-white bg-opacity-75 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity
"
                  onClick={() =>
                    handleOpenModal(`t1_${index+1}`, getImageBySection(1, `t1_${index+1}`)!)
                  }
                >
                  <Upload className="text-blue-500" />
                </button>
                    </div>
                  )
                    }
                  <h3 className="text-lg md:text-xl font-semibold mb-2">{name}</h3>
                  <Link href="#">
                  <Linkedin className="w-6 h-6" />
                  </Link>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 xl:gap-0 gap-8">
              {['Felix Friederich', 'Johannes Dörndorfer', 'Mohua Yang'].map((name,index) => (
                <div key={name} className="flex flex-col items-center">
                  {
                    getImageBySection(1, `t1_${index + 3}`) && (
                      <div className="relative group">
                        <Image src={getImageBySection(1, `t1_${index + 3}`)!} alt={name} width={300} height={300} className="mb-4 group-hover:opacity-20" sizes="(max-width: 640px) 80vw, 40vw" />
                        <button
                  className="absolute top-1/2 right-1/2 bg-white bg-opacity-75 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity
"
                  onClick={() =>
                    handleOpenModal(`t1_${index+3}`, getImageBySection(1, `t1_${index+3}`)!)
                  }
                >
                  <Upload className="text-blue-500" />
                </button>
                      </div>
                    )
                  }
                  <h3 className="text-lg md:text-xl font-semibold mb-2">{name}</h3>
                  <Link href="#">
                  <Linkedin className="w-6 h-6" />
                  </Link>
                </div>
              ))}
            </div>        
        </div>

        <div className="w-1/2 mx-auto h-1 bg-gray-200" />

        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            Our Founders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: "Nikheel Dilip Deshmukh, CEO",
                image: getImageBySection(2, "t2_1")!,
              },
              {
                name: "Prathyush Sreenivasan, CTO",
                image: getImageBySection(2, "t2_2")!,
              },
            ].map((founder, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="relative group">
                  <Image
                    src={founder.image}
                    alt={founder.name}
                    width={300}
                    height={300}
                    className="mb-4 group-hover:opacity-20"
                    sizes="(max-width: 640px) 80vw, 40vw"
                  />
                  <button
                    className="absolute top-1/2 right-1/2 bg-white bg-opacity-75 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity
"
                    onClick={() =>
                      handleOpenModal(`t2_${index + 1}`, founder.image)
                    }
                  >
                    <Upload className="text-blue-500" />
                  </button>
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">
                  {founder.name}
                </h3>
                <div className="flex space-x-2">
                  <Linkedin className="w-6 h-6" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-1/2 mx-auto h-1 bg-gray-200" />

        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            The Team
          </h2>
          <div className="relative group">
            <Image
              src={getImageBySection(3, "t3_1")!}
              alt="Team"
              width={800}
              height={400}
              className="w-full group-hover:opacity-20"
              sizes="(max-width: 640px) 90vw, 80vw "
            />
            <button
              className="absolute top-1/2 right-1/2 bg-white bg-opacity-75 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity
"
              onClick={() =>
                handleOpenModal("t3_1", getImageBySection(3, "t3_1")!)
              }
            >
              <Upload className="text-blue-500" />
            </button>
          </div>
        </div>
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

export default Team;
