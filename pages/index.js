'use client'
// src/app/page.js  — Màn hình Client (nhân viên)

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence }                    from 'framer-motion'
import {
  watchCurrentStep, watchCases, watchResponses,
  submitResponse, pushReaction,
} from '../lib/firebase'
import { useUserId } from '../hooks/useUserId'

// ─────────────────────────────────────────────────────────────
//  DNA LOCK VALUES
// ─────────────────────────────────────────────────────────────
const DNA_VALUES = [
  { key: 'duty',     label: 'Bổn phận',   emoji: '🛡️', color: '#008a5e' },
  { key: 'customer', label: 'Khách hàng', emoji: '🤝', color: '#0077aa' },
  { key: 'excel',    label: 'Xuất sắc',   emoji: '⭐', color: '#aa7700' },
  { key: 'result',   label: 'Kết quả',    emoji: '🚀', color: '#7700aa' },
]

const REACTION_ICONS = [
  { type: 'heart',    icon: '❤️',  label: 'Yêu thích' },
  { type: 'duty',     icon: '🛡️', label: 'Bổn phận'  },
  { type: 'star',     icon: '⭐',  label: 'Xuất sắc'  },
  { type: 'rocket',   icon: '🚀',  label: 'Kết quả'   },
]

// ─────────────────────────────────────────────────────────────
//  SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────

