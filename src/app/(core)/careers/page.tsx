// "use client";
// import { useState, useEffect, useRef } from "react";
// import Head from "next/head";
// import Header from "../../../components/Header";
// import InquiriesList from "@/components/InquiriesList";
// import ApplicationModal from "@/components/ApplicationModal";
// import { AllForms } from "@/types";
// import { createClient } from "@supabase/supabase-js";

// // Initialize Supabase client
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
// const supabase = createClient(supabaseUrl, supabaseAnonKey);

// export default function Careers() {
//   const [selectedApplication, setSelectedApplication] = useState<AllForms | null>(null);
//   const [allForms, setAllForms] = useState<AllForms[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedForms, setSelectedForms] = useState<Set<number>>(new Set());

//   const selectAllInputRef = useRef<HTMLInputElement>(null);

//   const fetchForms = async () => {
//     try {
//    const { data: careerForms, error: careerError } = await supabase
//   .from("career_forms")
//   .select("*")
//   .order("created_at", { ascending: false });

//       if (careerError) {
//         throw new Error(careerError?.message);
//       }

//       const combinedForms = [
//         ...(careerForms || []).map((form) => ({ ...form, category: "career_forms" })),
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
//       type: "career_forms",
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
//       setSelectedForms(new Set());
//       //reset select all button
//       if (selectAllInputRef.current) {
//         selectAllInputRef.current.checked = false;
//       }

//     } else {
//       setError("Failed to forward forms. Please try again later.");
//     }

//   };

//   const handleDeleteSelected = async () => {
//     const idsToDelete = Array.from(selectedForms);
//     const { error } = await supabase
//       .from("career_forms")
//       .delete()
//       .in("id", idsToDelete);

//     if (error) {
//       setError("Failed to delete forms. Please try again later.");
//     } else {
//       setAllForms(allForms.filter((form) => !idsToDelete.includes(form.id)));
//       setSelectedForms(new Set());
//       //reset select all button
//       if (selectAllInputRef.current) {
//         selectAllInputRef.current.checked = false;
//       }
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
//         <title>Careers - Ezpedal</title>
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <Header />

//       <main className="flex flex-col xl:px-32 md:px-16 px-4 w-full py-8">
//         <h1 className="text-3xl font-bold mb-6 text-center md:text-left">Career</h1>
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
//             inquiries={allForms.filter((form) => form.category === "career_forms")}
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
//           type={"career_forms"}
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
//   const [selectedApplication, setSelectedApplication] =
//     useState<AllForms | null>(null);
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

//   const fetchForms = async (currentPage: number) => {
//     setIsLoading(true);
//     try {
//       const res = await fetch(
//         `${baseURL}/api/v1/career/get-all?page=${currentPage}`,
//         {
//           headers: {
//             Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzBkYjA1NTA5ZDEyYTE2OTkzNTNlOSIsImVtYWlsIjoiZGV2b3BzQGV6cGVkYWwuaW4iLCJpYXQiOjE3NTI5MTc0MzUsImV4cCI6MTc1MjkyMTAzNX0.2krxKdUSmShJl1aws2OKfQn4g3Ri-Z-pLgzGn9kbXuA`,
//           },
//         }
//       );

//       if (!res.ok) throw new Error("Failed to fetch");

//       const json: PaginatedResponse<AllForms> = await res.json();

//       // Add "category" to every form
//       const forms = json.data.map((form) => ({
//         ...form,
//         category: "career_forms",
//       }));

//       setAllForms(forms);
//       setPaginationMeta(json.meta);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to fetch forms. Please try again later.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchForms(page);
//   }, [page]);

//   const handleDeleteSelected = async () => {
//     const idsToDelete = Array.from(selectedForms);

//     if (idsToDelete.length === 0) {
//       alert("No forms selected for deletion.");
//       return;
//     }

//     const confirmed = window.confirm(
//       `Are you sure you want to delete ${idsToDelete.length} forms?`
//     );
//     if (!confirmed) return;

//     setIsLoading(true);
//     try {
//       for (const id of idsToDelete) {
//         const res = await fetch(
//           `${baseURL}/api/v1/career/delete/${id}`,
//           {
//             method: "DELETE",
//             headers: {
//               Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzBkYjA1NTA5ZDEyYTE2OTkzNTNlOSIsImVtYWlsIjoiZGV2b3BzQGV6cGVkYWwuaW4iLCJpYXQiOjE3NTI5MTc0MzUsImV4cCI6MTc1MjkyMTAzNX0.2krxKdUSmShJl1aws2OKfQn4g3Ri-Z-pLgzGn9kbXuA`,
//             },
//           }
//         );

//         if (!res.ok) throw new Error(`Failed to delete form ${id}`);
//       }

//       // Optimistically update UI
//       setAllForms((prev) =>
//         prev.filter((form) => !idsToDelete.includes(form._id))
//       );
//       setSelectedForms(new Set());

//       // Reset "Select All" checkbox
//       if (selectAllInputRef.current) selectAllInputRef.current.checked = false;
//     } catch (err) {
//       console.error(err);
//       setError("Failed to delete forms. Please try again later.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleInquiryClick = (form: AllForms) => {
//     const fullApplication: AllForms = { ...form };
//     setSelectedApplication(fullApplication);
//   };

//   const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.checked) {
//       const allIds = new Set(allForms.map((form) => form._id));
//       setSelectedForms(allIds);
//     } else {
//       setSelectedForms(new Set());
//     }
//   };

