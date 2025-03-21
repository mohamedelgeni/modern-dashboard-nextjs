import { Button } from "@/components/ui/button"
import { PieChart, Users, ShoppingCart, Package, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activePage: string
  setActivePage: (page: string) => void
  isDarkMode: boolean
  handleSignOut: () => void
}

export function Sidebar({ activePage, setActivePage, isDarkMode, handleSignOut }: SidebarProps) {
  const menuItems = [
    { name: "Dashboard", icon: PieChart },
    { name: "Leaderboard", icon: Users },
    { name: "Order", icon: ShoppingCart },
    { name: "Products", icon: Package },
    { name: "Sales Report", icon: PieChart },
    { name: "Profile", icon: Users },
    { name: "Settings", icon: Settings }
  ]

  return (
    <aside className={cn("w-64 p-6 flex flex-col", 
      isDarkMode ? "bg-gray-800" : "bg-white")}>
      <div className="flex items-center mb-8">
        <div className={cn("w-8 h-8 rounded-lg mr-2", 
          isDarkMode ? "bg-indigo-400" : "bg-indigo-600")}></div>
        <span className="text-xl font-bold">Dabang</span>
      </div>
      
      <nav className="flex-1">
        {menuItems.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            className={cn("w-full justify-start mb-1", 
              activePage === item.name ? "bg-indigo-100 text-indigo-600" : "",
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100")}
            onClick={() => setActivePage(item.name)}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.name}
          </Button>
        ))}
      </nav>

      <Button variant="ghost" onClick={handleSignOut} className="w-full justify-start mt-auto">
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    </aside>
  )
} 