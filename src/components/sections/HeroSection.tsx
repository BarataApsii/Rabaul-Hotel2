'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Rabaul Hotel"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <h1 className="mb-6 text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
            Experience Luxury in the Heart of Rabaul
          </h1>
          <p className="mb-8 text-lg sm:text-xl md:mb-12 md:text-2xl">
            Discover the perfect blend of comfort, elegance, and exceptional service at Rabaul's premier destination.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="lg" 
              className="group bg-white text-primary hover:bg-primary hover:text-white"
              onClick={() => {
                document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Book Now
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
          }}
          className="flex flex-col items-center justify-center"
        >
          <span className="mb-2 text-sm text-white/80">Scroll to explore</span>
          <div className="h-6 w-4 rounded-full border-2 border-white/50 p-1">
            <motion.div
              className="h-2 w-1 rounded-full bg-white"
              animate={{
                y: [0, 6],
                opacity: [0.6, 0.2],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
