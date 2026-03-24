'use client';

import FloatingNavbar from '@/components/layout/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesGrid from '@/components/landing/FeaturesGrid';
import HowItWorks from '@/components/landing/HowItWorks';
import LanguageShowcase from '@/components/landing/LanguageShowcase';
import Testimonials from '@/components/landing/Testimonials';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <FloatingNavbar />
      <HeroSection />
      <FeaturesGrid />
      <HowItWorks />
      <LanguageShowcase />
      <Testimonials />
      <Footer />
    </div>
  );
}
