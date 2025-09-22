'use client'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import ReCAPTCHA from 'react-google-recaptcha'
// Import specific images directly instead of from lib/images
const logoImage = '/images/logo.png';

// Define attraction images with proper typing
interface AttractionImage {
  src: string;
  alt: string;
}

interface AttractionImages {
  [key: string]: AttractionImage;
}

const attractionImages: AttractionImages = {
  tavurvur: { src: '/images/cards/mt-tavurvur.PNG', alt: 'Tavurvur Volcano' },
  simpsonHarbour: { src: '/images/cards/simpson-harbour-at-sunset.jpg', alt: 'Simpson Harbour' },
  matupitIsland: { src: '/images/cards/matupit-island.PNG', alt: 'Matupit Island' },
  ww2Tunnels: { src: '/images/cards/war-tunnel.PNG', alt: 'WW2 Tunnels' },
  oldRabaul: { src: '/images/cards/old-rabaul-ruins.PNG', alt: 'Old Rabaul' },
  museum: { src: '/images/cards/kokopo-war-museum.jpg', alt: 'Rabaul Museum' },
  warCemetery: { src: '/images/cards/scenic-lookouts.PNG', alt: 'War Cemetery' },
  market: { src: '/images/cards/rabaul-market.jpg', alt: 'Local Market' },
};
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon, MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Youtube, Car, ConciergeBell, Utensils, ArrowUp } from 'lucide-react'

