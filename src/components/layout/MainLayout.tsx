'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Footer from '../shared/Footer';

const logoImage = '/images/logo.png';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const pathname = usePathname();

  // Handle scroll events for navbar visibility and position
  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header 
        className={`sticky top-0 w-full transition-all duration-300 ${
          isAtTop 
            ? 'bg-transparent md:bg-transparent' 
            : 'bg-gray-800/80 md:bg-gray-900/60 backdrop-blur-sm shadow-md'
        }`}
        style={{ zIndex: 1000 }}
      >
        <div className="w-full flex h-20 items-center justify-between px-4 md:px-8">
          {/* Mobile hamburger button */}
          <Button 
            variant="ghost"
            className="md:hidden text-white hover:bg-white/10 rounded-full p-3 transition-colors w-14 h-14 flex items-center justify-center"
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

          {/* Logo */}
          <div className="flex items-center md:pl-24">
            <Link href="/" className="focus:outline-none">
              <div className="relative h-20 w-52 md:h-28 md:w-72">
                <Image 
                  src={logoImage}
                  alt="Rabaul Hotel Logo"
                  fill
                  sizes="(max-width: 768px) 208px, 288px"
                  className="object-contain hover:opacity-90 transition-opacity"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link href="/" passHref>
              <Button 
                variant="ghost"
                className={`text-white hover:bg-gray-100/20 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-0 focus:ring-offset-0 active:scale-95 text-base px-6 py-2.5 border border-gray-300/30 rounded-md text-center cursor-pointer w-32 h-10 ${
                  pathname === '/' ? 'bg-white/20' : ''
                }`}
              >
                Home
              </Button>
            </Link>
            
            <Link href="/#about" passHref>
              <Button 
                variant="ghost"
                className="text-white hover:bg-gray-100/20 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-0 focus:ring-offset-0 active:scale-95 text-base px-6 py-2.5 border border-gray-300/30 rounded-md text-center cursor-pointer w-32 h-10"
              >
                About
              </Button>
            </Link>
            
            <Link href="/#services" passHref>
              <Button 
                variant="ghost"
                className="text-white hover:bg-gray-100/20 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-0 focus:ring-offset-0 active:scale-95 text-base px-6 py-2.5 border border-gray-300/30 rounded-md text-center cursor-pointer w-32 h-10"
              >
                Services
              </Button>
            </Link>
            
            <Link href="/gallery" passHref>
              <Button 
                variant="ghost"
                className={`text-white hover:bg-gray-100/20 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-0 focus:ring-offset-0 active:scale-95 text-base px-6 py-2.5 border border-gray-300/30 rounded-md text-center cursor-pointer w-32 h-10 ${
                  pathname === '/gallery' ? 'bg-white/20' : ''
                }`}
              >
                Gallery
              </Button>
            </Link>
            
            <Link href="/#booking" passHref>
              <Button 
                variant="ghost"
                className="text-white hover:bg-gray-100/20 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-0 focus:ring-offset-0 active:scale-95 text-base px-6 py-2.5 border border-gray-300/30 rounded-md text-center cursor-pointer w-32 h-10"
              >
                Book Now
              </Button>
            </Link>
          </nav>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-gray-900/95 backdrop-blur-sm z-50 py-4 px-6 shadow-lg">
            <div className="flex flex-col space-y-3">
              <Link href="/" className="text-white hover:bg-white/10 px-4 py-2 rounded-md transition-colors">
                Home
              </Link>
              <Link href="/#about" className="text-white hover:bg-white/10 px-4 py-2 rounded-md transition-colors">
                About
              </Link>
              <Link href="/#services" className="text-white hover:bg-white/10 px-4 py-2 rounded-md transition-colors">
                Services
              </Link>
              <Link href="/gallery" className="text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-md transition-colors">
                Gallery
              </Link>
              <Link href="/#booking" className="text-white hover:bg-white/10 px-4 py-2 rounded-md transition-colors">
                Book Now
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
