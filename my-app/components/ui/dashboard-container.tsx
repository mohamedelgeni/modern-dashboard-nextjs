"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { GlowingEffect } from "@/components/ui/glowing-effect"

interface DashboardContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  glowing?: boolean
  children: React.ReactNode
}

export function DashboardContainer({
  glowing = true,
  className,
  children,
  ...props
}: DashboardContainerProps) {
  return (
    <div className="relative group">
      <div
        className={cn(
          "rounded-xl border bg-card p-6 shadow-sm relative",
          className
        )}
        {...props}
      >
        {children}
      </div>
      {glowing && <GlowingEffect disabled={false} borderWidth={2} spread={20} />}
    </div>
  )
} 