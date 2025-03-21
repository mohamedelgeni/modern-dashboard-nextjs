"use client"

import React, { useState } from "react"
import { User, Moon, Sun, LogOut, Settings, Bell, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Switch } from "@/components/ui/switch"
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

interface DashboardHeaderProps {
  userName: string
  pageTitle: string
  isDarkMode: boolean
  onThemeToggle: () => void
  onSignOut: () => void
  userInitials?: string
  userImage?: string
  className?: string
}

export function DashboardHeader({
  userName,
  pageTitle,
  isDarkMode,
  onThemeToggle,
  onSignOut,
  userInitials,
  userImage,
  className,
}: DashboardHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)

  // Get user initials if not provided
  const initials = userInitials || userName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className={cn(
      "flex justify-between items-center py-3 px-4 rounded-xl backdrop-blur-sm",
      isDarkMode 
        ? "bg-gray-900/50 border border-gray-800 shadow-lg" 
        : "bg-white/70 border border-gray-100 shadow-sm",
      className
    )}>
      {/* Combined left section with title and search */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">{pageTitle}</h1>
      </div>
      
      {/* Right section with all controls in one line */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          className={cn(
            "w-9 h-9 flex items-center justify-center rounded-full transition-colors",
            isDarkMode 
              ? "hover:bg-gray-800" 
              : "hover:bg-gray-100"
          )}
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell size={18} />
          <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500"></span>
        </motion.button>
        
        {/* Dark mode toggle - simplified */}
        <Switch
          checked={isDarkMode}
          onCheckedChange={onThemeToggle}
          className="data-[state=checked]:bg-indigo-600"
        />
        
        <span className="text-sm hidden md:inline-flex">
          {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
        </span>
        
        {/* User profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className={cn(
                "h-10 gap-2 px-2",
                isDarkMode 
                  ? "hover:bg-gray-800 data-[state=open]:bg-gray-800" 
                  : "hover:bg-gray-100 data-[state=open]:bg-gray-100"
              )}
            >
              <Avatar className="h-8 w-8">
                {userImage && <AvatarImage src={userImage} alt={userName} />}
                <AvatarFallback className={isDarkMode ? "bg-gray-800" : "bg-gray-200"}>
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
    </header>
  )
} 