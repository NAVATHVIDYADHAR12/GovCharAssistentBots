'use client';

import { motion } from 'framer-motion';
import { Globe, Languages } from 'lucide-react';

const langs = [
  { name: 'English', native: 'English', flag: 'EN' },
  { name: 'Hindi', native: 'हिंदी', flag: 'HI' },
  { name: 'Telugu', native: 'తెలుగు', flag: 'TE' },
  { name: 'Tamil', native: 'தமிழ்', flag: 'TA' },
  { name: 'German', native: 'Deutsch', flag: 'DE' },
  { name: 'Russian', native: 'Русский', flag: 'RU' },
  { name: 'Chinese', native: '中文', flag: 'ZH' },
  { name: 'Japanese', native: '日本語', flag: 'JA' },
];

export default function LanguageShowcase() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20"
            >
              <Globe size={24} className="text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Speak Your{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Language</span>
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-8">
              GovPrompt responds in 8 languages so every citizen can access government services in the language they are most comfortable with.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {langs.map((l, i) => (
                <motion.div
                  key={l.flag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, type: 'spring', bounce: 0.4 }}
                  whileHover={{ scale: 1.08, boxShadow: '0 8px 20px rgba(59, 130, 246, 0.15)' }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 cursor-default hover:border-blue-500/30 transition-all"
                >
                  <Languages size={14} className="text-cyan-400" />
                  <span className="text-white text-sm font-medium">{l.native}</span>
                  <span className="text-gray-600 text-xs">({l.name})</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
