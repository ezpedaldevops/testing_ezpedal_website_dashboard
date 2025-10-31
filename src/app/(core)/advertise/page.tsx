// "use client";
// import { useState, useEffect, useRef } from "react";
// import Head from "next/head";
// import Header from "../../../components/Header";
// import InquiriesList from "@/components/InquiriesList";
// import ApplicationModal from "@/components/ApplicationModal";
// import { AllForms } from "@/types";
// import { supabase } from "@/lib/supabase";

// export default function Careers() {
//   const [selectedApplication, setSelectedApplication] = useState<AllForms | null>(null);
//   const [allForms, setAllForms] = useState<AllForms[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedForms, setSelectedForms] = useState<Set<number>>(new Set());
//   const selectAllInputRef = useRef<HTMLInputElement>(null);

//   const fetchForms = async () => {
//     try {
//       const { data: careerForms, error: careerError } = await supabase
//         .from("advertisement_forms")
//         .select("*");

//       if (careerError) {
//         throw new Error(careerError?.message);
//       }

//       const combinedForms = [
//         ...(careerForms || []).map((form) => ({ ...form, category: "advertisement_forms" })),
//       ];

//       setAllForms(combinedForms);
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
//     const fullApplication: AllForms = { ...form };
//     setSelectedApplication(fullApplication);
//   };

//   const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.checked) {
//       const allIds = new Set(allForms.map((form) => form.id));
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
//     const idArray = Array.from(selectedForms);

//     console.log(idArray);

//     const body = {
//       type: "advertisement_forms",
//       idArray,
//     };

//     const res = await fetch("/api/forward", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(body),
//     });

//     if (res.ok) {
//       alert("Forms forwarded successfully.");
//     } else {
//       setError("Failed to forward forms. Please try again later.");
//     }
//     setSelectedForms(new Set());
//     if (selectAllInputRef.current) {
//       selectAllInputRef.current.checked = false;
//     }

//   };

//   const handleDeleteSelected = async () => {
//     const idsToDelete = Array.from(selectedForms);
//     const { error } = await supabase
//       .from("advertisement_forms")
//       .delete()
//       .in("id", idsToDelete);

//     if (error) {
//       setError("Failed to delete forms. Please try again later.");
//     } else {
//       const updatedForms = allForms.filter((form) => !idsToDelete.includes(form.id));
//       setAllForms(updatedForms);

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
//         <title>Advertisement - Ezpedal</title>
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <Header />

//       <main className="flex flex-col xl:px-32 md:px-16 px-4 w-full py-8">
//         <h1 className="text-3xl font-bold mb-6 text-center md:text-left">Advertisement</h1>
//         <div className="flex flex-col md:flex-row gap-4 w-full items-center justify-center md:justify-start">
//           <input
//             type="text"
//             placeholder="Search"
//             className="flex-grow p-2 border rounded w-full md:w-auto"
//           />
//         </div>

//         <div className="mt-4 flex flex-wrap items-center">
//           <input ref={selectAllInputRef} type="checkbox" onChange={handleSelectAll} className="mr-2" />
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
//             inquiries={allForms.filter((form) => form.category === "advertisement_forms")}
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
//           type={"advertisement_forms"}
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
// import { AllForms, PaginatedResponse } from "@/types";

// export default function Careers() {
//   const [selectedApplication, setSelectedApplication] = useState<AllForms | null>(null);
//   const [allForms, setAllForms] = useState<AllForms[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedForms, setSelectedForms] = useState<Set<string>>(new Set());
//   const selectAllInputRef = useRef<HTMLInputElement>(null);
//   const [paginationMeta, setPaginationMeta] = useState({
//     page: 1,
//     total: 0,
//     totalPages: 1,
//     hasNext: false,
//     hasPrev: false,
//   });
//   const [page, setPage] = useState(1);

