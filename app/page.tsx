"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Mail, Lock, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react"

interface UserData {
  id: string
  name: string
  email: string
}

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword?: string
}

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export default function LandingPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [signUpData, setSignUpData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [signInData, setSignInData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  })

  const [signUpErrors, setSignUpErrors] = useState<FormErrors>({})
  const [signInErrors, setSignInErrors] = useState<FormErrors>({})

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string): boolean => {
    return password.length >= 6
  }

  const validateSignUpForm = (): boolean => {
    const errors: FormErrors = {}

    if (!signUpData.name.trim()) {
      errors.name = "Name is required"
    } else if (signUpData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters"
    }

    if (!signUpData.email.trim()) {
      errors.email = "Email is required"
    } else if (!validateEmail(signUpData.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!signUpData.password) {
      errors.password = "Password is required"
    } else if (!validatePassword(signUpData.password)) {
      errors.password = "Password must be at least 6 characters"
    }

    if (!signUpData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password"
    } else if (signUpData.password !== signUpData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    setSignUpErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateSignInForm = (): boolean => {
    const errors: FormErrors = {}

    if (!signInData.email.trim()) {
      errors.email = "Email is required"
    } else if (!validateEmail(signInData.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!signInData.password) {
      errors.password = "Password is required"
    }

    setSignInErrors(errors)
    return Object.keys(errors).length === 0
  }

  // API call function
  const createUser = async (userData: { name: string; email: string; password: string }) => {
    try {
      const response = await fetch("http://localhost:8080/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return { success: true, data: result }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  // Handle sign up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateSignUpForm()) {
      return
    }

    setIsLoading(true)

    const result = await createUser({
      name: signUpData.name,
      email: signUpData.email,
      password: signUpData.password,
    })

    setIsLoading(false)

    if (result.success) {
      toast({
        title: "Success!",
        description: "Account created successfully. You can now sign in.",
        duration: 5000,
      })
      setIsSignUpOpen(false)
      setSignUpData({ name: "", email: "", password: "", confirmPassword: "" })
      setSignUpErrors({})
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "Failed to create account. Please try again.",
        duration: 5000,
      })
    }
  }

  // Handle sign in (mock implementation)
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateSignInForm()) {
      return
    }

    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock successful sign in
    const mockUser: UserData = {
      id: "1",
      name: "John Doe",
      email: signInData.email,
    }

    setUser(mockUser)
    setIsLoading(false)
    setIsSignInOpen(false)
    setSignInData({ name: "", email: "", password: "" })
    setSignInErrors({})

    toast({
      title: "Welcome back!",
      description: `Successfully signed in as ${mockUser.name}`,
      duration: 5000,
    })
  }

  // Handle logout
  const handleLogout = () => {
    setUser(null)
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
      duration: 3000,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
            <span className="text-xl font-bold text-gray-900">ModernApp</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </a>
            <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
              About
            </a>
            <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
              Contact
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-900 font-medium">{user.name}</span>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Dialog open={isSignInOpen} onOpenChange={setIsSignInOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost">Sign In</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Sign In</DialogTitle>
                      <DialogDescription>Enter your credentials to access your account</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="signin-email"
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10"
                            value={signInData.email}
                            onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                          />
                        </div>
                        {signInErrors.email && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <XCircle className="w-4 h-4" />
                            {signInErrors.email}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signin-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="signin-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="pl-10 pr-10"
                            value={signInData.password}
                            onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {signInErrors.password && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <XCircle className="w-4 h-4" />
                            {signInErrors.password}
                          </p>
                        )}
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Signing In..." : "Sign In"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog open={isSignUpOpen} onOpenChange={setIsSignUpOpen}>
                  <DialogTrigger asChild>
                    <Button>Sign Up</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create Account</DialogTitle>
                      <DialogDescription>Sign up to get started with ModernApp</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name">Full Name</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="signup-name"
                            type="text"
                            placeholder="Enter your full name"
                            className="pl-10"
                            value={signUpData.name}
                            onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                          />
                        </div>
                        {signUpErrors.name && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <XCircle className="w-4 h-4" />
                            {signUpErrors.name}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10"
                            value={signUpData.email}
                            onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                          />
                        </div>
                        {signUpErrors.email && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <XCircle className="w-4 h-4" />
                            {signUpErrors.email}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            className="pl-10 pr-10"
                            value={signUpData.password}
                            onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {signUpErrors.password && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <XCircle className="w-4 h-4" />
                            {signUpErrors.password}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="signup-confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            className="pl-10 pr-10"
                            value={signUpData.confirmPassword}
                            onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {signUpErrors.confirmPassword && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <XCircle className="w-4 h-4" />
                            {signUpErrors.confirmPassword}
                          </p>
                        )}
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Build Something
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Amazing</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Create, collaborate, and scale your ideas with our modern platform. Join thousands of developers who trust
            us to bring their vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user && (
              <Dialog open={isSignUpOpen} onOpenChange={setIsSignUpOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="text-lg px-8 py-6">
                    Get Started Free
                  </Button>
                </DialogTrigger>
              </Dialog>
            )}
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="mt-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose ModernApp?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to build, deploy, and scale your applications with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Easy to Use</CardTitle>
                <CardDescription>Intuitive interface designed for developers of all skill levels.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Secure & Reliable</CardTitle>
                <CardDescription>Enterprise-grade security with 99.9% uptime guarantee.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Scale Globally</CardTitle>
                <CardDescription>Deploy worldwide with our global CDN and edge computing.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </main>

      <Toaster />
    </div>
  )
}
