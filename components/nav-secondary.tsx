"use client"

import type * as React from "react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { SidebarMenu, SidebarMenuButton, SidebarMenuLink } from "@/components/ui/sidebar"

interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
}

interface NavSecondaryProps extends React.HTMLAttributes<HTMLDivElement> {
  items: NavItem[]
}

export function NavSecondary({ items, className, ...props }: NavSecondaryProps) {
  return (
    <div className={cn("", className)} {...props}>
      <div className="px-2 py-1">
        <SidebarMenu>
          {items.map((item, index) => {
            const Icon = item.icon
            return (
              <SidebarMenuButton key={index} asChild>
                <SidebarMenuLink href={item.url} active={item.isActive}>
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </SidebarMenuLink>
              </SidebarMenuButton>
            )
          })}
        </SidebarMenu>
      </div>
    </div>
  )
}
