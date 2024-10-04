"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, Github, Linkedin, Twitter, Globe } from "lucide-react";
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
    <>
      <div
        className="
        flex flex-col gap-y-28 justify-center items-center text-gray-100
        sm:flex sm:flex-col sm:gap-y-4 sm:justify-center sm:items-center sm:text-gray-100
        md:flex md:flex-col md:gap-y-4 md:justify-center md:items-center md:text-gray-100
        lg:flex lg:flex-col lg:gap-y-4 lg:justify-center lg:items-center lg:text-gray-100
        xl:flex xl:flex-col xl:gap-y-4 xl:justify-center xl:items-center xl:text-gray-100
      2xl:flex 2xl:flex-col 2xl:gap-y-2 2xl:justify-center 2xl:items-center 2xl:text-gray-100 

      min-h-screen
      w-full">
        {/* LOGO AND BUTTON WALA DIV */}
        <div
          className="
          flex flex-col mt-20 justify-center items-center gap-y-8
          sm:flex sm:flex-col sm:mt-20 sm:justify-center sm:items-center sm:gap-y-8
          md:flex md:flex-col md:mt-20 md:justify-center md:items-center md:gap-y-8
          lg:flex lg:flex-col lg:mt-20 lg:justify-center lg:items-center lg:gap-y-8
          xl:flex xl:flex-col xl:mt-20 xl:justify-center xl:items-center xl:gap-y-8
        2xl:flex 2xl:flex-col 2xl:mt-20 2xl:justify-center 2xl:items-center 2xl:gap-y-8 "
        >
          <div
            className="
            pl-0 flex justify-center items-center gap-x-3
            sm:pl-8 sm:flex  sm:justify-center sm:items-center sm:gap-x-6
            md:pl-10 md:flex  md:justify-center md:items-center md:gap-x-6
            lg:pl-10 lg:flex  lg:justify-center lg:items-center lg:gap-x-6
            xl:pl-10 xl:flex xl:justify-center xl:items-center xl:gap-x-6
          2xl:pl-10 2xl:flex 2xl:justify-center 2xl:items-center 2xl:gap-x-6"
          >
            <CheckCircle
              className="
              h-12 w-12 text-black
              sm:h-20 sm:w-20 sm:text-black
              md:h-24 md:w-24 md:text-black
              lg:h-24 lg:w-24 lg:text-black
              xl:h-24 xl:w-24 xl:text-black
              2xl:h-24 2xl:w-24 2xl:text-black"
            />
            <h1
              className="
              text-5xl font-semibold
              sm:text-7xl sm:font-semibold
              md:text-8xl md:font-semibold
              lg:text-8xl lg:font-semibold
              xl:text-8xl xl:font-semibold
              2xl:text-8xl 2xl:font-semibold"
              id="headingName"
            >
              Trackr.
            </h1>
          </div>

          <div
            className="
            flex flex-col justify-center items-center gap-y-2
            sm:flex sm:flex-col sm:justify-center sm:items-center sm:gap-y-3
            md:flex md:flex-col md:justify-center md:items-center md:gap-y-3
            lg:flex lg:flex-col lg:justify-center lg:items-center lg:gap-y-3
            xl:flex xl:flex-col xl:justify-center xl:items-center xl:gap-y-3
          2xl:flex 2xl:flex-col 2xl:justify-center 2xl:items-center 2xl:gap-y-3"
          >
            <button
              className="
              inline-flex h-9 w-32 font-bold text-xs
              sm:inline-flex sm:h-10 sm:w-36 sm:font-bold sm:text-sm
              md:inline-flex md:h-10 md:w-36 md:font-bold md:text-sm
              lg:inline-flex lg:h-10 lg:w-36 lg:font-bold lg:text-sm 
              xl:inline-flex xl:h-10 xl:w-36 xl:font-bold xl:text-sm 
            2xl:inline-flex 2xl:h-10 2xl:w-36 2xl:font-bold 2xl:text-sm 
            
            animate-shimmer items-center justify-center rounded-full border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 text-slate-400 transition-all hover:border-2 hover:border-slate-400"
              onClick={handleLogin}
            >
              Get started
            </button>
            <h1
              className="
              text-base font-bold text-slate-900
              sm:text-xl sm:font-bold sm:text-slate-900
              md:text-xl md:font-bold md:text-slate-900
              lg:text-xl lg:font-bold lg:text-slate-900
              xl:text-xl xl:font-bold xl:text-slate-900
            2xl:text-xl 2xl:font-bold 2xl:text-slate-900"
            >
              Organize your life,{" "}
              <span className="text-white">in a better way</span>
            </h1>
          </div>
        </div>

        {/* Image and Footer section */}

        <div className=" 
        sm:mt-16 sm:flex sm:flex-col sm:justify-center sm:items-center        
        md:mt-16 md:flex md:flex-col md:justify-center md:items-center
        lg:mt-16 lg:flex lg:flex-col lg:justify-center lg:items-center
        xl:mt-16 xl:flex xl:flex-col xl:justify-center xl:items-center
        2xl:mt-16 2xl:flex 2xl:flex-col 2xl:justify-center 2xl:items-center">
        
        {/* Image */}
        <div className="
          sm:-mb-5 sm:h-[15rem] sm:w-[37rem]
          md:-mb-5 md:h-[20rem] md:w-[45rem]
          lg:-mb-5 lg:h-[25rem] lg:w-[60rem]
          xl:-mb-5 xl:h-[30rem] xl:w-[75rem]
          2xl:-mb-10 2xl:h-[30rem] 2xl:w-[75rem] ">

          <img src="./kanbanBoardImage.png" alt="" className="
            sm:z-0 sm:h-full sm:w-full sm:border-2 sm:border-purple-950 sm:border-b-0 sm:rounded-xl sm:rounded-b-none
            md:z-0 md:h-full md:w-full md:border-2 md:border-purple-950 md:border-b-0 md:rounded-xl md:rounded-b-none
            lg:z-0 lg:h-full lg:w-full lg:border-2 lg:border-purple-950 lg:border-b-0 lg:rounded-xl lg:rounded-b-none
            xl:z-0 xl:h-full xl:w-full xl:border-2 xl:border-purple-950 xl:border-b-0 xl:rounded-xl xl:rounded-b-none
            2xl:z-0 2xl:h-full 2xl:w-full 2xl:border-2 2xl:border-purple-950 2xl:border-b-0 2xl:rounded-xl 2xl:rounded-b-none 
            
            wobble" />
        </div>

        {/* Footer */}
        <footer className=" w-screen z-20 flex flex-col gap-3 md:gap-2 md:flex-row py-4 shrink-0 items-center px-4 md:px-6 border-t-2 border-purple-950"
        id="footerSection"
        >
        <p className="text-sm font-bold text-purple-950">
          © Trackr. Made by <span className="text-white">Sameer Poswal</span>
        </p>
        <nav className="md:ml-auto flex gap-4 sm:gap-5">
          <Link className="" href="#">
            <Github className="h-6 w-6 transition-all ease-in delay-75 text-purple-950 hover:text-white" />
          </Link>
          <Link className="" href="#">
            <Linkedin className="h-6 w-6 transition-all ease-in delay-75 text-purple-950 hover:text-white" />
          </Link>
          <Link className="" href="#">
            <Twitter className="h-6 w-6 transition-all ease-in delay-75 text-purple-950 hover:text-white" />
          </Link>
          <Link className="" href="#">
            <Globe className="h-6 w-6 transition-all ease-in delay-75 text-purple-950 hover:text-white" />
          </Link>
        </nav>
        </footer>

        </div>

        
      </div>

    </>
  );
}
