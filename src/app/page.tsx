'use client'
import { useState, useRef, useEffect, ChangeEvent } from 'react'
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
  // Initialize dates in useEffect to avoid hydration mismatch
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined)
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined)
  
  // Set initial dates on client side only
  useEffect(() => {
    setCheckIn(new Date())
    setCheckOut(new Date(Date.now() + 86400000))
  }, [])
  const [roomType, setRoomType] = useState('standard')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
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
    
    const sections = [homeRef.current, roomsRef.current, bookRef.current, contactRef.current].filter(Boolean)
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
    budget: 100,
    standard: 150,
    executive: 200,
    conference: 500 // per day for conference area
  }

  // Calculate number of nights - handle undefined dates during SSR
  const nights = checkIn && checkOut 
    ? Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)))
    : 1
  const totalCost = roomRates[roomType as keyof typeof roomRates] * nights
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
      
      // Reset form
      setFullName('')
      setEmail('')
      setPhone('')
      setCountry('')
      setSpecialRequest('')
      setErrors({})
      
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
    <div className="min-h-screen bg-background relative">
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
      <nav className={`bg-green-800/95 backdrop-blur supports-[backdrop-filter]:bg-green-900/60 sticky top-0 z-50 w-full border-b border-green-700 shadow-sm transition-transform duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}>
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
              variant={activeSection === 'home' ? 'secondary' : 'ghost'} 
              onClick={() => scrollToSection(homeRef)}
              className="transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Home
            </Button>
            <Button 
              variant={activeSection === 'rooms' ? 'secondary' : 'ghost'} 
              onClick={() => scrollToSection(roomsRef)}
              className="transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Rooms
            </Button>
            <Button 
              variant={activeSection === 'book' ? 'secondary' : 'ghost'} 
              onClick={() => scrollToSection(bookRef)}
              className="transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Booking
            </Button>
            <Button 
              variant={activeSection === 'amenities' ? 'secondary' : 'ghost'} 
              onClick={() => scrollToSection(amenitiesRef)}
              className="transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Amenities
            </Button>
            <Button 
              variant={activeSection === 'contact' ? 'secondary' : 'ghost'} 
              onClick={() => scrollToSection(contactRef)}
              className="transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Contact
            </Button>
          </div>
          <Button 
            className="md:hidden" 
            variant="ghost" 
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" x2="20" y1="12" y2="12"></line>
                <line x1="4" x2="20" y1="6" y2="6"></line>
                <line x1="4" x2="20" y1="18" y2="18"></line>
              </svg>
            )}
          </Button>
          
          {/* Mobile Menu */}
          <div 
            className={`fixed inset-0 bg-background/95 backdrop-blur-md z-40 flex flex-col items-center justify-center transition-all duration-300 ease-in-out transform ${
              mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            } md:hidden`}
          >
            <div className="flex flex-col items-center space-y-6 text-xl">
              <button 
                onClick={() => {
                  scrollToSection(homeRef)
                  setMobileMenuOpen(false)
                }}
                className={`px-6 py-3 w-full text-center rounded-lg transition-colors ${
                  activeSection === 'home' 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-muted'
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => {
                  scrollToSection(roomsRef)
                  setMobileMenuOpen(false)
                }}
                className={`px-6 py-3 w-full text-center rounded-lg transition-colors ${
                  activeSection === 'rooms' 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-muted'
                }`}
              >
                Rooms
              </button>
              <button 
                onClick={() => {
                  scrollToSection(bookRef)
                  setMobileMenuOpen(false)
                }}
                className={`px-6 py-3 w-full text-center rounded-lg transition-colors ${
                  activeSection === 'book' 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-muted'
                }`}
              >
                Book
              </button>
              <button 
                onClick={() => {
                  scrollToSection(amenitiesRef)
                  setMobileMenuOpen(false)
                }}
                className={`px-6 py-3 w-full text-center rounded-lg transition-colors ${
                  activeSection === 'amenities' 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-muted'
                }`}
              >
                Amenities
              </button>
              <button 
                onClick={() => {
                  scrollToSection(contactRef)
                  setMobileMenuOpen(false)
                }}
                className={`px-6 py-3 w-full text-center rounded-lg transition-colors ${
                  activeSection === 'contact' 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-muted'
                }`}
              >
                Contact
              </button>
            </div>
            <button 
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        id="home" 
        ref={homeRef}
        className="relative h-screen flex items-center justify-center text-white overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/beach.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
        </div>
        <div className="container max-w-7xl px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              Welcome to <span className="text-yellow-300">Rabaul Hotel</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 md:mb-12 max-w-2xl mx-auto">
            Where the Road Ends & The Adventure Begins!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-green-800 hover:bg-green-50 hover:scale-105 transition-transform duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-white"
                onClick={() => scrollToSection(bookRef)}
              >
                Book Now
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-green-800/50 hover:scale-105 transition-transform duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-white"
                onClick={() => scrollToSection(roomsRef)}
              >
                View Rooms
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Rooms Section */}
      <section 
        id="rooms" 
        ref={roomsRef}
        className="py-20 bg-muted/50 scroll-mt-16"
      >
        <div className="container max-w-7xl px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Rooms & Suites</h2>
            <p className="text-muted-foreground">Experience comfort and luxury in our carefully designed rooms, each offering a perfect blend of style and functionality.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src="https://source.unsplash.com/random/600x400?hotel-room-budget" 
                    alt="Budget Room" 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span>Budget Room</span>
                    <span className="text-lg font-semibold text-blue-600">$100</span>
                  </CardTitle>
                  <CardDescription>Cozy and affordable stay with all essential amenities</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Queen Size Bed
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Free WiFi
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Air Conditioning
                    </li>
                  </ul>
                  <Button 
                    className="mt-auto w-full hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      setRoomType('budget')
                      scrollToSection(bookRef)
                    }}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src="https://source.unsplash.com/random/600x400?hotel-room-standard" 
                    alt="Standard Room" 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span>Standard Room</span>
                    <span className="text-lg font-semibold text-blue-600">$150</span>
                  </CardTitle>
                  <CardDescription>Comfortable with modern amenities and city view</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      King Size Bed
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Premium WiFi
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Work Desk
                    </li>
                  </ul>
                  <Button 
                    className="mt-auto w-full hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      setRoomType('standard')
                      scrollToSection(bookRef)
                    }}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src="https://source.unsplash.com/random/600x400?hotel-room-deluxe" 
                    alt="Executive Room" 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span>Executive Room</span>
                    <span className="text-lg font-semibold text-blue-600">$200</span>
                  </CardTitle>
                  <CardDescription>Luxury with premium features and panoramic views</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      King Size Bed
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Executive Lounge Access
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Premium Amenities
                    </li>
                  </ul>
                  <Button 
                    className="mt-auto w-full hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      setRoomType('executive')
                      scrollToSection(bookRef)
                    }}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src="https://source.unsplash.com/random/600x400?conference-room" 
                    alt="Conference Area" 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span>Conference Area</span>
                    <span className="text-lg font-semibold text-blue-600">$500</span>
                  </CardTitle>
                  <CardDescription>Spacious area for meetings and special events</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Up to 50 people
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      AV Equipment Included
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Catering Available
                    </li>
                  </ul>
                  <Button 
                    className="mt-auto w-full hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      setRoomType('conference')
                      scrollToSection(bookRef)
                    }}
                  >
                    Inquire Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Book Your Stay Section */}
      <section 
        id="book" 
        ref={bookRef}
        className="py-12 md:py-20 scroll-mt-16"
      >
        <div className="container max-w-7xl px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Book Your Stay</h2>
            <p className="text-muted-foreground">Fill in your details below to secure your reservation at Rabaul Hotel</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <CardTitle className="text-2xl">Reservation Details</CardTitle>
                  <CardDescription className="text-blue-100">Fill in your information to complete your booking</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="check-in" className="font-medium">Check-in Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="check-in"
                            variant="outline"
                            className="w-full justify-start text-left font-normal h-12 px-4"
                          >
                            <CalendarIcon className="mr-2 h-5 w-5" />
                            {checkIn ? format(checkIn, "PPP") : <span>Select check-in date</span>}
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
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="check-out" className="font-medium">Check-out Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="check-out"
                            variant="outline"
                            className="w-full justify-start text-left font-normal h-12 px-4"
                          >
                            <CalendarIcon className="mr-2 h-5 w-5" />
                            {checkOut ? format(checkOut, "PPP") : <span>Select check-out date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
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
                    <div className="space-y-2">
                      <Label htmlFor="room-type" className="font-medium">Room Type</Label>
                      <Select value={roomType} onValueChange={setRoomType}>
                        <SelectTrigger id="room-type" className="h-12">
                          <SelectValue placeholder="Select room type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="budget">Budget Room ($100/night)</SelectItem>
                          <SelectItem value="standard">Standard Room ($150/night)</SelectItem>
                          <SelectItem value="executive">Executive Room ($200/night)</SelectItem>
                          <SelectItem value="conference">Conference Area ($500/day)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="font-medium">Guests</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="adults" className="text-sm font-normal text-muted-foreground">Adults</Label>
                          <Select 
                            value={adults.toString()} 
                            onValueChange={(value) => setAdults(parseInt(value))}
                          >
                            <SelectTrigger id="adults" className="h-12">
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
                        <div>
                          <Label htmlFor="children" className="text-sm font-normal text-muted-foreground">Children</Label>
                          <Select 
                            value={children.toString()} 
                            onValueChange={(value) => setChildren(parseInt(value))}
                          >
                            <SelectTrigger id="children" className="h-12">
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

                  {/* Personal Information Fields */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullname">Full Name *</Label>
                      <Input 
                        id="fullname" 
                        value={fullName} 
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                        className={errors.fullName ? 'border-red-500' : ''}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input 
                          id="phone" 
                          value={phone} 
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                          className={errors.phone ? 'border-red-500' : ''}
                        />
                        {errors.phone && (
                          <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={email} 
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                          className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" value={country} onChange={(e: ChangeEvent<HTMLInputElement>) => setCountry(e.target.value)} />
                      </div>
                      <div />
                    </div>
                    <div>
                      <Label htmlFor="special">Special Request</Label>
                      <Textarea
                        id="special"
                        value={specialRequest}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setSpecialRequest(e.target.value)}
                        placeholder="Any special requests?"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Nights:</span>
                  <span>{nights} night{nights > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span>Room Rate:</span>
                  <span>${roomRates[roomType as keyof typeof roomRates]} / night</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-bold">
                  <span>Total Cost:</span>
                  <span>${totalCost}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Guests: {totalGuests}
                </div>
                <Button 
                  onClick={handleBookingConfirm} 
                  className="w-full mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : 'Confirm Reservation'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section 
        id="contact" 
        ref={contactRef}
        className="py-12 md:py-20 bg-muted/50 scroll-mt-16"
      >
        <div className="container max-w-7xl px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h2>
            <p className="text-muted-foreground">Have questions or special requests? We&apos;re here to help!</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <CardTitle className="text-2xl">Get in Touch</CardTitle>
                  <CardDescription className="text-blue-100">Our friendly staff is ready to assist you</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Address</h4>
                      <p className="text-muted-foreground">123 Hotel Street, Rabaul, Papua New Guinea</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Phone</h4>
                      <p className="text-muted-foreground">+675 123 4567</p>
                      <p className="text-sm text-muted-foreground mt-1">Available 24/7</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Email</h4>
                      <a href="mailto:info@rabaulhotel.com" className="text-blue-600 hover:underline">
                        info@rabaulhotel.com
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">We typically respond within 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Reception Hours</h4>
                      <p className="text-muted-foreground">24/7</p>
                      <p className="text-sm text-muted-foreground mt-1">Our front desk is always open to assist you</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="overflow-hidden rounded-lg">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.123456789012!2d152.1234567!3d-4.1234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMDcnMjQuNCJTIDE1MsKwMDcnMjQuNCJF!5e0!3m2!1sen!2spg!4v1234567890123!5m2!1sen!2spg" 
                  width="100%" 
                  height="300" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy"
                  className="rounded-lg shadow-md w-full h-64 md:h-full min-h-[300px]"
                  aria-label="Our location on map"
                ></iframe>
              </div>
            </div>
            <div className="space-y-6 lg:col-span-1">
              <Card>
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                  <CardDescription className="text-blue-100"> We'd love to hear from you. Fill out the form below.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Full Name *</Label>
                    <Input
                      id="contactName"
                      value={contactName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setContactName(e.target.value)}
                      className={errors.contactName ? 'border-red-500' : ''}
                      placeholder="Enter your full name"
                    />
                    {errors.contactName && (
                      <p className="text-sm text-red-500 mt-1">{errors.contactName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={contactEmail}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setContactEmail(e.target.value)}
                      className={errors.contactEmail ? 'border-red-500' : ''}
                      placeholder="Enter your email"
                    />
                    {errors.contactEmail && (
                      <p className="text-sm text-red-500 mt-1">{errors.contactEmail}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactMessage">Message *</Label>
                    <Textarea
                      id="contactMessage"
                      value={contactMessage}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContactMessage(e.target.value)}
                      className={errors.contactMessage ? 'border-red-500' : ''}
                      placeholder="Tell us how we can help you..."
                      rows={5}
                    />
                    {errors.contactMessage && (
                      <p className="text-sm text-red-500 mt-1">{errors.contactMessage}</p>
                    )}
                  </div>
                  <Button
                    onClick={handleContactSubmit}
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : 'Send Message'}
                  </Button>
                </CardContent>
              </Card>
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
      <footer className="bg-green-900 text-white py-12">
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
                  <span className="text-green-300">123 Rabaul Street, City Center, Papua New Guinea</span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                  <a href="tel:+61212345678" className="text-green-300 hover:text-white transition-colors">+61 2 1234 5678</a>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                  <a href="mailto:info@rabaulhotel.com" className="text-green-300 hover:text-white transition-colors">info@rabaulhotel.com</a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
              <p className="text-green-300 mb-4">Subscribe to our newsletter for special offers and updates.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="px-4 py-2 text-green-900 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                />
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-r-md font-medium transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-green-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-green-300 text-sm mb-4 md:mb-0">&copy; {new Date().getFullYear()} Rabaul Hotel. All rights reserved.</p>
            <div className="flex space-x-6">
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
        className={`fixed bottom-6 right-6 p-3 rounded-full bg-green-700 text-white shadow-lg hover:bg-green-800 transition-all duration-200 ${showScrollButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-6 w-6" />
      </button>
    </div>
  )
}
