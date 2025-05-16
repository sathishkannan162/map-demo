"use client"

import * as React from "react"
import { ChevronDown, type LucideIcon, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { SidebarMenu, SidebarMenuButton, SidebarMenuLink } from "@/components/ui/sidebar"

interface Project {
  name: string
  url: string
  icon: LucideIcon
}

interface NavProjectsProps extends React.HTMLAttributes<HTMLDivElement> {
  projects: Project[]
}

export function NavProjects({ projects, className, ...props }: NavProjectsProps) {
  const [open, setOpen] = React.useState(true)

  return (
    <div className={cn("", className)} {...props}>
      <div className="px-2 py-1">
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="w-full justify-between">
              <h2 className="text-xs font-semibold tracking-tight">Projects</h2>
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
          <CollapsibleContent className="pt-1">
            <SidebarMenu>
              {projects.map((project, index) => {
                const Icon = project.icon
                return (
                  <SidebarMenuButton key={index} asChild>
                    <SidebarMenuLink href={project.url}>
                      <Icon className="h-4 w-4" />
                      <span>{project.name}</span>
                    </SidebarMenuLink>
                  </SidebarMenuButton>
                )
              })}
              <SidebarMenuButton asChild>
                <SidebarMenuLink href="#" className="text-muted-foreground">
                  <Plus className="h-4 w-4" />
                  <span>Add Project</span>
                </SidebarMenuLink>
              </SidebarMenuButton>
            </SidebarMenu>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}
