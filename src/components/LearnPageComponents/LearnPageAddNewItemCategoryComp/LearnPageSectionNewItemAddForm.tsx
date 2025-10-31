"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface LearnPageSectionNewItemAddFormProps {
  toTitleCase: (str: string) => string;
  slugTitle: string;
  categoryId: string;
}

const LearnPageSectionNewItemAddForm: React.FC<LearnPageSectionNewItemAddFormProps> = ({
  slugTitle,
  categoryId,
}) => {
  const router = useRouter();

  const handleNavigate = () => {
    const slug = slugTitle.toLowerCase().replace(/\s+/g, "-");
    router.push(`/mediaform/${categoryId}-${slug}`);
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-[300px] bg-[#f0e5e5] xl:px-32 md:px-16 px-4">
      <h1 className="text-6xl font-outfit text-black">
        Add new Item to the Library
      </h1>
      <h3 className="font-Poppins my-2 text-lg">
        Fill the following form to add a new piece of information to the library
      </h3>
      <button
        onClick={handleNavigate}
        className="mt-4 px-6 bg-[#223658] text-white py-2 rounded-xl hover:bg-black transition"
      >
        Add New Item
      </button>
    </div>
  );
};

export default LearnPageSectionNewItemAddForm;

