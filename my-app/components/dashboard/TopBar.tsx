import { Bell, ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

interface TopBarProps {
  activePage: string
  userName: string
  isDarkMode: boolean
  toggleTheme: () => void
  handleSignOut: () => void
}

export function TopBar({ activePage, userName, isDarkMode, toggleTheme, handleSignOut }: TopBarProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold">{activePage}</h1>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input placeholder="Search here..." className="pl-8" />
        </div>
        <Button variant="outline">
          Eng (US)
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="flex items-center space-x-2">
          <span className="font-medium">{userName}</span>
          <ChevronDown className="h-4 w-4" />
          <Button variant="ghost" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
        <Switch
          checked={isDarkMode}
          onCheckedChange={toggleTheme}
          className="ml-4"
        />
      </div>
    </div>
  )
} 