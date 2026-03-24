'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, Landmark, LogIn, Zap } from 'lucide-react';
import { getCurrentUser, logoutUser, User } from '@/lib/user-storage';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Quick Chat', href: '/gov-prompt' },
  { label: 'All Bots', href: '/government-bots' },
];

export default function FloatingNavbar() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useEffect(() => {
    setUser(getCurrentUser());
  }, [pathname]);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 20);
    if (latest > 80 && latest > prev) {
      setHidden(true);
    } else if (prev - latest > 5) {
      setHidden(false);
    }
  });

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setMobileOpen(false);
  };

  return (
    <>
      <motion.nav
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 pt-3 px-4`}
      >
        <div
          className={`max-w-5xl mx-auto rounded-2xl px-5 py-3 flex items-center justify-between transition-all duration-300 ${
            scrolled
              ? 'bg-gray-900/80 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/20'
              : 'bg-white/5 backdrop-blur-xl border border-white/5'
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
              <Landmark size={16} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg">
              Gov<span className="text-cyan-400">Prompt</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all no-underline ${
                    isActive
                      ? 'text-white bg-white/10 border border-white/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">
                  Hi, <span className="text-white font-medium">{user.name.split(' ')[0]}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 text-white text-sm font-medium hover:bg-white/10 transition-all no-underline"
                >
                  <LogIn size={15} />
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all no-underline"
                >
                  <Zap size={15} />
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white p-1"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        <motion.div
          initial={false}
          animate={mobileOpen ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
          className="md:hidden max-w-5xl mx-auto mt-2 rounded-2xl bg-gray-900/95 backdrop-blur-xl border border-white/10 overflow-hidden"
        >
          <div className="p-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all no-underline ${
                  pathname === link.href ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-white/10 pt-3 mt-1 flex flex-col gap-2">
              {user ? (
                <>
                  <span className="text-sm text-gray-400 px-4">Signed in as {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-white/5 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm text-white border border-white/20 text-center no-underline"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm text-white bg-gradient-to-r from-blue-500 to-cyan-400 text-center no-underline"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </motion.nav>

      {/* Spacer so content isn't behind fixed nav */}
      <div className="h-20" />
    </>
  );
}
