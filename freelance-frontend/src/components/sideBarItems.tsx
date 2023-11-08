import React from "react"
import Link from "next/link"
import { NextRouter } from "next/router"
import { cn } from "@/utils/cn"

interface SidebarItemProps {
  link: SideBarItem
  location: NextRouter
  open: boolean
}

const SidebarItem = ({ link, location, open }: SidebarItemProps) => {
  return (
    <Link
      href={link.href}
      className={cn("border-l-4 border-transparent", {
        " border-l-4 border-primary": location.pathname === link.href,
      })}
    >
      <li
        className={cn(
          "flex cursor-pointer items-center gap-x-2 rounded-lg p-2 font-normal text-foreground hover:bg-border",
          {
            "rounded-l-none": location.pathname === link.href,
          }
        )}
      >
        <span>{link.icon}</span>
        <span
          className={cn(
            { "max-w-[30px] overflow-hidden text-ellipsis": !open },
            "text-md origin-left font-medium text-slate-600"
          )}
        >
          {link.title}
        </span>
      </li>
    </Link>
  )
}

export default SidebarItem
