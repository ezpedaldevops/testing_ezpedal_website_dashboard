"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Header from "@/components/Header";
import Head from "next/head";
import { ArrowRight, LucideIcon, Plus, Trash, Pencil } from "lucide-react";
import AddNewCategoryForm from "@/components/LearnPageComponents/AddNewCategoryForm";
import { useRouter } from "next/navigation";
interface Category {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  file?: File | null;
  icon: LucideIcon;
}

interface GetCategory {
  _id: string;
  addTitleCategory: string;
  descriptionOfCategory: string;
  coverImageUrl: string;
  file: File | null;
}

const Learn = () => {
  const [cards, setCards] = useState<Category[]>([]);
  const [onClickAddCard, setOnClickAddCard] = useState(false);
  const addFormRef = useRef<HTMLElement | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const router = useRouter();
  const getToken = (): string | null => {
    const token = localStorage.getItem("token");
    return token ? `Bearer ${token}` : null;
  };
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (onClickAddCard && addFormRef.current) {
      addFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [onClickAddCard]);

  //   const handleDelete = async (id: string) => {
  //     const token = getToken();
  //     if (!token) throw new Error("Not authenticated");

  //     const confirmDelete = window.confirm(
  //       `
  //                                ⚠️ Category Delete ?

  // Please make Sure All Media Files Inside this Category is Already Deleted !

  // Then, Press OK To Delete Category Permanently
  //       `
  //     );
  //     if (!confirmDelete) return;

  //     try {
  //       const res = await axios.delete(
  //         `${baseURL}/api/v2/learn/delete-category/${id}`,
  //         {
  //           headers: {
  //             Authorization: `${token}`,
  //           },
  //         }
  //       );

  //       if (res.data.success) {
  //         // remove deleted card from UI
  //         setCards((prev) => prev.filter((card) => card.id !== id));
  //         alert("Category deleted successfully");
  //       }
  //     } catch (err) {
  //       console.error("Failed to delete category", err);
  //       alert("Error deleting category");
  //     }
  //   };

  const handleDelete = async () => {
    if (!deleteId) return;

    const token = getToken();
    if (!token) throw new Error("Not authenticated");

    try {
      const res = await axios.delete(
        `${baseURL}/api/v2/learn/delete-category/${deleteId}`,
        {
          headers: { Authorization: `${token}` },
        }
      );

      if (res.data.success) {
        setCards((prev) => prev.filter((card) => card.id !== deleteId));
      }
    } catch (err) {
      console.error("Failed to delete category", err);
      alert("Error deleting category");
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/v2/learn/get-all-category`);
        if (res.data.success) {
          const apiCards = res.data.data.map((cat: GetCategory) => ({
            id: cat._id,
            title: cat.addTitleCategory,
            description: cat.descriptionOfCategory,
            coverImage: cat.coverImageUrl,
            icon: ArrowRight,
          }));
          setCards([
            ...apiCards,
            { id: "add-new", title: "Add New", icon: Plus },
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, [baseURL]);

  const handleEdit = (card: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditCategory(card);
    setIsEditModalOpen(true);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCategory) return;

    const token = getToken();
    if (!token) throw new Error("Not authenticated");

    try {
      const formData = new FormData();
      formData.append("addTitleCategory", editCategory.title);
      formData.append("descriptionOfCategory", editCategory.description);

      if (editCategory.file) {
        formData.append("file", editCategory.file); // 👈 correct way
      }

      const res = await axios.patch(
        `${baseURL}/api/v2/learn/update-category/${editCategory.id}`,
        formData,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        setCards((prev) =>
          prev.map((card) =>
            card.id === editCategory.id ? { ...card, ...editCategory } : card
          )
        );
        setIsEditModalOpen(false);
        setEditCategory(null);
      }
    } catch (err) {
      console.error("Failed to update category", err);
      alert("Error updating category");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Learn - Ezpedal</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <main className="flex flex-col xl:px-32 md:px-16 px-4 w-full py-8">
        <section>
          <div className="flex flex-col justify-center items-center mb-8">
            <h3 className="text-xl py-2 font-poppins font-medium text-black">
              Learn
            </h3>
            <h1 className="text-6xl  font-outfit text-black">Add File</h1>
            <h3 className="font-Poppins my-2 text-lg">
              Select the Existing Category or ‘Add new’ to add new item into the
              ‘Learn’ section.
            </h3>
          </div>

          <div className="p-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 ">
              {cards.map((card) => {
                const Icon = card.icon;
                const isAddNew = card.title === "Add New";

                return (
                  <div
                    key={card.id}
                    onClick={() => {
                      if (isAddNew) {
                        setOnClickAddCard(true);
                      } else {
                        const slug = card.title
                          .toLowerCase()
                          .replace(/\s+/g, "-");
                        router.push(`/learn/${card.id}-${slug}`);
                      }
                    }}
                    className={` p-5 h-96 flex flex-col justify-center items-start transition hover:shadow-lg cursor-pointer
                      ${
                        isAddNew
                          ? " bg-transparent"
                          : " shadow-md bg-gradient-to-r from-[#A7AFBC66] to-[#DDE2EB]"
                      }`}
                    style={{
                      backgroundImage: "url('/category_card_bg.png')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <Icon
                      className={`w-10 h-10 mb-3 text-white ${
                        isAddNew ? "text-white" : ""
                      }`}
                    />
                    <h3
                      className={`text-5xl font-outfit text-white ${
                        isAddNew ? "text-white" : ""
                      }`}
                    >
                      {card.title}
                    </h3>
                    <div className="flex justify-center items-center mt-5 gap-5">
                      <button
                        onClick={(e) => handleEdit(card, e)}
                        className={` p-1 px-3 rounded-full text-[8px] text-white   hover:text-blue-950 ${
                          isAddNew ? "hidden" : "block"
                        }`}
                      >
                        <Pencil className="w-6 h-6" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(card.id);
                          setIsDeleteModalOpen(true);
                        }}
                        className={`p-1 px-2 rounded-full text-[8px] text-white  hover:text-red-600 ${
                          isAddNew ? "hidden" : "block"
                        }`}
                        title="Make sure all files inside this category is Empty Before Delete "
                      >
                        <Trash className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 transition-all">
            <div className="bg-[#223658] p-6 py-20  shadow-2xl max-w-3xl w-full text-center animate-fadeIn flex flex-col gap-y-3">
              <h2 className="text-3xl font-medium font-outfit text-white mb-3">
                Are you sure you want to delete this category?
              </h2>
              <p className="text-white font-poppins text-sm mb-6">
                Please make sure all media files inside this category are
                deleted.
                <br />
                <br />
                This action is permanent and cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                
                <button
                  onClick={handleDelete}
                  className="px-5 py-2 bg-transpernt text-white rounded-lg border-2 border-gray-600 hover:bg-white hover:text-white transition"
                >
                  Delete Anyway
                </button>
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setDeleteId(null);
                  }}
                  className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {onClickAddCard && (
          <section
            ref={addFormRef}
            className={`px-6 transition-all duration-300 ${
              onClickAddCard ? "block" : "hidden"
            }`}
            id="AddNewCategoryForm"
          >
            <AddNewCategoryForm
              onCategoryAdded={(newCat: Category) => {
                setCards((prev) => [
                  ...prev.slice(0, -1),
                  newCat,
                  prev[prev.length - 1],
                ]);
              }}
            />
          </section>
        )}
      </main>
      {/* Edit Modal */}
      {isEditModalOpen && editCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#223658]  rounded-lg p-6 shadow-lg max-w-xl  w-full">
            <h2 className="text-4xl font-poppins text-white font-semibold mb-6 flex justify-center items-center">
              Edit Category
            </h2>
            <form
              onSubmit={handleUpdateCategory}
              className="flex flex-col gap-4"
            >
              <label
                htmlFor="title"
                className="text-lg font-medium text-white mb-2"
              >
                Title
              </label>
              <input
                type="text"
                value={editCategory.title}
                onChange={(e) =>
                  setEditCategory({ ...editCategory, title: e.target.value })
                }
                className="border px-3 py-2 rounded-2xl"
              />
              <label
                htmlFor="title"
                className="text-lg font-medium text-white mb-2"
              >
                Description
              </label>
              <textarea
                value={editCategory.description}
                rows={5}
                onChange={(e) =>
                  setEditCategory({
                    ...editCategory,
                    description: e.target.value,
                  })
                }
                className="border px-3 py-2 rounded-2xl"
              />
              <label className="text-lg font-medium text-white mb-2">
                Cover Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setEditCategory({
                    ...editCategory,
                    file: e.target.files?.[0] || null,
                  })
                }
                className="border px-3 py-2 bg-white"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditCategory(null);
                  }}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Learn;
