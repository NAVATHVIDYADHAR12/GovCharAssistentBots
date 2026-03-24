'use client';

import { motion } from 'framer-motion';
import {
  GraduationCap, Rocket, Factory, FileText,
  ClipboardList, Scale, Compass, BookOpen, Laptop,
} from 'lucide-react';

const features = [
  { icon: GraduationCap, title: 'Scholarships', desc: 'Find and apply for government scholarships — NSP, merit-based, minority, and more.', color: 'from-violet-500 to-purple-500', href: 'scholarship' },
  { icon: Rocket, title: 'Startup India', desc: 'Register your startup, get DPIIT recognition, tax benefits, and seed funding info.', color: 'from-blue-500 to-cyan-400', href: 'startup' },
  { icon: Factory, title: 'MSME Benefits', desc: 'Udyam registration, collateral-free loans, PMEGP, and micro enterprise support.', color: 'from-amber-500 to-yellow-500', href: 'msme' },
  { icon: FileText, title: 'Patents & IP', desc: 'File patents, trademarks, and copyrights. Understand IP protection in India.', color: 'from-orange-500 to-red-400', href: 'patent' },
  { icon: ClipboardList, title: 'Certifications', desc: 'Get caste, income, domicile certificates online. DigiLocker and e-District support.', color: 'from-sky-500 to-blue-500', href: 'certification' },
  { icon: Scale, title: 'Legal Rights', desc: 'Student and minor rights — POCSO, RTE, anti-ragging, JJ Act explanations.', color: 'from-red-500 to-rose-500', href: 'legal' },
  { icon: Compass, title: 'Career Guide', desc: 'Personalized career advice for every education level — 10th to PhD.', color: 'from-indigo-500 to-blue-500', href: 'career' },
  { icon: BookOpen, title: 'Exam Prep', desc: 'JEE, NEET, UPSC, GATE, CAT — strategies, syllabi, and study plans.', color: 'from-teal-500 to-cyan-500', href: 'exam-prep' },
  { icon: Laptop, title: 'Tech Roadmap', desc: 'Full-stack, AI/ML, DevOps — complete learning roadmaps with job market data.', color: 'from-cyan-500 to-blue-400', href: 'tech-roadmap' },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, bounce: 0.3 } },
};

export default function FeaturesGrid() {
  return (
    <section className="py-20 px-6 relative">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            9 Specialized AI{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Domains</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Each domain is powered by a custom-tuned system prompt, ensuring accurate, structured, and actionable answers.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((f) => (
            <motion.a
              key={f.href}
              href={`/government-bots?domain=${f.href}`}
              variants={item}
              whileHover={{ scale: 1.03, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.1)' }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 no-underline group transition-all hover:border-blue-500/20"
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-r ${f.color} flex items-center justify-center mb-4 shadow-lg`}>
                <f.icon size={20} className="text-white" />
              </div>
              <h3 className="text-white font-semibold text-base mb-2 group-hover:text-cyan-400 transition-colors">
                {f.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