//   const handleSelectForm = (id: any) => {
//     const updated = new Set(selectedForms);
//     updated.has(id) ? updated.delete(id) : updated.add(id);
//     setSelectedForms(updated);
//   };

//   const handleMassForward = async () => {
//     const idArray = Array.from(selectedForms);

//     console.log(idArray);

//     const body = {
//       type: "career_forms",
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
//       setSelectedForms(new Set());
//       //reset select all button
//       if (selectAllInputRef.current) {
//         selectAllInputRef.current.checked = false;
//       }
//     } else {
//       setError("Failed to forward forms. Please try again later.");
//     }
//   };

//   const handleClose = (id?: any) => {
//     setSelectedApplication(null);
//     if (id) {
//       // Remove the form from the list
//       setAllForms(allForms.filter((form) => form._id !== id));
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Head>
//         <title>Careers - Ezpedal</title>
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <Header />

//       <main className="flex flex-col xl:px-32 md:px-16 px-4 w-full py-8">
//         <h1 className="text-3xl font-bold mb-6 text-center md:text-left">
//           Career
//         </h1>
//         <div className="flex flex-col md:flex-row gap-4 w-full items-center justify-center md:justify-start">
//           <input
//             type="text"
//             placeholder="Search"
//             className="flex-grow p-2 border rounded w-full md:w-auto"
//           />
//         </div>

//         <div className="mt-4 flex flex-wrap items-center">
//           <input
//             ref={selectAllInputRef}
//             type="checkbox"
//             onChange={handleSelectAll}
//             className="mr-2"
//           />
//           <span>Select All</span>
//           <button
//             onClick={handleMassForward}
//             className="ml-4 p-2 bg-blue-500 text-white rounded"
//           >
//             Forward Selected
//           </button>
//           <button
//             onClick={handleDeleteSelected}
//             className="ml-4 p-2 bg-red-500 text-white rounded"
//           >
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
//           type={"career_forms"}
//         />
//       )}
//     </div>
//   );
// }





































"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  

  const getToken = () => localStorage.getItem("token");

const handleAuthError = useCallback(() => {
  localStorage.removeItem("token");
  router.push("/");
}, [router]); 



const fetchForms = useCallback(
  async (currentPage: number) => {
    setIsLoading(true);
    const token = getToken();
    if (!token) return handleAuthError();

    try {
      const res = await fetch(
        `${baseURL}/api/v1/career/get-all?page=${currentPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401) return handleAuthError();
      if (!res.ok) throw new Error("Failed to fetch");

      const json: PaginatedResponse<AllForms> = await res.json();

      const forms = json.data.map((form) => ({
        ...form,
        category: "career_forms",
      }));

      setAllForms(forms);
      setPaginationMeta(json.meta);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch forms. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  },
  [handleAuthError] // ✅ include only what it depends on
);

useEffect(() => {
  fetchForms(page);
}, [page, fetchForms]); // ✅ clean and dependency-safe

  const handleDeleteSelected = async () => {
    const token = getToken();
    if (!token) return handleAuthError();

    const idsToDelete = Array.from(selectedForms);
    if (idsToDelete.length === 0) {
      alert("No forms selected for deletion.");
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete ${idsToDelete.length} forms?`);
    if (!confirmed) return;

    setIsLoading(true);
    try {
      for (const id of idsToDelete) {
        const res = await fetch(`${baseURL}/api/v1/career/delete/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) return handleAuthError();
        if (!res.ok) throw new Error(`Failed to delete form ${id}`);
      }

      setAllForms((prev) => prev.filter((form) => !idsToDelete.includes(form._id)));
      setSelectedForms(new Set());
      if (selectAllInputRef.current) selectAllInputRef.current.checked = false;
    } catch (err) {
      console.error(err);
      setError("Failed to delete forms. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInquiryClick = (form: AllForms) => {
    const fullApplication: AllForms = { ...form };
    setSelectedApplication(fullApplication);
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
    const updated = new Set(selectedForms);
    updated.has(id) ? updated.delete(id) : updated.add(id);
    setSelectedForms(updated);
  };

  const handleMassForward = async () => {
    const idArray = Array.from(selectedForms);

    const body = {
      type: "career_forms",
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
      setSelectedForms(new Set());
      if (selectAllInputRef.current) {
        selectAllInputRef.current.checked = false;
      }
    } else {
      setError("Failed to forward forms. Please try again later.");
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
        <title>Careers - Ezpedal</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex flex-col xl:px-32 md:px-16 px-4 w-full py-8">
        <h1 className="text-3xl font-bold mb-6 text-center md:text-left">Career</h1>
        <div className="flex flex-col md:flex-row gap-4 w-full items-center justify-center md:justify-start">
          <input type="text" placeholder="Search" className="flex-grow p-2 border rounded w-full md:w-auto" />
        </div>

        <div className="mt-4 flex flex-wrap items-center">
          <input
            ref={selectAllInputRef}
            type="checkbox"
            onChange={handleSelectAll}
            className="mr-2"
          />
          <span>Select All</span>
          <button onClick={handleMassForward} className="ml-4 p-2 bg-blue-500 text-white rounded">
            Forward Selected
          </button>
          <button onClick={handleDeleteSelected} className="ml-4 p-2 bg-red-500 text-white rounded">
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
          type={"career_forms"}
        />
      )}
    </div>
  );
}
