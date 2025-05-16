"use client"

import * as React from "react"
import { ChevronDown, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { SidebarMenu, SidebarMenuButton, SidebarMenuLink } from "@/components/ui/sidebar"

interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
  items?: {
    title: string
    url: string
    isActive?: boolean
  }[]
}

interface NavMainProps extends React.HTMLAttributes<HTMLDivElement> {
  items: NavItem[]
}

export function NavMain({ items, className, ...props }: NavMainProps) {
  return (
    <div className={cn("", className)} {...props}>
      <div className="px-2 py-1">
        <h2 className="mb-1 px-4 text-xs font-semibold tracking-tight">Navigation</h2>
        <SidebarMenu>
          {items.map((item, index) => (
            <NavItemWithSub key={index} item={item} />
          ))}
        </SidebarMenu>
      </div>
    </div>
  )
}

interface NavItemWithSubProps {
  item: NavItem
}

function NavItemWithSub({ item }: NavItemWithSubProps) {
  const [open, setOpen] = React.useState(item.isActive)
  const Icon = item.icon

  if (!item.items?.length) {
    return (
      <SidebarMenuButton asChild>
        <SidebarMenuLink href={item.url} active={item.isActive}>
          <Icon className="h-4 w-4" />
          <span>{item.title}</span>
        </SidebarMenuLink>
      </SidebarMenuButton>
    )
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <SidebarMenuButton className="w-full justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <span>{item.title}</span>
          </div>
          <ChevronDown
            className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200"
            data-state={open ? "open" : "closed"}
            aria-hidden="true"
            style={{
              transform: open ? "rotate(-180deg)" : undefined,
            }}
          />
        </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-6 pt-1">
        <SidebarMenu>
          {item.items.map((subItem, index) => (
            <SidebarMenuButton key={index} asChild>
              <SidebarMenuLink href={subItem.url} active={subItem.isActive}>
                <span>{subItem.title}</span>
              </SidebarMenuLink>
            </SidebarMenuButton>
          ))}
        </SidebarMenu>
      </CollapsibleContent>
    </Collapsible>
  )
}
