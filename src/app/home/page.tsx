'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamically import components with loading states
const HeroSection = dynamic(
  () => import('@/components/sections').then(mod => mod.HeroSection),
  { loading: () => <Skeleton className="h-screen w-full" />, ssr: true }
);

const BookingForm = dynamic(
  () => import('@/components/booking').then(mod => mod.BookingForm),
  { loading: () => <Skeleton className="h-[600px] w-full" />, ssr: false }
);

const ExploreSection = dynamic(
  () => import('@/components/sections').then(mod => mod.ExploreSection),
  { loading: () => <Skeleton className="h-[800px] w-full" />, ssr: true }
);

const RoomsSection = dynamic(
  () => import('@/components/sections').then(mod => mod.RoomsSection),
  { loading: () => <Skeleton className="h-[1000px] w-full" />, ssr: true }
);

const AmenitiesSection = dynamic(
  () => import('@/components/sections').then(mod => mod.AmenitiesSection),
  { loading: () => <Skeleton className="h-[800px] w-full" />, ssr: true }
);

export default function Home() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<Skeleton className="h-screen w-full" />}>
        <HeroSection />
      </Suspense>
      
      <section className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
          <BookingForm />
        </Suspense>
      </section>

      <Suspense fallback={<Skeleton className="h-[800px] w-full" />}>
        <ExploreSection />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-[1000px] w-full" />}>
        <RoomsSection />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-[800px] w-full" />}>
        <AmenitiesSection />
      </Suspense>
    </main>
  );
}
