"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
  isDarkMode?: boolean
  onItemClick?: (name: string) => void
}

export function NavBar({ items, className, isDarkMode = false, onItemClick }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [isMobile, setIsMobile] = useState(false)

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

  return (
    <div
      className={cn(
        "fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6",
        className,
      )}
    >
      <div className={cn(
        "flex items-center gap-3 border backdrop-blur-lg py-1 px-1 rounded-full shadow-lg",
        isDarkMode 
          ? "bg-gray-800/50 border-gray-700" 
          : "bg-background/5 border-border"
      )}>
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
                "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                isDarkMode ? "text-gray-300 hover:text-white" : "text-foreground/80 hover:text-primary",
                isActive && (isDarkMode ? "bg-gray-700 text-white" : "bg-muted text-primary"),
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
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
    </div>
  )
} 