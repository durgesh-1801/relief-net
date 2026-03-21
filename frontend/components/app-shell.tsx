"use client"
import React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  FileWarning,
  Users,
  Shield,
  AlertTriangle,
  Search,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Activity,
} from "lucide-react"

const navItems = [
  { 
    href: "/", 
    label: "Dashboard", 
    icon: LayoutDashboard,
    roles: ["admin", "user"],
    description: "Overview & incidents"
  },
  { 
    href: "/report", 
    label: "Report", 
    icon: FileWarning,
    roles: ["admin", "user"],
    description: "Submit new incident"
  },
  { 
    href: "/volunteers", 
    label: "Volunteers", 
    icon: Users,
    roles:["volunteers", "admin"],
    description: "Manage team"
  },
  { 
    href: "/admin", 
    label: "Admin", 
    icon: Shield,
    roles:["admin"],
    description: "Control center"
  },
]

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full z-50 flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[72px]" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "flex items-center h-16 px-4 border-b border-sidebar-border",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg group-hover:bg-primary/30 transition-colors" />
              <div className="relative p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 group-hover:border-primary/40 transition-colors">
                <AlertTriangle className="h-5 w-5 text-primary" />
              </div>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-semibold text-sidebar-foreground tracking-tight">
                  DisasterHub
                </span>
                <span className="text-[10px] text-muted-foreground font-medium tracking-wide uppercase">
                  Response System
                </span>
              </div>
            )}
          </Link>
          
          {/* Collapse button - desktop only */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "hidden lg:flex h-7 w-7 text-muted-foreground hover:text-foreground",
              isCollapsed && "absolute -right-3 top-6 h-6 w-6 rounded-full border border-border bg-card shadow-lg"
            )}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto scrollbar-thin">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                  )}
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-lg transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground group-hover:text-foreground group-hover:bg-muted/50"
                  )}>
                    <item.icon className="h-4.5 w-4.5" />
                  </div>
                  {!isCollapsed && (
                    <div className="flex flex-col">
                      <span>{item.label}</span>
                      <span className="text-[10px] text-muted-foreground font-normal">
                        {item.description}
                      </span>
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Live status indicator */}
        {!isCollapsed && (
          <div className="p-4 mx-3 mb-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20" />
                <div className="relative w-2 h-2 bg-emerald-500 rounded-full" />
              </div>
              <span className="text-xs font-medium text-emerald-400">System Active</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              All services operational. Real-time monitoring enabled.
            </p>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className={cn(
        "flex-1 flex flex-col min-h-screen transition-all duration-300",
        isCollapsed ? "lg:ml-[72px]" : "lg:ml-64"
      )}>
        {/* Top navbar */}
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 lg:px-6 border-b border-border glass">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search incidents, volunteers..."
                className="w-64 lg:w-80 pl-9 h-9 bg-secondary/50 border-border/50 text-sm placeholder:text-muted-foreground/60 focus:bg-secondary focus:border-primary/30"
              />
              <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden lg:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">{"/"}</span>K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Activity indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <Activity className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">5 Active</span>
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground hover:text-foreground">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </Button>

            {/* Settings */}
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
              <Settings className="h-4.5 w-4.5" />
            </Button>

            {/* Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage src="/avatar.jpg" alt="User" />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                      JD
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-3 p-3">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src="/avatar.jpg" alt="User" />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">John Doe</span>
                    <span className="text-xs text-muted-foreground">Administrator</span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
