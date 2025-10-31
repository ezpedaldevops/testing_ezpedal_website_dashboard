// "use client";
// import { useState, useEffect, useRef } from "react";
// import Head from "next/head";
// import Header from "../../../components/Header";
// import InquiriesList from "@/components/InquiriesList";
// import ApplicationModal from "@/components/ApplicationModal";
// import { AllForms } from "@/types"; // Ensure Form type is defined in your types file
// import { supabase } from "@/lib/supabase";

// export default function Careers() {
//   const [selectedApplication, setSelectedApplication] = useState<AllForms | null>(null);
//   const [allForms, setAllForms] = useState<AllForms[]>([]); // Store all forms
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedForms, setSelectedForms] = useState<Set<number>>(new Set());
//   const [selectedCategory, setSelectedCategory] = useState<'career_forms' | 'residential_forms' | 'corporate_forms' | 'advertisement_forms'>("residential_forms");
//   const selectAllInputRef = useRef<HTMLInputElement>(null);

//   const fetchForms = async () => {
//     try {
//       // Fetch forms from Supabase
//       const { data: residentionForms, error: residentionError } = await supabase
//         .from("residential_forms")
//         .select("*")
//         .order('created_at', { ascending: false });
//       const { data: corporateForms, error: corporateError } = await supabase
//         .from("corporate_forms")
//         .select("*")
//         .order('created_at', { ascending: false });
//       // const { data: advertisementForms, error: advertisementError } = await supabase
//       //   .from("advertisement_forms")
//       //   .select("*");

//       if (residentionError || corporateError) {
//         throw new Error(residentionError?.message || corporateError?.message);
//       }

//       // Combine forms and add category
//       const combinedForms = [
//         ...(residentionForms || []).map((form) => ({ ...form, category: "residential_forms" })),
//         ...(corporateForms || []).map((form) => ({ ...form, category: "corporate_forms" })),
//       ];

//       setAllForms(combinedForms); // Set all forms
//       setIsLoading(false);
//     } catch (err) {
//       setError("Failed to fetch forms. Please try again later.");
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchForms();
//   }, []);

//   const handleInquiryClick = (form: AllForms) => {
//     // In a real application, you would fetch the full application details here
//     const fullApplication = {
//       ...form,
//       id: form.id ?? 0, // Ensure id is always defined
//       name: form.name ?? "NA",
//       contact_number: form.contact_number ?? "NA",
//       nameof_company: form.nameof_company ?? "NA" // Ensure nameof_company is always defined as a string
//     };
//     setSelectedApplication(fullApplication);
//   };

//   const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.checked) {
//       const allIds = new Set(allForms.map((form: AllForms) => form.id)); // Use allForms
//       setSelectedForms(allIds);
//     } else {
//       setSelectedForms(new Set());
//     }
//   };

//   const handleSelectForm = (id: number) => {
//     const updatedSelectedForms = new Set(selectedForms);
//     if (updatedSelectedForms.has(id)) {
//       updatedSelectedForms.delete(id);
//     } else {
//       updatedSelectedForms.add(id);
//     }
//     setSelectedForms(updatedSelectedForms);
//   };

//   const handleMassForward = async () => {
//     // Forward selected forms to a particular email
//     const idArray = Array.from(selectedForms);
//     const body = {
//       type: selectedCategory,
//       idArray,
//     }

//     const res = await fetch('/api/forward', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(body),
//     });

//     // Handle response
//     if (res.ok) {
//       // Handle success
//       alert('Forms forwarded successfully');
//     } else {
//       // Handle error
//       console.error('Failed to forward forms');
//     }

//     setSelectedForms(new Set());
//     if (selectAllInputRef.current) {
//       selectAllInputRef.current.checked = false;
//     }

//   };

//   const handleDeleteSelected = async () => {
//     // Logic to delete selected forms
//     const idsToDelete = Array.from(selectedForms);

//     if (selectedCategory === 'residential_forms') {
//       const { error } = await supabase
//         .from("residential_forms")
//         .delete()
//         .in("id", idsToDelete);

