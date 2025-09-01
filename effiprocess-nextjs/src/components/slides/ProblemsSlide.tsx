'use client'

import { motion } from 'framer-motion'

const problems = [
  { title: 'GDPR Compliance', desc: 'Data protection' },
  { title: 'IT Security', desc: 'Access rights' },
  { title: 'AI Hallucinations', desc: 'Unreliable responses' },
  { title: 'System Integration', desc: 'Compatibility' },
  { title: 'Cost Control', desc: 'Unpredictable costs' }
]

const solutions = [
  { title: 'EU Hosting & Compliance', desc: 'DSAR process, deletion concept, DPA' },
  { title: 'Enterprise Security', desc: 'RLS/RBAC, secrets management, audits' },
  { title: 'Reliability Engineering', desc: 'RAG, human review, disclaimers' },
  { title: 'Seamless Integration', desc: 'Stable APIs, webhooks, E2E tests' },
  { title: 'Transparent Pricing', desc: 'Budgets, rate limits, caching' }
]

export default function ProblemsSlide() {
  return (
    <div className="fixed inset-0 w-full h-full bg-white overflow-hidden" style={{
      zIndex: 10
    }}>
      {/* Problems Side (Left) - Pure Black */}
      <div className="absolute left-0 top-0 w-1/2 h-full bg-black flex flex-col justify-center" style={{
        paddingLeft: '120px',
        paddingRight: '60px',
        paddingTop: '80px',
        paddingBottom: '80px',
        zIndex: 1000
      }}>
        <div className="max-w-md ml-auto mr-10 text-right">
          <motion.div 
            className="text-sm text-gray-300 tracking-wider uppercase font-semibold mb-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            Customer Concerns
          </motion.div>
          
          <motion.h2 
            className="text-5xl font-light text-white leading-tight mb-10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap'
            }}
          >
            What holds you back from AI?
          </motion.h2>
          
          <div className="grid grid-rows-5 gap-0 h-80">
            {problems.map((problem, index) => (
              <motion.div
                key={problem.title}
                className="py-2 flex flex-col justify-center relative"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className="text-base font-medium text-white mb-2">
                  {problem.title}
                </div>
                <div className="text-sm text-gray-300 mb-2">
                  {problem.desc}
                </div>
                <div className="w-2/5 h-px bg-white/10 ml-auto" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Solutions Side (Right) - Pure White */}
      <div className="absolute left-1/2 top-0 w-1/2 h-full bg-white flex flex-col justify-center" style={{
        paddingLeft: '60px',
        paddingRight: '120px',
        paddingTop: '80px',
        paddingBottom: '80px',
        zIndex: 1000
      }}>
        <div className="max-w-md mr-auto">
          <motion.div 
            className="text-sm text-[#a078c8] tracking-wider uppercase font-semibold mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            Our Solutions
          </motion.div>
          
          <motion.h2 
            className="text-5xl font-light text-gray-800 leading-tight mb-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap'
            }}
          >
            We solve every concern.
          </motion.h2>
          
          <div className="grid grid-rows-5 gap-0 h-80">
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.title}
                className="py-2 flex flex-col justify-center relative"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className="text-base font-semibold text-[#a078c8] mb-2">
                  {solution.title}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {solution.desc}
                </div>
                <div className="w-3/5 h-px bg-[#a078c8]/20" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Vertical Divider with Gradient */}
      <div 
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-px h-4/5 z-10"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(160, 120, 200, 0.3) 50%, transparent 100%)'
        }}
      />
      
      {/* Arrow pointing from problems to solutions */}
      <motion.div 
        className="fixed left-1/2 transform -translate-x-1/2 z-20"
        style={{ top: '20vh' }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: 'spring' }}
      >
        <div 
          className="w-15 h-15 bg-[#a078c8] rounded-full flex items-center justify-center"
          style={{
            boxShadow: '0 4px 20px rgba(160, 120, 200, 0.3)'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </div>
      </motion.div>
      
      {/* Page Number */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
        <div className="text-2xl font-light text-[#a078c8] font-mono opacity-70">
          04/06
        </div>
      </div>
    </div>
  )
}