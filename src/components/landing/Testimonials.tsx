'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Engineering Student, Delhi',
    text: 'GovPrompt helped me find the perfect scholarship. The step-by-step guide made applying so easy — I got my NSP scholarship approved within weeks!',
    avatar: 'PS',
  },
  {
    name: 'Rahul Verma',
    role: 'Startup Founder, Bangalore',
    text: 'I was clueless about DPIIT registration. The Startup India bot walked me through the entire process and even told me about tax benefits I didn\'t know existed.',
    avatar: 'RV',
  },
  {
    name: 'Ananya Reddy',
    role: '12th Student, Hyderabad',
    text: 'The Career Guide bot is amazing! It gave me a clear roadmap for B.Tech vs Diploma comparison and helped me choose the right stream after 12th.',
    avatar: 'AR',
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, bounce: 0.3 } },
};

export default function Testimonials() {
  return (
    <section className="py-20 px-6 relative">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            What Citizens{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Say</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Real stories from users who navigated government services with GovPrompt.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={item}
              whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.08)' }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-blue-500/20 transition-all"
            >
              <Quote size={24} className="text-blue-500/30 mb-4" />
              <p className="text-gray-300 text-sm leading-relaxed mb-6">{t.text}</p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-500/20">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{t.name}</div>
                  <div className="text-gray-500 text-xs">{t.role}</div>
                </div>
                <div className="flex gap-0.5 ml-auto">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
