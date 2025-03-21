'use client'

import * as React from "react"
import { Bell, ChevronDown, DollarSign, LogOut, MessageSquare, Package, PieChart, Search, ShoppingCart, Users, Loader2, Check, Shield, Clock, RefreshCw, HelpCircle, Sparkles, Upload, Menu, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import axios from "axios"
import { Label } from "@/components/ui/label"
import { CreativePricing } from "@/components/ui/creative-pricing"
import { SalesSummary } from "@/components/ui/sales-summary"
import { DashboardNav } from "@/components/ui/dashboard-nav"
import { DashboardContainer } from "@/components/ui/dashboard-container"

// Import new chart components
import LineChart from "@/components/charts/LineChart"
import BarChart from "@/components/charts/BarChart"
import PieChartComponent from "@/components/charts/PieChart"

// Import chart configurations
import {
  lineChartDataOverallRevenue,
  lineChartOptionsOverallRevenue,
  barChartDataDailyTraffic,
  barChartOptionsDailyTraffic,
  pieChartData,
  pieChartOptions
} from "@/variables/charts"

// Mock data for charts (unchanged)
const visitorData = [
  { name: "Jan", loyal: 400, new: 240, unique: 240 },
  { name: "Feb", loyal: 300, new: 139, unique: 221 },
  { name: "Mar", loyal: 200, new: 980, unique: 229 },
  { name: "Apr", loyal: 278, new: 390, unique: 200 },
  { name: "May", loyal: 189, new: 480, unique: 218 },
  { name: "Jun", loyal: 239, new: 380, unique: 250 },
  { name: "Jul", loyal: 349, new: 430, unique: 210 },
]

const revenueData = [
  { name: "Monday", online: 4000, offline: 2400 },
  { name: "Tuesday", online: 3000, offline: 1398 },
  { name: "Wednesday", online: 2000, offline: 9800 },
  { name: "Thursday", online: 2780, offline: 3908 },
  { name: "Friday", online: 1890, offline: 4800 },
  { name: "Saturday", online: 2390, offline: 3800 },
  { name: "Sunday", online: 3490, offline: 4300 },
]

const satisfactionData = [
  { name: "Jan", lastMonth: 4000, thisMonth: 2400 },
  { name: "Feb", lastMonth: 3000, thisMonth: 1398 },
  { name: "Mar", lastMonth: 2000, thisMonth: 9800 },
  { name: "Apr", lastMonth: 2780, thisMonth: 3908 },
  { name: "May", lastMonth: 1890, thisMonth: 4800 },
  { name: "Jun", lastMonth: 2390, thisMonth: 3800 },
]

const leaderboardData = [
  { name: "John Doe", sales: 120000 },
  { name: "Jane Smith", sales: 98000 },
  { name: "Bob Johnson", sales: 85000 },
  { name: "Alice Brown", sales: 72000 },
  { name: "Charlie Davis", sales: 68000 },
]

const orderData = [
  { id: 1234, customer: "John Doe", amount: 99.99, status: "Shipped" },
  { id: 1235, customer: "Jane Smith", amount: 149.99, status: "Processing" },
  { id: 1236, customer: "Bob Johnson", amount: 79.99, status: "Delivered" },
  { id: 1237, customer: "Alice Brown", amount: 199.99, status: "Pending" },
  { id: 1238, customer: "Charlie Davis", amount: 59.99, status: "Shipped" },
]

const productData = [
  { name: "Category A", value: 400 },
  { name: "Category B", value: 300 },
  { name: "Category C", value: 300 },
  { name: "Category D", value: 200 },
]

const messageData = [
  { id: 1, sender: "John Doe", message: "Hey, I have a question about my order.", time: "10:30 AM" },
  { id: 2, sender: "Jane Smith", message: "Thanks for the quick response!", time: "11:45 AM" },
  { id: 3, sender: "Mike Johnson", message: "When will my package be shipped?", time: "1:15 PM" },
  { id: 4, sender: "Alice Brown", message: "I need to change my shipping address.", time: "2:30 PM" },
  { id: 5, sender: "Charlie Davis", message: "Is this item still in stock?", time: "3:45 PM" },
]

interface ProfileFormData {
  name: string
  email: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

type Page = 'Overview' | 'Sales' | 'Customers' | 'Products' | 'Settings' | 'Profile' | 
  'Dashboard' | 'Order' | 'Sales Report' | 'Data' | 'Plans' | 'AI';

const LoadingSpinner = () => (
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
)

export function DashboardComponent() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>('Overview')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [activePage, setActivePage] = useState<Page>('Overview')
  const [userName, setUserName] = React.useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [userEmail, setUserEmail] = useState('')
  const [dataFile, setDataFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [uploadedResults, setUploadedResults] = useState<{
    id: number
    chart_type: string
    data: any
  } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [updating, setUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [updateError, setUpdateError] = useState('')

  React.useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      router.push('/login')
    } else {
      const name = localStorage.getItem('userName') || 'User'
      setUserName(name)
    }
  }, [router])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const handleSignOut = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userName')
    router.push('/login')
  }

  const validateForm = () => {
    // Basic validation
    if (!formData.name.trim()) {
      toast.error("Name is required")
      return false
    }
    
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Valid email is required")
      return false
    }
    
    // Password validation only if user is trying to update password
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        toast.error("Current password is required to set new password")
        return false
      }
      if (formData.newPassword.length < 8) {
        toast.error("New password must be at least 8 characters")
        return false
      }
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("Passwords don't match")
        return false
      }
    }

    return true
  }

  const handleDataFileUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('dataFile', file);

      setIsLoading(true);
      console.log('Uploading data file to Python app...');
      
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8501/upload-data-file', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload file');
      }
      
      console.log('Analysis results:', result);
      setUploadedResults(result);
      
      toast.success('File analyzed successfully and results saved');
      
      return true;
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast.error(error.message || 'Failed to analyze file');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const downloadResults = async (filename: string) => {
    try {
      const response = await fetch(`http://localhost:8501/download-result/${filename}`);
      const data = await response.json();
      
      // Create and download file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading results:', error);
      toast.error('Failed to download results');
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    setUpdateSuccess(false)
    setUpdateError('')
    
    try {
      const token = localStorage.getItem('authToken')
      if (!token) throw new Error('Not authenticated')
      
      // Validate passwords match if new password is provided
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        setUpdateError('New passwords do not match')
        setUpdating(false)
        return
      }
      
      // Create payload - only include password fields if new password is provided
      const payload = {
        name: formData.name,
        email: formData.email,
        ...(formData.newPassword ? {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        } : {})
      }
      
      const response = await axios.post(
        'http://localhost:4000/update-profile',
        payload,
        { headers: { Authorization: `Bearer ${token}` }}
      )
      
      // Update auth token if returned
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token)
      }
      
      // Update user name in localStorage if it changed
      if (response.data.name) {
        localStorage.setItem('userName', response.data.name)
      }
      
      setUpdateSuccess(true)
      toast.success('Profile updated successfully')
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
    } catch (error) {
      console.error('Error updating profile:', error)
      setUpdateError(axios.isAxiosError(error) 
        ? error.response?.data.error || 'Update failed' 
        : 'An unexpected error occurred')
      toast.error('Failed to update profile')
    } finally {
      setUpdating(false)
    }
  }

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) return

      const userData = await axios.get('http://localhost:4000/get-user-profile', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.data)

      setFormData(prev => ({
        ...prev,
        name: userData.name || '',
        email: userData.email || ''
      }))
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  useEffect(() => {
    if (activePage === "Profile") {
      fetchUserData()
    }
  }, [activePage])

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    console.log('Current token:', token)
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]))
        console.log('Decoded token:', decoded)
      } catch (error) {
        console.error('Invalid token:', error)
      }
    }
  }, [])

  // Close mobile menu when page changes
  React.useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [activePage])

  // Sales summary data for today
  const salesSummaryData = {
    totalSales: '$12,456',
    totalSalesChange: '+12.5%',
    totalOrders: '156',
    totalOrdersChange: '+8.2%',
    productsSold: '432',
    productsSoldChange: '+14.3%',
    newCustomers: '64',
    newCustomersChange: '-3.7%'
  }

  return (
    <div className={cn("flex h-screen bg-gray-100 transition-colors duration-200", 
                       isDarkMode ? "dark bg-gray-900 text-white" : "")}>
      
      {/* Combined navigation and header */}
      <DashboardNav 
        items={[
          { name: "Dashboard", url: "#", icon: PieChart },
          { name: "Order", url: "#", icon: ShoppingCart },
          { name: "Products", url: "#", icon: Package },
          { name: "Sales", url: "#", icon: DollarSign },
          { name: "Profile", url: "#", icon: Users },
          { name: "Data", url: "#", icon: Package },
          { name: "Plans", url: "#", icon: DollarSign },
          { name: "AI", url: "#", icon: Sparkles }
        ]}
        userName={userName}
        isDarkMode={isDarkMode}
        onThemeToggle={toggleTheme}
        onSignOut={handleSignOut}
        onItemClick={(name) => setActivePage(name as Page)}
        className="sm:mb-0 sm:top-6"
      />

      {/* Main content - adjusted padding for combined navbar */}
      <main className="flex-1 p-4 pt-24 sm:pt-32 md:p-8 md:pt-32 overflow-auto">
        {/* Conditional rendering for each page */}
        {activePage === "Dashboard" && (
          <>
            {/* Replace Today's Sales Grid with SalesSummary component */}
            <DashboardContainer className="mb-8">
              <SalesSummary data={salesSummaryData} isDarkMode={isDarkMode} />
            </DashboardContainer>

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
              <Card className={isDarkMode ? "bg-gray-800" : ""}>
                <CardHeader>
                  <CardTitle>Visitor Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <LineChart 
                      chartData={lineChartDataOverallRevenue}
                      chartOptions={lineChartOptionsOverallRevenue}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className={isDarkMode ? "bg-gray-800" : ""}>
                <CardHeader>
                  <CardTitle>Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <BarChart
                      chartData={barChartDataDailyTraffic}
                      chartOptions={barChartOptionsDailyTraffic}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
              <Card className={isDarkMode ? "bg-gray-800" : ""}>
                <CardHeader>
                  <CardTitle>Customer Satisfaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <LineChart 
                      chartData={lineChartDataOverallRevenue}
                      chartOptions={{
                        ...lineChartOptionsOverallRevenue,
                        colors: ["#FF4560", "#008FFB"],
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className={isDarkMode ? "bg-gray-800" : ""}>
                <CardHeader>
                  <CardTitle>Target vs Reality</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <BarChart
                      chartData={[
                        {
                          name: "Target",
                          data: revenueData.map(item => item.online),
                        },
                        {
                          name: "Reality",
                          data: revenueData.map(item => item.offline),
                        }
                      ]}
                      chartOptions={{
                        ...barChartOptionsDailyTraffic,
                        xaxis: {
                          ...barChartOptionsDailyTraffic.xaxis,
                          categories: revenueData.map(item => item.name),
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {activePage === "Order" && (
          <div className="space-y-4">
            <Card className={isDarkMode ? "bg-gray-800" : ""}>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Order ID</th>
                        <th className="text-left p-2">Customer</th>
                        <th className="text-right p-2">Amount</th>
                        <th className="text-left p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderData.map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="p-2">{order.id}</td>
                          <td className="p-2">{order.customer}</td>
                          <td className="text-right p-2">${order.amount.toFixed(2)}</td>
                          <td className="p-2">
                            <span className={cn("px-2 py-1 rounded-full text-xs", 
                              order.status === "Shipped" ? "bg-green-200 text-green-800" :
                              order.status === "Processing" ? "bg-yellow-200 text-yellow-800" :
                              order.status === "Pending" ? "bg-red-200 text-red-800" :
                              "bg-blue-200 text-blue-800"
                            )}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            <Card className={isDarkMode ? "bg-gray-800" : ""}>
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <PieChartComponent
                    chartData={[2, 1, 1, 1]}
                    chartOptions={{
                      ...pieChartOptions,
                      labels: ['Shipped', 'Processing', 'Delivered', 'Pending'],
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activePage === "Products" && (
          <div className="space-y-4">
            <Card className={isDarkMode ? "bg-gray-800" : ""}>
              <CardHeader>
                <CardTitle>Product Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <PieChartComponent
                    chartData={productData.map(item => item.value)}
                    chartOptions={{
                      ...pieChartOptions,
                      labels: productData.map(item => item.name),
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            <Card className={isDarkMode ? "bg-gray-800" : ""}>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {productData.map((product) => (
                    <div key={product.name} className="flex justify-between items-center">
                      <span>{product.name}</span>
                      <div className="w-24 bg-blue-100 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(product.value / Math.max(...productData.map(p => p.value))) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activePage === "Sales" && (
          <div className="space-y-4">
            <Card className={isDarkMode ? "bg-gray-800" : ""}>
              <CardHeader>
                <CardTitle>Monthly Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <LineChart
                    chartData={[
                      {
                        name: "Last Month",
                        data: satisfactionData.map(item => item.lastMonth),
                      },
                      {
                        name: "This Month",
                        data: satisfactionData.map(item => item.thisMonth),
                      }
                    ]}
                    chartOptions={{
                      ...lineChartOptionsOverallRevenue,
                      xaxis: {
                        ...lineChartOptionsOverallRevenue.xaxis,
                        categories: satisfactionData.map(item => item.name),
                      },
                      colors: ["#8884d8", "#82ca9d"]
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            <Card className={isDarkMode ? "bg-gray-800" : ""}>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <BarChart
                    chartData={[
                      {
                        name: "Sales",
                        data: productData.map(item => item.value),
                      }
                    ]}
                    chartOptions={{
                      ...barChartOptionsDailyTraffic,
                      xaxis: {
                        ...barChartOptionsDailyTraffic.xaxis,
                        categories: productData.map(item => item.name),
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activePage === "Sales Report" && (
          <div className="space-y-4">
            <Card className={isDarkMode ? "bg-gray-800" : ""}>
              <CardHeader>
                <CardTitle>Monthly Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <LineChart 
                    chartData={[
                      {
                        name: "Last Month",
                        data: satisfactionData.map(item => item.lastMonth),
                      },
                      {
                        name: "This Month",
                        data: satisfactionData.map(item => item.thisMonth),
                      }
                    ]}
                    chartOptions={{
                      ...lineChartOptionsOverallRevenue,
                      xaxis: {
                        ...lineChartOptionsOverallRevenue.xaxis,
                        categories: satisfactionData.map(item => item.name),
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            <Card className={isDarkMode ? "bg-gray-800" : ""}>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <BarChart
                    chartData={[
                      {
                        name: "Sales",
                        data: productData.map(item => item.value),
                      }
                    ]}
                    chartOptions={{
                      ...barChartOptionsDailyTraffic,
                      xaxis: {
                        ...barChartOptionsDailyTraffic.xaxis,
                        categories: productData.map(item => item.name),
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activePage === "Profile" && (
          <div className="space-y-4">
            <Card className={isDarkMode ? "bg-gray-800" : ""}>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleProfileUpdate}>
                  <div className="flex flex-col space-y-4">
                    <div className="w-full flex justify-center mb-6">
                      <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <Users className="h-12 w-12" />
                      </div>
                    </div>
                      
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className={isDarkMode ? "bg-gray-700 border-gray-600" : ""}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className={isDarkMode ? "bg-gray-700 border-gray-600" : ""}
                      />
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="font-medium mb-2">Change Password</h3>
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input 
                          id="current-password" 
                          type="password" 
                          value={formData.currentPassword}
                          onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                          className={isDarkMode ? "bg-gray-700 border-gray-600" : ""}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input 
                          id="new-password" 
                          type="password" 
                          value={formData.newPassword}
                          onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                          className={isDarkMode ? "bg-gray-700 border-gray-600" : ""}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input 
                          id="confirm-password" 
                          type="password" 
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                          className={isDarkMode ? "bg-gray-700 border-gray-600" : ""}
                        />
                      </div>
                    </div>
                    
                    {updateError && (
                      <div className="p-3 bg-red-100 text-red-700 rounded-md">
                        {updateError}
                      </div>
                    )}
                    
                    {updateSuccess && (
                      <div className="p-3 bg-green-100 text-green-700 rounded-md">
                        Profile updated successfully.
                      </div>
                    )}
                    
                    <Button 
                      type="submit"
                      disabled={updating} 
                      className="w-full mt-4"
                    >
                      {updating ? 'Updating...' : 'Update Profile'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {activePage === "Data" && (
          <div className="space-y-4">
            <Card className={isDarkMode ? "bg-gray-800" : ""}>
              <CardHeader>
                <CardTitle>Data Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <label htmlFor="data-file" className="block text-sm font-medium mb-1">Upload Data File</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Package className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="data-file"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input 
                            id="data-file" 
                            type="file" 
                            className="sr-only"
                            accept=".csv,.xlsx,.xls,.json"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                await handleDataFileUpload(file);
                              }
                            }}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        CSV, Excel, or JSON up to 10MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Display Analysis Results */}
                {uploadedResults && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold">Analysis Results</h3>
                    <p className="text-sm text-gray-500">{uploadedResults.data.message}</p>
                    <Button
                      onClick={() => downloadResults(uploadedResults.data.result_file)}
                      className="mt-2"
                    >
                      Download Results
                    </Button>
                    
                    {/* Display KPIs */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(uploadedResults.data.kpis).map(([key, value]) => (
                        <div key={key} className="p-4 border rounded">
                          <h4 className="font-medium">{key}</h4>
                          <p>{JSON.stringify(value)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activePage === "Plans" && (
          <div className="space-y-4">
            <Card className={isDarkMode ? "bg-gray-800" : ""}>
              <CardHeader>
                <CardTitle>Choose Your Perfect Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <CreativePricing
                  tag="Restaurant Plans"
                  title="Empower Your Restaurant Analytics"
                  description="Unlock insights, boost sales, and streamline your operations"
                  tiers={[
                    {
                      name: "Basic",
                      icon: <Package className="w-6 h-6" />,
                      price: 29,
                      description: "Perfect for small restaurants",
                      color: "blue",
                      features: [
                        "Up to 1,000 orders/month",
                        "Basic analytics",
                        "2 team members",
                        "Email support",
                        "Basic reporting"
                      ],
                    },
                    {
                      name: "Pro",
                      icon: <Star className="w-6 h-6" />,
                      price: 79,
                      description: "For growing restaurants",
                      color: "amber",
                      features: [
                        "Up to 10,000 orders/month",
                        "Advanced analytics",
                        "5 team members",
                        "Priority email support",
                        "Advanced reporting",
                        "Custom integrations",
                        "API access"
                      ],
                      popular: true,
                    },
                    {
                      name: "Enterprise",
                      icon: <Sparkles className="w-6 h-6" />,
                      price: 199,
                      description: "For restaurant chains",
                      color: "purple",
                      features: [
                        "Unlimited orders",
                        "Enterprise analytics",
                        "Unlimited team members",
                        "24/7 phone support",
                        "Custom reporting",
                        "Dedicated account manager",
                        "Custom development",
                        "SLA guarantee"
                      ],
                    }
                  ]}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {activePage === "AI" && (
          <DashboardContainer className={cn(
            "max-w-4xl mx-auto",
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
          )}>
            <h2 className="text-2xl font-bold mb-6">AI Assistant</h2>
            
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-gray-700">
                <h3 className="font-semibold text-lg mb-2">Ask me anything</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Our AI assistant can help you analyze sales data, generate reports, 
                  and provide insights on your business performance.
                </p>
                
                <div className="flex">
                  <Input 
                    className="flex-1 mr-2" 
                    placeholder="How did our sales perform last week?" 
                  />
                  <Button>
                    Ask
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Recent Queries</h3>
                <ul className="space-y-2">
                  <li className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5 text-gray-400">
                        <MessageSquare size={16} />
                      </div>
                      <div>
                        <p className="text-sm">What were our top selling products last month?</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">5 hours ago</p>
                      </div>
                    </div>
                  </li>
                  <li className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5 text-gray-400">
                        <MessageSquare size={16} />
                      </div>
                      <div>
                        <p className="text-sm">Summarize revenue trends for Q3</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Yesterday</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </DashboardContainer>
        )}
      </main>
    </div>
  )
}