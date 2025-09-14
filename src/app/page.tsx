'use client'
import { useState, useRef, useEffect, ChangeEvent } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon, MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Wifi, Utensils, Dumbbell, Waves, Car, ConciergeBell, Coffee, Tv, Snowflake, ArrowUp } from 'lucide-react'

export default function Home() {
  // Initialize dates as undefined - will be set by the reset effect
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined)
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined)
  const [roomType, setRoomType] = useState<string | undefined>(undefined)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+675')
  const [email, setEmail] = useState('')
  const [country, setCountry] = useState('')
  const [specialRequest, setSpecialRequest] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [visible, setVisible] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [bookingDetails, setBookingDetails] = useState(null)
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false)
  const [formKey, setFormKey] = useState(0) // Key to force remount of form components

  // Reset all form data and booking summary when component mounts
  useEffect(() => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    // Set all form fields in a single batch
    setCheckIn(today)
    setCheckOut(tomorrow)
    setRoomType(undefined)
    setAdults(1)
    setChildren(0)
    setFullName('')
    setPhone('')
    setEmail('')
    setCountry('')
    setSpecialRequest('')
    setContactName('')
    setContactEmail('')
    setContactMessage('')
    setErrors({})
    setBookingDetails(null)
    setIsBookingConfirmed(false)
    setFormKey(prev => prev + 1)
  }, [])

  // Show toast message
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 5000)
  }
  
  // Refs for sections
  const homeRef = useRef<HTMLElement>(null)
  const roomsRef = useRef<HTMLElement>(null)
  const bookRef = useRef<HTMLElement>(null)
  const amenitiesRef = useRef<HTMLElement>(null)
  const contactRef = useRef<HTMLElement>(null)
  
  // Handle scroll events for navbar visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset
      const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10
      
      setVisible(isVisible)
      setPrevScrollPos(currentScrollPos)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [prevScrollPos, visible])

  // Show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true)
      } else {
        setShowScrollButton(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // Intersection Observer for active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5, rootMargin: '-100px 0px -50% 0px' }
    )
    
    const sections = [homeRef.current, roomsRef.current, bookRef.current, amenitiesRef.current, contactRef.current].filter(Boolean)
    sections.forEach((section) => {
      if (section) observer.observe(section)
    })
    
    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section)
      })
    }
  }, [])
  
  // Smooth scroll function
  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const roomRates = {
    'select': 0, // Default selection
    budget: 150,
    standard: 200,
    executive: 300,
    conference: 450 // per day for conference area
  }

  // Calculate number of nights - handle undefined dates during SSR
  const nights = checkIn && checkOut 
    ? Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)))
    : 1
  const totalCost = roomType && roomType !== 'select' ? roomRates[roomType as keyof typeof roomRates] * nights : 0
  const totalGuests = adults + children

  const validateBookingForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[\d\s\-+()]*$/.test(phone)) {
      newErrors.phone = 'Phone number is invalid'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleBookingConfirm = async () => {
    if (!validateBookingForm()) return
    
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('Booking confirmed:', { checkIn, checkOut, roomType, adults, children, fullName, phone, email, country, specialRequest })
      
      // Show success toast
      showToast('Reservation confirmed! We have sent a confirmation to your email.', 'success')
      
      // Reset form and booking summary with default dates
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      setCheckIn(today)
      setCheckOut(tomorrow)
      setRoomType(undefined) // Reset to show 'Select Room' by default
      setAdults(1)
      setChildren(0)
      setFullName('')
      setPhone('')
      setEmail('')
      setCountry('')
      setSpecialRequest('')
      setErrors({})
      setBookingDetails(null)
      setIsBookingConfirmed(false)
      
    } catch (error) {
      console.error('Booking failed:', error)
      showToast('Failed to process your booking. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const validateContactForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!contactName.trim()) newErrors.contactName = 'Name is required'
    if (!contactEmail.trim()) {
      newErrors.contactEmail = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(contactEmail)) {
      newErrors.contactEmail = 'Email is invalid'
    }
    if (!contactMessage.trim()) newErrors.contactMessage = 'Message is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleContactSubmit = async () => {
    if (!validateContactForm()) return
    
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('Contact form submitted:', { contactName, contactEmail, contactMessage })
      
      // Show success toast
      showToast('Thank you for your message! We will get back to you soon.', 'success')
      
      // Reset form
      setContactName('')
      setContactEmail('')
      setContactMessage('')
      setErrors({})
      
    } catch (error) {
      console.error('Failed to send message:', error)
      showToast('Failed to send your message. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative">
      {/* Toast Notification */}
      {toast && (
        <div 
          className={`fixed bottom-4 right-4 z-50 px-6 py-4 rounded-md shadow-lg ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white flex items-center space-x-2 transition-all duration-300 transform ${
            toast ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <span>{toast.message}</span>
          <button 
            onClick={() => setToast(null)}
            className="ml-4 text-white hover:text-gray-200"
          >
            ✕
          </button>
        </div>
      )}
      {/* Navbar */}
      <nav className={`bg-[#1a5f2c] sticky top-0 w-full border-b border-green-700 shadow-sm transition-transform duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`} style={{ zIndex: 1000, position: 'fixed', width: '100%' }}>
        <div className="container flex h-20 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            <button onClick={() => scrollToSection(homeRef)} className="focus:outline-none">
              <img 
                src="/images/logo.png" 
                alt="Rabaul Hotel Logo" 
                className="h-12 w-auto hover:opacity-90 transition-opacity"
              />
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-300 to-green-100 bg-clip-text text-transparent"></h1>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            <Button 
              variant="ghost"
              onClick={() => scrollToSection(homeRef)}
              className="text-white hover:bg-green-600 hover:text-white transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-0 focus:ring-offset-0 active:scale-95"
            >
              Home
            </Button>
            <Button 
              variant="ghost"
              onClick={() => scrollToSection(roomsRef)}
              className="text-white hover:bg-green-600 hover:text-white transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-0 focus:ring-offset-0 active:scale-95"
            >
              Rooms
            </Button>
            <Button 
              variant="ghost"
              onClick={() => scrollToSection(bookRef)}
              className="text-white hover:bg-green-600 hover:text-white transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-0 focus:ring-offset-0 active:scale-95"
            >
              Booking
            </Button>
            <Button 
              variant="ghost"
              onClick={() => scrollToSection(amenitiesRef)}
              className="text-white hover:bg-green-600 hover:text-white transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-0 focus:ring-offset-0 active:scale-95"
            >
              Amenities
            </Button>
            <Button 
              variant="ghost"
              onClick={() => scrollToSection(contactRef)}
              className="text-white hover:bg-green-600 hover:text-white transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-0 focus:ring-offset-0 active:scale-95"
            >
              Contact
            </Button>
          </div>
          <Button 
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-white/10 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 rounded-full p-3 transition-colors w-14 h-14 flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" x2="20" y1="12" y2="12"></line>
                <line x1="4" x2="20" y1="6" y2="6"></line>
                <line x1="4" x2="20" y1="18" y2="18"></line>
              </svg>
            )}
          </Button>
          
          {/* Mobile Menu */}
          <div 
            className={`fixed left-0 top-20 z-[1002] flex flex-col justify-start overflow-y-auto transition-all duration-300 ease-in-out transform ${
              mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            } md:hidden`}
          >
            <div className="flex flex-col space-y-1 w-64 bg-gray-800/90 backdrop-blur-sm py-4 px-4 text-lg rounded-r-lg">
              <button 
                onClick={() => {
                  scrollToSection(roomsRef)
                  setMobileMenuOpen(false)
                }}
                className={`px-6 py-4 w-full text-left text-white hover:bg-white/10 transition-colors ${
                  activeSection === 'rooms' ? 'bg-white/20 font-medium' : ''
                }`}
              >
                Rooms
              </button>
              <button 
                onClick={() => {
                  scrollToSection(bookRef)
                  setMobileMenuOpen(false)
                }}
                className={`px-6 py-4 w-full text-left text-white hover:bg-white/10 transition-colors ${
                  activeSection === 'book' ? 'bg-white/20 font-medium' : ''
                }`}
              >
                Booking
              </button>
              <button 
                onClick={() => {
                  scrollToSection(amenitiesRef)
                  setMobileMenuOpen(false)
                }}
                className={`px-6 py-4 w-full text-left text-white hover:bg-white/10 transition-colors ${
                  activeSection === 'amenities' ? 'bg-white/20 font-medium' : ''
                }`}
              >
                Amenities
              </button>
              <button 
                onClick={() => {
                  scrollToSection(contactRef)
                  setMobileMenuOpen(false)
                }}
                className={`px-6 py-4 w-full text-left text-white hover:bg-white/10 transition-colors ${
                  activeSection === 'contact' ? 'bg-white/20 font-medium' : ''
                }`}
              >
                Contact
              </button>
              <button 
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        id="home" 
        ref={homeRef}
        className="relative h-screen flex items-center justify-center text-white overflow-hidden"
        style={{ position: 'relative', paddingTop: '80px', zIndex: 1 }}
      >
        <div className="absolute inset-0 z-0">
          <div className="hidden md:block absolute inset-0">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline 
              className="w-full h-full object-cover"
            >
              <source src="/videos/beach.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="md:hidden absolute inset-0" style={{ zIndex: 1 }}>
            <Image
              src="/images/mobile-banner.png"
              alt="Rabaul Hotel"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-black/30" style={{ zIndex: 1 }} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" style={{ zIndex: 1 }} />
        </div>
        <div className="container max-w-7xl px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto px-2"
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-2 sm:mb-4 md:mb-6 leading-tight">
              Welcome to <span className="text-yellow-300">Rabaul Hotel</span>
            </h1>
            <p className="text-base sm:text-xl md:text-2xl mb-4 sm:mb-8 md:mb-12 max-w-2xl mx-auto">
              Where the Road Ends & The Adventure Begins!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Button 
                size="lg" 
                className="bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transition-transform duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => scrollToSection(bookRef)}
              >
                Book Now
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-transparent border-white text-white hover:bg-white/10 hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-white"
                onClick={() => scrollToSection(roomsRef)}
              >
                View Rooms
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Rooms Section */}
      <section id="rooms" ref={roomsRef} className="py-16 bg-gray-50 scroll-mt-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Rooms & Suites</h2>
            <div className="w-20 h-1 bg-[#1a5f2c] mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">Experience comfort and luxury in our carefully designed rooms, each offering a perfect blend of style and functionality.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Budget Room */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-64 overflow-hidden group">
                <Image 
                  src="/images/rooms/budget-room.PNG" 
                  alt="Budget Room"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2">Budget Room</h3>
                    <p className="text-gray-200">Starting from <span className="text-white font-bold">K200</span> per night</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-[#1a5f2c] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Best Value
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="flex items-center mr-4">
                    <svg className="w-4 h-4 mr-1 text-[#1a5f2c]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    24/7 Check-in
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-[#1a5f2c]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    Free WiFi
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">Budget Room</h4>
                    <p className="text-gray-500 text-sm">Max guests: 2</p>
                  </div>
                  <Button 
                    onClick={() => {
                      setRoomType('budget');
                      scrollToSection(bookRef);
                    }}
                    className="bg-[#1a5f2c] hover:bg-[#144a22] text-white px-4 py-2 text-sm rounded-md transition-colors"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>

            {/* Standard Room */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-64 overflow-hidden group">
                <Image 
                  src="/images/rooms/standard-room.PNG" 
                  alt="Standard Room"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2">Standard Room</h3>
                    <p className="text-gray-200">Starting from <span className="text-white font-bold">K300</span> per night</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="flex items-center mr-4">
                    <svg className="w-4 h-4 mr-1 text-[#1a5f2c]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    24/7 Check-in
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-[#1a5f2c]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    Free WiFi
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">Standard Room</h4>
                    <p className="text-gray-500 text-sm">Max guests: 2</p>
                  </div>
                  <Button 
                    onClick={() => {
                      setRoomType('standard');
                      scrollToSection(bookRef);
                    }}
                    className="bg-[#1a5f2c] hover:bg-[#144a22] text-white px-4 py-2 text-sm rounded-md transition-colors"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>

            {/* Executive Room */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-64 overflow-hidden group">
                <Image 
                  src="/images/rooms/executive-room.PNG" 
                  alt="Executive Room"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2">Executive Room</h3>
                    <p className="text-gray-200">Starting from <span className="text-white font-bold">K450</span> per night</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Popular
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="flex items-center mr-4">
                    <svg className="w-4 h-4 mr-1 text-[#1a5f2c]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    24/7 Check-in
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-[#1a5f2c]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    Free WiFi
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">Executive Room</h4>
                    <p className="text-gray-500 text-sm">Max guests: 3</p>
                  </div>
                  <Button 
                    onClick={() => {
                      setRoomType('executive');
                      scrollToSection(bookRef);
                    }}
                    className="bg-[#1a5f2c] hover:bg-[#144a22] text-white px-4 py-2 text-sm rounded-md transition-colors"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Book Your Stay Section */}
      <section 
        id="book" 
        ref={bookRef}
        className="py-8 md:py-12 scroll-mt-16 relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/booking-background.PNG')" }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="container max-w-7xl px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Book Your Stay</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden text-white">
                <CardHeader className="bg-[#1a5f2c] text-white py-3">
                  <CardTitle className="text-xl">Reservation Details</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1" key={`check-in-${formKey}`}>
                      <Label htmlFor="check-in" className="font-medium text-white">Check-in Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="check-in"
                            variant="outline"
                            className="w-full justify-start text-left font-normal h-12 px-4 bg-white hover:bg-gray-50 text-gray-800"
                          >
                            <CalendarIcon className="mr-2 h-5 w-5" />
                            {checkIn ? format(checkIn, "PPP") : <span className="text-white/70">Select check-in date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={checkIn}
                            onSelect={setCheckIn}
                            initialFocus
                            disabled={(date) => date < new Date()}
                            className="rounded-md border"
                            key={`calendar-in-${formKey}`}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-1" key={`check-out-${formKey}`}>
                      <Label htmlFor="check-out" className="font-medium">Check-out Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="check-out"
                            variant="outline"
                            className="w-full justify-start text-left font-normal h-12 px-4 bg-white hover:bg-gray-50 text-gray-800"
                          >
                            <CalendarIcon className="mr-2 h-5 w-5" />
                            {checkOut ? format(checkOut, "PPP") : <span>Select check-out date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            key={`calendar-out-${formKey}`}
                            mode="single"
                            selected={checkOut}
                            onSelect={setCheckOut}
                            initialFocus
                            disabled={(date) => !checkIn || date <= checkIn}
                            className="rounded-md border"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <Label htmlFor="room-type" className="text-sm font-medium text-gray-600">Room Type</Label>
                      <Select value={roomType || 'select'} onValueChange={value => setRoomType(value === 'select' ? undefined : value)}>
                        <SelectTrigger id="room-type" className="h-10 text-sm">
                          <SelectValue placeholder="Select room type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="select">Select Room</SelectItem>
                          <SelectItem value="budget">Budget Room</SelectItem>
                          <SelectItem value="standard">Standard Room</SelectItem>
                          <SelectItem value="executive">Executive Room</SelectItem>
                          <SelectItem value="conference">Conference Room</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-gray-600">Guests</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="adults" className="text-xs font-medium text-gray-600">Adults</Label>
                          <Select 
                            value={adults.toString()} 
                            onValueChange={(value) => setAdults(parseInt(value))}
                          >
                            <SelectTrigger id="adults" className="h-9 text-sm">
                              <SelectValue placeholder="Adults" />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} {num === 1 ? 'Adult' : 'Adults'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="children" className="text-xs font-medium text-gray-600">Children</Label>
                          <Select 
                            value={children.toString()} 
                            onValueChange={(value) => setChildren(parseInt(value))}
                          >
                            <SelectTrigger id="children" className="h-9 text-sm">
                              <SelectValue placeholder="Children" />
                            </SelectTrigger>
                            <SelectContent>
                              {[0, 1, 2, 3, 4].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} {num === 1 ? 'Child' : 'Children'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="fullName" className="text-sm font-medium text-gray-600">Full Name</Label>
                      <Input 
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="h-9 text-sm"
                      />
                      {errors.fullName && (
                        <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-600">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="your@email.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-9 text-sm"
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-600">Phone</Label>
                      <div className="flex">
                        <Select 
                          value={countryCode}
                          onValueChange={setCountryCode}
                        >
                          <SelectTrigger className="w-[120px] h-9 text-sm rounded-r-none border-r-0 focus:ring-0 focus:ring-offset-0">
                            <SelectValue placeholder="Code" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[400px] overflow-y-auto">
                            {/* Americas */}
                            <SelectItem value="+1">🇺🇸 +1 (US/CA)</SelectItem>
                            <SelectItem value="+52">🇲🇽 +52 (MX)</SelectItem>
                            <SelectItem value="+55">🇧🇷 +55 (BR)</SelectItem>
                            <SelectItem value="+54">🇦🇷 +54 (AR)</SelectItem>
                            <SelectItem value="+51">🇵🇪 +51 (PE)</SelectItem>
                            <SelectItem value="+56">🇨🇱 +56 (CL)</SelectItem>
                            <SelectItem value="+57">🇨🇴 +57 (CO)</SelectItem>
                            
                            {/* Europe */}
                            <SelectItem value="+44">🇬🇧 +44 (UK)</SelectItem>
                            <SelectItem value="+33">🇫🇷 +33 (FR)</SelectItem>
                            <SelectItem value="+49">🇩🇪 +49 (DE)</SelectItem>
                            <SelectItem value="+39">🇮🇹 +39 (IT)</SelectItem>
                            <SelectItem value="+34">🇪🇸 +34 (ES)</SelectItem>
                            <SelectItem value="+7">🇷🇺 +7 (RU)</SelectItem>
                            <SelectItem value="+31">🇳🇱 +31 (NL)</SelectItem>
                            <SelectItem value="+41">🇨🇭 +41 (CH)</SelectItem>
                            <SelectItem value="+46">🇸🇪 +46 (SE)</SelectItem>
                            
                            {/* Asia Pacific */}
                            <SelectItem value="+61">🇦🇺 +61 (AU)</SelectItem>
                            <SelectItem value="+64">🇳🇿 +64 (NZ)</SelectItem>
                            <SelectItem value="+675">🇵🇬 +675 (PNG)</SelectItem>
                            <SelectItem value="+62">🇮🇩 +62 (ID)</SelectItem>
                            <SelectItem value="+60">🇲🇾 +60 (MY)</SelectItem>
                            <SelectItem value="+63">🇵🇭 +63 (PH)</SelectItem>
                            <SelectItem value="+65">🇸🇬 +65 (SG)</SelectItem>
                            <SelectItem value="+66">🇹🇭 +66 (TH)</SelectItem>
                            <SelectItem value="+81">🇯🇵 +81 (JP)</SelectItem>
                            <SelectItem value="+82">🇰🇷 +82 (KR)</SelectItem>
                            <SelectItem value="+84">🇻🇳 +84 (VN)</SelectItem>
                            <SelectItem value="+86">🇨🇳 +86 (CN)</SelectItem>
                            <SelectItem value="+91">🇮🇳 +91 (IN)</SelectItem>
                            <SelectItem value="+92">🇵🇰 +92 (PK)</SelectItem>
                            <SelectItem value="+94">🇱🇰 +94 (LK)</SelectItem>
                            <SelectItem value="+95">🇲🇲 +95 (MM)</SelectItem>
                            <SelectItem value="+98">🇮🇷 +98 (IR)</SelectItem>
                            
                            {/* Middle East & Africa */}
                            <SelectItem value="+20">🇪🇬 +20 (EG)</SelectItem>
                            <SelectItem value="+27">🇿🇦 +27 (ZA)</SelectItem>
                            <SelectItem value="+30">🇬🇷 +30 (GR)</SelectItem>
                            <SelectItem value="+90">🇹🇷 +90 (TR)</SelectItem>
                            <SelectItem value="+966">🇸🇦 +966 (SA)</SelectItem>
                            <SelectItem value="+971">🇦🇪 +971 (AE)</SelectItem>
                            <SelectItem value="+972">🇮🇱 +972 (IL)</SelectItem>
                            <SelectItem value="+234">🇳🇬 +234 (NG)</SelectItem>
                            <SelectItem value="+254">🇰🇪 +254 (KE)</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input 
                          id="phone" 
                          type="tel" 
                          placeholder="1234567" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="h-9 text-sm rounded-l-none flex-1"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                      )}
                    </div>
                    <div className="space-y-1 col-span-2">
                      <Label htmlFor="special-requests" className="text-sm font-medium text-gray-600">Special Requests</Label>
                      <Textarea
                        id="special-requests"
                        placeholder="Any special requirements?"
                        value={specialRequest}
                        onChange={(e) => setSpecialRequest(e.target.value)}
                        className="min-h-[80px] text-sm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary */}
            <Card className="flex flex-col h-full border-2 border-white/50 shadow-lg shadow-green-900/20 hover:shadow-xl hover:shadow-green-900/30 transition-all duration-300">
              <div>
                <CardHeader>
                  <CardTitle className="text-yellow-400">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                <div className="flex justify-between text-white">
                  <span>Nights:</span>
                  <span className="font-medium">{nights} night{nights > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Room Rate:</span>
                  <span className="font-medium">K {roomType && roomType !== 'select' ? roomRates[roomType as keyof typeof roomRates] : 0} / night</span>
                </div>
                <div className="flex justify-between border-t border-white pt-2 font-bold text-white">
                  <span>Total Cost:</span>
                  <span className="text-white">K {totalCost}</span>
                </div>
                <div className="text-sm text-white/80 mt-2">
                  Total Guests: {totalGuests}
                </div>
                <Button 
                  onClick={handleBookingConfirm} 
                  className="w-full mt-4 py-4 text-base font-semibold bg-[#1a5f2c] hover:bg-[#2a7d3c] text-white shadow-lg transform transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing Your Booking...
                    </>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Confirm Your Stay
                    </span>
                  )}
                </Button>
              </CardContent>
              </div>
              <div className="mt-auto p-4 border-t border-gray-200">
                <div className="flex justify-center">
                  <img 
                    src="/images/logo.png" 
                    alt="Rabaul Hotel" 
                    className="h-12 w-auto"
                    style={{
                      imageRendering: 'crisp-edges',
                      WebkitBackfaceVisibility: 'hidden',
                      WebkitTransform: 'translateZ(0)',
                      transform: 'translateZ(0)'
                    }}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section 
        id="contact" 
        ref={contactRef}
        className="pt-10 pb-16 bg-white scroll-mt-16"
      >
        <div className="container max-w-7xl px-4 mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Get in touch with our concierge team for any inquiries or assistance</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="space-y-8">
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200 w-full">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Hotel Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="mt-0.5">
                      <MapPin className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Address</h4>
                      <p className="text-gray-600">8th Street, Rabaul</p>
                      <p className="text-gray-600">East New Britain, Papua New Guinea</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="mt-0.5">
                      <Phone className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Phone</h4>
                      <p className="text-gray-600">+675 7653 4563</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="mt-0.5">
                      <Mail className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Email</h4>
                      <a href="mailto:info@rabaulhotel.com" className="text-blue-600 hover:underline">
                        info@rabaulhotel.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="mt-0.5">
                      <Clock className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Reception Hours</h4>
                      <p className="text-gray-600">24/7 Front Desk Service</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200 w-full">
          
              
                <div className="rounded-lg overflow-hidden">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.123456789012!2d152.1234567!3d-4.1234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMDclMjQuNCJTIDE1MsKwMDclMjQuNCJF!5e0!3m2!1sen!2spg!4v1234567890123!5m2!1sen!2spg" 
                    width="100%" 
                    height="200" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy"
                    className="rounded-lg w-full"
                    aria-label="Our location on map"
                  ></iframe>
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">(Google Maps Integration)</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200 h-fit w-full">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      className="w-full"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-700">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      className="w-full"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    className="w-full"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-gray-700">Subject</Label>
                  <select
                    id="subject"
                    className="flex h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="" className="text-gray-700">Select a subject</option>
                    <option value="reservation" className="text-gray-900 hover:bg-gray-100">Reservation Inquiry</option>
                    <option value="services" className="text-gray-900 hover:bg-gray-100">Services & Amenities</option>
                    <option value="events" className="text-gray-900 hover:bg-gray-100">Events & Meetings</option>
                    <option value="feedback" className="text-gray-900 hover:bg-gray-100">Feedback</option>
                    <option value="other" className="text-gray-900 hover:bg-gray-100">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-gray-700">Message</Label>
                  <Textarea
                    id="message"
                    className="w-full min-h-[120px]"
                    placeholder="Type your message here..."
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section ref={amenitiesRef} className="py-16 bg-green-50 scroll-mt-16" id="amenities">
        <div className="container max-w-7xl px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Amenities</h2>
            <p className="text-green-700 max-w-3xl mx-auto">Experience comfort and convenience with our range of facilities designed to make your stay memorable.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 23m Swimming Pool */}
            <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-green-100">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
                  <svg className="h-16 w-16 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8 4m0 0L4 7m16 0l-8-4m8 4v10l-8 4m0-10L4 11m16 0v10M4 7v10l8 4" />
                  </svg>
                </div>
                {/* Replace with actual image: /images/amenities/pool.jpg */}
                <div className="absolute inset-0 bg-blue-600/10 group-hover:opacity-0 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">23m Swimming Pool</h3>
                <p className="text-green-700 text-sm">Relax and unwind in our beautiful 23-meter swimming pool surrounded by tropical gardens.</p>
              </div>
            </div>

            {/* Phoenix Room Restaurant */}
            <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-green-100">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-amber-50 flex items-center justify-center">
                  <Utensils className="h-16 w-16 text-amber-200" />
                </div>
                {/* Replace with actual image: /images/amenities/restaurant.jpg */}
                <div className="absolute inset-0 bg-amber-600/10 group-hover:opacity-0 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Phoenix Room Restaurant</h3>
                <p className="text-green-700 text-sm">Savor a blend of Western, Asian, and Vegetarian cuisine in our renowned restaurant.</p>
              </div>
            </div>

            {/* Conference Facilities */}
            <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-green-100">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-purple-50 flex items-center justify-center">
                  <svg className="h-16 w-16 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                {/* Replace with actual image: /images/amenities/conference.jpg */}
                <div className="absolute inset-0 bg-purple-600/10 group-hover:opacity-0 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Conference Facilities</h3>
                <p className="text-green-700 text-sm">Host your next event in our air-conditioned conference room with capacity for 150+ guests.</p>
              </div>
            </div>

            {/* 24/7 Reception */}
            <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-green-100">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-green-50 flex items-center justify-center">
                  <ConciergeBell className="h-16 w-16 text-green-200" />
                </div>
                {/* Replace with actual image: /images/amenities/reception.jpg */}
                <div className="absolute inset-0 bg-green-600/10 group-hover:opacity-0 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">24/7 Reception</h3>
                <p className="text-green-700 text-sm">Our friendly staff is available around the clock to assist you with any needs during your stay.</p>
              </div>
            </div>

            {/* Free Secure Parking */}
            <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-green-100">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
                  <Car className="h-16 w-16 text-blue-200" />
                </div>
                {/* Replace with actual image: /images/amenities/parking.jpg */}
                <div className="absolute inset-0 bg-blue-600/10 group-hover:opacity-0 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Free Secure Parking</h3>
                <p className="text-green-700 text-sm">Park with peace of mind in our secure, on-site parking area available to all guests.</p>
              </div>
            </div>

            {/* Room Service */}
            <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-green-100">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-pink-50 flex items-center justify-center">
                  <svg className="h-16 w-16 text-pink-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                {/* Replace with actual image: /images/amenities/room-service.jpg */}
                <div className="absolute inset-0 bg-pink-600/10 group-hover:opacity-0 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Room Service</h3>
                <p className="text-green-700 text-sm">Enjoy the convenience of in-room dining with our room service menu.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a5f2c] text-white py-12">
        <div className="container max-w-7xl px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* About */}
            <div>
              <h3 className="text-xl font-bold mb-4">Rabaul Hotel</h3>
              <p className="text-green-300 mb-6">Experience luxury and comfort in the heart of the city. Our hotel offers world-class amenities and exceptional service.</p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-green-300 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-green-300 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-green-300 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li><button onClick={() => scrollToSection(homeRef)} className="text-green-300 hover:text-white transition-colors">Home</button></li>
                <li><button onClick={() => scrollToSection(roomsRef)} className="text-green-300 hover:text-white transition-colors">Rooms & Suites</button></li>
                <li><button onClick={() => scrollToSection(bookRef)} className="text-green-300 hover:text-white transition-colors">Book Now</button></li>
                <li><button onClick={() => scrollToSection(contactRef)} className="text-green-300 hover:text-white transition-colors">Contact Us</button></li>
                <li><a href="#amenities" className="text-green-300 hover:text-white transition-colors">Amenities</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-green-300">8th street Rabaul WNB Papua New Guinea</span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                  <a href="tel:+67576534563" className="text-green-300 hover:text-white transition-colors">+675 7653 4563</a>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                  <a href="mailto:info@rabaulhotel.com" className="text-green-300 hover:text-white transition-colors">info@rabaulhotel.com</a>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Our Services</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-green-300 hover:text-white transition-colors">24/7 Room Service</a></li>
                <li><a href="#" className="text-green-300 hover:text-white transition-colors">Airport Transfer</a></li>
                <li><a href="#" className="text-green-300 hover:text-white transition-colors">Laundry Service</a></li>
                <li><a href="#" className="text-green-300 hover:text-white transition-colors">Tour Arrangements</a></li>
                <li><a href="#" className="text-green-300 hover:text-white transition-colors">Car Rental</a></li>
              </ul>
            </div>

          </div>

          <div className="border-t border-green-800 pt-8">
            <div className="flex flex-wrap justify-center items-center gap-6">
              <span className="text-green-300 text-sm">&copy; {new Date().getFullYear()} Rabaul Hotel. All rights reserved.</span>
              <a href="#" className="text-green-300 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-green-300 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-green-300 hover:text-white text-sm transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 p-3 rounded-full bg-[#1a5f2c] text-white shadow-lg hover:bg-[#144a22] transition-all duration-200 ${showScrollButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-6 w-6" />
      </button>
    </div>
  )
}
