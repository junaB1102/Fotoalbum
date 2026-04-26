import { createContext, useContext, useState, useEffect } from 'react'

const DiaryContext = createContext(null)

export function DiaryProvider({ children }) {
  const [entries, setEntries] = useState(() => {
    try {
      const stored = localStorage.getItem('diary-entries')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('diary-entries', JSON.stringify(entries))
    } catch (e) {
      console.warn('localStorage full:', e)
    }
  }, [entries])

  function addEntry(entry) {
    const newEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setEntries(prev => [newEntry, ...prev])
    return newEntry.id
  }

  function updateEntry(id, updates) {
    setEntries(prev =>
      prev.map(e => (e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e))
    )
  }

  function deleteEntry(id) {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  function getEntry(id) {
    return entries.find(e => e.id === id) || null
  }

  return (
    <DiaryContext.Provider value={{ entries, addEntry, updateEntry, deleteEntry, getEntry }}>
      {children}
    </DiaryContext.Provider>
  )
}

export function useDiary() {
  const ctx = useContext(DiaryContext)
  if (!ctx) throw new Error('useDiary must be used inside DiaryProvider')
  return ctx
}
