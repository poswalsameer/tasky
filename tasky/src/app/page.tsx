"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Component() {
  const { status } = useSession();
  const router = useRouter();

  const handleLogin = async () => {
    const response = await signIn("google", { redirect: false });
    if (response?.ok) {
      router.push("/tasks");
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/tasks");
    }
  }, [status, router]);

  return (
    <div className="flex flex-col gap-y-28 justify-center items-center h-screen text-gray-100 overflow-hidden">

      <div className="flex flex-col justify-center items-center gap-y-5 ">
        <div className="pl-10 mt-14 flex justify-center items-center gap-x-6">
          <CheckCircle className="h-24 w-24 text-black" />
          <h1  
            className="text-8xl font-semibold"
            id="headingName"
          >
            Trackr.
          </h1>
        </div>

          <button className="inline-flex h-10 w-36 font-bold text-sm animate-shimmer items-center justify-center rounded-full border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 text-slate-400 transition-all hover:border-2 hover:border-slate-400"
          onClick={handleLogin}
          >
            Get started
          </button>

      </div>

      <div className=" h-[27rem] w-[70%]">
        
        <img src="./taskPageImage.png" alt="" className="absolute h-[20rem] w-[53%]  bottom-5 left-24 -rotate-3 rounded-xl object-fill wobbleReverse" />
        <img src="./kanbanBoardImage.png" alt="kanban board image" className="absolute h-[22rem] w-[55%] bottom-5 right-20 rounded-xl rotate-2 object-fill wobble "/>
      </div>
      
    </div>
  );
}
