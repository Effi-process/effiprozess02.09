'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function CalculatorSlide() {
  const [formData, setFormData] = useState({
    tasksPerDay: '',
    minutesPerTask: '',
    workDays: '',
    automationPercent: '',
    employees: ''
  })

  const [results, setResults] = useState({ hours: '--', cost: '--' })

  const calculateSavings = () => {
    const { tasksPerDay, minutesPerTask, workDays, automationPercent, employees } = formData
    
    // Check if all fields are selected
    if (!tasksPerDay || !minutesPerTask || !workDays || !automationPercent || !employees) {
      setResults({ hours: '--', cost: '--' })
      return
    }
    
    // Convert to numbers and calculate
    const tasks = parseInt(tasksPerDay)
    const minutes = parseInt(minutesPerTask)
    const days = parseInt(workDays)
    const automation = parseInt(automationPercent)
    const teamSize = parseInt(employees)
    
    const dailyTimeSavingsPerEmployee = (tasks * minutes * automation / 100) / 60
    const annualHoursSaved = dailyTimeSavingsPerEmployee * days * 52 * teamSize
    const hourlyRate = 75000 / 2080
    const annualCostSavings = annualHoursSaved * hourlyRate
    
    setResults({
      hours: Math.round(annualHoursSaved).toLocaleString() + ' hours',
      cost: '€' + Math.round(annualCostSavings).toLocaleString()
    })
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Trigger calculation after state update
    setTimeout(calculateSavings, 0)
  }

  return (
    <section className="slide calculator" style={{ 
      background: '#f8f9fa', 
      zIndex: 10,
      position: 'relative',
      width: '100%',
      height: '100vh'
    }}>
      {/* Vertical 06/06 in center background */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%) rotate(-90deg)',
        zIndex: 1
      }}>
        <div style={{
          fontSize: '3rem',
          fontWeight: 300,
          color: '#333',
          fontFamily: "'SF Mono', Monaco, monospace",
          opacity: 0.3,
          whiteSpace: 'nowrap'
        }}>06/06</div>
      </div>
      
      {/* Left content area moved further right */}
      <div style={{
        position: 'absolute',
        left: '120px',
        top: 0,
        width: '35%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 30px',
        zIndex: 1000
      }}>
        <div style={{ maxWidth: '350px' }}>
          <div style={{
            fontSize: '0.9rem',
            color: '#a078c8',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 500,
            marginBottom: '25px'
          }}>Time Savings Calculator</div>
          <h2 style={{
            fontSize: '2.4rem',
            fontWeight: 300,
            color: '#333333',
            lineHeight: 1.15,
            marginBottom: '25px',
            letterSpacing: '-0.02em'
          }}>
            Calculate your<br/>
            automation ROI.
          </h2>
          
          <div style={{
            fontSize: '0.85rem',
            color: '#666666',
            lineHeight: 1.6,
            marginBottom: '30px',
            maxWidth: '380px'
          }}>
            <p style={{ marginBottom: '15px' }}>
              Estimate time and cost savings with our intelligent automation solutions. Our advanced algorithms analyze your workflow patterns to provide accurate ROI calculations.
            </p>
            <p style={{ marginBottom: '15px' }}>
              Transform repetitive tasks into automated processes that work 24/7. See how much time and money your business can save by implementing our tailored automation strategies.
            </p>
            <p>
              Enter your current workflow details in the calculator to discover your potential savings. Every minute automated is a minute gained for strategic business growth.
            </p>
          </div>
        </div>
      </div>

      {/* Right side: Enhanced Calculator moved to extreme edge */}
      <div style={{
        position: 'absolute',
        right: '-100px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '42%',
        zIndex: 1000
      }}>
        <motion.div
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            borderRadius: '20px',
            padding: '35px',
            boxShadow: '0 25px 80px rgba(160, 120, 200, 0.15), 0 0 0 1px rgba(160, 120, 200, 0.1)',
            border: '2px solid rgba(160, 120, 200, 0.2)',
            width: '100%',
            maxWidth: '420px'
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
        {/* Header */}
        <div className="text-center mb-8 pb-6 border-b-2 border-[#a078c8]/10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-3 h-3 bg-[#a078c8] rounded-full shadow-lg shadow-[#a078c8]/40" />
            <h3 className="text-[#a078c8] text-xl font-semibold">ROI Calculator</h3>
            <div className="w-3 h-3 bg-[#a078c8] rounded-full shadow-lg shadow-[#a078c8]/40" />
          </div>
          <div className="text-xs text-gray-500 tracking-widest uppercase">
            Automation Impact Analysis
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-3">Daily Tasks</label>
            <select 
              value={formData.tasksPerDay}
              onChange={(e) => handleChange('tasksPerDay', e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-lg text-sm bg-white text-gray-800 font-medium cursor-pointer transition-border-colors duration-200 focus:border-[#a078c8] outline-none"
            >
              <option value="" disabled>Please select</option>
              <option value="5">5 tasks</option>
              <option value="10">10 tasks</option>
              <option value="15">15 tasks</option>
              <option value="20">20 tasks</option>
              <option value="30">30 tasks</option>
              <option value="50">50+ tasks</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-3">Task Duration</label>
            <select 
              value={formData.minutesPerTask}
              onChange={(e) => handleChange('minutesPerTask', e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-lg text-sm bg-white text-gray-800 font-medium cursor-pointer transition-border-colors duration-200 focus:border-[#a078c8] outline-none"
            >
              <option value="" disabled>Please select</option>
              <option value="5">5 minutes</option>
              <option value="10">10 minutes</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2+ hours</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-3">Work Schedule</label>
            <select 
              value={formData.workDays}
              onChange={(e) => handleChange('workDays', e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-lg text-sm bg-white text-gray-800 font-medium cursor-pointer transition-border-colors duration-200 focus:border-[#a078c8] outline-none"
            >
              <option value="" disabled>Please select</option>
              <option value="1">1 day/week</option>
              <option value="2">2 days/week</option>
              <option value="3">3 days/week</option>
              <option value="4">4 days/week</option>
              <option value="5">5 days/week</option>
              <option value="6">6 days/week</option>
              <option value="7">7 days/week</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-3">Automation Potential</label>
            <select 
              value={formData.automationPercent}
              onChange={(e) => handleChange('automationPercent', e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-lg text-sm bg-white text-gray-800 font-medium cursor-pointer transition-border-colors duration-200 focus:border-[#a078c8] outline-none"
            >
              <option value="" disabled>Please select</option>
              <option value="50">50% - Partial automation</option>
              <option value="70">70% - High automation</option>
              <option value="80">80% - Very high automation</option>
              <option value="90">90% - Near-complete</option>
              <option value="95">95% - Full automation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-3">Team Size</label>
            <select 
              value={formData.employees}
              onChange={(e) => handleChange('employees', e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-lg text-sm bg-white text-gray-800 font-medium cursor-pointer transition-border-colors duration-200 focus:border-[#a078c8] outline-none"
            >
              <option value="" disabled>Please select</option>
              <option value="1">1 employee</option>
              <option value="3">3 employees</option>
              <option value="5">5 employees</option>
              <option value="10">10 employees</option>
              <option value="20">20 employees</option>
              <option value="50">50+ employees</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <motion.div 
          className="mt-8 p-6 bg-gray-50 rounded-xl border border-[#a078c8]/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center mb-6">
            <h4 className="text-[#a078c8] text-sm font-semibold tracking-widest uppercase">
              Annual Savings
            </h4>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Time Saved</span>
              <span className="text-lg font-semibold text-[#a078c8]">{results.hours}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Cost Savings</span>
              <span className="text-lg font-semibold text-[#a078c8]">{results.cost}</span>
            </div>
          </div>
        </motion.div>
        </motion.div>
      </div>
    </section>
  )
}