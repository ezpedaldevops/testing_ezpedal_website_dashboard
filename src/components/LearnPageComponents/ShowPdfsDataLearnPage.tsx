"use client";
import { useEffect, useState } from "react";
import UpdateMediaLearnPage from "./UpdateMediaLearnPage";
import Image from "next/image";
import { Trash, Pencil } from "lucide-react";

interface Media {
  _id: string;
  title: string;
  abstract: string;
  coverImageUrl: string;
  fileUrl: string;
  fileType: string;
  authorOfDocument: string;
  dateOfPublish: string;
  tags?: string[];
}

interface Props {
  slugTitle: string;
  categoryId: string;
}

const ShowPdfsDataLearnPage = ({  categoryId }: Props) => {
  const [media, setMedia] = useState<Media[]>([]);
  const [, setPage] = useState(1);
  const [, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isShowEditPage, setIsShowEditPage] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const getToken = (): string | null => {
    const token = localStorage.getItem("token");
    return token ? `Bearer ${token}` : null;
  };

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(
        `${baseURL}/api/v2/learn-media/get-all-category-media/${categoryId}`,
        { headers: { Authorization: token } }
      );

      if (!res.ok) throw new Error("Failed to fetch media");
      const data = await res.json();

      setMedia(data.data);
      setTotalPages(data.pagination.totalPages || 1);
      setPage(data.pagination.page || 1);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("Unexpected error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId) fetchMedia();
  }, [categoryId]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media?")) return;
    try {
      const token = getToken();
      const res = await fetch(
        `${baseURL}/api/v2/learn-media/delete-category-media/${id}`,
        { method: "DELETE", headers: { Authorization: token! } }
      );
      if (!res.ok) throw new Error("Failed to delete");
      alert("Deleted successfully!");
      fetchMedia(); // refresh current page
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unknown error occurred.");
      }
    }
  };

  const handleEdit = (mediaItem: Media) => {
    setSelectedMedia(mediaItem);
    setIsShowEditPage(true);
  };

  const closeModal = () => {
    setSelectedMedia(null);
    setIsShowEditPage(false);
  };



  const formatPublishedDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-GB", { month: "long" });
    const year = date.getFullYear();

    // Determine the correct ordinal suffix
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";

    return `${day}${suffix} ${month}, ${year}`;
  };
  const [sortBy, setSortBy] = useState<"date" | "tags" | "fileType">("date");

  // Derived + sorted data
  const sortedMedia = [...media].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return (
          new Date(b.dateOfPublish).getTime() -
          new Date(a.dateOfPublish).getTime()
        );

      case "tags":
        return (a.tags?.join(", ").toLowerCase() || "").localeCompare(
          b.tags?.join(", ").toLowerCase() || ""
        );

      case "fileType":
        return a.fileType.localeCompare(b.fileType);

      default:
        return 0;
    }
  });

  return (
    <>
      <div className="bg-gray-100">
        <main className="flex flex-col xl:px-32 md:px-16 px-4 w-full py-8">
          <div className="p-6">
             {loading ? (
              <div className="text-center text-gray-500 text-lg font-poppins py-20">
                Loading...
              </div>
            ) :
            media.length === 0 ? (""):(
            <div className="flex justify-start items-center gap-5 mb-8">
              <span className="font-poppins p-2 px-5">Sort By</span>

              {[
                { label: "Date", key: "date" },
                { label: "Tags", key: "tags" },
                { label: "File Type", key: "fileType" },
              ].map((option) => (
                <span
                  key={option.key}
                  onClick={() =>
                    setSortBy(option.key as "date" | "tags" | "fileType")
                  }
                  className={`font-poppins p-2 px-5 rounded-md cursor-pointer transition-all duration-200 ${
                    sortBy === option.key
                      ? "bg-[#dcd7d7] text-black font-medium shadow-lg"
                      : "bg-transparent text-black "
                  }`}
                >
                  {option.label}
                </span>
              ))}
            </div>
            )}
            {loading ? (
              <div className="text-center text-gray-500 text-lg font-poppins py-20">
                Loading...
              </div>
            ) : media.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-black py-20">
                <h1 className="text-4xl font-outfit">No Item Added</h1>
                <p className="text-center text-2xl text-wrap w-1/2">
                  Add new item from top most section to get an overview of the
                  website here
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {sortedMedia.map((m) => (
                  <div
                    className="relative border-2 border-[#9da7b366] shadow-md bg-[#F2F2F2] h-max"
                    key={m._id}
                  >
                    <div className="flex flex-col gap-5 p-5">
                      <h3>
                        {m.tags?.flatMap((tagStr) =>
                          tagStr.split(",").map((tag) => (
                            <span
                              key={tag}
                              className="text-black font-medium px-3 py-1 rounded-full text-lg font-poppins"
                            >
                              {tag.trim()}
                            </span>
                          ))
                        )}
                      </h3>
                      <h1 className="text-4xl font-outfit font-medium text-black text-wrap">
                        {m.title}
                      </h1>
                      <h4 className="text-md font-poppins text-black">
                        Written by {m.authorOfDocument}
                      </h4>
                      <h5 className="text-md font-poppins text-black">
                        Published on {formatPublishedDate(m.dateOfPublish)}
                      </h5>
                      <span
                        className="text-lg font-poppins font-medium text-black cursor-pointer hover:text-blue-500 w-max"
                        onClick={() => window.open(m.fileUrl, "_blank")}
                      >
                        Explore {">"}
                      </span>
                    </div>
                    <Image
                      src={m.coverImageUrl}
                      alt={m.title}
                      height={250}
                      width={400}
                      className="w-full object-cover cursor-pointer"
                      onClick={() => window.open(m.fileUrl, "_blank")}
                    />
                    <div className="absolute top-3 right-3 flex justify-center items-center gap-5">
                      <button
                        className="hover:text-blue-600"
                        onClick={() => handleEdit(m)}
                      >
                        <Pencil />
                      </button>
                      <button
                        className="hover:text-red-600"
                        onClick={() => handleDelete(m._id)}
                      >
                        <Trash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {isShowEditPage && selectedMedia && (
        <UpdateMediaLearnPage
          selectedMedia={selectedMedia}
          closeModal={closeModal}
        />
      )}
    </>

    // <div className="bg-gray-100">
    //   <main className="flex flex-col xl:px-32 md:px-16 px-4 w-full py-8">
    //     <section>
    //       <div className="flex flex-col">
    //         <h1 className="text-4xl text-[#223658] font-Poppins">
    //           All Files of {slugTitle}
    //         </h1>
    //       </div>

    //       {loading && <p>Loading...</p>}

    //       <div className="p-6">
    //         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
    //           {media.map((m) => (
    //             <div
    //               key={m._id}
    //               className="border-2 rounded-2xl border-[#9da7b366] shadow-md bg-gradient-to-r from-[#A7AFBC66] to-[#DDE2EB]"
    //             >
    //               <Image
    //                 src={m.coverImageUrl}
    //                 alt={m.title}
    //                 height={300}
    //                 width={400}
    //                 className="h-60 w-full object-cover cursor-pointer rounded-t-2xl"
    //                 onClick={() => window.open(m.fileUrl, "_blank")}
    //               />
    //               <div className="p-4 flex-1 flex flex-col justify-between">
    //                 <div>
    //                   <h2 className="font-semibold text-lg">{m.title}</h2>
    //                   <p className="text-sm text-gray-500">
    // Written by {m.authorOfDocument} ⚡{" "}
    // {new Date(m.dateOfPublish).toLocaleDateString("en-GB", {
    //   day: "2-digit",
    //   month: "2-digit",
    //   year: "numeric",
    // })}
    //                   </p>

    //                   {/* Tags */}
    //                   <div className="flex justify-end flex-wrap gap-2 mt-2">
    // {m.tags?.flatMap((tagStr) =>
    //   tagStr.split(",").map((tag) => (
    //     <span
    //       key={tag}
    //       className="bg-gray-200 border-2 border-gray-500 text-gray-800 px-3 py-1 rounded-full text-xs"
    //     >
    //       {tag.trim()}
    //     </span>
    //   ))
    // )}
    //                   </div>
    //                 </div>

    //                 <div className="flex justify-center gap-3 mt-4">
    // <button
    //   className="bg-[#223658] text-white px-5 py-1 rounded-full hover:bg-blue-600"
    //   onClick={() => handleEdit(m)}
    // >
    //   EDIT
    // </button>
    //                   <button
    //                     className="bg-black rounded-full text-white px-5 py-1 hover:bg-red-600"
    //                     onClick={() => handleDelete(m._id)}
    //                   >
    //                     DELETE
    //                   </button>
    //                 </div>
    //               </div>
    //             </div>
    //           ))}
    //         </div>

    //         {/* Pagination */}
    //         <div className="flex justify-center gap-4 mt-6">
    //           <button
    //             className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
    //             onClick={prevPage}
    //             disabled={page === 1}
    //           >
    //             Previous
    //           </button>
    //           <span className="px-4 py-2">
    //             Page {page} of {totalPages}
    //           </span>
    //           <button
    //             className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
    //             onClick={nextPage}
    //             disabled={page === totalPages}
    //           >
    //             Next
    //           </button>
    //         </div>
    //       </div>
    //     </section>
    //   </main>

    //   {/* --- Modal --- */}
    //   {isShowEditPage && selectedMedia && (
    //     <UpdateMediaLearnPage
    //       selectedMedia={selectedMedia}
    //       closeModal={closeModal}
    //     />
    //   )}
    // </div>
  );
};

export default ShowPdfsDataLearnPage;
