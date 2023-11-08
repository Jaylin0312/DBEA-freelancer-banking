import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { cn } from "@/utils/cn"
import {
  BarChartBig,
  Bookmark,
  ClipboardSignature,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import SidebarItem from "./sideBarItems"

export const Sidebar = () => {
  const [open, setOpen] = useState(true)
  const [role, setRole] = useState<string | null>(null)
  const [userID, setUserID] = useState<string | null>(null)
  const [sidebarLinks, setSidebarLinks] = useState<SideBarItem[]>([])
  const location = useRouter()

  useEffect(() => {
    setUserID(localStorage.getItem("userID"))
    setRole(localStorage.getItem("role"))
  }, [])

  useEffect(() => {
    if (role === "USER") {
      setSidebarLinks([
        {
          title: "Dashboard",
          href: "/user/dashboard",
          icon: <BarChartBig color="#2563EB" size={30} />,
        },
        {
          title: "Loan Application",
          href: "/loan/application",
          icon: <Bookmark color="#2563EB" size={30} />,
        },
        {
          title: "Invoice",
          href: "/invoice/form",
          icon: <ClipboardSignature color="#2563EB" size={30} />,
        },
        {
          title: "Logout",
          href: "/login",
          icon: <LogOut color="#2563EB" size={30} />,
        },
      ])
    } else {
      setSidebarLinks([
        {
          title: "Loan Approval",
          href: "/admin/dashboard",
          icon: <BarChartBig color="#2563EB" size={30} />,
        },
        {
          title: "Logout",
          href: "/login",
          icon: <LogOut color="#2563EB" size={30} />,
        },
      ])
    }
  }, [role])

  return (
    <>
      <div
        className={`${
          open ? "w-60" : "w-fit"
        } relative hidden content-between border-r border-border bg-muted p-6 duration-300 sm:grid`}
      >
        <PanelLeftOpen
          className={cn(
            "absolute -right-6 top-3 h-auto w-fit cursor-pointer rounded-md border bg-white p-1.5 text-primary hover:bg-muted",
            { hidden: open }
          )}
          onClick={() => setOpen(!open)}
        />
        <PanelLeftClose
          className={cn(
            "absolute -right-6 top-3 h-auto w-fit cursor-pointer rounded-md border bg-white p-1.5 text-primary hover:bg-muted",
            { hidden: !open }
          )}
          onClick={() => setOpen(!open)}
        />
        <div>
          <div className="flex border-b-2 pb-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1 className="p-2 text-xl font-bold text-primary">
              {open ? userID : "ST"}
            </h1>
          </div>
          <ul className="flex flex-col gap-y-2 pt-4">
            {sidebarLinks.map((link, index) => (
              <SidebarItem
                link={link}
                open={open}
                location={location}
                key={index}
              />
            ))}
          </ul>
        </div>
        <div
          className={cn(
            { hidden: !open },
            "text-md origin-left text-slate-600"
          )}
        >
          More features coming soon!
        </div>
      </div>
    </>
  )
}

export default Sidebar
