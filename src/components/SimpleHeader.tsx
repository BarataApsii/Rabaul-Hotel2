'use client'

import Link from 'next/link';

export default function SimpleHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-green-900">
          Rabaul Hotel
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-700 hover:text-green-700 transition-colors">
            Home
          </Link>
          <Link href="/#rooms" className="text-gray-700 hover:text-green-700 transition-colors">
            Rooms
          </Link>
        </nav>
      </div>
    </header>
  );
}
