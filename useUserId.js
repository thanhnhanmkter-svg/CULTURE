// src/hooks/useUserId.js
'use client'
import { useState, useEffect } from 'react'

function generateId() {
  return 'u_' + Math.random().toString(36).slice(2, 10)
}

/**
 * Tạo và persist userId trong localStorage.
 * Mỗi thiết bị/browser = 1 userId duy nhất.
 */
export function useUserId() {
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    let id = localStorage.getItem('oppo_workshop_uid')
    if (!id) {
      id = generateId()
      localStorage.setItem('oppo_workshop_uid', id)
    }
    setUserId(id)
  }, [])

  return userId
}
