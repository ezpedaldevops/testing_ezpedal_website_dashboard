// "use client"
// import { supabase } from "@/lib/supabase";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";


// export default function RootLayout({
//     children,
// }: Readonly<{
//     children: React.ReactNode;
// }>) {

//     const router = useRouter();
//     const getStatus = async () => {
//         const { data: { user } } = await supabase.auth.getUser();
//         if (user) {
//             console.log(user)
//         } else {
//             router.push("/")

//         }

//     }

//     useEffect(() => {
//         getStatus()
//     }, [])



//     return (
//         <body
//             className={`antialiased`}
//         >
//             {children}
//         </body>
//     );
// }



"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  

useEffect(() => {
  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const res = await fetch(`${baseURL}/api/v1/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        router.push("/");
      }
    } catch (e) {
      router.push("/");
    }
  };

  checkAuth();
}, [router]); 


  return <body className="antialiased">{children}</body>;
}
