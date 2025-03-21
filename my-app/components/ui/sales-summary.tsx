import React from 'react'
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, TrendingDown, DownloadCloud, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { GlowingEffect } from '@/components/ui/glowing-effect'

interface StatCardProps {
  icon: React.ReactNode
  value: string | number
  title: string
  change: string
  bgGradient: string
  darkBgGradient: string
  iconColor: string
  darkIconColor: string
  increasingIsGood?: boolean
  isDarkMode?: boolean
}

const StatCard = ({
  icon,
  value,
  title,
  change,
  bgGradient,
  darkBgGradient,
  iconColor,
  darkIconColor,
  increasingIsGood = true,
  isDarkMode = false
}: StatCardProps) => {
  // Extract the number from change (e.g., "+4%" -> 4)
  const changeValue = parseFloat(change.replace('%', ''))
  const isPositiveChange = !change.includes('-')
  const changeColor = isPositiveChange === increasingIsGood 
    ? isDarkMode ? 'text-green-400' : 'text-green-500'
    : isDarkMode ? 'text-red-400' : 'text-red-500'

  const containerVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
    hover: { 
      y: -5,
      boxShadow: isDarkMode ? "0 20px 25px -5px rgba(0, 0, 0, 0.5)" : "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2, ease: "easeOut" },
    }
  };

  const iconVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { delay: 0.2, duration: 0.3 } },
    hover: { 
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.2, type: "spring", stiffness: 400 },
    }
  };

  const valueVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { delay: 0.3, duration: 0.3 } },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 },
    }
  };

  return (
    <div className="relative">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        className={cn(
          'p-6 rounded-2xl relative overflow-hidden h-full',
          'border',
          isDarkMode 
            ? 'border-gray-800 shadow-lg shadow-gray-900/20' 
            : 'border-gray-100 shadow-md shadow-gray-200/40',
          'backdrop-blur-sm'
        )}
        style={{
          background: isDarkMode ? darkBgGradient : bgGradient
        }}
      >
        <div className="absolute inset-0 opacity-50">
          <div className={`w-32 h-32 rounded-full blur-3xl absolute -right-12 -bottom-12 ${isDarkMode ? 'opacity-20' : 'opacity-30'}`} 
            style={{ background: isDarkMode ? darkIconColor : iconColor }} />
          <div className={`w-20 h-20 rounded-full blur-2xl absolute right-10 -top-10 ${isDarkMode ? 'opacity-10' : 'opacity-20'}`} 
            style={{ background: isDarkMode ? darkIconColor : iconColor }} />
        </div>
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex justify-between items-start mb-5">
            <motion.div 
              variants={iconVariants}
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center',
                isDarkMode ? 'bg-gray-800/60' : 'bg-white',
                'shadow-sm',
                'backdrop-blur-sm'
              )}
              style={{
                border: `1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(243, 244, 246, 0.8)'}`
              }}
            >
              {icon}
            </motion.div>
            
            <div className={cn(
              'px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-semibold',
              isPositiveChange === increasingIsGood
                ? isDarkMode ? 'bg-green-900/40 text-green-400' : 'bg-green-50 text-green-600'
                : isDarkMode ? 'bg-red-900/40 text-red-400' : 'bg-red-50 text-red-600'
            )}>
              {isPositiveChange ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {change}
            </div>
          </div>
          
          <div className="mt-auto space-y-1">
            <motion.div 
              variants={valueVariants}
              className={cn(
                "text-3xl font-bold tracking-tight",
                isDarkMode ? "text-white" : "text-gray-900"
              )}
            >
              {value}
            </motion.div>
            
            <div className={cn(
              "font-medium text-sm",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}>
              {title}
            </div>
          </div>
        </div>
      </motion.div>
      {!isDarkMode && <GlowingEffect disabled={false} borderWidth={1.5} spread={12} />}
    </div>
  )
}

interface SalesSummaryProps {
  data: {
    totalSales: string | number
    totalSalesChange: string
    totalOrders: string | number
    totalOrdersChange: string
    productsSold: string | number
    productsSoldChange: string
    newCustomers: string | number
    newCustomersChange: string
  }
  isDarkMode?: boolean
}

