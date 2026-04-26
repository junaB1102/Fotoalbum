import { createContext, useContext, useState, useEffect } from 'react'

const FriendsContext = createContext(null)

const AVATAR_COLORS = [
  '#1b4332', '#2d6a4f', '#1a56db', '#7e3af2',
  '#c81e1e', '#d97706', '#0891b2', '#be185d',
]

export function FriendsProvider({ children }) {
  const [friends, setFriends] = useState(() => {
    try { return JSON.parse(localStorage.getItem('memory-friends') || '[]') }
    catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('memory-friends', JSON.stringify(friends))
  }, [friends])

  function addFriend(name) {
    const trimmed = name.trim()
    if (!trimmed) return null
    const color = AVATAR_COLORS[friends.length % AVATAR_COLORS.length]
    const newFriend = { id: crypto.randomUUID(), name: trimmed, color, photo: null, createdAt: new Date().toISOString() }
    setFriends(prev => [...prev, newFriend])
    return newFriend
  }

  function updateFriend(id, updates) {
    setFriends(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f))
  }

  function removeFriend(id) {
    setFriends(prev => prev.filter(f => f.id !== id))
  }

  function getFriend(id) {
    return friends.find(f => f.id === id) || null
  }

  return (
    <FriendsContext.Provider value={{ friends, addFriend, updateFriend, removeFriend, getFriend }}>
      {children}
    </FriendsContext.Provider>
  )
}

export function useFriends() {
  const ctx = useContext(FriendsContext)
  if (!ctx) throw new Error('useFriends must be used inside FriendsProvider')
  return ctx
}
