'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import WordWithLeftBorder from "@/components/WordWithLeftBorder"
// import { supabase } from '@/lib/supabase'
import UpdateImageModal from '@/components/UpdateImageModal'
import { Upload } from 'lucide-react'
const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

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




export default function Advertise() {
  const [images, setImages] = useState<ImageData[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIdentifier, setSelectedImageIdentifier] = useState<string | null>(null);
  const [selectedImageLink, setSelectedImageLink] = useState<string>("");
  
  useEffect(() => {
    // Fetch image from supabase
const fetchImages = async () => {
    try {
      const res = await fetch(
        `${baseURL}/api/v1/website-img/images-list?page_name=advertise`
      );
      if (!res.ok) throw new Error("Failed to fetch images");

      const result = await res.json();
      const sortedImages = result.data.sort((a: ImageData, b: ImageData) => {
        const aNum = parseInt(a.image_identifier.split("_")[1], 10);
        const bNum = parseInt(b.image_identifier.split("_")[1], 10);
        return aNum - bNum;
      });

      setImages(sortedImages);
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  };
    fetchImages()
  }, [])


  const content = [
    {
      title: "On Pedelecs / Bicycles",
      description: "Partner with us to display your ads on our electric bikes! It's a unique, eco-friendly way to get your message rolling through the city."
    },
    {
      title: "On LED Boards",
      description: "Partner with us to display your ads on our LED boards at mother stations! It’s a unique, high-visibility platform to get your message seen by commuters and city travelers alike."
    },
    {
      title: "Residential / Office Spaces / In Campus",
      description: "Partner with us to display your ads on our society campus boards! It’s a high-visibility platform that ensures your message reaches residents, visitors, and local businesses."
    }
  ]


    const handleOpenModal = (imageId: string, currentLink: string) => {
      console.log("imageId", imageId)
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
    if (!selectedImageIdentifier) return;

    const updated = images.map((img) =>
      img.image_identifier === selectedImageIdentifier
        ? {
            ...img,
            media: { ...img.media, url: newLink },
          }
        : img
    );

    setImages(updated);
    handleCloseModal();
  };

  return (
    <div className="flex flex-col xl:px-32 px-8 py-8 w-full">
      <h1 
        className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12"
      >
        <h1>Advertise</h1>
      </h1>

      {images.map((image, index) => (
        <div 
          key={image._id}
       
          className={`grid sm:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12 ${index % 2 !== 0 ? 'sm:grid-flow-row-dense sm:[&>*:nth-child(1)]:col-start-2 sm:[&>*:nth-child(2)]:col-start-1' : ''}`}
        >
              <div className="flex justify-center items-center">
              <div className="relative group w-full">
              <Image
                src={image.media.url}
                alt={image["image_identifier"]} width={400} height={300} className="w-full h-auto group-hover:opacity-20"
              />
              <button
                className="absolute top-1/2 right-1/2 bg-white bg-opacity-75 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity
                  "
                onClick={() =>
                  handleOpenModal(image['image_identifier'], image.media.url)
                }
              >
                <Upload className="text-blue-500" />
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-center items-start gap-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
              <WordWithLeftBorder>
                {content[index].title.split(" ")[0]}
              </WordWithLeftBorder>
              <span className="ml-2">
                {content[index].title.split(" ").slice(1).join(" ")}
              </span>
            </h2>
            <p className="text-sm sm:text-base">
              {content[index].description}
            </p>
          </div>
        </div>
      ))}

      {/* Update Image Modal */}
      <UpdateImageModal 
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              currentLink={selectedImageLink}
              onUpdate={handleUpdateImage}
                imageId={selectedImageIdentifier!}
          />
    </div>
  )
}
