'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  scrollToSection: (ref: React.RefObject<HTMLDivElement>) => void
  homeRef: React.RefObject<HTMLDivElement>
  aboutRef: React.RefObject<HTMLDivElement>
  roomsRef: React.RefObject<HTMLDivElement>
  bookRef: React.RefObject<HTMLDivElement>
  exploreRef: React.RefObject<HTMLDivElement>
  contactRef: React.RefObject<HTMLDivElement>
  activeSection: string
  setActiveSection: (section: string) => void
}

export default function Header({ 
  scrollToSection,
  homeRef,
  aboutRef,
  roomsRef,
  bookRef,
  exploreRef,
  contactRef,
  activeSection,
  setActiveSection
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      if (offset > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when clicking outside
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNavClick = (ref: React.RefObject<HTMLDivElement>, section: string) => {
    scrollToSection(ref)
    setActiveSection(section)
    setMobileMenuOpen(false)
  }

  return (
    <header 
      ref={menuRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button 
              onClick={() => handleNavClick(homeRef, 'home')} 
              className="text-white text-2xl font-bold focus:outline-none"
            >
              Rabaul Hotel
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavClick(homeRef, 'home')}
              className={`px-3 py-2 text-sm font-medium ${
                activeSection === 'home' ? 'text-yellow-400' : 'text-white hover:text-yellow-300'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick(aboutRef, 'about')}
              className={`px-3 py-2 text-sm font-medium ${
                activeSection === 'about' ? 'text-yellow-400' : 'text-white hover:text-yellow-300'
              }`}
            >
              About
            </button>
            <button
              onClick={() => handleNavClick(roomsRef, 'rooms')}
              className={`px-3 py-2 text-sm font-medium ${
                activeSection === 'rooms' ? 'text-yellow-400' : 'text-white hover:text-yellow-300'
              }`}
            >
              Rooms
            </button>
            <button
              onClick={() => handleNavClick(exploreRef, 'explore')}
              className={`px-3 py-2 text-sm font-medium ${
                activeSection === 'explore' ? 'text-yellow-400' : 'text-white hover:text-yellow-300'
              }`}
            >
              Explore
            </button>
            <button
              onClick={() => handleNavClick(contactRef, 'contact')}
              className={`px-3 py-2 text-sm font-medium ${
                activeSection === 'contact' ? 'text-yellow-400' : 'text-white hover:text-yellow-300'
              }`}
            >
              Contact
            </button>
            <Button
              onClick={() => handleNavClick(bookRef, 'booking')}
              className="ml-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold"
            >
              Book Now
            </Button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-yellow-400 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900/95">
          <button
            onClick={() => handleNavClick(homeRef, 'home')}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              activeSection === 'home' ? 'bg-gray-800 text-yellow-400' : 'text-white hover:bg-gray-700'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick(aboutRef, 'about')}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              activeSection === 'about' ? 'bg-gray-800 text-yellow-400' : 'text-white hover:bg-gray-700'
            }`}
          >
            About
          </button>
          <button
            onClick={() => handleNavClick(roomsRef, 'rooms')}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              activeSection === 'rooms' ? 'bg-gray-800 text-yellow-400' : 'text-white hover:bg-gray-700'
            }`}
          >
            Rooms
          </button>
          <button
            onClick={() => handleNavClick(exploreRef, 'explore')}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              activeSection === 'explore' ? 'bg-gray-800 text-yellow-400' : 'text-white hover:bg-gray-700'
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => handleNavClick(contactRef, 'contact')}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              activeSection === 'contact' ? 'bg-gray-800 text-yellow-400' : 'text-white hover:bg-gray-700'
            }`}
          >
            Contact
          </button>
          <button
            onClick={() => handleNavClick(bookRef, 'booking')}
            className="w-full mt-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-md"
          >
            Book Now
          </button>
        </div>
      </div>
    </header>
  )
}