//       if (error) {
//         setError("Failed to delete forms. Please try again later.");
//       } else {
//         // Refresh forms
//         setAllForms(allForms.filter((form) => !idsToDelete.includes(form.id)));
//       }
//     }
//     else if (selectedCategory === 'corporate_forms') {
//       const { error } = await supabase
//         .from("corporate_forms")
//         .delete()
//         .in("id", idsToDelete);

//       if (error) {
//         setError("Failed to delete forms. Please try again later.");
//       } else {
//         // Refresh forms
//         setAllForms(allForms.filter((form) => !idsToDelete.includes(form.id)))

//       }
//     }
//     setSelectedForms(new Set());
//     if (selectAllInputRef.current) {
//       selectAllInputRef.current.checked = false;
//     }
//   };

//   const handleClose = (id?: number) => {
//     setSelectedApplication(null);
//     if (id) {
//       // Remove the form from the list
//       setAllForms(allForms.filter((form) => form.id !== id));
//     }

//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Head>
//         <title>Partnership - Ezpedal</title>
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <Header />

//       <main className="flex flex-col xl:px-32 px-8 w-full py-8">
//         <h1 className="text-3xl font-bold mb-6">Partnership</h1>
//         <div className="flex flex-col md:flex-row gap-4">
//           <input
//             type="text"
//             placeholder="Search"
//             className="flex-grow p-2 border rounded"
//           />
//           <select className="p-2 border rounded"
//             onChange={(e) => {
//               const category = e.target.value as 'career_forms' | 'residential_forms' | 'corporate_forms'; // Type assertion
//               setSelectedCategory(category);
//             }}
//             defaultValue={"residential_forms"}
//           >
//             <option value={"residential_forms"}>Residential</option>
//             <option value={"corporate_forms"}>Corporate</option>

//           </select>
//         </div>

//         <div className="mt-4 flex items-center">
//           <input
//             type="checkbox"
//             onChange={handleSelectAll}
//             className="mr-2"
//             ref={selectAllInputRef}
//           />
//           <span>Select All</span>
//           <button onClick={handleMassForward} className="ml-4 p-2 bg-blue-500 text-white rounded">
//             Forward Selected
//           </button>
//           <button onClick={handleDeleteSelected} className="ml-4 p-2 bg-red-500 text-white rounded">
//             Delete Selected
//           </button>
//         </div>

//         {error ? (
//           <div className="mt-8 text-center text-red-600">{error}</div>
//         ) : (
//           <InquiriesList
//             inquiries={allForms.filter((form) => form.category === selectedCategory)} // Filter based on selectedCategory
//             onInquiryClick={handleInquiryClick}
//             isLoading={isLoading}
//             selectedForms={selectedForms}
//             onSelectForm={handleSelectForm}
//           />
//         )}
//       </main>

//       {selectedApplication && (
//         <ApplicationModal
//           application={selectedApplication}
//           onClose={handleClose}
//           type={selectedCategory}
//         />
//       )}
//     </div>
//   );
// }

// "use client";
// import { useState, useEffect, useRef } from "react";
// import Head from "next/head";
// import Header from "../../../components/Header";
// import InquiriesList from "@/components/InquiriesList";
// import ApplicationModal from "@/components/ApplicationModal";
// import { AllForms, CorporateForm, PaginatedResponse, ResidentialForm } from "@/types";

// export default function Careers() {
//   const [selectedApplication, setSelectedApplication] = useState<AllForms | null>(null);
//   const [allForms, setAllForms] = useState<AllForms[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedForms, setSelectedForms] = useState<Set<string>>(new Set());
//   const [selectedCategory, setSelectedCategory] = useState<'residential_forms' | 'corporate_forms'>("residential_forms");
//   const selectAllInputRef = useRef<HTMLInputElement>(null);
//   const [page, setPage] = useState(1);
//   const [paginationMeta, setPaginationMeta] = useState({
//     page: 1,
//     total: 0,
//     totalPages: 1,
//     hasNext: false,
//     hasPrev: false,
//   });

