'use client'

import axios from 'axios'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { EyeIcon, EyeOffIcon } from 'lucide-react'

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const toggleForm = () => setIsLogin(!isLogin)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const url = isLogin ? '/login' : '/signup'
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      ...(isLogin ? {} : { name: formData.get('name') as string }),
    }

    try {
      const response = await axios.post(`http://localhost:4000${url}`, data)
      const { token, name } = response.data
      
      // Store both token and name
      localStorage.setItem('authToken', token)
      if (name) {
        localStorage.setItem('userName', name)
      }
      
      router.push('/dashboard')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.error || 'Server error')
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 w-full">
      <div className="w-full max-w-md mx-auto">
        <Card className="w-full shadow-lg border-gray-200">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-center">
              {isLogin ? 'Login' : 'Sign Up'}
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              {isLogin
                ? 'Welcome back! Please login to your account.'
                : 'Create an account to get started.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <AnimatePresence mode="wait">
              <motion.form
                onSubmit={handleSubmit}
                key={isLogin ? 'login' : 'signup'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      placeholder="John Doe" 
                      required 
                      className="h-10 px-3"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    required 
                    className="h-10 px-3"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      required
                      className="h-10 px-3 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-10 w-10 px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-4 w-4 text-gray-500" />
                      ) : (
                        <EyeIcon className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>
                {error && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                    {error}
                  </div>
                )}
                <Button 
                  className="w-full h-10 mt-6" 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading 
                    ? (isLogin ? 'Logging in...' : 'Signing up...') 
                    : (isLogin ? 'Login' : 'Sign Up')
                  }
                </Button>
              </motion.form>
            </AnimatePresence>
          </CardContent>
          <CardFooter className="flex justify-center pt-0 pb-6">
            <Button variant="link" className="text-sm" onClick={toggleForm}>
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}