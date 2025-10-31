"use client";
import axios from "axios";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Category {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  icon: typeof ArrowRight;
}

interface AddNewCategoryFormProps {
  onCategoryAdded?: (category: Category) => void;
}

const AddNewCategoryForm = ({ onCategoryAdded }: AddNewCategoryFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const getToken = (): string | null => {
    const token = localStorage.getItem("token");
    return token ? `Bearer ${token}` : null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    if (!coverFile) {
      alert("Please add a cover image");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("addTitleCategory", title);
    formData.append("descriptionOfCategory", description);
    formData.append("file", coverFile);

    try {
      const res = await axios.post(
        `${baseURL}/api/v2/learn/create-category`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        alert("Category created successfully!");

        const newCategory: Category = {
          id: res.data.data._id,
          title: res.data.data.addTitleCategory,
          description: res.data.data.descriptionOfCategory,
          coverImage: res.data.data.coverImageUrl,
          icon: ArrowRight,
        };

        onCategoryAdded?.(newCategory); // ✅ properly typed callback

        setTitle("");
        setDescription("");
        setCoverFile(null);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="">
        <div className="flex flex-col gap-y-5 py-7">
          <h1 className="text-5xl font-outfit font-medium text-black ">
            Add New Category
          </h1>
          <p className="text-xl font-outfit text-black">
            Add a new section to ‘Learn’ Page
          </p>
        </div>

        <form
          className=" gap-y-6  flex flex-col justify-center items-start transition "
          onSubmit={handleSubmit}
        >
          {/* Title of Category */}
          <div className="flex flex-col w-full">
            <label htmlFor="title" className="font-outfit text-black  mb-2">
              Title of Category
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              name="title"
              className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
              required
            />
          </div>

          {/* Description of Category */}
          <div className="flex flex-col w-full gap-y-4">
            <label htmlFor="description" className="font-outfit text-black ">
              Description of Category
            </label>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              id="description"
              name="description"
              className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none resize-none"
              rows={3}
              required
            />
            <p className="text-xs font-thin px-5 my-[-5px]">
              Maximum 300 Character.
            </p>
          </div>

          {/* Add Cover Image */}

          {/* Add Cover Image */}
          <div className="flex flex-col w-full gap-y-4">
            <label htmlFor="coverImage" className="font-outfit text-black ">
              Add Cover Image
            </label>

            {/* Preview before upload */}
            {coverFile && (
              <div className="flex justify-center mb-2">
                <Image
                  src={URL.createObjectURL(coverFile)}
                  width={300}
                  height={200}
                  alt="Selected preview"
                  className="max-h-40 rounded-xl shadow"
                />
              </div>
            )}

            {/* Custom upload box */}
            <label
              htmlFor="coverImage"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#223658] rounded-xl cursor-pointer bg-white/40 hover:bg-white/60 transition"
            >
              <span className="text-[#223658] text-xl font-thin">
                Add Cover +
              </span>
              <span className="text-xs font-thin text-gray-500">
                Click to upload or drag & drop
              </span>
            </label>

            {/* Hidden file input */}
            <input
              id="coverImage"
              name="coverImage"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
            />

            <p className="text-xs font-thin px-5 my-[-5px]">
              Size : W x H = 1440 px X 552 px
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 w-1/5 bg-black text-white py-2 px-4 rounded-xl hover:bg-[#1a2947] transition"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Category"}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddNewCategoryForm;