export default function Home() {
  // Initialize dates as undefined - will be set by the reset effect
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined)
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined)
  const [roomType, setRoomType] = useState<string | undefined>(undefined)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [title, setTitle] = useState('mr')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+675')
  const [email, setEmail] = useState('')
  const [country, setCountry] = useState('')
  const [specialRequest, setSpecialRequest] = useState('')
  const [transportServices, setTransportServices] = useState({
    needsTransport: false,
    noTransport: true,
    transportType: '',
    pickupTime: '',
    dropoffTime: '',
    pickupLocation: '',
    dropoffLocation: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('credit-card')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [lastName, setLastName] = useState('')
  const [subject, setSubject] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState('home')
  const [visible, setVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  interface BookingDetails {
    name: string;
    email: string;
    checkIn: string;
    checkOut: string;
    roomType?: string;
    guests?: number;
    specialRequests?: string;
  }

  const [, setBookingDetails] = useState<BookingDetails | null>({
    name: '',
    email: '',
    checkIn: '',
    checkOut: '',
    roomType: '',
    guests: 1,
    specialRequests: ''
  })
  const [, setIsBookingConfirmed] = useState(false)
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
  const aboutRef = useRef<HTMLElement>(null)
  const exploreRef = useRef<HTMLElement>(null)
  const amenitiesRef = useRef<HTMLElement>(null)
  const contactRef = useRef<HTMLElement>(null)
  const transportRef = useRef<HTMLElement>(null)
  const diningRef = useRef<HTMLElement>(null)
  const tourRef = useRef<HTMLElement>(null)
  
  // Handle scroll events for navbar visibility and position
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setVisible(currentScrollY < lastScrollY || currentScrollY < 10);
      setIsAtTop(currentScrollY < 50); // Consider top if scrolled less than 50px
      lastScrollY = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    
    // Add all section refs to the observer
    const sections = [
      homeRef.current, 
      roomsRef.current, 
      bookRef.current, 
      aboutRef.current,
      exploreRef.current, 
      amenitiesRef.current, 
      contactRef.current,
      transportRef.current,
      diningRef.current,
      tourRef.current
    ].filter(Boolean)
    
    // Assign IDs to each section element 
    if (homeRef.current) homeRef.current.id = 'home';
    if (roomsRef.current) roomsRef.current.id = 'rooms';
    if (bookRef.current) bookRef.current.id = 'booking';
    if (aboutRef.current) aboutRef.current.id = 'about';
    if (exploreRef.current) exploreRef.current.id = 'explore';
    if (amenitiesRef.current) amenitiesRef.current.id = 'amenities';
    if (contactRef.current) contactRef.current.id = 'contact';
    if (transportRef.current) transportRef.current.id = 'transport';
    if (diningRef.current) diningRef.current.id = 'dining';
    if (tourRef.current) tourRef.current.id = 'tour';
    
    // Observe all sections
    sections.forEach((section) => {
      if (section) observer.observe(section)
    })
    
    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section)
      })
    }
  }, [])
  
  // Smooth scroll function with offset for fixed header
  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop - 80, // Adjust for fixed header
        behavior: 'smooth'
      })
    }
  }

  const roomRates = {
    'select': 0,
    budget: 200,
    standard: 300,
    executive: 450,
    family: 600,
    conference: 800
  }

  // Calculate number of nights - handle undefined dates during SSR
  const nights = checkIn && checkOut 
    ? Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;
  // Calculate transport cost
  const calculateTransportCost = () => {
    // Fixed transport cost when transport is needed
    return transportServices.needsTransport ? 100 : 0
  }

  // Calculate total cost
  const transportCost = calculateTransportCost()
  const roomCost = roomType && roomType !== 'select' ? roomRates[roomType as keyof typeof roomRates] * nights : 0
  const totalCost = roomCost + transportCost
  // Calculate total guests (removed unused variable)

  // Use public path for mobile banner

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
    // First validate the form
    if (!validateBookingForm()) return
    
    // Check if reCAPTCHA is completed
    if (!recaptchaToken) {
      setErrors(prev => ({ ...prev, recaptcha: 'Please complete the reCAPTCHA' }));
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Verify reCAPTCHA token with our API
      const recaptchaResponse = await fetch('/api/verify-recaptcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: recaptchaToken }),
      });

      const recaptchaData = await recaptchaResponse.json();

      if (!recaptchaData.success) {
        throw new Error('reCAPTCHA verification failed');
      }

      // Simulate API call for booking
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Booking confirmed:', { 
        checkIn, 
        checkOut, 
        roomType, 
        adults, 
        children, 
        fullName, 
        phone, 
        email, 
        country, 
        specialRequest 
      });
      
      // Show success toast
      showToast('Reservation confirmed! We have sent a confirmation to your email.', 'success');
      
      // Reset form and booking summary with default dates
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      setCheckIn(today);
      setCheckOut(tomorrow);
      setRoomType(undefined); // Reset to show 'Select Room' by default
      setAdults(1);
      setChildren(0);
      setFullName('');
      setPhone('');
      setEmail('');
      setCountry('');
      setSpecialRequest('');
      setErrors({});
      setBookingDetails(null);
      setIsBookingConfirmed(false);
      setRecaptchaToken(null); // Reset reCAPTCHA
      
    } catch (error) {
      console.error('Booking failed:', error);
      showToast(
        error instanceof Error && error.message === 'reCAPTCHA verification failed'
          ? 'Security verification failed. Please try again.'
          : 'Failed to process your booking. Please try again.', 
        'error'
      );
    } finally {
      setIsLoading(false);
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
    if (!lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!subject.trim()) newErrors.subject = 'Subject is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateContactForm()) return
    
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('Contact form submitted:', { contactName, lastName, contactEmail, subject, contactMessage })
      
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

    const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
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
      <nav 
        className={`sticky top-0 w-full shadow-sm transition-all duration-300 ${
          isAtTop ? 'bg-black/50' : 'bg-gray-800/90'
        } ${
          visible ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{ zIndex: 1000, position: 'fixed', width: '100%' }}
      >
        <div className="w-full flex h-24 items-center justify-between px-8">
          <div className="flex items-center pl-12">
            <button onClick={() => scrollToSection(homeRef)} className="focus:outline-none">
              <div className="relative h-20 w-48">
                <Image 
                  src={logoImage}
                  alt="Rabaul Hotel Logo"
                  fill
                  sizes="(max-width: 768px) 192px, 240px"
                  className="object-contain hover:opacity-90 transition-opacity"
                  priority
                  quality={100}
                />
              </div>
            </button>
          </div>
          <div className="hidden md:flex items-center space-x-4 mr-6">
            {/* Home */}
            <Button 
              variant="ghost"
              onClick={() => scrollToSection(homeRef)}
              className="text-white hover:bg-gray-100/20 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-0 focus:ring-offset-0 active:scale-95 text-base px-6 py-2 border border-gray-300/30 rounded-lg w-28 text-center cursor-pointer"
            >
              Home
            </Button>
            
            {/* About Us */}
            <Button 
              variant="ghost"
              onClick={() => scrollToSection(aboutRef)}
              className="text-white hover:bg-gray-100/20 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-0 focus:ring-offset-0 active:scale-95 text-base px-6 py-2 border border-gray-300/30 rounded-lg w-28 text-center cursor-pointer"
            >
              About Us
            </Button>
            
            {/* Services */}
            <div className="relative group">
              <Button 
                variant="ghost"
                className="text-white hover:bg-gray-100/20 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-0 focus:ring-offset-0 active:scale-95 text-base px-6 py-2 border border-gray-300/30 rounded-lg w-32 text-center flex items-center justify-center cursor-pointer"
              >
                Services
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>
              <div className="absolute left-0 mt-1 w-48 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
                <button 
                  onClick={() => {
                    scrollToSection(diningRef);
                    setActiveSection('dining');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100/80 transition-colors cursor-pointer text-gray-800"
                >
                  Dining
                </button>
                <button 
                  onClick={() => {
                    scrollToSection(exploreRef);
                    setActiveSection('explore');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100/80 transition-colors cursor-pointer text-gray-800"
                >
                  Tours
                </button>
                <button 
                  onClick={() => {
                    scrollToSection(roomsRef);
                    setActiveSection('rooms');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100/80 transition-colors cursor-pointer text-gray-800"
                >
                  Accommodation
                </button>
              </div>
            </div>
            
            {/* Reservations */}
            <Button 
              variant="ghost"
              onClick={() => scrollToSection(bookRef)}
              className={`text-white hover:bg-gray-100/20 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-0 focus:ring-offset-0 active:scale-95 text-base px-6 py-2 border border-gray-300/30 rounded-lg w-28 text-center cursor-pointer ${
                activeSection === 'booking' ? 'bg-white/20' : ''
              }`}
            >
              Reservations
            </Button>
            
            {/* Contact Us */}
            <Button 
              variant="ghost"
              onClick={() => scrollToSection(contactRef)}
              className={`text-white hover:bg-gray-100/20 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-0 focus:ring-offset-0 active:scale-95 text-base px-6 py-2 border border-gray-300/30 rounded-lg w-28 text-center cursor-pointer ${
                activeSection === 'contact' ? 'bg-white/20' : ''
              }`}
            >
              Contact Us
            </Button>
          </div>
          <Button 
            variant="ghost"
            className="md:hidden text-white hover:bg-white/10 rounded-full p-2 transition-colors w-11 h-11 flex items-center justify-center focus:outline-none focus:ring-0 focus-visible:ring-0 focus:ring-offset-0 focus-visible:ring-offset-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="!w-7 !h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="!w-7 !h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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
            <div className="flex flex-col space-y-2 w-72 bg-gray-800/90 backdrop-blur-sm py-4 px-4 text-lg rounded-r-lg">
              {/* Home */}
              <button 
                onClick={() => {
                  scrollToSection(homeRef)
                  setMobileMenuOpen(false)
                }}
                className={`px-6 py-3 w-full text-left text-white hover:bg-gray-100/20 transition-colors border border-gray-300/30 rounded-lg mx-2 my-1 ${
                  activeSection === 'home' ? 'bg-white/20 font-medium' : ''
                }`}
              >
                Home
              </button>
              
              {/* About Us */}
              <button 
                onClick={() => {
                  scrollToSection(aboutRef)
                  setMobileMenuOpen(false)
                }}
                className="px-6 py-3 w-full text-left text-white hover:bg-gray-100/20 transition-colors border border-gray-300/30 rounded-lg mx-2 my-1"
              >
                About Us
              </button>
              
              {/* Services Dropdown */}
              <div className="border border-gray-300/30 rounded-lg mx-2 my-1 overflow-hidden">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const content = e.currentTarget.nextElementSibling as HTMLElement;
                    content.style.display = content.style.display === 'none' ? 'block' : 'none';
                  }}
                  className={`px-6 py-3 w-full text-left text-white hover:bg-gray-100/20 transition-colors flex justify-between items-center ${
                    ['dining', 'explore', 'rooms'].includes(activeSection) ? 'bg-white/20 font-medium' : ''
                  }`}
                >
                  <span>Services</span>
                  <svg className="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="pl-4 hidden">
                  <button 
                    onClick={() => {
                      scrollToSection(diningRef)
                      setActiveSection('dining')
                      setMobileMenuOpen(false)
                    }}
                    className="px-6 py-2 w-full text-left text-white hover:bg-gray-100/20 transition-colors"
                  >
                    Dining
                  </button>
                  <button 
                    onClick={() => {
                      scrollToSection(exploreRef)
                      setActiveSection('explore')
                      setMobileMenuOpen(false)
                    }}
                    className="px-6 py-2 w-full text-left text-white hover:bg-gray-100/20 transition-colors"
                  >
                    Tours
                  </button>
                  <button 
                    onClick={() => {
                      scrollToSection(roomsRef)
                      setActiveSection('rooms')
                      setMobileMenuOpen(false)
                    }}
                    className="px-6 py-2 w-full text-left text-white hover:bg-gray-100/20 transition-colors"
                  >
                    Accommodation
                  </button>
                </div>
              </div>
              
              {/* Reservations */}
              <button 
                onClick={() => {
                  scrollToSection(bookRef)
                  setMobileMenuOpen(false)
                }}
                className={`px-6 py-3 w-full text-left text-white hover:bg-gray-100/20 transition-colors border border-gray-300/30 rounded-lg mx-2 my-1 ${
                  activeSection === 'booking' ? 'bg-white/20 font-medium' : ''
                }`}
              >
                Reservations
              </button>
              
              {/* Contact Us */}
              <button 
                onClick={() => {
                  scrollToSection(contactRef)
                  setMobileMenuOpen(false)
                }}
                className={`px-6 py-3 w-full text-left text-white hover:bg-gray-100/20 transition-colors border border-gray-300/30 rounded-lg mx-2 my-1 ${
                  activeSection === 'contact' ? 'bg-white/20 font-medium' : ''
                }`}
              >
                Contact Us
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
          <div
            className="md:hidden absolute inset-0 w-full h-full bg-gradient-to-br from-blue-900 to-green-900"
            style={{
              // CSS background from public/ so it works on Vercel
              backgroundImage:
                "linear-gradient(to bottom right, rgba(30,58,138,0.6), rgba(6,95,70,0.6)), url('/images/mobile-hero.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Image removed; using CSS background only so it always shows on mobile */}
          </div>
        </div>
        <div className="container max-w-7xl px-4 relative z-10 w-full pt-16 sm:pt-24 md:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto px-4 w-full text-center"
          >
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <motion.div
                className="hidden md:block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h3 className="text-xl sm:text-2xl md:text-3xl font-light text-white mb-3 tracking-wider uppercase" style={{fontFamily: "'Montserrat', sans-serif"}}>
                  WELCOME TO
                </h3>
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 leading-tight tracking-tight" style={{fontFamily: "'Playfair Display', serif", textShadow: "2px 2px 4px rgba(0,0,0,0.3)"}}>
                  <span className="text-green-400 drop-shadow-lg">Rabaul Hotel</span>
                </h1>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-light text-white tracking-wider uppercase" style={{fontFamily: "'Montserrat', sans-serif"}}>
                  RESORT & TOURS
                </h3>
              </motion.div>
              <div className="md:hidden space-y-2">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-2xl font-light text-white tracking-wider uppercase"
                  style={{fontFamily: "'Montserrat', sans-serif"}}
                >
                  WELCOME TO
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-6xl font-bold text-green-400 mb-3 tracking-tight"
                >
                  Rabaul Hotel
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-2xl font-light text-white tracking-wider uppercase"
                  style={{fontFamily: "'Montserrat', sans-serif"}}
                >
                  RESORT & TOURS
                </motion.div>
              </div>
            </div>
            
            <div className="mt-12 sm:mt-16 md:mt-20">
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
            </div>
          </motion.div>
        </div>
      </section>
      {/* About Us Section */}
      <section ref={aboutRef} className="py-16 md:py-20 bg-green-950 text-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Text Content - First on mobile, left on desktop */}
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">About Rabaul Hotel</h2>
              <div className="w-20 h-1 bg-yellow-400 mb-6"></div>
              <p className="text-base md:text-lg leading-relaxed mb-6">
                The iconic Rabaul Hotel has been hosting visitors since 1952. Previously the &quot;Ascot&quot; &amp; then the &quot;Hamamas&quot; Hotel, the Rabaul Hotel is famous for its genuine &apos;home away from home&apos; style of hospitality.
              </p>
              <p className="text-base md:text-lg leading-relaxed">
                Boasting visitors such as Prime Ministers, Sporting Stars and even HRH Prince Andrew Duke of York, the Rabaul Hotel takes great pride in ensuring our Guests have an enjoyable and comfortable stay while discovering the SPIRIT of Volcano Town.
              </p>
            </div>
            
            {/* Image - Second on mobile, right on desktop */}
            <div className="w-full md:w-1/2">
              <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden shadow-2xl">
                <Image 
                  src="/images/rabaul-hotel.png" 
                  alt="Rabaul Hotel"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
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
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  quality={95}
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7g5BTZCNl4xYlpNYs6P/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAIAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdAB//2Q=="
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2">Budget Room</h3>
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
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  quality={95}
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7g5BTZCNl4xYlpNYs6P/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAIAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdAB//2Q=="
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2">Standard Room</h3>
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
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  quality={95}
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7g5BTZCNl4xYlpNYs6P/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAIAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdAB//2Q=="
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2">Executive Room</h3>
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
            
            {/* Family Suite */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-64 overflow-hidden group">
                <Image 
                  src="/images/rooms/family-suite.png" 
                  alt="Family Suite"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  quality={95}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2">Family Suite</h3>
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
                    <h4 className="text-lg font-semibold text-gray-800">Family Suite</h4>
                    <p className="text-gray-500 text-sm">Max guests: 4</p>
                  </div>
                  <Button 
                    onClick={() => {
                      setRoomType('family');
                      scrollToSection(bookRef);
                    }}
                    className="bg-[#1a5f2c] hover:bg-[#144a22] text-white px-4 py-2 text-sm rounded-md transition-colors"
                  >
                    Book Now
                  </Button>
                </div>
                <p className="mt-3 text-sm text-gray-600">
                  Perfect blend of space and comfort for families
                </p>
              </div>
            </div>
            
            {/* Conference Room */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-64 overflow-hidden group">
                <Image 
                  src="/images/amenities/conference-room.PNG" 
                  alt="Conference Room"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  quality={95}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2">Conference Room</h3>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="flex items-center mr-4">
                    <svg className="w-4 h-4 mr-1 text-[#1a5f2c]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    Full Day Rental
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-[#1a5f2c]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                    AV Equipment
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">Conference Room</h4>
                    <p className="text-gray-500 text-sm">Capacity: 20 people</p>
                  </div>
                  <Button 
                    onClick={() => {
                      setRoomType('conference');
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
      <section className="py-12 md:py-16 bg-gray-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Text Content - Always on top on mobile, left on desktop */}
            <div className="w-full md:w-1/2">
              <div className="flex items-center mb-6">
                <div className="bg-[#1a5f2c] p-3 rounded-full mr-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Hotel Reception</h2>
              </div>
              <div className="w-20 h-1 bg-[#1a5f2c] mb-6"></div>
              <p className="text-gray-700 leading-relaxed mb-6">
                Rabaul Hotel is happy to offer Guests Room Upgrades if available on Check In. Rabaul Hotel is happy to offer Guests late Check Out if available. Please advise Reception on Check In, otherwise late Check Out without authority from the Management, may incur a surcharge.
              </p>
            </div>
            
            {/* Image - Below text on mobile, right on desktop */}
            <div className="w-full md:w-1/2">
              <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden shadow-2xl">
                <Image 
                  src="/images/amenities/hotel-reception.PNG" 
                  alt="Hotel Reception"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Book Your Stay Section */}
      <section 
        id="book" 
        ref={bookRef}
        className="py-8 md:py-12 scroll-mt-16 relative bg-cover bg-center bg-no-repeat w-full flex justify-center"
        style={{ backgroundImage: "url('/images/booking-background.PNG')" }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="container max-w-7xl px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Book Your Stay</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden text-white">
                <CardHeader className="bg-[#1a5f2c] text-white py-3">
                  <CardTitle className="text-xl">Reservation Details</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4 text-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1" key={`check-in-${formKey}`}>
                      <Label htmlFor="check-in" className="font-medium text-white">Check-in Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="check-in"
                            variant="outline"
                            className="w-full justify-start text-left font-normal h-12 px-4 bg-white/10 hover:bg-white/20 text-white border-white/30"
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
                      <Label htmlFor="check-out" className="font-medium text-white">Check-out Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="check-out"
                            variant="outline"
                            className="w-full justify-start text-left font-normal h-12 px-4 bg-white/10 hover:bg-white/20 text-white border-white/30"
                          >
                            <CalendarIcon className="mr-2 h-5 w-5" />
                            {checkOut ? format(checkOut, "PPP") : <span className="text-white/70">Select check-out date</span>}
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
                      <Label htmlFor="room-type" className="text-sm font-medium text-white">Room Type</Label>
                      <Select value={roomType || 'select'} onValueChange={value => setRoomType(value === 'select' ? undefined : value)}>
                        <SelectTrigger id="room-type" className="h-10 text-sm border-white/30">
                          <SelectValue placeholder="Select room type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="select">Select Room</SelectItem>
                          <SelectItem value="budget">Budget Room</SelectItem>
                          <SelectItem value="standard">Standard Room</SelectItem>
                          <SelectItem value="executive">Executive Room</SelectItem>
                          <SelectItem value="family">Family Suite</SelectItem>
                          <SelectItem value="conference">Conference Room</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-white">Guests</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="adults" className="text-xs font-medium text-white">Adults</Label>
                          <Select 
                            value={adults.toString()} 
                            onValueChange={(value) => setAdults(parseInt(value))}
                          >
                            <SelectTrigger id="adults" className="h-9 text-sm border-white/30">
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
                          <Label htmlFor="children" className="text-xs font-medium text-white">Children</Label>
                          <Select 
                            value={children.toString()} 
                            onValueChange={(value) => setChildren(parseInt(value))}
                          >
                            <SelectTrigger id="children" className="h-9 text-sm border-white/30">
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
                      <Label className="text-sm font-medium text-white">Title & Full Name</Label>
                      <div className="flex gap-2">
                        <Select 
                          value={title}
                          onValueChange={setTitle}
                        >
                          <SelectTrigger className="w-24 h-9 text-sm border-white/30">
                            <SelectValue placeholder="Title" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mr">Mr.</SelectItem>
                            <SelectItem value="mrs">Mrs.</SelectItem>
                            <SelectItem value="ms">Ms.</SelectItem>
                            <SelectItem value="dr">Dr.</SelectItem>
                            <SelectItem value="prof">Prof.</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input 
                          id="fullName"
                          type="text"
                          placeholder="John Doe"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="h-9 text-sm flex-1 border-white/30"
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email" className="text-sm font-medium text-white">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="your@email.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-9 text-sm border-white/30"
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="phone" className="text-sm font-medium text-white">Phone</Label>
                      <div className="flex">
                        <Select 
                          value={countryCode}
                          onValueChange={setCountryCode}
                        >
                          <SelectTrigger className="w-[120px] h-9 text-sm rounded-r-none border-r-0 focus:ring-0 focus:ring-offset-0 border-white/30">
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
                          className="h-9 text-sm rounded-l-none flex-1 border-white/30"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                      )}
                    </div>
                    <div className="space-y-3 col-span-2">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-white">Transport Services</Label>
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-6 justify-start w-full">
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="no-transport"
                                name="transport-option"
                                checked={transportServices.noTransport}
                                onChange={() => setTransportServices(prev => ({ ...prev, needsTransport: false, noTransport: true, transportType: '' }))}
                                className="h-4 w-4 border-gray-300 text-[#1a5f2c] focus:ring-[#1a5f2c]"
                              />
                              <Label htmlFor="no-transport" className="text-sm font-normal text-white">I don&apos;t need transport services</Label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="needs-transport"
                                name="transport-option"
                                checked={transportServices.needsTransport}
                                onChange={() => setTransportServices(prev => ({ ...prev, needsTransport: true, noTransport: false }))}
                                className="h-4 w-4 border-gray-300 text-[#1a5f2c] focus:ring-[#1a5f2c]"
                              />
                              <Label htmlFor="needs-transport" className="text-sm font-normal text-white">I need transport services</Label>
                            </div>
                          </div>
                          
                          {transportServices.needsTransport && (
                            <div className="ml-6 space-y-3 border-l-2 border-white/20 pl-4">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-white">Transport Type</Label>
                                <div className="flex flex-wrap items-center gap-6">
                                  <label className="inline-flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      name="transport-type"
                                      checked={transportServices.transportType === 'pickup'}
                                      onChange={() => setTransportServices(prev => ({ ...prev, transportType: 'pickup' }))}
                                      className="h-4 w-4 border-gray-300 text-[#1a5f2c] focus:ring-[#1a5f2c]"
                                    />
                                    <span className="text-sm text-white whitespace-nowrap">Pick Up Only</span>
                                  </label>
                                  <label className="inline-flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      name="transport-type"
                                      checked={transportServices.transportType === 'dropoff'}
                                      onChange={() => setTransportServices(prev => ({ ...prev, transportType: 'dropoff' }))}
                                      className="h-4 w-4 border-gray-300 text-[#1a5f2c] focus:ring-[#1a5f2c]"
                                    />
                                    <span className="text-sm text-white whitespace-nowrap">Drop Off Only</span>
                                  </label>
                                  <label className="inline-flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      name="transport-type"
                                      checked={transportServices.transportType === 'both'}
                                      onChange={() => setTransportServices(prev => ({ ...prev, transportType: 'both' }))}
                                      className="h-4 w-4 border-gray-300 text-[#1a5f2c] focus:ring-[#1a5f2c]"
                                    />
                                    <span className="text-sm text-white whitespace-nowrap">Pick Up & Drop Off</span>
                                  </label>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {(transportServices.transportType === 'pickup' || transportServices.transportType === 'both') && (
                                    <div className="space-y-2">
                                      <div className="space-y-1">
                                        <Label className="text-sm font-medium text-white">Pick Up Location</Label>
                                        <input
                                          type="text"
                                          placeholder="Enter pick-up address"
                                          value={transportServices.pickupLocation}
                                          onChange={(e) => setTransportServices(prev => ({ ...prev, pickupLocation: e.target.value }))}
                                          className="w-full h-9 px-3 py-2 text-sm bg-white/10 border border-white/30 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-[#1a5f2c]"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <Label className="text-sm font-medium text-white">Pick Up Time</Label>
                                        <input
                                          type="time"
                                          value={transportServices.pickupTime}
                                          onChange={(e) => setTransportServices(prev => ({ ...prev, pickupTime: e.target.value }))}
                                          className="w-full h-9 px-3 py-2 text-sm bg-white/10 border border-white/30 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-[#1a5f2c]"
                                        />
                                      </div>
                                    </div>
                                  )}
                                  
                                  {(transportServices.transportType === 'dropoff' || transportServices.transportType === 'both') && (
                                    <div className="space-y-2">
                                      <div className="space-y-1">
                                        <Label className="text-sm font-medium text-white">
                                          {transportServices.transportType === 'both' ? 'Drop Off' : 'Drop Off'} Location
                                        </Label>
                                        <input
                                          type="text"
                                          placeholder="Enter drop-off address"
                                          value={transportServices.dropoffLocation}
                                          onChange={(e) => setTransportServices(prev => ({ ...prev, dropoffLocation: e.target.value }))}
                                          className="w-full h-9 px-3 py-2 text-sm bg-white/10 border border-white/30 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-[#1a5f2c]"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <Label className="text-sm font-medium text-white">
                                          {transportServices.transportType === 'both' ? 'Drop Off' : 'Drop Off'} Time
                                        </Label>
                                        <input
                                          type="time"
                                          value={transportServices.dropoffTime}
                                          onChange={(e) => setTransportServices(prev => ({ ...prev, dropoffTime: e.target.value }))}
                                          className="w-full h-9 px-3 py-2 text-sm bg-white/10 border border-white/30 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-[#1a5f2c]"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          
                        </div>
                      </div>

                      {transportCost > 0 && (
                        <div className="pt-2 border-t border-white/20">
                          <div className="text-sm font-medium mb-1">Transport Services:</div>
                          <div className="flex justify-between text-sm">
                            <span className="pl-2">• Transport Service</span>
                            <span>K 100</span>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-white">Payment Method</Label>
                        <div className="flex items-center space-x-6">
                          <label className="inline-flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="credit-card"
                              checked={paymentMethod === 'credit-card'}
                              onChange={() => setPaymentMethod('credit-card')}
                              className="h-4 w-4 text-[#1a5f2c] focus:ring-[#1a5f2c] border-white/50"
                            />
                            <span className="text-sm text-white">Credit Card</span>
                          </label>
                          <label className="inline-flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="bank-transfer"
                              checked={paymentMethod === 'bank-transfer'}
                              onChange={() => setPaymentMethod('bank-transfer')}
                              className="h-4 w-4 text-[#1a5f2c] focus:ring-[#1a5f2c] border-white/50"
                            />
                            <span className="text-sm text-white">Bank Transfer</span>
                          </label>
                          <label className="inline-flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="cash"
                              checked={paymentMethod === 'cash'}
                              onChange={() => setPaymentMethod('cash')}
                              className="h-4 w-4 text-[#1a5f2c] focus:ring-[#1a5f2c] border-white/50"
                            />
                            <span className="text-sm text-white">Cash on Arrival</span>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="special-requests" className="text-sm font-medium text-white">Special Requests</Label>
                        <Textarea
                          id="special-requests"
                          placeholder="Any special requirements?"
                          value={specialRequest}
                          onChange={(e) => setSpecialRequest(e.target.value)}
                          className="min-h-[80px] text-sm border-white/30 mb-4"
                        />
                      </div>
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
                <div className="space-y-2 text-white">
                  <div className="flex justify-between">
                    <span>Nights:</span>
                    <span className="font-medium">{nights} night{nights > 1 ? 's' : ''}</span>
                  </div>
                  
                  {roomType && roomType !== 'select' && (
                    <div className="flex justify-between">
                      <span>Room ({roomType.charAt(0).toUpperCase() + roomType.slice(1)}):</span>
                      <span className="font-medium">K {roomRates[roomType as keyof typeof roomRates]} × {nights} = K {roomCost}</span>
                    </div>
                  )}
                  
                  {transportCost > 0 && (
                    <div className="pt-2 border-t border-white/20">
                      <div className="text-sm font-medium mb-1">Transport Services:</div>
                      <div className="text-sm space-y-1">
                        <div className="pl-2">• {transportServices.transportType === 'pickup' && 'Pick Up'}
                                              {transportServices.transportType === 'dropoff' && 'Drop Off'}
                                              {transportServices.transportType === 'both' && 'Pick Up & Drop Off'}</div>
                        {transportServices.pickupLocation && (
                          <div className="pl-4 text-white/80">From: {transportServices.pickupLocation}</div>
                        )}
                        {transportServices.dropoffLocation && (
                          <div className="pl-4 text-white/80">To: {transportServices.dropoffLocation}</div>
                        )}
                        {transportServices.pickupTime && (
                          <div className="pl-4 text-white/80">Time: {transportServices.pickupTime}</div>
                        )}
                      </div>
                      <div className="flex justify-between text-sm font-medium mt-1 pt-1 border-t border-white/20">
                        <span>Subtotal (Transport):</span>
                        <span>K {transportCost}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between border-t border-white/30 pt-2 font-bold">
                    <span>Total Cost:</span>
                    <span className="text-yellow-300">K {totalCost}</span>
                  </div>
                  
                  <div className="text-sm text-white/80">
                    <div>Guests: {adults} Adult{adults > 1 ? 's' : ''} {children > 0 ? `& ${children} Child${children > 1 ? 'ren' : ''}` : ''}</div>
                    <div>Payment: {paymentMethod === 'credit-card' ? 'Credit Card' : paymentMethod === 'bank-transfer' ? 'Bank Transfer' : 'Cash on Arrival'}</div>
                  </div>
                </div>
                <div className="mt-4">
                    <style jsx global>{`
                      .recaptcha-container > div {
                        width: 100% !important;
                        transform: scale(0.85);
                        transform-origin: 0 0;
                        margin: 0 auto;
                        max-width: 300px;
                      }
                      .g-recaptcha {
                        display: flex;
                        justify-content: center;
                      }
                    `}</style>
                    <div className="flex justify-center">
                      <ReCAPTCHA
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || 'your-site-key'}
                        onChange={(token: string | null) => setRecaptchaToken(token)}
                        onExpired={() => setRecaptchaToken(null)}
                        onErrored={() => setRecaptchaToken(null)}
                        theme="dark"
                        className="recaptcha-container"
                      />
                    </div>
                    {errors.recaptcha && (
                      <p className="mt-2 text-sm text-red-400 text-center">{errors.recaptcha}</p>
                    )}
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
                  <div className="relative h-20 w-48">
                    <Image 
                      src={logoImage}
                      alt="Rabaul Hotel"
                      fill
                      sizes="192px"
                      className="object-contain"
                      quality={100}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Amenities Section */}
      <section ref={amenitiesRef} className="py-16 bg-white scroll-mt-16" id="amenities">
        <div className="container max-w-7xl px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Amenities</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Discover the natural beauty and rich history of Rabaul, where volcanic landscapes meet World War II relics and vibrant local culture.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 23m Swimming Pool */}
            <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-green-100">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
                  <svg className="h-16 w-16 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8 4m0 0L4 7m16 0l-8-4m8 4v10l-8 4m0-10L4 7m16 0v10M4 7v10l8 4" />
                  </svg>
                </div>
                <Image 
                  src="/images/amenities/swimming-pool.PNG" 
                  alt="Swimming Pool"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-blue-600/10 group-hover:opacity-0 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">23m Swimming Pool</h3>
                <p className="text-green-700 text-sm">Relax and unwind in our beautiful 23-meter swimming pool surrounded by tropical gardens.</p>
              </div>
            </div>

            {/* Phoenix Room Restaurant */}
            <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-green-100">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-amber-50 flex items-center justify-center">
                  <Utensils className="h-16 w-16 text-amber-200" />
                </div>
                <Image 
                  src="/images/amenities/phoenix.jpeg" 
                  alt="Restaurant"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-amber-600/10 group-hover:opacity-0 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Phoenix Room Restaurant</h3>
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
                <Image 
                  src="/images/amenities/conference-room.PNG" 
                  alt="Conference Room"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-purple-600/10 group-hover:opacity-0 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Conference Facilities</h3>
                <p className="text-green-700 text-sm">Host your next event in our air-conditioned conference room with capacity for 150+ guests.</p>
              </div>
            </div>

            {/* 24/7 Reception */}
            <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-green-100">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-green-50 flex items-center justify-center">
                  <ConciergeBell className="h-16 w-16 text-green-200" />
                </div>
                <Image 
                  src="/images/amenities/hotel-reception.PNG" 
                  alt="Hotel Reception"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-green-600/10 group-hover:opacity-0 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">24/7 Reception</h3>
                <p className="text-green-700 text-sm">Our friendly staff is available around the clock to assist you with any needs during your stay.</p>
              </div>
            </div>

            {/* Free Secure Parking */}
            <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-green-100">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
                  <Car className="h-16 w-16 text-blue-200" />
                </div>
                <Image 
                  src="/images/amenities/parking.PNG" 
                  alt="Parking"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-blue-600/10 group-hover:opacity-0 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Free Secure Parking</h3>
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

      {/* Contact Us Section */}
      <section 
        id="contact" 
        ref={contactRef}
        className="pt-8 pb-12 bg-gradient-to-br from-green-50 to-blue-50 scroll-mt-12 relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-1/4 h-1/4 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="container max-w-6xl px-4 mx-auto relative z-10">
          <div className="text-center mb-6">
            <span className="inline-block px-4 py-1.5 text-sm font-semibold text-green-700 bg-green-100 rounded-full mb-4">Get In Touch</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Have questions or need assistance? Our team is here to help you plan your perfect stay in Rabaul.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Contact Info */}
            <div className="space-y-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 relative pb-4">
                  <span className="relative">
                    Our Information
                    <span className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></span>
                  </span>
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-5 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">Our Location</h4>
                      <p className="text-gray-600">Mango Avenue</p>
                      <p className="text-gray-600">P.O Box 1</p>
                      <p className="text-gray-600">Rabaul, East New Britain Province</p>
                      <p className="text-gray-600">Papua New Guinea</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-5 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">Phone Numbers</h4>
                      <div className="space-y-1">
                        <a href="tel:+67571893571" className="block text-gray-600 hover:text-blue-600 transition-colors">
                          +675 7189 3571
                        </a>
                        <a href="tel:+6759821999" className="block text-gray-600 hover:text-blue-600 transition-colors">
                          +675 982 1999
                        </a>
                        <a href="tel:+67571749608" className="block text-gray-600 hover:text-blue-600 transition-colors">
                          +675 7174 9608
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-5 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">Email Address</h4>
                      <a href="mailto:info@rabaulhotel.com" className="text-blue-600 hover:underline">
                        info@rabaulhotel.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-5 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">Working Hours</h4>
                      <p className="text-gray-600">24/7 Front Desk Service</p>
                      <p className="text-sm text-gray-500">Check-in: 2:00 PM | Check-out: 11:00 AM</p>
                    </div>
                  </div>
                </div>
                
                {/* Social Media Links */}
                <div className="mt-10">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h4>
                  <div className="flex space-x-4">
                    {[
                      { icon: Facebook, color: 'bg-blue-500 hover:bg-blue-600', label: 'Facebook' },
                      { icon: Instagram, color: 'bg-pink-500 hover:bg-pink-600', label: 'Instagram' },
                      { icon: Twitter, color: 'bg-sky-400 hover:bg-sky-500', label: 'Twitter' },
                      { icon: Youtube, color: 'bg-red-500 hover:bg-red-600', label: 'YouTube' }
                    ].map((social, index) => (
                      <a 
                        key={index}
                        href="#" 
                        className={`w-10 h-10 rounded-full ${social.color} text-white flex items-center justify-center transition-colors duration-300 transform hover:-translate-y-1`}
                        aria-label={social.label}
                      >
                        <social.icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            
            </div>
            
            {/* Right Column - Contact Form */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-fit">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h3>
              <p className="text-gray-600 mb-8">We&apos;ll get back to you within 24 hours</p>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      className="w-full"
                      placeholder="Enter your first name"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />
                    {errors.contactName && (
                      <p className="text-xs text-red-500 mt-1">{errors.contactName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-700">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      className="w-full"
                      placeholder="Enter your last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                    {errors.lastName && (
                      <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    className="w-full"
                    placeholder="Enter your email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                  {errors.contactEmail && (
                    <p className="text-xs text-red-500 mt-1">{errors.contactEmail}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-gray-700">Subject</Label>
                  <Input
                    id="subject"
                    type="text"
                    className="w-full"
                    placeholder="Enter subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                  {errors.subject && (
                    <p className="text-xs text-red-500 mt-1">{errors.subject}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-gray-700">Message</Label>
                  <Textarea
                    id="message"
                    className="min-h-[120px]"
                    placeholder="Type your message here..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                  />
                  {errors.contactMessage && (
                    <p className="text-xs text-red-500 mt-1">{errors.contactMessage}</p>
                  )}
                </div>
                <div className="mt-4">
                  <style jsx global>{`
                    .contact-recaptcha > div {
                      width: 100% !important;
                      transform: scale(0.9);
                      transform-origin: 0 0;
                      margin: 0 auto;
                    }
                    .g-recaptcha {
                      display: flex;
                      justify-content: center;
                    }
                  `}</style>
                  <div className="flex justify-center">
                    <ReCAPTCHA
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || 'your-site-key'}
                      onChange={(token: string | null) => setRecaptchaToken(token)}
                      onExpired={() => setRecaptchaToken(null)}
                      onErrored={() => setRecaptchaToken(null)}
                      theme="light"
                      className="contact-recaptcha"
                    />
                  </div>
                  {errors.recaptcha && (
                    <p className="mt-2 text-sm text-red-500 text-center">{errors.recaptcha}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Your Message...
                    </>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Send Message
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Rabaul Section */}
      <section ref={exploreRef} className="py-16 bg-white scroll-mt-16" id="explore">
        <div className="container max-w-7xl px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Rabaul</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Discover the natural beauty and rich history of Rabaul, where volcanic landscapes meet World War II relics and vibrant local culture.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 w-full">
                <Image 
                  src={attractionImages.tavurvur.src}
                  alt={attractionImages.tavurvur.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-green-700">Mt Tavurvur Volcano</h3>
                <p className="text-sm text-gray-600">Witness the power of nature at this active volcano with dramatic crater views, especially stunning at sunrise.</p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 w-full">
                <Image 
                  src={attractionImages.simpsonHarbour.src}
                  alt={attractionImages.simpsonHarbour.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-green-700">Simpson Harbour & Caldera</h3>
                <p className="text-sm text-gray-600">Stunning flooded caldera surrounded by volcanoes, perfect for scenic walks and wildlife spotting.</p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 w-full">
                <Image 
                  src={attractionImages.matupitIsland.src}
                  alt={attractionImages.matupitIsland.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-green-700">Matupit Island</h3>
                <p className="text-sm text-gray-600">Experience traditional village life and enjoy excellent snorkeling in crystal clear waters.</p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 w-full">
                <Image 
                  src={attractionImages.ww2Tunnels.src}
                  alt={attractionImages.ww2Tunnels.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-green-700">WWII Relics & Tunnels</h3>
                <p className="text-sm text-gray-600">Explore historic tunnels and bunkers from the Japanese occupation during World War II.</p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 w-full">
                <Image 
                  src={attractionImages.oldRabaul.src}
                  alt={attractionImages.oldRabaul.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-green-700">Old Rabaul Ruins</h3>
                <p className="text-sm text-gray-600">See the remnants of the old town, a powerful reminder of the 1994 volcanic eruptions.</p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 w-full">
                <Image 
                  src={attractionImages.museum.src}
                  alt={attractionImages.museum.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-green-700">Rabaul Museum</h3>
                <p className="text-sm text-gray-600">Discover the region&apos;s volcanic history, local culture, and wartime heritage.</p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 w-full">
                <Image 
                  src={attractionImages.warCemetery.src}
                  alt={attractionImages.warCemetery.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-green-700">Bitapaka War Cemetery</h3>
                <p className="text-sm text-gray-600">A peaceful memorial honoring those who perished in World Wars I and II.</p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 w-full">
                <Image 
                  src={attractionImages.market.src}
                  alt={attractionImages.market.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-green-700">Rabaul Market</h3>
                <p className="text-sm text-gray-600">Immerse yourself in local life with fresh seafood, tropical fruits, and traditional crafts.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-950 text-white py-12">
        <div className="container max-w-7xl px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Rabaul Hotel */}
            <div className="lg:order-1">
              <h3 className="text-2xl font-bold mb-2 text-yellow-400">Rabaul Hotel</h3>
              <p className="text-white mb-4">Experience luxury and comfort in the heart of Rabaul. Our hotel offers amenities and breathtaking views of the surrounding landscape.</p>
              
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:opacity-80 transition-opacity">
                  <span className="sr-only">Facebook</span>
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-white hover:opacity-80 transition-opacity">
                  <span className="sr-only">Twitter</span>
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-white hover:opacity-80 transition-opacity">
                  <span className="sr-only">Instagram</span>
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:order-4">
              <h4 className="text-lg font-semibold mb-4 text-yellow-400">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#home" className="text-white hover:text-yellow-400 transition-colors">Home</a></li>
                <li><a href="#rooms" className="text-white hover:text-yellow-400 transition-colors">Rooms & Suites</a></li>
                <li><a href="#explore" className="text-white hover:text-yellow-400 transition-colors">Dining</a></li>
                <li><a href="#amenities" className="text-white hover:text-yellow-400 transition-colors">Facilities</a></li>
                <li><a href="#contact" className="text-white hover:text-yellow-400 transition-colors">Contact Us</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="lg:order-2">
              <h4 className="text-lg font-semibold mb-4 text-yellow-400">Contact Info</h4>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                  <div className="text-white">
                    <a href="tel:+6759821999" className="block hover:text-yellow-400 transition-colors">+675 982 1999 / 7189 3571</a>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                  <a href="mailto:info@rabaulhotel.com" className="text-white hover:text-yellow-400 transition-colors">info@rabaulhotel.com</a>
                </li>
                <li className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">
                    Mango Avenue, P.O Box 1
                    <br />Rabaul, East New Britain Province
                    <br />Papua New Guinea
                  </span>
                </li>
              </ul>
            </div>

            {/* Our Services */}
            <div className="lg:order-3">
              <h4 className="text-lg font-semibold mb-4 text-yellow-400">Our Services</h4>
              <ul className="space-y-3">
                <li><a href="#amenities" className="text-white hover:text-yellow-400 transition-colors">24/7 Room Service</a></li>
                <li><a href="#amenities" className="text-white hover:text-yellow-400 transition-colors">Airport Transfer</a></li>
                <li><a href="#amenities" className="text-white hover:text-yellow-400 transition-colors">Laundry Service</a></li>
                <li><a href="#amenities" className="text-white hover:text-yellow-400 transition-colors">Car Rental</a></li>
              </ul>
            </div>

          </div>

          <div className="border-t border-green-800 pt-8">
            <div className="flex flex-wrap justify-center items-center gap-6">
              <span className="text-white text-sm">&copy; {new Date().getFullYear()} Rabaul Hotel. All rights reserved.</span>
              <a href="#" className="text-white hover:text-yellow-400 text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-white hover:text-yellow-400 text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-white hover:text-yellow-400 text-sm transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 p-3 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-all duration-200 ${showScrollButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-6 w-6 text-black" />
      </button>
    </div>
  )
}
