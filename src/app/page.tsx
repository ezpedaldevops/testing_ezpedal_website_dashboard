// "use client";
// import { supabase } from "@/lib/supabase";
// import { useRouter } from "next/navigation";
// import React from "react";

// export default function Login() {

//   const [loading, setLoading] = React.useState(false);
//   // 

//   // redirect to careers page if user is already logged in
//   const router = useRouter();
//   const getStatus = async () => {
//     const { data: { user } } = await supabase.auth.getUser();
//     if (user) {
//       console.log(user)
//       router.push("/careers")
//     } else {
//       router.push("/")

//     }

//   }

//   React.useEffect(() => {
//     getStatus()
//   }, [getStatus])

//   const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const formData = new FormData(e.currentTarget);
//       const username = formData.get("username") as string;
//       const password = formData.get("password") as string;

//       const { error } = await supabase.auth.signInWithPassword({
//         email: username,
//         password: password,
//       });

//       if (error) {
//         console.error("Error during logging in:", error.message);
//       } else {
//         router.push("/careers");
//       }
//     }
//     catch (e) {
//       console.error("Error logging in:", e);
//     }
//     finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white">
//       <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
//         <h1 className="text-3xl font-semibold text-center">Dashboard Login</h1>
//         <form onSubmit={handleLogin} className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-300">Username</label>
//             <input
//               type="text"
//               name="username"
//               required
//               className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter your username"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-300">Password</label>
//             <input
//               type="password"
//               name="password"
//               required
//               className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter your password"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full py-2 text-lg font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-600 focus:outline-none transition-colors"
//             disabled={loading}
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//       </div>
//     </div>
//   );
// }


"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch(`${baseURL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error(data.message);
        alert("Login failed");
        return;
      }

      localStorage.setItem("token", data.token); // TEMPORARY, replace with cookies ideally
      router.push("/careers");
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="max-w-md p-8 bg-gray-800 rounded">
        <h1 className="text-3xl text-center mb-6">Dashboard Login</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <input name="username" type="email" placeholder="Email" required className="w-full p-2" />
          <input name="password" type="password" placeholder="Password" required className="w-full p-2" />
          <button type="submit" disabled={loading} className="w-full bg-blue-500 p-2 rounded">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
