import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, Calendar, Users, BarChart, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <CheckCircle className="h-6 w-6 text-blue-400" />
          <span className="ml-2 text-2xl font-bold">Tasky</span>
        </Link>
        
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-9 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Manage Tasks with Ease
                </h1>
                
              </div>
              <div className="w-full max-w-sm space-y-2">
                  <Button className=" h-10 w-32 rounded-sm bg-blue-600 hover:bg-blue-700">
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
      </footer>
    </div>
  )
}