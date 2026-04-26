import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useFriends } from '../context/FriendsContext'
import { useDiary } from '../context/DiaryContext'
import { UserPlus, Trash2, Camera } from 'lucide-react'
import { compressImage } from '../utils/api'

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function Friends() {
  const { friends, addFriend, removeFriend, updateFriend } = useFriends()
  const { entries } = useDiary()
  const [newName, setNewName] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

  function memoryCount(friendId) {
    return entries.filter(e => e.taggedFriends?.includes(friendId)).length
  }

  async function handlePhotoUpload(friendId, file) {
    if (!file) return
    const b64 = await compressImage(file, 400)
    updateFriend(friendId, { photo: b64 })
  }

  function handleAdd(e) {
    e.preventDefault()
    if (!newName.trim()) return
    addFriend(newName.trim())
    setNewName('')
    setShowForm(false)
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 className="page-title">Friends</h1>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'system-ui,sans-serif', fontSize: '0.9rem' }}>
            {friends.length} {friends.length === 1 ? 'friend' : 'friends'}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}>
          <UserPlus size={16} /> Add friend
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <input
            autoFocus
            className="form-input"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Friend's name…"
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary">Add</button>
          <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
        </form>
      )}

      {friends.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">👥</div>
          <div className="empty-title">No friends yet</div>
          <p>Add friends to tag them in your memories.</p>
        </div>
      ) : (
        <div className="friends-grid">
          {friends.map(friend => {
            const count = memoryCount(friend.id)
            return (
              <div key={friend.id} className="friend-card">
                <Link to={`/friends/${friend.id}`} className="friend-card-link">
                  <div className="friend-card-avatar" style={{ '--fc': friend.color }}>
                    {friend.photo
                      ? <img src={friend.photo} alt={friend.name} />
                      : <span>{initials(friend.name)}</span>
                    }
                    <label className="friend-card-photo-btn" title="Change photo">
                      <Camera size={13} />
                      <input
                        type="file" accept="image/*" hidden
                        onChange={e => handlePhotoUpload(friend.id, e.target.files[0])}
                        onClick={e => e.stopPropagation()}
                      />
                    </label>
                  </div>
                  <div className="friend-card-name">{friend.name}</div>
                  <div className="friend-card-count">
                    {count} {count === 1 ? 'memory' : 'memories'}
                  </div>
                </Link>
                <div className="friend-card-actions">
                  {confirmDelete === friend.id ? (
                    <>
                      <button className="btn btn-danger" style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                        onClick={() => { removeFriend(friend.id); setConfirmDelete(null) }}>
                        Delete
                      </button>
                      <button className="btn btn-ghost" style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                        onClick={() => setConfirmDelete(null)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button className="btn btn-ghost" style={{ color: 'var(--danger)', padding: '4px 8px' }}
                      onClick={() => setConfirmDelete(friend.id)}>
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
