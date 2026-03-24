'use client';

import Link from 'next/link';
import { Landmark, GitGraph, MessageCircle, Mail } from 'lucide-react';

const footerLinks = [
  {
    title: 'Services',
    links: [
      { label: 'Scholarships', href: '/government-bots?domain=scholarship' },
      { label: 'Startup India', href: '/government-bots?domain=startup' },
      { label: 'MSME Benefits', href: '/government-bots?domain=msme' },
      { label: 'Patents & IP', href: '/government-bots?domain=patent' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Career Guide', href: '/government-bots?domain=career' },
      { label: 'Exam Prep', href: '/government-bots?domain=exam-prep' },
      { label: 'Tech Roadmap', href: '/government-bots?domain=tech-roadmap' },
      { label: 'Legal Rights', href: '/government-bots?domain=legal' },
    ],
  },
  {
    title: 'Platform',
    links: [
      { label: 'Quick Chat', href: '/gov-prompt' },
      { label: 'All Bots', href: '/government-bots' },
      { label: 'Login', href: '/auth/login' },
      { label: 'Register', href: '/auth/register' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-white/[0.02] mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                <Landmark size={16} className="text-white" />
              </div>
              <span className="text-white font-bold text-lg">
                Gov<span className="text-cyan-400">Prompt</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your unified AI assistant for Indian government services. Simplifying access to schemes, rights, and opportunities.
            </p>
            <div className="flex gap-3 mt-4">
              {[GitGraph, MessageCircle, Mail].map((Icon, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <Icon size={14} />
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-white font-semibold text-sm mb-4">{group.title}</h4>
              <div className="flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-gray-500 text-sm hover:text-cyan-400 transition-colors no-underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">
            &copy; {new Date().getFullYear()} GovPrompt. Powered by Groq LLaMA 3.3 70B.
          </p>
          <p className="text-gray-600 text-xs">
            Built for Indian Citizens with AI
          </p>
        </div>
      </div>
    </footer>
  );
}
