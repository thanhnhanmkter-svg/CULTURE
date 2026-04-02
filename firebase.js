// src/lib/firebase.js
// ─────────────────────────────────────────────────────────────
//  Firebase Realtime Database  +  Firestore (auth fallback)
//  Workshop Culture — OPPO Việt Nam
// ─────────────────────────────────────────────────────────────
import { initializeApp, getApps } from 'firebase/app'
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  off,
  update,
  remove,
  get,
  serverTimestamp,
} from 'firebase/database'

const firebaseConfig = {
  apiKey:            'AIzaSyDRoQRCV7fr-1yN071g8Vdi2u1sOvEtHBA',
  authDomain:        'workshop-culture.firebaseapp.com',
  projectId:         'workshop-culture',
  storageBucket:     'workshop-culture.firebasestorage.app',
  messagingSenderId: '741916433991',
  appId:             '1:741916433991:web:b401d078c3446d591f9b62',
  measurementId:     'G-9QSHBP1GJV',
  // ⚠️ QUAN TRỌNG: Thêm databaseURL cho Realtime Database
  databaseURL:       'https://workshop-culture-default-rtdb.asia-southeast1.firebasedatabase.app',
}

// Singleton — tránh khởi tạo nhiều lần trong Next.js HMR
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const db = getDatabase(app)

// ─── Re-export firebase/database helpers ─────────────────────
export {
  ref, set, push, onValue, off,
  update, remove, get, serverTimestamp,
}

// ─────────────────────────────────────────────────────────────
//  TYPED HELPERS
// ─────────────────────────────────────────────────────────────

/** Lấy ID case hiện tại (Host đang chiếu) */
export function watchCurrentStep(cb) {
  const r = ref(db, '/currentStep')
  onValue(r, snap => cb(snap.val()))
  return () => off(r)
}

/** Host chuyển sang case mới */
export async function setCurrentStep(caseId) {
  await set(ref(db, '/currentStep'), caseId)
}

/** Lắng nghe danh sách cases */
export function watchCases(cb) {
  const r = ref(db, '/cases')
  onValue(r, snap => {
    const val = snap.val() || {}
    cb(
      Object.entries(val).map(([id, data]) => ({ id, ...data }))
    )
  })
  return () => off(r)
}

/** CRUD cases */
export async function addCase(data) {
  return push(ref(db, '/cases'), { ...data, createdAt: Date.now() })
}
export async function updateCase(id, data) {
  return update(ref(db, `/cases/${id}`), data)
}
export async function deleteCase(id) {
  return remove(ref(db, `/cases/${id}`))
}

/** Lưu response của user */
export async function submitResponse(userId, caseId, choice) {
  await set(ref(db, `/responses/${caseId}/${userId}`), {
    userId, caseId, choice, timestamp: Date.now(),
  })
}

/** Lắng nghe responses của một case */
export function watchResponses(caseId, cb) {
  const r = ref(db, `/responses/${caseId}`)
  onValue(r, snap => {
    const val = snap.val() || {}
    const entries = Object.values(val)
    const countA = entries.filter(e => e.choice === 'A').length
    const countB = entries.filter(e => e.choice === 'B').length
    cb({ countA, countB, total: entries.length, raw: entries })
  })
  return () => off(r)
}

/** Thả tim / icon giá trị */
export async function pushReaction(type) {
  return push(ref(db, '/reactions'), {
    type,
    timestamp: Date.now(),
  })
}

/** Lắng nghe reactions mới (chỉ nhận item cuối cùng push) */
export function watchReactions(cb) {
  const r = ref(db, '/reactions')
  onValue(r, snap => {
    const val = snap.val()
    if (!val) return
    cb(Object.values(val))
  })
  return () => off(r)
}

/** Xoá toàn bộ responses của một case (Host reset) */
export async function clearResponses(caseId) {
  await remove(ref(db, `/responses/${caseId}`))
}

/** Xoá toàn bộ reactions */
export async function clearReactions() {
  await remove(ref(db, '/reactions'))
}
