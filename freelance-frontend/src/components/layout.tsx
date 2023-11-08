import Sidebar from "@/components/sideBar"
import { Toaster } from "@/components/ui/toaster"

interface LayoutProps {
  children?: React.ReactElement[] | React.ReactElement
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen flex-auto">
      <Sidebar />
      <div className="grow overflow-y-auto overflow-x-hidden">
        <div className="mx-auto max-w-2xl px-6 py-8 md:pl-7 lg:max-w-4xl xl:max-w-6xl">
          {children}
        </div>
        <Toaster />
      </div>
    </div>
  )
}