//   const AUTH_TOKEN = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzBkYjA1NTA5ZDEyYTE2OTkzNTNlOSIsImVtYWlsIjoiZGV2b3BzQGV6cGVkYWwuaW4iLCJpYXQiOjE3NTI5MTc0MzUsImV4cCI6MTc1MjkyMTAzNX0.2krxKdUSmShJl1aws2OKfQn4g3Ri-Z-pLgzGn9kbXuA`

// const fetchForms = async () => {
//   setIsLoading(true);
//   setError(null);
//   try {
//     const res = await fetch(`${baseURL}/api/v1/contact/get-all?page=${page}`, {
//       headers: {
//         Authorization: AUTH_TOKEN,
//       },
//     });

//     if (!res.ok) throw new Error("Failed to fetch contact forms");

//     const response: PaginatedResponse<AllForms> = await res.json();

//     const formattedData = response.data.map((form) => ({
//       ...form,
//       name: form.full_name,
//       category: "advertisement_forms",
//     }));

//     setAllForms(formattedData);

//     setPaginationMeta({
//       page: response.meta.page,
//       total: response.meta.total,
//       totalPages: response.meta.totalPages,
//       hasNext: response.meta.hasNext,
//       hasPrev: response.meta.hasPrev,
//     });
//   } catch (err) {
//     setError("Failed to fetch forms. Please try again later.");
//   } finally {
//     setIsLoading(false);
//   }
// };

//   useEffect(() => {
//     fetchForms();
//   }, [page]);

//   const handleInquiryClick = (form: AllForms) => {
//     setSelectedApplication({ ...form });
//   };

//   const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.checked) {
//       const allIds = new Set(allForms.map((form) => form._id));
//       setSelectedForms(allIds);
//     } else {
//       setSelectedForms(new Set());
//     }
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

//   const handleMassForward = async () => {
//     const idArray = Array.from(selectedForms);
//     const body = {
//       type: "advertisement_forms",
//       idArray,
//     };

//     const res = await fetch("/api/forward", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(body),
//     });

//     if (res.ok) {
//       alert("Forms forwarded successfully.");
//     } else {
//       setError("Failed to forward forms. Please try again later.");
//     }
//     setSelectedForms(new Set());
//     if (selectAllInputRef.current) {
//       selectAllInputRef.current.checked = false;
//     }
//   };

//   const handleDeleteSelected = async () => {
//     try {
//       const idsToDelete = Array.from(selectedForms);
//       for (const id of idsToDelete) {
//         await fetch(`${baseURL}/api/v1/contact/delete/${id}`, {
//           method: "DELETE",
//           headers: {
//             Authorization: AUTH_TOKEN,
//           },
//         });
//       }
//       setAllForms((prev) => prev.filter((form) => !selectedForms.has(form._id)));
//       setSelectedForms(new Set());
//       if (selectAllInputRef.current) selectAllInputRef.current.checked = false;
//     } catch (err) {
//       console.error(err);
//       setError("Failed to delete selected forms. Please try again later.");
//     }
//   };

//   const handleClose = (id?: any) => {
//     setSelectedApplication(null);
//     if (id) {
//       setAllForms(allForms.filter((form) => form._id !== id));
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Head>
//         <title>Advertisement - Ezpedal</title>
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <Header />

//       <main className="flex flex-col xl:px-32 md:px-16 px-4 w-full py-8">
//         <h1 className="text-3xl font-bold mb-6 text-center md:text-left">Advertisement</h1>
//         <div className="flex flex-col md:flex-row gap-4 w-full items-center justify-center md:justify-start">
//           <input
//             type="text"
//             placeholder="Search"
//             className="flex-grow p-2 border rounded w-full md:w-auto"
//           />
//         </div>

//         <div className="mt-4 flex flex-wrap items-center">
//           <input ref={selectAllInputRef} type="checkbox" onChange={handleSelectAll} className="mr-2" />
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
//             inquiries={allForms}
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
//           type={"advertisement_forms"}
//         />
//       )}
//     </div>
//   );
// }

