export function SalesSummary({ data, isDarkMode = false }: SalesSummaryProps) {
  const headerVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="w-full">
      <motion.div 
        variants={headerVariants}
        initial="initial"
        animate="animate"
        className={cn(
          "mb-8 p-6 rounded-2xl relative overflow-hidden",
          isDarkMode 
            ? "bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-800" 
            : "bg-gradient-to-r from-gray-50 to-white border border-gray-100"
        )}
      >
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-30">
          <div
            className={`w-full h-full ${isDarkMode ? "opacity-10" : "opacity-5"}`}
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          ></div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="flex items-start">
            <div className={cn(
              "flex items-center justify-center w-12 h-12 rounded-xl mr-4",
              isDarkMode ? "bg-indigo-900/40 text-indigo-400" : "bg-indigo-100/80 text-indigo-600"
            )}>
              <BarChart3 size={24} />
            </div>
            <div>
              <h2 className={cn(
                "text-2xl font-bold",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                Today's Sales Dashboard
              </h2>
              <p className={cn(
                "mt-1",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}>
                Performance metrics for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors text-sm",
              isDarkMode 
                ? "bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500" 
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-200"
            )}
          >
            <DownloadCloud size={16} />
            Export Report
          </motion.button>
        </div>
      </motion.div>
      
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          icon={<DollarSign className={isDarkMode ? "text-pink-400" : "text-pink-500"} size={22} />}
          value={data.totalSales}
          title="Total Sales"
          change={data.totalSalesChange}
          bgGradient="linear-gradient(145deg, rgb(253, 242, 248, 0.9) 0%, rgb(253, 232, 243, 0.9) 100%)"
          darkBgGradient="linear-gradient(145deg, rgba(39, 31, 50, 0.9) 0%, rgba(44, 29, 48, 0.9) 100%)"
          iconColor="#F472B6"
          darkIconColor="#F472B6"
          isDarkMode={isDarkMode}
        />
        
        <StatCard
          icon={<ShoppingCart className={isDarkMode ? "text-orange-400" : "text-orange-500"} size={22} />}
          value={data.totalOrders}
          title="Total Orders"
          change={data.totalOrdersChange}
          bgGradient="linear-gradient(145deg, rgba(255, 247, 237, 0.9) 0%, rgba(255, 237, 213, 0.9) 100%)"
          darkBgGradient="linear-gradient(145deg, rgba(39, 34, 29, 0.9) 0%, rgba(43, 34, 26, 0.9) 100%)"
          iconColor="#FB923C"
          darkIconColor="#FB923C"
          isDarkMode={isDarkMode}
        />
        
        <StatCard
          icon={<Package className={isDarkMode ? "text-emerald-400" : "text-emerald-500"} size={22} />}
          value={data.productsSold}
          title="Products Sold"
          change={data.productsSoldChange}
          bgGradient="linear-gradient(145deg, rgba(236, 253, 245, 0.9) 0%, rgba(209, 250, 229, 0.9) 100%)"
          darkBgGradient="linear-gradient(145deg, rgba(23, 40, 35, 0.9) 0%, rgba(22, 45, 37, 0.9) 100%)"
          iconColor="#10B981"
          darkIconColor="#10B981"
          isDarkMode={isDarkMode}
        />
        
        <StatCard
          icon={<Users className={isDarkMode ? "text-violet-400" : "text-violet-500"} size={22} />}
          value={data.newCustomers}
          title="New Customers"
          change={data.newCustomersChange}
          bgGradient="linear-gradient(145deg, rgba(245, 243, 255, 0.9) 0%, rgba(233, 225, 254, 0.9) 100%)"
          darkBgGradient="linear-gradient(145deg, rgba(35, 33, 45, 0.9) 0%, rgba(39, 32, 53, 0.9) 100%)"
          iconColor="#8B5CF6"
          darkIconColor="#8B5CF6"
          isDarkMode={isDarkMode}
        />
      </motion.div>
    </div>
  )
} 