//   const AUTH_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzBkYjA1NTA5ZDEyYTE2OTkzNTNlOSIsImVtYWlsIjoiZGV2b3BzQGV6cGVkYWwuaW4iLCJpYXQiOjE3NTI5MTc0MzUsImV4cCI6MTc1MjkyMTAzNX0.2krxKdUSmShJl1aws2OKfQn4g3Ri-Z-pLgzGn9kbXuA";

//   const fetchForms = async (
//     type: 'residential_forms' | 'corporate_forms',
//     page: number = 1
//   ): Promise<PaginatedResponse<ResidentialForm | CorporateForm>> => {
//     const endpoint =
//       type === "residential_forms"
//         ? `${baseURL}/api/v1/residential-forms/get-all?page=${page}`
//         : `${baseURL}/api/v1/corporate-forms/get-all?page=${page}`;

//     const res = await fetch(endpoint, {
//       headers: {
//         Authorization: AUTH_TOKEN,
//       },
//     });

//     if (!res.ok) {
//       throw new Error(`Failed to fetch ${type}`);
//     }

//     return res.json();

//   };

//   useEffect(() => {
//     const loadForms = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const response = await fetchForms(selectedCategory, page);
//         const formattedData = response.data.map((item: any) => ({
//           ...item,
//           category: selectedCategory,
//         })) as AllForms[];
//         setAllForms(formattedData);
//               setPaginationMeta({
//         page: response.meta.page,
//         total: response.meta.total,
//         totalPages: response.meta.totalPages,
//         hasNext: response.meta.hasNext,
//         hasPrev: response.meta.hasPrev,
//       });
//       } catch (err) {
//         setError("Failed to fetch forms");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadForms();
//   }, [selectedCategory, page]);

//   const handleInquiryClick = (form: AllForms) => {
//     setSelectedApplication(form);
//   };

//   const handleSelectForm = (id: string) => {
//     const updatedSelectedForms = new Set(selectedForms);
//     if (updatedSelectedForms.has(id)) {
//       updatedSelectedForms.delete(id);
//     } else {
//       updatedSelectedForms.add(id);
//     }
//     setSelectedForms(updatedSelectedForms);
//   };

// const deleteFormById = async (type: 'residential_forms' | 'corporate_forms', id: string) => {
//   const endpoint =
//     type === 'residential_forms'
//       ? `${baseURL}/api/v1/residential-forms/delete/${id}`
//       : `${baseURL}/api/v1/corporate-forms/delete/${id}`;

//   const res = await fetch(endpoint, {
//     method: 'DELETE',
//     headers: {
//       Authorization: AUTH_TOKEN,
//     },
//   });

//   if (!res.ok) {
//     throw new Error(`Failed to delete ${type} with ID ${id}`);
//   }

//   return res.json();
// };

// const handleDelete = async (id: string) => {
//   try {
//     await deleteFormById(selectedCategory, id);
//     setAllForms((prev) => prev.filter((form) => form._id !== id));
//     setSelectedApplication(null);
//     setSelectedForms((prev) => {
//       const updated = new Set(prev);
//       updated.delete(id);
//       return updated;
//     });
//   } catch (err) {
//     console.error(err);
//     setError("Failed to delete form. Please try again later.");
//   }
// };

// const handleDeleteSelected = async () => {
//   try {
//     const idsToDelete = Array.from(selectedForms);

//     for (const id of idsToDelete) {
//       await deleteFormById(selectedCategory, id);
//     }

//     setAllForms((prev) => prev.filter((form) => !selectedForms.has(form._id)));
//     setSelectedForms(new Set());
//     if (selectAllInputRef.current) {
//       selectAllInputRef.current.checked = false;
//     }
//   } catch (err) {
//     console.error(err);
//     setError("Failed to delete selected forms. Please try again later.");
//   }
// };

//   const handleClose = (id?: any) => {
//     setSelectedApplication(null);
//     if (id) {
//       setAllForms(allForms.filter((form) => form._id !== id));
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Head>
//         <title>Partnership - Ezpedal</title>
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <Header />

