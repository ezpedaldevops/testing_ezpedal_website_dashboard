"use client";

import Header from "@/components/Header";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Upload } from "lucide-react";
import Image from "next/image";

interface Section {
  _id: string;
  section_name: string;
  section_name_slug: string;
  order: number;
}

interface GalleryImage {
  _id: string;
  image: string;
  blur_img?: string;
  alt: string;
  img_title?: string;
  section_slug: string;
}

const Page = () => {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [sections, setSections] = useState<Section[]>([]);
  const [sectionName, setSectionName] = useState("");
  const [order, setOrder] = useState<number>(1);

  const [images, setImages] = useState<GalleryImage[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState("");

  //------
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadSectionId, setUploadSectionId] = useState("");
  const [uploadSectionSlug, setUploadSectionSlug] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [imgTitle, setImgTitle] = useState("");
  const [alt, setAlt] = useState("");

  // ---------------------------
  // GET ALL SECTIONS
  // ---------------------------
  async function fetchSections() {
    try {
      const res = await axios.get(`${baseURL}/api/v2/gallery-section/get-all`);
      setSections(res.data.data || []);
    } catch (error) {
      console.error("Error loading sections:", error);
    }
  }

  // ---------------------------
  // GET IMAGES OF SECTION
  // ---------------------------
  async function fetchImages(slug: string) {
    try {
      const res = await axios.get(
        `${baseURL}/api/v2/gallery-image/get-all-images/${slug}`
      );
      setImages(res.data.data || []);
      setModalOpen(true);
    } catch (err) {
      console.error("Error loading images:", err);
    }
  }

  // ---------------------------
  // CREATE NEW SECTION
  // ---------------------------
  async function createSection(e: React.FormEvent) {
    e.preventDefault();

    if (!sectionName.trim()) {
      alert("Section name required.");
      return;
    }

    try {
      await axios.post(`${baseURL}/api/v2/gallery-section/create`, {
        section_name: sectionName,
        order,
      });

      setSectionName("");
      setOrder(1);
      fetchSections();
      alert("Section created!");
    } catch (err) {
      console.error("Create failed:", err);
      alert("Failed to create section.");
    }
  }

  useEffect(() => {
    fetchSections();
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();

    if (!file) {
      alert("Please select an image file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("alt", alt);
    formData.append("img_title", imgTitle);

    try {
      await axios.post(
        `${baseURL}/api/v2/gallery-image/add/${uploadSectionId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Image uploaded");

      setFile(null);
      setImgTitle("");
      setAlt("");
      setUploadOpen(false);

      fetchImages(uploadSectionSlug);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed.");
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Head>
          <title>Gallery Admin - Ezpedal</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header />

        <main className="flex flex-col xl:px-32 md:px-16 px-4 w-full py-8">
          <div className="flex flex-col justify-center items-center mb-8">
            <h3 className="text-xl py-2 font-poppins font-medium text-black">
              Gallery
            </h3>
            <h1 className="text-6xl font-outfit text-black">Add New Section</h1>
            <h3 className="font-poppins my-2 text-lg">
              Select existing sections or add new categories.
            </h3>
          </div>

          {/* FORM */}
          <form
            onSubmit={createSection}
            className="bg-white p-6 rounded-xl shadow-md w-full mb-10"
          >
            <h2 className="text-xl font-outfit mb-4">Create Section</h2>

            <div className="grid grid-cols-2 gap-6 font-poppins">
              <div className="flex flex-col">
                <label className="text-sm font-semibold  mb-1">
                  Section Name
                </label>
                <input
                  type="text"
                  value={sectionName}
                  onChange={(e) => setSectionName(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                  placeholder="Example: Germany, Saalburg"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  Section Display Order
                </label>
                <input
                  type="number"
                  min={1}
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="px-3 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-5 bg-[#223658] text-white py-2 px-6 rounded-lg hover:bg-[#1a2947] flex items-center gap-2"
            >
              Create Section
            </button>
          </form>

          {/* TABLE OF SECTIONS */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-outfit mb-4">All Sections</h2>

            <table className="min-w-full text-sm border-separate border-spacing-3 font-poppins text-center">
              <thead>
                <tr>
                  <th className="px-3 py-4">Name</th>
                  <th className="px-3 py-4">Slug</th>
                  <th className="px-3 py-4">Order</th>
                  <th className="px-3 py-4">Images</th>
                  <th className="px-3 py-4">Upload</th>
                </tr>
              </thead>

              <tbody>
                {sections.length ? (
                  sections.map((section) => (
                    <tr key={section._id}>
                      <td className="px-3 py-3 bg-slate-200 rounded-lg border">
                        {section.section_name}
                      </td>
                      <td className="px-3 py-3 bg-slate-200 rounded-lg border">
                        {section.section_name_slug}
                      </td>
                      <td className="px-3 py-3 bg-slate-200 rounded-lg border">
                        {section.order}
                      </td>
                      <td className="px-3 py-3 bg-slate-200 rounded-lg border">
                        <button
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                          onClick={() => {
                            setSelectedSlug(section.section_name_slug);
                            fetchImages(section.section_name_slug);
                          }}
                        >
                          <Eye size={16} /> View
                        </button>
                      </td>
                      <td className="px-3 py-3 bg-slate-200 rounded-lg border">
                        <button
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                          onClick={() => {
                            setUploadSectionId(section._id);
                            setUploadSectionSlug(section.section_name_slug);
                            setUploadOpen(true);
                          }}
                        >
                          <Upload size={16} /> Upload
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-5 text-gray-500">
                      No sections found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>

          {/* IMAGE MODAL */}
          {modalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur flex items-center justify-center p-4">
              <div className=" relative bg-white p-6 rounded-xl w-[1000px] max-h-[80vh] overflow-y-auto shadow-xl">
                <h2 className="text-xl font-outfit mb-4">
                  {"Images in Section :"} {selectedSlug}
                </h2>

                {images.length ? (
                  <div className="grid grid-cols-2 gap-3">
                    {images.map((img) => (
                      <div key={img._id} className="border p-2 ">
                        <Image
                          src={img.image}
                          alt={img.alt}
                          className=" h-full w-full"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No images found.</p>
                )}

                <button
                  onClick={() => setModalOpen(false)}
                  className="absolute top-0 right-5 mt-4 bg-red-500 text-white px-5 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {uploadOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center font-poppins p-4 z-50">
              <div className="bg-white p-6 rounded-xl w-[500px] shadow-xl">
                <h2 className="text-xl font-outfit mb-4">
                  Upload Image – {uploadSectionSlug}
                </h2>

                <form onSubmit={handleUpload}>
                  {/* FILE INPUT */}
                  <div className="flex flex-col mb-4">
                    <label className="text-sm font-semibold mb-1">
                      Select Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="border px-3 py-2 rounded-lg"
                    />
                  </div>

                  {/* PREVIEW */}
                  {file && (
                    <div className="relative w-full h-64 mb-4">
    <Image
      src={URL.createObjectURL(file)}
      alt="image"
      fill
      className="object-contain rounded-lg border"
      unoptimized
    />
  </div>
                  )}

                  {/* ALT TEXT */}
                  <div className="flex flex-col mb-4">
                    <label className="text-sm font-semibold mb-1">Alt</label>
                    <input
                      type="text"
                      value={alt}
                      onChange={(e) => setAlt(e.target.value)}
                      placeholder="Image alt text"
                      className="border px-3 py-2 rounded-lg"
                      required
                    />
                  </div>

                  {/* IMAGE TITLE */}
                  <div className="flex flex-col mb-4">
                    <label className="text-sm font-semibold mb-1">
                      Image Title
                    </label>
                    <input
                      type="text"
                      value={imgTitle}
                      onChange={(e) => setImgTitle(e.target.value)}
                      placeholder="Optional title"
                      className="border px-3 py-2 rounded-lg"
                    />
                  </div>

                  {/* BUTTONS */}
                  <div className="flex justify-end gap-3 mt-5">
                    <button
                      type="button"
                      onClick={() => setUploadOpen(false)}
                      className="bg-gray-300 px-5 py-2 rounded-lg"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="bg-[#223658] text-white px-5 py-2 rounded-lg hover:bg-[#1a2947]"
                    >
                      Upload
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Page;

// "use client";
// import Header from "@/components/Header";
// import Head from "next/head";
// import React from "react";

// const Page = () => {
//   return (
//     <>
//       <div className="min-h-screen bg-gray-100">
//         <Head>
//           <title>Learn - Ezpedal</title>
//           <link rel="icon" href="/favicon.ico" />
//         </Head>
//         <Header />

//         <main className="flex flex-col xl:px-32 md:px-16 px-4 w-full py-8">
//           <div className="flex flex-col justify-center items-center mb-8">
//             <h3 className="text-xl py-2 font-poppins font-medium text-black">
//               Gallery
//             </h3>
//             <h1 className="text-6xl  font-outfit text-black">
//               Add New Section
//             </h1>
//             <h3 className="font-Poppins my-2 text-lg">
//               Select the Existing Section or ‘Add new’ to add Section into the
//               ‘Gallery’ section.
//             </h3>
//           </div>
//         </main>
//       </div>
//     </>
//   );
// };

// export default Page;
