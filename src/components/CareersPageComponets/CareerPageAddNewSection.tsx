import { useState } from "react";
import CareerPageNewJobForm from "./CareerPageNewJobForm";

const CareerPageAddNewSection = () => {
  const [createJob, setCreateJob] = useState(false);
  const formVisible = () => setCreateJob(true);

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";


 

  return (
    <>
      {createJob ? (
        <CareerPageNewJobForm baseUrl={baseUrl} />
      ) : (
        <div className="flex flex-col justify-center items-center w-full bg-slate-200 h-[300px] xl:px-32 md:px-16 px-4">
          <h1 className="text-6xl font-outfit text-black">
            Post a new job on portal
          </h1>
          <h3 className="font-Poppins my-2 text-lg">
            Fill the form to add new job post for any department and role.
          </h3>
          <button
            onClick={formVisible}
            className="mt-4 px-6 bg-[#223658] text-white py-2 rounded-xl font-poppins hover:bg-black transition"
          >
            Continue
          </button>
        </div>
      )}
    </>
  );
};

export default CareerPageAddNewSection;




// import { useState } from "react";
// import CareerPageNewJobForm from "./CareerPageNewJobForm";

// const CareerPageAddNewSection = () => {
//   const [createJob, setCreateJob] = useState(false);
//   const formVisible = () => {
//     setCreateJob(true);
//   };
//   const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
//   const getToken = (): string | null => {
//     const token = localStorage.getItem("token");
//     return token ? `Bearer ${token}` : null;
//   };

//   return (
//     <>
//       {createJob ? (
//         <CareerPageNewJobForm />
//       ) : (
//         <>
//           <div className="flex flex-col justify-center items-center w-full h-[300px] xl:px-32 md:px-16 px-4">
//             <h1 className="text-6xl font-outfit text-black">
//               Post a new job on portal
//             </h1>
//             <h3 className="font-Poppins my-2 text-lg">
//               Fill the form to add new job post for any department and role.
//             </h3>
//             <button
//               onClick={formVisible}
//               className="mt-4 px-6 bg-[#223658] text-white py-2 rounded-xl font-poppins hover:bg-black transition"
//             >
//               Continue
//             </button>
//           </div>
//         </>
//       )}

//       {/*  */}
//     </>
//   );
// };

// export default CareerPageAddNewSection;