//       <main className="flex flex-col xl:px-32 px-8 w-full py-8">
//         <h1 className="text-3xl font-bold mb-6">Partnership</h1>
//         <div className="flex flex-col md:flex-row gap-4">
//           <input
//             type="text"
//             placeholder="Search"
//             className="flex-grow p-2 border rounded"
//           />
//           <select
//             className="p-2 border rounded"
//             onChange={(e) => {
//               const category = e.target.value as 'residential_forms' | 'corporate_forms';
//               setSelectedCategory(category);
//             }}
//             defaultValue={"residential_forms"}
//           >
//             <option value={"residential_forms"}>Residential</option>
//             <option value={"corporate_forms"}>Corporate</option>
//           </select>
//         </div>

//         <div className="mt-4 flex items-center">
//           <input type="checkbox" className="mr-2" ref={selectAllInputRef} />
//           <span>Select All</span>
//           <button className="ml-4 p-2 bg-blue-500 text-white rounded">Forward Selected</button>
//           <button onClick={handleDeleteSelected}  className="ml-4 p-2 bg-red-500 text-white rounded">Delete Selected</button>
//         </div>

//         {error ? (
//           <div className="mt-8 text-center text-red-600">{error}</div>
//         ) : (
//           <InquiriesList
//             inquiries={allForms.filter((form) => form.category === selectedCategory)}
//             onInquiryClick={handleInquiryClick}
//             isLoading={isLoading}
//             selectedForms={selectedForms}
//             onSelectForm={handleSelectForm}
//             pagination={{
//               currentPage: paginationMeta.page,
//               totalPages: paginationMeta.totalPages,
//               hasNext: paginationMeta.hasNext,
//               hasPrev: paginationMeta.hasPrev,
//               onPageChange: setPage,
//             }}
//           />
//         )}
//       </main>

//       {selectedApplication && (
//         <ApplicationModal
//           application={selectedApplication}
//           onClose={handleClose}
//           type={selectedCategory}
//         />
//       )}
//     </div>
//   );
// }

