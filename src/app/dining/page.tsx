'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DiningPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Navigation Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <Link href="/" className="inline-flex items-center text-gray-700 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 w-full overflow-hidden mt-4">
        <Image
          src="/images/amenities/phoenix.jpeg"
          alt="The Phoenix Restaurant at Rabaul Hotel"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">The Phoenix Restaurant</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">Boasting one of the best International Menus in Papua New Guinea</p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 md:p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="prose max-w-none"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-6 text-gray-700">
                <p>
                  After Rabaul Hotel suffered a devastating fire in 1984 the McGrade family aptly re-named the restaurant, &ldquo;The Phoenix Room&rdquo; never suspecting the Restaurant would once again be devastated by ash!
                </p>
                <p>
                  On the 9th September 1994, the overwhelming ash fallout from the twin volcanic eruptions caused mass destruction to Rabaul Town. Rabaul Hotel chose not to close their doors but once again rose from the ashes like the Phoenix!
                </p>

                <div className="my-8">
                  <div className="relative h-80 md:h-96 w-full rounded-lg overflow-hidden">
                    <Image
                      src="/images/bar.PNG"
                      alt="The Phoenix Restaurant Interior"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2 text-center">The elegant interior of The Phoenix Restaurant</p>
                </div>

                <h3 className="text-2xl font-semibold text-gray-900 mt-8">A Unique Dining Experience</h3>
                <p>
                  The Restaurant interior is a collection of pieces from Taiwan, Hong Kong, China and Papua New Guinea. Pieces collected over the years from family travels. The cathedral like ceiling features the largest &ldquo;Tabu&rdquo; wheel in Papua New Guinea. This is traditional shell money and is still used as currency in the islands region today. It is a museum piece.
                </p>

                <div className="grid md:grid-cols-2 gap-8 my-8">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">WWII Bunker</h4>
                    <p>
                      Directly under the Phoenix Restaurant we have our own Japanese WWII Bunker discovered during the excavation of the Hotel Swimming Pool and was used for many years as our personal wine cellar. Now it is open to the public.
                    </p>
                  </div>
                  <div className="relative h-64 rounded-lg overflow-hidden">
                    <Image
                      src="/images/Hotel-Japanese-Bunker.jpg"
                      alt="Japanese WWII Bunker"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>

                <h3 className="text-2xl font-semibold text-gray-900 mt-8">Our Cuisine</h3>
                <p>
                  The Restaurant features popular Western & Asian dishes reflective of our social and cultural history and aimed to suit all tastes.
                </p>
                <p>
                  We take great pride in endeavouring to offer the freshest possible produce by purchasing daily from the Rabaul Market and all our menu items are made on the premises.
                </p>

                <div className="bg-amber-50 p-6 rounded-lg my-8 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Special Dietary Requirements</h4>
                  <p className="text-gray-700">
                    We endeavour to cater for vegans, vegetarians and gluten free patrons. Please inform our staff of any dietary requirements when making your reservation.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg my-8 text-center">
                  <p className="text-gray-700 italic">
                    &ldquo;Our most famous dining patron was HRH Prince Andrew who devoured the Chocolate Profiteroles!&rdquo;
                  </p>
                </div>

                <div className="text-center mt-12">
                  <p className="text-2xl font-semibold text-gray-900 mb-2">Bon Appétit</p>
                  <p className="text-gray-600">Please sign our Guest Book and share your experience with us!</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Make a Reservation</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience the finest dining in Rabaul. Reserve your table today for an unforgettable culinary journey.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="tel:+67571893571" 
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <span>Call to Reserve</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </a>
            <a 
              href="mailto:reservations@rabaulhotel.com.pg" 
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <span>Email Us</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
