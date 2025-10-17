'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import ReCAPTCHA from 'react-google-recaptcha'
import ExploreSection from '@/components/sections/ExploreSection'
import RoomsSection from '@/components/sections/RoomsSection'
import AmenitiesSection from '@/components/sections/AmenitiesSection'


// Import specific images directly instead of from lib/images
const logoImage = '/images/logo.png';

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format, isBefore, isToday, isEqual } from 'date-fns'
import { CalendarIcon, MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Youtube, ArrowUp } from 'lucide-react'

export default function Home() {
  // Initialize dates as undefined - will be set by the reset effect
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined)
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined)
  
  // Refs for scrolling to sections
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
    pickupTime: '',
    pickupLocation: ''
  })
  const [contactMessage, setContactMessage] = useState('')
  const [subject] = useState('')
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const [visible, setVisible] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [, setBookingDetails] = useState(null)
  const [, setIsBookingConfirmed] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [isAtTop, setIsAtTop] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [isLoading, setIsLoading] = useState(false)
  const [lastName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)

  // Map room IDs to their display names
  const getRoomNameById = (roomId: string) => {
    const roomMap: Record<string, string> = {
      'deluxe': 'Deluxe Room',
      'executive': 'Executive Suite',
      'family': 'Family Room',
      'standard': 'Standard Room',
      'budget': 'Budget Room'
    }
    return roomMap[roomId] || 'Selected Room'
  }

  // Handle URL parameters when component mounts
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const roomId = params.get('roomId')
    if (roomId) {
      setSelectedRoomId(roomId)
      // Scroll to booking section after a short delay to ensure the page is loaded
      const timer = setTimeout(() => {
        document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })
      }, 500)
      return () => clearTimeout(timer)
    }
    return () => {} // Return empty cleanup function when no roomId
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 9)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 9) % 9)
  }


  const handleMouseEnter = () => {
    // Add any hover effects here if needed
  }

  const handleMouseLeave = () => {
    // Add any hover effects here if needed
  }

  // Handle URL parameters for room type selection and scroll to booking section
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const roomTypeParam = params.get('roomType');
    
    if (roomTypeParam) {
      // Map the room type from the URL to the corresponding value in the select
      const roomTypeMap: Record<string, string> = {
        'budget': 'budget',
        'standard': 'standard',
        'deluxe': 'deluxe',
        'executive': 'executive',
        'family': 'family',
        'conference': 'conference'
      };

      const mappedRoomType = roomTypeMap[roomTypeParam.toLowerCase()];
      
      if (mappedRoomType) {
        setRoomType(mappedRoomType);
        
        // Scroll to booking section after a short delay
        setTimeout(() => {
          const bookingSection = document.getElementById('booking');
          if (bookingSection) {
            bookingSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  }, []);

  // Update URL when room type changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const url = new URL(window.location.href);
    if (roomType) {
      url.searchParams.set('roomType', roomType);
    } else {
      url.searchParams.delete('roomType');
    }
    window.history.replaceState({}, '', url.toString());
  }, [roomType]);


  // Auto-slide effect with professional timing
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 9)
    }, 5000) // 5 second intervals like their website

    return () => clearInterval(timer)
  }, [])
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
  const homeRef = useRef<HTMLDivElement>(null)
  const roomsRef = useRef<HTMLDivElement>(null)
  const bookRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const exploreRef = useRef<HTMLDivElement>(null)
  const amenitiesRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const transportRef = useRef<HTMLDivElement>(null)
  const diningRef = useRef<HTMLDivElement>(null)
  const tourRef = useRef<HTMLDivElement>(null)
  
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
    ].filter(Boolean) as HTMLElement[];
    
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
        if (section) observer.observe(section)
      })
    }
  }, [])

  // Scroll to section function with proper type checking
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref?.current) {
      window.scrollTo({
        top: ref.current.offsetTop - 80, // Adjust for fixed header
        behavior: 'smooth'
      })
    }
  }

  // Room rates configuration
  const roomRates = {
    'select': 0,
    'budget': 200,
    'standard': 300,
    'deluxe': 450,
    'executive': 600,
    'family': 500,
    'conference': 1000
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
    
    if (!fullName.trim()) newErrors['fullName'] = 'Full name is required'
    if (!email.trim()) {
      newErrors['email'] = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors['email'] = 'Email is invalid'
    }
    if (!phone.trim()) {
      newErrors['phone'] = 'Phone number is required'
    } else if (!/^[\d\s\-+()]*$/.test(phone)) {
      newErrors['phone'] = 'Phone number is invalid'
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
    
    if (!contactName.trim()) newErrors['contactName'] = 'Name is required'
    if (!contactEmail.trim()) {
      newErrors['contactEmail'] = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(contactEmail)) {
      newErrors['contactEmail'] = 'Email is invalid'
    }
    if (!contactMessage.trim()) newErrors['contactMessage'] = 'Message is required'
    if (!lastName.trim()) newErrors['lastName'] = 'Last name is required'
    if (!subject.trim()) newErrors['subject'] = 'Subject is required'
    
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
  }

  // Professional transition effects matching Rabaul Hotel website
  const getSlideTransition = (index: number) => {
    const transitions = [
      'scale(1.0) translateX(0px)', // Slide 0: Clean entrance
      'scale(1.0) translateX(0px)', // Slide 1: Clean entrance
      'scale(1.0) translateX(0px)', // Slide 2: Clean entrance
      'scale(1.0) translateX(0px)', // Slide 3: Clean entrance
      'scale(1.0) translateX(0px)', // Slide 4: Clean entrance
      'scale(1.0) translateX(0px)', // Slide 5: Clean entrance
      'scale(1.0) translateX(0px)', // Slide 6: Clean entrance
      'scale(1.0) translateX(0px)', // Slide 7: Clean entrance
      'scale(1.0) translateX(0px)'  // Slide 8: Clean entrance
    ];
    return transitions[index] || 'scale(1.0) translateX(0px)';
  };

  const getSlideExitTransition = (index: number) => {
    const exitTransitions = [
      'scale(0.95) translateX(-20px)', // Slide 0: Gentle zoom out with left slide
      'scale(0.95) translateX(20px)',  // Slide 1: Gentle zoom out with right slide
      'scale(0.95) translateX(-15px)', // Slide 2: Gentle zoom out with left slide
      'scale(0.95) translateX(15px)',  // Slide 3: Gentle zoom out with right slide
      'scale(0.95) translateX(-20px)', // Slide 4: Gentle zoom out with left slide
      'scale(0.95) translateX(20px)',  // Slide 5: Gentle zoom out with right slide
      'scale(0.95) translateX(-15px)', // Slide 6: Gentle zoom out with left slide
      'scale(0.95) translateX(15px)',  // Slide 7: Gentle zoom out with right slide
      'scale(0.95) translateX(-20px)'  // Slide 8: Gentle zoom out with left slide
    ];
    return exitTransitions[index] || 'scale(0.95) translateX(-20px)';
  };

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
        className={`sticky top-0 w-full transition-all duration-300 ${
          isAtTop 
            ? 'bg-transparent md:bg-transparent' 
            : 'bg-gray-800/80 md:bg-gray-900/60 backdrop-blur-sm shadow-md'
        } ${
          visible ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{ zIndex: 1000, position: 'fixed', width: '100%' }}
      >
        <div className="w-full flex h-20 items-center justify-between px-4 md:px-8">
          {/* Mobile hamburger button - Left side */}
          <Button 
            variant="ghost"
            className="md:hidden text-white hover:bg-white/10 rounded-full p-3 transition-colors w-14 h-14 flex items-center justify-center focus:outline-none focus:ring-0 focus-visible:ring-0 focus:ring-offset-0 focus-visible:ring-offset-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="!w-7 !h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="!w-7 !h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" x2="20" y1="12" y2="12"></line>
                <line x1="4" x2="20" y1="6" y2="6"></line>
                <line x1="4" x2="20" y1="18" y2="18"></line>
              </svg>
            )}
          </Button>

          {/* Logo - Left side (moved towards center) */}
          <div className="flex items-center md:pl-24">
            <button onClick={() => scrollToSection(homeRef)} className="focus:outline-none">
              <div className="relative h-20 w-52 md:h-28 md:w-72">
                <Image 
                  src={logoImage}
                  alt="Rabaul Hotel Logo"
                  fill
                  sizes="(max-width: 768px) 208px, 288px"
                  className="object-contain hover:opacity-90 transition-opacity"
                  priority
                  quality={100}
                />
              </div>
            </button>
          </div>

          {/* Center - Navigation Buttons (Desktop only) */}
          <div className="hidden md:flex items-center space-x-2 absolute left-1/2 transform -translate-x-1/2">
            {/* Home */}
            <Button 
              variant="ghost"
              onClick={() => scrollToSection(homeRef)}
              className="text-white hover:bg-gray-100/20 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-0 focus:ring-offset-0 active:scale-95 text-base px-6 py-2.5 border border-gray-300/30 rounded-md text-center cursor-pointer w-32 h-10"
            >
              Home
            </Button>
            
            {/* About Us */}
            <Button 
              variant="ghost"
              onClick={() => scrollToSection(aboutRef)}
              className="text-white hover:bg-gray-100/20 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-0 focus:ring-offset-0 active:scale-95 text-base px-6 py-2.5 border border-gray-300/30 rounded-md text-center cursor-pointer w-32 h-10"
            >
              About
            </Button>
            
            {/* Services */}
            <div className="relative group">
              <Button 
                variant="ghost"
                className="text-white hover:bg-gray-100/20 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-0 focus:ring-offset-0 active:scale-95 text-base px-6 py-2.5 border border-gray-300/30 rounded-md text-center flex items-center justify-center cursor-pointer w-32 h-10"
              >
                Services
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>
              <div className="absolute left-0 mt-1 w-40 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
                <Link 
                  href="/dining"
                  className="block w-full text-left px-3 py-2 hover:bg-gray-100/80 transition-colors cursor-pointer text-gray-800 text-sm"
                >
                  Dining
                </Link>
                <button 
                  onClick={() => {
                    scrollToSection(exploreRef);
                    setActiveSection('explore');
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100/80 transition-colors cursor-pointer text-gray-800 text-sm"
                >
                  Tours
                </button>
                <button 
                  onClick={() => {
                    scrollToSection(roomsRef);
                    setActiveSection('rooms');
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100/80 transition-colors cursor-pointer text-gray-800 text-sm"
                >
                  Accommodation
                </button>
              </div>
            </div>
            
            {/* Reservations */}
            <Button 
              variant="ghost"
              onClick={() => scrollToSection(bookRef)}
              className={`text-white hover:bg-gray-100/20 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-0 focus:ring-offset-0 active:scale-95 text-base px-6 py-2.5 border border-gray-300/30 rounded-md text-center cursor-pointer w-32 h-10 ${
                activeSection === 'booking' ? 'bg-white/20' : ''
              }`}
            >
              Reservations
            </Button>

            {/* Gallery */}
            <Link href="/gallery" passHref>
              <Button 
                variant="ghost"
                className="text-white hover:bg-gray-100/20 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-0 focus:ring-offset-0 active:scale-95 text-base px-6 py-2.5 border border-gray-300/30 rounded-md text-center cursor-pointer w-32 h-10"
              >
                Gallery
              </Button>
            </Link>
            
            {/* Contact Us */}
            <Button 
              variant="ghost"
              onClick={() => scrollToSection(contactRef)}
              className={`text-white hover:bg-gray-100/20 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-0 focus:ring-offset-0 active:scale-95 text-base px-6 py-2.5 border border-gray-300/30 rounded-md text-center cursor-pointer w-32 h-10 ${
                activeSection === 'contact' ? 'bg-white/20' : ''
              }`}
            >
              Contact Us
            </Button>
          </div>
          
          {/* Right side - Contact Info (Desktop only) */}
          <div className="hidden md:flex items-center space-x-6 flex-shrink-0 mr-4">
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="w-4 h-4 text-white" />
              <span className='text-yellow-400'>reservations@rabaulhotel.com.pg</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="w-4 h-4 text-white" />
              <span className='text-yellow-400'>+675 7189 3571</span>
            </div>
          </div>
          
          {/* Spacer for mobile layout */}
          <div className="md:hidden w-10"></div>
          
          {/* Mobile Menu */}
          <div 
            className={`fixed left-0 top-20 z-[1002] flex flex-col justify-start overflow-y-auto transition-all duration-300 ease-in-out transform ${
              mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            } md:hidden`}
          >
            <div className="flex flex-col space-y-1 w-48 bg-black/80 backdrop-blur-sm py-3 px-3 text-sm rounded-r-lg">
              {/* Home */}
              <button 
                onClick={() => {
                  scrollToSection(homeRef)
                  setMobileMenuOpen(false)
                }}
                className={`px-3 py-2 w-full text-left text-white hover:bg-gray-100/20 transition-colors border border-gray-300/30 rounded-md mx-1 my-0.5 text-sm ${
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
                className="px-3 py-2 w-full text-left text-white hover:bg-gray-100/20 transition-colors border border-gray-300/30 rounded-md mx-1 my-0.5 text-sm"
              >
                About Us
              </button>
              
              {/* Services Dropdown */}
              <div className="border border-gray-300/30 rounded-md mx-1 my-0.5 overflow-hidden">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const content = e.currentTarget.nextElementSibling as HTMLElement;
                    content.style.display = content.style.display === 'none' ? 'block' : 'none';
                  }}
                  className={`px-3 py-2 w-full text-left text-white hover:bg-gray-100/20 transition-colors flex justify-between items-center text-sm ${
                    ['dining', 'explore', 'rooms'].includes(activeSection) ? 'bg-white/20 font-medium' : ''
                  }`}
                >
                  <span>Services</span>
                  <svg className="w-3 h-3 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="pl-2 hidden">
                  <Link 
                    href="/dining"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-1.5 w-full text-left text-white hover:bg-gray-100/20 transition-colors text-sm"
                  >
                    Dining
                  </Link>
                  <button 
                    onClick={() => {
                      scrollToSection(exploreRef)
                      setActiveSection('explore')
                      setMobileMenuOpen(false)
                    }}
                    className="px-3 py-1.5 w-full text-left text-white hover:bg-gray-100/20 transition-colors text-sm"
                  >
                    Tours
                  </button>
                  <button 
                    onClick={() => {
                      scrollToSection(roomsRef)
                      setActiveSection('rooms')
                      setMobileMenuOpen(false)
                    }}
                    className="px-3 py-1.5 w-full text-left text-white hover:bg-gray-100/20 transition-colors text-sm"
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
                className={`px-3 py-2 w-full text-left text-white hover:bg-gray-100/20 transition-colors border border-gray-300/30 rounded-md mx-1 my-0.5 text-sm ${
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
                className={`px-3 py-2 w-full text-left text-white hover:bg-gray-100/20 transition-colors border border-gray-300/30 rounded-md mx-1 my-0.5 text-sm ${
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
        className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
        style={{ 
          position: 'relative', 
          zIndex: 10, 
          marginTop: '0',
          paddingTop: '6rem'
        }}
      >
        {/* Background Image using Next.js Image for better reliability */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/home-bg.png"
            alt="Hotel Background"
            fill
            className="object-cover opacity-100"
            priority
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
        </div>
        <div className="container mx-auto px-4 py-2 relative z-10 flex flex-col items-center">
          {/* Slider Container */}
          <div className="w-full max-w-[1800px]">
            {/* Image Slider */}
            <div className="w-full h-[50vh] lg:h-[40vh] relative rounded-lg shadow-2xl overflow-hidden">
              <div className="w-full h-full relative">
                {[
                  { src: '/images/wow-sliders/North-Wing.jpg', caption: 'North Wing Accommodation' },
                  { src: '/images/wow-sliders/a004fromrvomay07.jpg', caption: 'Scenic Rabaul Views' },
                  { src: '/images/wow-sliders/a057tubuans.jpg', caption: 'Traditional Tubuan Culture' },
                  { src: '/images/wow-sliders/dukeof_yorks.jpg', caption: 'Duke of York Islands' },
                  { src: '/images/wow-sliders/img2014111901091b.jpg', caption: 'Historic Rabaul Heritage' },
                  { src: '/images/wow-sliders/rabaul_market.jpg', caption: 'Vibrant Local Market' },
                  { src: '/images/wow-sliders/rabaul_vulcan.jpg', caption: 'Majestic Vulcan Volcano' },
                  { src: '/images/wow-sliders/rabaultavurvur3364.jpg', caption: 'Tavurvur Volcanic Activity' },
                  { src: '/images/wow-sliders/simpsonharbour2012.jpg', caption: 'Beautiful Simpson Harbour' }
                ].map((slide, index) => (
                  <div
                    key={index}
                    className="absolute inset-0 w-full h-full"
                    style={{
                      opacity: index === currentSlide ? 1 : 0,
                      transform: index === currentSlide ? getSlideTransition(index) : getSlideExitTransition(index),
                      transition: 'all 2s ease-in-out',
                      zIndex: index === currentSlide ? 10 : 1
                    }}
                  >
                    <Image
                      src={slide.src}
                      alt={`Rabaul Hotel - ${slide.caption}`}
                      fill
                      sizes="(max-width: 1536px) 100vw, 1536px"
                      className="object-cover brightness-110 contrast-110"
                      priority={index === 0}
                      quality={100}
                    />
                    <div className="absolute inset-0 bg-black/10" />
                    
                    {/* Caption Overlay */}
                    <div className="absolute bottom-4 left-4 z-20">
                      <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2">
                        <h3 style={{ color: '#CCCCCC !important' }} className="font-bold text-lg mb-1">Rabaul Hotel</h3>
                        <p className="text-white/90 text-sm">{slide.caption}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition-all duration-300 opacity-80 hover:opacity-100 shadow-lg backdrop-blur-sm"
                  aria-label="Previous slide"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition-all duration-300 opacity-80 hover:opacity-100 shadow-lg backdrop-blur-sm"
                  aria-label="Next slide"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

          </div>

          {/* Horizontal Booking Form - Hidden on mobile! */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:block w-full max-w-[1800px] mt-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 md:p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              {/* Check-in */}
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700">Check-in</Label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a5f2c] focus:border-transparent text-gray-900 bg-white"
                    value={checkIn ? format(checkIn, 'yyyy-MM-dd') : ''}
                    onChange={(e) => setCheckIn(new Date(e.target.value))}
                    min={format(new Date(), 'yyyy-MM-dd')}
                  />
                </div>
              </div>
              
              {/* Check-out */}
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700">Check-out</Label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a5f2c] focus:border-transparent text-gray-900 bg-white"
                    value={checkOut ? format(checkOut, 'yyyy-MM-dd') : ''}
                    onChange={(e) => setCheckOut(new Date(e.target.value))}
                    min={checkIn ? format(new Date(checkIn.getTime() + 86400000), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')}
                  />
                </div>
              </div>
              
              {/* Guests */}
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700">Guests</Label>
                <select
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a5f2c] focus:border-transparent text-gray-900 bg-white"
                  value={adults}
                  onChange={(e) => setAdults(parseInt(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Adult' : 'Adults'}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Room Type */}
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700">Room Type</Label>
                <select
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a5f2c] focus:border-transparent text-gray-900 bg-white"
                  value={roomType || ''}
                  onChange={(e) => setRoomType(e.target.value || undefined)}
                >
                  <option value="">All Room Types</option>
                  <option value="budget">Budget Room</option>
                  <option value="standard">Standard Room</option>
                  <option value="deluxe">Deluxe Room</option>
                  <option value="executive">Executive Room</option>
                  <option value="family">Family Suite</option>
                </select>
              </div>
              
              {/* Check Availability Button */}
              <Button
                onClick={() => scrollToSection(bookRef)}
                className="bg-[#1a5f2c] hover:bg-[#144a22] text-white py-2 h-10 text-sm md:text-base font-medium rounded-md transition-colors duration-200"
              >
                Check Availability
              </Button>
            </div>
          </motion.div>

      {/* Bottom content section */}
      <div className="relative z-10 w-full bg-gradient-to-t from-black/60 to-transparent mt-6">
        <div className="container max-w-7xl mx-auto px-4 py-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full text-center"
          >
            {/* Mobile Book Now Button - Only visible on mobile */}
            <div className="md:hidden">
              <Button
                size="lg"
                className="bg-[#1a5f2c] hover:bg-[#144a22] text-white font-semibold px-8 py-4 text-lg rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-[#1a5f2c]"
                onClick={() => scrollToSection(bookRef)}
              >
                Book Your Stay With Us
              </Button>
            </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
      {/* About Us Section */}
      <section ref={aboutRef} className="py-8 md:py-12 bg-green-950 text-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Text Content - First on mobile, left on desktop */}
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">About Rabaul Hotel</h2>
              <div className="w-20 h-1 bg-yellow-400 mb-6"></div>
              <p className="text-base md:text-lg leading-relaxed mb-6">
                The iconic Rabaul Hotel has been hosting visitors since 1952. Previously the &quot;Ascot&quot; &amp; then the &quot;Hamamas&quot; Hotel, the Rabaul Hotel is famous for its genuine &apos;home away from home&apos; style of hospitality.
              </p>
              <p className="text-base md:text-lg leading-relaxed mb-6">
                Boasting visitors such as Prime Ministers, Sporting Stars and even HRH Prince Andrew Duke of York, the Rabaul Hotel takes great pride in ensuring our Guests have an enjoyable and comfortable stay while discovering the SPIRIT of Volcano Town.
              </p>
              <a 
                href="/images/RABAUL_MAP.jpg" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-yellow-400 hover:text-yellow-300 font-medium transition-colors mt-4"
              >
                See Map of Rabaul
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                </svg>
              </a>
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
      <RoomsSection />

      {/* Book Your Stay Section */}
      <section 
        id="book" 
        ref={bookRef}
        className="py-16 md:py-20 scroll-mt-16 relative w-full flex justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("/images/booking-background.PNG")',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="container max-w-7xl px-4 relative">
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
                            disabled={(date: Date) => isBefore(date, new Date()) && !isToday(date)}
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
                            disabled={(date: Date) => !checkIn || isBefore(date, checkIn) || isEqual(date, checkIn)}
                            className="rounded-md border"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <Label htmlFor="room-type" className="font-medium text-white">Room Type</Label>
                      <Select 
                        onValueChange={setRoomType} 
                        value={selectedRoomId || roomType}
                        disabled={!!selectedRoomId}
                      >
                        <SelectTrigger className="h-12 bg-white/10 border-white/30 text-white">
                          <SelectValue placeholder={selectedRoomId ? "Pre-selected Room" : "Select a room type"} />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {selectedRoomId ? (
                            <SelectItem value={selectedRoomId}>
                              {getRoomNameById(selectedRoomId) || 'Selected Room'}
                            </SelectItem>
                          ) : (
                            <>
                              <SelectItem value="deluxe">Deluxe Room</SelectItem>
                              <SelectItem value="executive">Executive Suite</SelectItem>
                              <SelectItem value="family">Family Room</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                      {selectedRoomId && (
                        <p className="text-xs text-white/70 mt-1">
                          Room pre-selected from room page
                        </p>
                      )}
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
                      {errors['fullName'] && (
                        <p className="text-xs text-red-500 mt-1">{errors['fullName']}</p>
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
                      {errors['email'] && (
                        <p className="text-xs text-red-500 mt-1">{errors['email']}</p>
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
                      {errors['phone'] && (
                        <p className="text-xs text-red-500 mt-1">{errors['phone']}</p>
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
                                checked={!transportServices.needsTransport}
                                onChange={() => setTransportServices(prev => ({ ...prev, needsTransport: false, pickupLocation: '', pickupTime: '' }))}
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
                                onChange={() => setTransportServices(prev => ({ ...prev, needsTransport: true }))}
                                className="h-4 w-4 border-gray-300 text-[#1a5f2c] focus:ring-[#1a5f2c]"
                              />
                              <Label htmlFor="needs-transport" className="text-sm font-normal text-white">I need transport services</Label>
                            </div>
                          </div>
                          
                          {transportServices.needsTransport && (
                            <div className="ml-6 space-y-3 border-l-2 border-white/20 pl-4 mt-2">
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-1 sm:space-y-2">
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
                                  </div>
                                  <div className="space-y-1 sm:space-y-2">
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
                            <span className="pl-2">• Airport Transfer</span>
                            <span>K 100</span>
                          </div>
                        </div>
                      )}

                      <div className="space-y-1 sm:space-y-2">
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
                        <div className="pl-2">• Airport Transfer</div>
                        {transportServices.pickupLocation && (
                          <div className="pl-4 text-white/80">Pickup: {transportServices.pickupLocation}</div>
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
                    {process.env.NODE_ENV === 'production' && process.env['NEXT_PUBLIC_RECAPTCHA_SITE_KEY'] ? (
                      <div className="flex justify-center">
                        <ReCAPTCHA
                          sitekey={process.env['NEXT_PUBLIC_RECAPTCHA_SITE_KEY']}
                          onChange={(token: string | null) => setRecaptchaToken(token)}
                          onExpired={() => setRecaptchaToken(null)}
                          onErrored={() => setRecaptchaToken(null)}
                          theme="dark"
                          className="recaptcha-container"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow">
                        <div className="flex items-center space-x-3">
                          <input 
                            type="checkbox" 
                            className="form-checkbox h-5 w-5 text-[#1a5f2c] rounded-sm border-2 border-gray-300 focus:ring-[#1a5f2c]"
                            checked={!!recaptchaToken}
                            onChange={(e) => setRecaptchaToken(e.target.checked ? 'dev-mode-token' : null)}
                          />
                          <span className="text-gray-700 font-medium">I'm not a robot</span>
                        </div>
                      </div>
                    )}
                    {errors['recaptcha'] && (
                      <p className="mt-2 text-sm text-red-400 text-center">{errors['recaptcha']}</p>
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
      <AmenitiesSection />

      {/* Contact Us Section */}
      <section 
        id="contact" 
        ref={contactRef}
        className="py-8 bg-gradient-to-br from-green-50 to-blue-50 scroll-mt-12 relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-1/4 h-1/4 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="container max-w-6xl px-4 mx-auto relative z-10">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold text-gray-900">Contact Us</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                  <div className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">Our Location</h4>
                      <p className="text-gray-600">Mango Avenue</p>
                      <p className="text-gray-600">P.O Box 1</p>
                      <p className="text-gray-600">Rabaul, East New Britain Province</p>
                      <p className="text-gray-600">Papua New Guinea</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">Phone Number</h4>
                      <div className="space-y-1">
                        <a href="tel:+67571893571" className="block text-gray-600 hover:text-blue-600 transition-colors">
                          +675 7189 3571
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">Email Address</h4>
                      <a href="mailto:reservations@rabaulhotel.com.pg" className="text-blue-600 hover:underline">
                        reservations@rabaulhotel.com.pg
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">Working Hours</h4>
                      <p className="text-gray-600">24/7 Front Desk Service</p>
                      <p className="text-sm text-gray-500">Check-in: 2:00 PM | Check-out: 11:00 AM</p>
                    </div>
                  </div>
                </div>
                
                {/* Social Media Links */}
                <div className="mt-6">
                  <h4 className="text-base font-semibold text-gray-900 mb-3">Follow Us</h4>
                  <div className="flex space-x-3">
                    {[
                      { icon: Facebook, color: 'bg-blue-500 hover:bg-blue-600', label: 'Facebook' },
                      { icon: Instagram, color: 'bg-pink-500 hover:bg-pink-600', label: 'Instagram' },
                      { icon: Twitter, color: 'bg-sky-400 hover:bg-sky-500', label: 'Twitter' },
                      { icon: Youtube, color: 'bg-red-500 hover:bg-red-600', label: 'YouTube' }
                    ].map((social, index) => (
                      <a 
                        key={index}
                        href="#" 
                        className={`w-9 h-9 rounded-full ${social.color} text-white flex items-center justify-center transition-colors duration-300 transform hover:-translate-y-1`}
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
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-fit">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Send us a Message</h3>
              <p className="text-gray-600 mb-6 text-sm">We&apos;ll get back to you within 24 hours</p>
              <form onSubmit={handleContactSubmit} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="fullName" className="text-gray-700">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      className="w-full"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                    {errors['fullName'] && (
                      <p className="text-xs text-red-500 mt-1">{errors['fullName']}</p>
                    )}
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="email" className="text-gray-700">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full ${errors['email'] ? 'border-red-500' : ''}`}
                    />
                    {errors['email'] && (
                      <p className="text-xs text-red-500 mt-1">{errors['email']}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full ${errors['phone'] ? 'border-red-500' : ''}`}
                  />
                  {errors['phone'] && (
                    <p className="text-xs text-red-500 mt-1">{errors['phone']}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="message" className="text-gray-700 text-sm">Message</Label>
                  <Textarea
                    id="message"
                    className="min-h-[80px] text-sm"
                    placeholder="Type your message here..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                  />
                  {errors['contactMessage'] && (
                    <p className="text-xs text-red-500 mt-1">{errors['contactMessage']}</p>
                  )}
                </div>
                <div className="mt-3">
                  <style jsx global>{`
                    .contact-recaptcha > div {
                      width: 100% !important;
                      transform: scale(0.85);
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
                      sitekey={process.env['NEXT_PUBLIC_RECAPTCHA_SITE_KEY'] || 'your-site-key'}
                      onChange={(token: string | null) => setRecaptchaToken(token)}
                      onExpired={() => setRecaptchaToken(null)}
                      onErrored={() => setRecaptchaToken(null)}
                      theme="light"
                      className="contact-recaptcha"
                    />
                  </div>
                  {errors['recaptcha'] && (
                    <p className="mt-2 text-sm text-red-500 text-center">{errors['recaptcha']}</p>
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
      <ExploreSection />

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
