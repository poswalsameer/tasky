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
    <div className="flex flex-col gap-y-5 justify-center items-center min-h-screen text-gray-100">

      {/* NAME - Trackr */}
      <div className="pl-10 flex justify-center items-center gap-x-6">
        <CheckCircle className="h-32 w-32 text-black" />
        <h1  
          className="text-9xl font-semibold"
          id="headingName"
        >
          Trackr.
        </h1>
      </div>

      <div
        className="text-5xl text-purple-950 font-semibold "
        id="extraTextId"
        >
        Fuel your focus
      </div>

      <button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-full border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-all hover:border-2 hover:border-slate-400"
      onClick={handleLogin}
      >
        Get started
      </button>

      {/* <Button
        className=" h-10 w-32 rounded-sm bg-black text-white"
        onClick={handleLogin}
      >
        Get Started
      </Button> */}
      {/* <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <CheckCircle className="h-6 w-6 text-blue-400" />
          <span className="ml-2 text-2xl font-bold">Tasky</span>
        </Link>
        
      </header> */}
      {/* <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-9 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Manage Tasks with Ease
                </h1>
                
              </div>
              <div className="w-full max-w-sm space-y-2">
                  <Button className=" h-10 w-32 rounded-sm bg-blue-600 hover:bg-blue-700"
                  onClick={handleLogin}
                  >
                    Get Started
                  </Button>
              </div>
            </div>
          </div>
        </section>
        
        
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-700">
        <p className="text-xs text-gray-400">© 2024 Tasky. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer> */}
    </div>
  );
}