function DnaLock({ onUnlock }) {
  const [touched, setTouched] = useState(new Set())

  const touch = (key) => {
    const next = new Set(touched).add(key)
    setTouched(next)
    if (next.size === DNA_VALUES.length) {
      setTimeout(onUnlock, 600)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6"
         style={{ background: 'radial-gradient(ellipse at center, #071a10 0%, #030f09 70%)' }}>

      {/* Logo / Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y:   0  }}
        transition={{ delay: 0.2 }}
        className="text-center mb-14"
      >
        <div className="inline-flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-black"
               style={{ background: 'linear-gradient(135deg, #008a5e, #00ffa3)' }}>OP</div>
          <span className="text-xs tracking-[4px] text-oppo-glow font-light">WORKSHOP CULTURE</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2 glow-text">Kích hoạt DNA</h1>
        <p className="text-sm text-white/40 font-light tracking-wide">
          Chạm vào đủ 4 giá trị cốt lõi để bắt đầu
        </p>
      </motion.div>

      {/* 4 Value Buttons */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        {DNA_VALUES.map((v, i) => {
          const active = touched.has(v.key)
          return (
            <motion.button
              key={v.key}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1   }}
              transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 300 }}
              onClick={() => touch(v.key)}
              whileTap={{ scale: 0.92 }}
              className={`
                relative h-32 rounded-2xl flex flex-col items-center justify-center gap-2
                transition-all duration-500 select-none
                ${active ? 'glow-green' : 'card-glass dna-pulse'}
              `}
              style={{
                background: active
                  ? `linear-gradient(135deg, ${v.color}cc, ${v.color}44)`
                  : undefined,
                border: `1.5px solid ${active ? v.color : 'rgba(0,138,94,0.22)'}`,
              }}
            >
              <span className="text-4xl">{v.emoji}</span>
              <span className="text-sm font-semibold text-white">{v.label}</span>
              {active && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs text-black font-bold"
                  style={{ background: v.color }}
                >✓</motion.div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 mt-10">
        {DNA_VALUES.map(v => (
          <motion.div
            key={v.key}
            animate={{ scale: touched.has(v.key) ? 1.4 : 1, opacity: touched.has(v.key) ? 1 : 0.3 }}
            className="w-2 h-2 rounded-full bg-oppo-green"
          />
        ))}
      </div>

      <p className="text-xs text-white/25 mt-4 tracking-widest font-light">
        {touched.size} / {DNA_VALUES.length} ĐÃ KÍCH HOẠT
      </p>
    </div>
  )
}

// ── FloatingReactionBar ───────────────────────────────────────
function FloatingReactionBar() {
  const [bursts, setBursts] = useState([])
  const [cooling, setCooling] = useState({})

  const fire = async (type, icon) => {
    if (cooling[type]) return
    // Cooldown 800ms per button
    setCooling(c => ({ ...c, [type]: true }))
    setTimeout(() => setCooling(c => ({ ...c, [type]: false })), 800)

    // Optimistic local burst
    const id = Date.now() + Math.random()
    setBursts(b => [...b, { id, icon, x: Math.random() * 80 + 10 }])
    setTimeout(() => setBursts(b => b.filter(i => i.id !== id)), 3000)

    await pushReaction(type)
  }

  return (
    <>
      {/* Floating icons */}
      <div className="fixed inset-0 pointer-events-none z-30">
        <AnimatePresence>
          {bursts.map(b => (
            <motion.span
              key={b.id}
              initial={{ opacity: 1, y: 0,    scale: 1   }}
              animate={{ opacity: 0, y: -300, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5, ease: 'easeOut' }}
              className="absolute bottom-24 text-3xl select-none"
              style={{ left: `${b.x}%` }}
            >
              {b.icon}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {/* Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-safe">
        <div
          className="card-glass flex items-center gap-1 px-3 py-2 rounded-t-2xl mx-4 mb-0"
          style={{ borderBottom: 'none', boxShadow: '0 -4px 30px rgba(0,138,94,0.2)' }}
        >
          {REACTION_ICONS.map(r => (
            <button
              key={r.type}
              onClick={() => fire(r.type, r.icon)}
              className={`
                flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all
                ${cooling[r.type] ? 'scale-90 opacity-60' : 'hover:bg-oppo-green/20 active:scale-95'}
              `}
            >
              <span className="text-2xl">{r.icon}</span>
              <span className="text-[9px] text-white/50 font-light tracking-wide">{r.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

// ── QuizScreen ────────────────────────────────────────────────
function QuizScreen({ userId }) {
  const [currentCaseId, setCurrentCaseId] = useState(null)
  const [cases,         setCases]         = useState([])
  const [responses,     setResponses]     = useState({ countA: 0, countB: 0, total: 0 })
  const [myChoice,      setMyChoice]      = useState(null) // 'A' | 'B'
  const [showResult,    setShowResult]    = useState(false)
  const prevCaseId = useRef(null)
  const unsubResponses = useRef(null)

  // Sync current step
  useEffect(() => {
    const unsub = watchCurrentStep(id => setCurrentCaseId(id))
    return unsub
  }, [])

  // Sync cases
  useEffect(() => {
    const unsub = watchCases(list => setCases(list))
    return unsub
  }, [])

  // Reset choice when case changes
  useEffect(() => {
    if (currentCaseId !== prevCaseId.current) {
      setMyChoice(null)
      setShowResult(false)
      prevCaseId.current = currentCaseId

      if (unsubResponses.current) unsubResponses.current()
      if (currentCaseId) {
        unsubResponses.current = watchResponses(currentCaseId, data => setResponses(data))
      }
    }
  }, [currentCaseId])

  useEffect(() => () => unsubResponses.current?.(), [])

  const currentCase = cases.find(c => c.id === currentCaseId)

  const choose = async (option) => {
    if (myChoice) return
    setMyChoice(option)
    await submitResponse(userId, currentCaseId, option)
  }

  // Waiting screen
  if (!currentCase) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-6">
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="w-20 h-20 rounded-full border-2 border-oppo-green/50 flex items-center justify-center"
        >
          <span className="text-3xl">⏳</span>
        </motion.div>
        <p className="text-white/40 text-sm tracking-widest font-light">ĐANG CHỜ HOST BẮT ĐẦU...</p>
      </div>
    )
  }

  const pctA = responses.total > 0 ? Math.round((responses.countA / responses.total) * 100) : 0
  const pctB = responses.total > 0 ? Math.round((responses.countB / responses.total) * 100) : 0

  return (
    <div className="min-h-screen pb-28 px-4 pt-6 flex flex-col gap-5 max-w-lg mx-auto">

      {/* Case header */}
      <motion.div
        key={currentCaseId + '-header'}
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y:  0  }}
        className="card-glass rounded-2xl p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="text-[10px] tracking-[3px] text-oppo-glow font-light uppercase">Case Study</div>
        </div>
        <h2 className="text-lg font-bold text-white leading-snug mb-3">{currentCase.title}</h2>
        <p className="text-sm text-white/60 font-light leading-relaxed">{currentCase.context}</p>
      </motion.div>

      {/* Choices */}
      {!myChoice ? (
        <motion.div
          key={currentCaseId + '-choices'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col gap-4"
        >
          {[
            { opt: 'A', text: currentCase.optionA, color: '#008a5e' },
            { opt: 'B', text: currentCase.optionB, color: '#0077cc' },
          ].map(({ opt, text, color }) => (
            <motion.button
              key={opt}
              whileTap={{ scale: 0.96 }}
              onClick={() => choose(opt)}
              className="relative w-full rounded-2xl p-5 text-left transition-all active:scale-95"
              style={{
                background:  `linear-gradient(135deg, ${color}22, ${color}11)`,
                border:      `1.5px solid ${color}55`,
                boxShadow:   `0 4px 24px ${color}22`,
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black shrink-0 text-black"
                  style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }}
                >{opt}</div>
                <p className="text-white/90 text-sm leading-relaxed font-light pt-1">{text}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1   }}
          className="card-glass rounded-2xl p-6 text-center"
        >
          <div className="text-4xl mb-3">✅</div>
          <p className="text-white font-semibold">Bạn đã chọn <span className="text-oppo-light font-bold">{myChoice}</span></p>
          <p className="text-white/40 text-xs mt-1 tracking-wide">Đang chờ kết quả từ host...</p>

          {/* Mini bar */}
          <div className="mt-5 flex gap-3">
            {[['A', pctA, '#008a5e'], ['B', pctB, '#0077cc']].map(([opt, pct, color]) => (
              <div key={opt} className="flex-1">
                <div className="text-xs text-white/50 mb-1">{opt}: {pct}%</div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-white/25 mt-2">{responses.total} người đã trả lời</p>
        </motion.div>
      )}

      <FloatingReactionBar />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  ROOT PAGE
// ─────────────────────────────────────────────────────────────
export default function ClientPage() {
  const userId   = useUserId()
  const [unlocked, setUnlocked] = useState(false)

  // Check if already unlocked
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('oppo_dna_unlocked')
      if (saved === 'true') setUnlocked(true)
    }
  }, [])

  const handleUnlock = () => {
    localStorage.setItem('oppo_dna_unlocked', 'true')
    setUnlocked(true)
  }

  if (!userId) return null // waiting for hydration

  return (
    <AnimatePresence mode="wait">
      {!unlocked ? (
        <motion.div key="lock" exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
          <DnaLock onUnlock={handleUnlock} />
        </motion.div>
      ) : (
        <motion.div
          key="quiz"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y:  0 }}
          transition={{ duration: 0.4 }}
        >
          <QuizScreen userId={userId} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