"use client";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Header from "../../../components/Header";
import InquiriesList from "@/components/InquiriesList";
import ApplicationModal from "@/components/ApplicationModal";
import { AllForms, PaginatedResponse } from "@/types";
const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
export default function Careers() {
  const [selectedApplication, setSelectedApplication] = useState<AllForms | null>(null);
  const [allForms, setAllForms] = useState<AllForms[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedForms, setSelectedForms] = useState<Set<string>>(new Set());
  const selectAllInputRef = useRef<HTMLInputElement>(null);
  const [paginationMeta, setPaginationMeta] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });
  const [page, setPage] = useState(1);
  

  const getToken = (): string | null => {
    const token = localStorage.getItem("token");
    return token ? `Bearer ${token}` : null;
  };

useEffect(() => {
  const fetchForms = async () => {
    setIsLoading(true);
    setError(null);

    const token = getToken();
    if (!token) {
      setError("You are not authenticated. Please login.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${baseURL}/api/v1/contact/get-all?page=${page}`, {
        headers: {
          Authorization: token,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch contact forms");

      const response: PaginatedResponse<AllForms> = await res.json();

      const formattedData = response.data.map((form) => ({
        ...form,
        name: form.full_name,
        category: "advertisement_forms",
      }));

      setAllForms(formattedData);

      setPaginationMeta({
        page: response.meta.page,
        total: response.meta.total,
        totalPages: response.meta.totalPages,
        hasNext: response.meta.hasNext,
        hasPrev: response.meta.hasPrev,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch forms. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  fetchForms();
}, [page]); 


  const handleInquiryClick = (form: AllForms) => {
    setSelectedApplication({ ...form });
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = new Set(allForms.map((form) => form._id));
      setSelectedForms(allIds);
    } else {
      setSelectedForms(new Set());
    }
  };

  const handleSelectForm = (id: string) => {
    const updatedSelectedForms = new Set(selectedForms);
    updatedSelectedForms.has(id)
      ? updatedSelectedForms.delete(id)
      : updatedSelectedForms.add(id);
    setSelectedForms(updatedSelectedForms);
  };

  const handleMassForward = async () => {
    const idArray = Array.from(selectedForms);
    const body = {
      type: "advertisement_forms",
      idArray,
    };

    const res = await fetch("/api/forward", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      alert("Forms forwarded successfully.");
    } else {
      setError("Failed to forward forms. Please try again later.");
    }
    setSelectedForms(new Set());
    if (selectAllInputRef.current) {
      selectAllInputRef.current.checked = false;
    }
  };

  const handleDeleteSelected = async () => {
    const token = getToken();
    if (!token) {
      setError("You are not authenticated. Please login.");
      return;
    }

    try {
      const idsToDelete = Array.from(selectedForms);
      for (const id of idsToDelete) {
        await fetch(`${baseURL}/api/v1/contact/delete/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        });
      }

      setAllForms((prev) => prev.filter((form) => !selectedForms.has(form._id)));
      setSelectedForms(new Set());
      if (selectAllInputRef.current) selectAllInputRef.current.checked = false;
    } catch (err) {
      console.error(err);
      setError("Failed to delete selected forms. Please try again later.");
    }
  };

const handleClose = (id?: string | number) => {
  setSelectedApplication(null);
  if (id) {
    setAllForms((prev) => prev.filter((form) => form._id !== id.toString()));
  }
};

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Advertisement - Ezpedal</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex flex-col xl:px-32 md:px-16 px-4 w-full py-8">
        <h1 className="text-3xl font-bold mb-6 text-center md:text-left">Advertisement</h1>

        <div className="flex flex-col md:flex-row gap-4 w-full items-center justify-center md:justify-start">
          <input
            type="text"
            placeholder="Search"
            className="flex-grow p-2 border rounded w-full md:w-auto"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center">
          <input
            ref={selectAllInputRef}
            type="checkbox"
            onChange={handleSelectAll}
            className="mr-2"
          />
          <span>Select All</span>
          <button
            onClick={handleMassForward}
            className="ml-4 p-2 bg-blue-500 text-white rounded"
          >
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
          type={"advertisement_forms"}
        />
      )}
    </div>
  );
}
