'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, MessageCircle, ArrowRight, Sparkles, Globe, BookOpen, Shield, Briefcase } from 'lucide-react';

const heroImages = [
  '/hero/1.jpg',
  '/hero/2.jpg',
  '/hero/3.jpg',
  '/hero/4.jpg',
  '/hero/5.jpg',
  '/hero/6.jpg',
  '/hero/7.png',
  '/hero/8.png',
  '/hero/9.png',
];

const rotatingWords = [
  'Scholarships',
  'Legal Rights',
  'Career Guidance',
  'Startup Schemes',
  'MSME Benefits',
  'Exam Preparation',
  'Tech Roadmaps',
  'Patent Filing',
];

const stats = [
  { icon: <Globe size={16} />, label: '8 Languages' },
  { icon: <BookOpen size={16} />, label: '9+ Domains' },
  { icon: <Shield size={16} />, label: 'AI Verified' },
  { icon: <Briefcase size={16} />, label: '100% Free' },
];

export default function HeroSection() {
  const [currentImage, setCurrentImage] = useState(0);
  const [currentWord, setCurrentWord] = useState(0);

  // Auto-rotate images every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Auto-rotate words every 2.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[100vh] overflow-hidden">
      {/* ─── BACKGROUND IMAGE SLIDESHOW ─── */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: currentImage === i ? 1 : 0 }}
          >
            <Image
              src={src}
              alt={`Hero slide ${i + 1}`}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="100vw"
            />
          </div>
        ))}

        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a]/85 via-[#0a0a1a]/75 to-[#0a0a1a]/95 z-10" />

        {/* Bottom fade into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a1a] to-transparent z-10" />
      </div>

      {/* ─── DECORATIVE GRADIENT ORBS ─── */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/15 rounded-full blur-[120px] z-10" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-400/15 rounded-full blur-[120px] z-10" />

      {/* ─── IMAGE INDICATOR DOTS ─── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentImage(i)}
            className={`h-2 rounded-full transition-all duration-500 ${
              currentImage === i
                ? 'w-8 bg-cyan-400'
                : 'w-2 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* ─── HERO CONTENT ─── */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-cyan-400 text-sm mb-6 backdrop-blur-sm"
          >
            <Sparkles size={14} className="animate-pulse" />
            Powered by Groq LLaMA 3.3 70B
          </motion.div>

          {/* ─── ROTATING HEADLINE ─── */}
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            style={{
              textShadow:
                '0 4px 20px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.5), 0 0 40px rgba(6,182,212,0.15)',
            }}
          >
            Your AI Gateway to{' '}
            <span className="relative inline-block">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentWord}
                  initial={{ opacity: 0, y: 30, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -30, rotateX: 90 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="inline-block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent"
                  style={{
                    textShadow: 'none',
                    filter:
                      'drop-shadow(0 4px 12px rgba(6,182,212,0.4)) drop-shadow(0 2px 4px rgba(59,130,246,0.2))',
                  }}
                >
                  {rotatingWords[currentWord]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
          >
            Navigate scholarships, legal rights, career paths, startup schemes, and more —
            all through one intelligent AI assistant that speaks 8 languages.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/gov-prompt">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3.5 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-medium text-base hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2"
              >
                <Zap size={18} />
                Start Chatting
                <ArrowRight size={18} />
              </motion.div>
            </Link>

            <Link href="/government-bots">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3.5 border border-white/20 text-white rounded-xl font-medium text-base hover:bg-white/10 backdrop-blur-sm transition-all flex items-center gap-2"
              >
                <MessageCircle size={18} />
                Explore All Bots
              </motion.div>
            </Link>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-6 md:gap-10"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-2 text-gray-300 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
              >
                <div className="text-cyan-400">{stat.icon}</div>
                <span className="text-sm font-medium">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