"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";
import Header from "../../../components/Header";
import InquiriesList from "@/components/InquiriesList";
import ApplicationModal from "@/components/ApplicationModal";
import {
  AllForms,
  CorporateForm,
  PaginatedResponse,
  ResidentialForm,
} from "@/types";
const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
export default function Careers() {
  const [selectedApplication, setSelectedApplication] =
    useState<AllForms | null>(null);
  const [allForms, setAllForms] = useState<AllForms[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedForms, setSelectedForms] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<
    "residential_forms" | "corporate_forms"
  >("residential_forms");

  const selectAllInputRef = useRef<HTMLInputElement>(null);
  const [page, setPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchForms = useCallback(
    async (
      type: "residential_forms" | "corporate_forms",
      page: number = 1
    ): Promise<PaginatedResponse<ResidentialForm | CorporateForm>> => {
      const endpoint =
        type === "residential_forms"
          ? `${baseURL}/api/v1/residential-forms/get-all?page=${page}`
          : `${baseURL}/api/v1/corporate-forms/get-all?page=${page}`;

      const res = await fetch(endpoint, {
        headers: getAuthHeader(),
      });

      if (!res.ok) throw new Error(`Failed to fetch ${type}`);
      return res.json();
    },
    [] // include only dynamic dependencies
  );

  useEffect(() => {
    const loadForms = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchForms(selectedCategory, page);
        const formattedData: AllForms[] = response.data.map((item) => {
          if (selectedCategory === "residential_forms") {
            const resi = item as ResidentialForm;
            return {
              _id: resi._id,
              full_name: resi.name,
              name: resi.name,
              email: "",
              contact_number: resi.contact_number,
              portfolio_link: "",
              linkedin_link: "",
              desired_position: "",
              message: resi.message,
              resume: {
                key: "",
                url: "",
                contentType: "",
                size: 0,
              },
              created_at: resi.created_at,
              category: "residential_forms",
            };
          } else {
            const corp = item as CorporateForm;
            return {
              _id: corp._id,
              full_name: corp.name,
              name: corp.name,
              email: corp.company_email,
              contact_number: corp.contact_number,
              portfolio_link: "",
              linkedin_link: "",
              desired_position: "",
              message: corp.message,
              resume: {
                key: "",
                url: "",
                contentType: "",
                size: 0,
              },
              created_at: corp.created_at,
              category: "corporate_forms",
            };
          }
        });

        setAllForms(formattedData);
        setPaginationMeta(response.meta);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch forms. Are you logged in?");
      } finally {
        setIsLoading(false);
      }
    };

    loadForms();
  }, [fetchForms, selectedCategory, page]);

  const handleInquiryClick = (form: AllForms) => {
    setSelectedApplication(form);
  };

  const handleSelectForm = (id: string) => {
    const updated = new Set(selectedForms);
    updated.has(id) ? updated.delete(id) : updated.add(id);
    setSelectedForms(updated);
  };

  const deleteFormById = async (
    type: "residential_forms" | "corporate_forms",
    id: string
  ) => {
    const endpoint =
      type === "residential_forms"
        ? `${baseURL}/api/v1/residential-forms/delete/${id}`
        : `${baseURL}/api/v1/corporate-forms/delete/${id}`;

    const res = await fetch(endpoint, {
      method: "DELETE",
      headers: getAuthHeader(),
    });

    if (!res.ok) throw new Error(`Failed to delete ${type} with ID ${id}`);
    return res.json();
  };

  const handleDeleteSelected = async () => {
    try {
      const idsToDelete = Array.from(selectedForms);
      for (const id of idsToDelete) {
        await deleteFormById(selectedCategory, id);
      }

      setAllForms((prev) =>
        prev.filter((form) => !selectedForms.has(form._id))
      );
      setSelectedForms(new Set());
      if (selectAllInputRef.current) {
        selectAllInputRef.current.checked = false;
      }
    } catch (err) {
      console.error(err);
      setError("Failed to delete selected forms.");
    }
  };

  const handleClose = (id?: string | number) => {
    setSelectedApplication(null);
    if (id) {
      setAllForms(allForms.filter((form) => form._id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Partnership - Ezpedal</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex flex-col xl:px-32 px-8 w-full py-8">
        <h1 className="text-3xl font-bold mb-6">Partnership</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search"
            className="flex-grow p-2 border rounded"
          />
          <select
            className="p-2 border rounded"
            onChange={(e) =>
              setSelectedCategory(
                e.target.value as "residential_forms" | "corporate_forms"
              )
            }
            defaultValue={"residential_forms"}
          >
            <option value={"residential_forms"}>Residential</option>
            <option value={"corporate_forms"}>Corporate</option>
          </select>
        </div>

        <div className="mt-4 flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            ref={selectAllInputRef}
            onChange={(e) => {
              if (e.target.checked) {
                const allIds = new Set(allForms.map((form) => form._id));
                setSelectedForms(allIds);
              } else {
                setSelectedForms(new Set());
              }
            }}
          />
          <span>Select All</span>
          <button className="ml-4 p-2 bg-blue-500 text-white rounded">
            Forward Selected
          </button>
          <button
            onClick={handleDeleteSelected}
            className="ml-4 p-2 bg-red-500 text-white rounded"
          >
            Delete Selected
          </button>
        </div>

        {error ? (
          <div className="mt-8 text-center text-red-600">{error}</div>
        ) : (
          <InquiriesList
            inquiries={allForms}
            onInquiryClick={handleInquiryClick}
            isLoading={isLoading}
            selectedForms={selectedForms}
            onSelectForm={handleSelectForm}
            pagination={{
              currentPage: paginationMeta.page,
              totalPages: paginationMeta.totalPages,
              hasNext: paginationMeta.hasNext,
              hasPrev: paginationMeta.hasPrev,
              onPageChange: setPage,
            }}
          />
        )}
      </main>

      {selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          onClose={handleClose}
          type={selectedCategory}
        />
      )}
    </div>
  );
}
