'use client';

import { motion } from 'framer-motion';
import { MousePointerClick, MessageSquareText, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: MousePointerClick,
    title: 'Pick a Domain',
    desc: 'Choose from 9 specialized government service domains — scholarships, legal rights, career guidance, and more.',
    step: '01',
  },
  {
    icon: MessageSquareText,
    title: 'Ask Your Question',
    desc: 'Type your question in plain language. Our AI understands context and supports 8 languages including Hindi, Telugu, and Tamil.',
    step: '02',
  },
  {
    icon: CheckCircle,
    title: 'Get Structured Answers',
    desc: 'Receive clear, formatted responses with eligibility criteria, step-by-step guides, required documents, and official links.',
    step: '03',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            How It{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Three simple steps to access any government service information.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, type: 'spring', bounce: 0.3 }}
              whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.08)' }}
              className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center transition-all hover:border-blue-500/20"
            >
              {/* Step number */}
              <div className="text-5xl font-bold bg-gradient-to-b from-white/10 to-transparent bg-clip-text text-transparent absolute top-4 right-5">
                {s.step}
              </div>

              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/20"
              >
                <s.icon size={24} className="text-white" />
              </motion.div>
              <h3 className="text-white font-semibold text-lg mb-2">{s.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>

              {/* Connector line */}
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 border-t border-dashed border-blue-500/30" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
