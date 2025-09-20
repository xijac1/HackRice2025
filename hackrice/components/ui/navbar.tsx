"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Menu, X, Home, User, MapPin, Settings, Heart, Cloud, Wind } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // <-- track login state

  const handleAuthClick = () => {
    if (isLoggedIn) {
      // log out logic here (clear tokens, reset state, etc.)
      setIsLoggedIn(false)
    } else {
      // navigate to login page
      window.location.href = "/login"
    }
  }

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AirSafe</h1>
              <p className="text-xs text-gray-600">Lung Health Guide</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium">
              <Home className="w-4 h-4" />
              Dashboard
            </Link>
            <Link href="/profile" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium">
              <User className="w-4 h-4" />
              Profile
            </Link>
            <Link href="/places" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium">
              <MapPin className="w-4 h-4" />
              Places
            </Link>
            <Link href="/health" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium">
              <Heart className="w-4 h-4" />
              Health
            </Link>
            <Link href="/run-coach" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium">
              <Wind className="w-4 h-4" />
              Run Coach
            </Link>

            {/* Status Indicators */}
            <div className="flex items-center gap-3 ml-auto">
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                Houston, TX
              </Badge>
              <Badge className="text-xs bg-green-100 text-green-800">
                Good
              </Badge>

              {/* Dynamic Log In / Log Out Button */}
              <Button onClick={handleAuthClick} className="ml-4">
                {isLoggedIn ? "Log Out" : "Log In"}
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </nav>
  )
}