// Path: /Users/julio/Documents/hackrice/HackRice2025/hackrice/components/ui/navbar.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Menu, X, Home, User, MapPin, Settings, Heart, Cloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">AirSafe</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">Air Quality Monitor</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </Link>
            
            <Link 
              href="/profile" 
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium"
            >
              <User className="w-4 h-4" />
              Profile
            </Link>

            <Link 
              href="/places" 
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium"
            >
              <MapPin className="w-4 h-4" />
              Places
            </Link>

            <Link 
              href="/health" 
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium"
            >
              <Heart className="w-4 h-4" />
              Health
            </Link>

            {/* Status Indicators */}
            <div className="flex items-center gap-3 ml-auto">
              <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                Houston, TX
              </Badge>
              <Badge 
                variant="default" 
                className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
              >
                Good
              </Badge>
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

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-gray-200/50 dark:border-gray-700/50 pt-4">
            <Link 
              href="/" 
              className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-3">
                <Home className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </div>
            </Link>
            
            <Link 
              href="/profile" 
              className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-3">
                <User className="w-5 h-5" />
                <span className="font-medium">Profile</span>
              </div>
            </Link>

            <Link 
              href="/places" 
              className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">Places</span>
              </div>
            </Link>

            <Link 
              href="/health" 
              className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5" />
                <span className="font-medium">Health</span>
              </div>
            </Link>

            <div className="px-4 pt-3 pb-2">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  Houston, TX
                </Badge>
                <Badge 
                  variant="default" 
                  className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                >
                  Good
                </Badge>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}