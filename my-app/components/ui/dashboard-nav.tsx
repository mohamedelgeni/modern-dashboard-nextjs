"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { LucideIcon, Moon, Sun, LogOut, User, Settings, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface DashboardNavProps {
  items: NavItem[]
  userName: string
  userInitials?: string
  userImage?: string
  isDarkMode: boolean
  onThemeToggle: () => void
  onSignOut: () => void
  className?: string
  onItemClick?: (name: string) => void
}

export function DashboardNav({ 
  items, 
  userName, 
  userInitials,
  userImage,
  isDarkMode, 
  onThemeToggle, 
  onSignOut,
  className, 
  onItemClick 
}: DashboardNavProps) {
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [isMobile, setIsMobile] = useState(false)

  // Get user initials if not provided
  const initials = userInitials || userName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleClick = (name: string) => {
    setActiveTab(name)
    if (onItemClick) {
      onItemClick(name)
    }
  }

  const handleDarkModeToggle = () => {
    onThemeToggle()
  }

  return (
    <div className={cn(
      "fixed left-0 right-0 z-50",
      isMobile ? "bottom-0 mb-6" : "top-0 mt-6",
      className
    )}>
      <div className={cn(
        "mx-auto max-w-screen-xl px-4 flex items-center justify-between",
        "backdrop-blur-lg py-2 px-4 rounded-full shadow-lg",
        isDarkMode 
          ? "bg-gray-800/50 border border-gray-700" 
          : "bg-background/5 border border-border"
      )}>
        {/* Navigation Items */}
        <div className="flex items-center gap-1 md:gap-2 flex-1">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.name

            return (
              <Link
                key={item.name}
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handleClick(item.name)
                }}
                className={cn(
                  "relative flex items-center justify-center cursor-pointer text-sm font-medium px-3 md:px-4 py-2 rounded-full transition-colors",
                  isDarkMode ? "text-gray-300 hover:text-white" : "text-foreground/80 hover:text-primary",
                  isActive && (isDarkMode ? "bg-gray-700 text-white" : "bg-muted text-primary"),
                )}
              >
                <Icon size={18} strokeWidth={2} className="flex-shrink-0" />
                <span className="hidden md:inline md:ml-2">{item.name}</span>
                
                {isActive && (
                  <motion.div
                    layoutId="lamp"
                    className={cn(
                      "absolute inset-0 w-full rounded-full -z-10",
                      isDarkMode ? "bg-primary/10" : "bg-primary/5"
                    )}
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <div className={cn(
                      "absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-t-full",
                      isDarkMode ? "bg-indigo-500" : "bg-primary"
                    )}>
                      <div className={cn(
                        "absolute w-12 h-6 rounded-full blur-md -top-2 -left-2",
                        isDarkMode ? "bg-indigo-500/30" : "bg-primary/20"
                      )} />
                      <div className={cn(
                        "absolute w-8 h-6 rounded-full blur-md -top-1",
                        isDarkMode ? "bg-indigo-500/30" : "bg-primary/20"
                      )} />
                      <div className={cn(
                        "absolute w-4 h-4 rounded-full blur-sm top-0 left-2",
                        isDarkMode ? "bg-indigo-500/30" : "bg-primary/20"
                      )} />
                    </div>
                  </motion.div>
                )}
              </Link>
            )
          })}
        </div>

        {/* User Controls */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Dark mode toggle - only icon */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDarkModeToggle}
            className={cn(
              "w-9 h-9 rounded-full",
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            )}
          >
            {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
          </Button>
          
          {/* User profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={cn(
                  "h-9 gap-2 pl-1 pr-2 rounded-full",
                  isDarkMode 
                    ? "hover:bg-gray-700 data-[state=open]:bg-gray-700" 
                    : "hover:bg-gray-100 data-[state=open]:bg-gray-100"
                )}
              >
                <Avatar className="h-7 w-7">
                  {userImage && <AvatarImage src={userImage} alt={userName} />}
                  <AvatarFallback className={isDarkMode ? "bg-gray-700" : "bg-gray-200"}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline font-medium truncate max-w-[100px]">
                  {userName}
                </span>
                <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-muted-foreground">Admin</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onSignOut} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
} 