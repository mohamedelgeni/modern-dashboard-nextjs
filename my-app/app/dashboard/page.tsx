'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { DashboardComponent } from "@/components/dashboard"

export default function DashboardPage() {
  const router = useRouter()

  React.useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      // Redirect to login if no token is found
      router.push('/login')
    }
  }, [router])

  return <DashboardComponent />
}