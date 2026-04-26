import { useParams, Link } from 'react-router-dom'
import { useFriends } from '../context/FriendsContext'
import { useDiary } from '../context/DiaryContext'
import { ArrowLeft, Camera, Image } from 'lucide-react'
import { compressImage } from '../utils/api'

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })
}

const TYPE_LABEL = { gedicht: 'Poem', tagebuch: 'Journal Entry', gedanken: 'Thoughts' }

export default function FriendProfile() {
  const { id } = useParams()
  const { getFriend, updateFriend } = useFriends()
  const { entries } = useDiary()
  const friend = getFriend(id)

  if (!friend) {
    return (
      <div className="page">
        <div className="empty">
          <div className="empty-icon">👤</div>
          <div className="empty-title">Friend not found</div>
          <Link to="/friends" className="btn btn-secondary"><ArrowLeft size={16} /> Back</Link>
        </div>
      </div>
    )
  }

  const sharedEntries = entries
    .filter(e => e.taggedFriends?.includes(id))
    .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))

  async function handlePhotoUpload(file) {
    if (!file) return
    const b64 = await compressImage(file, 400)
    updateFriend(id, { photo: b64 })
  }

  return (
    <div className="page">
      <Link to="/friends" className="btn btn-ghost" style={{ marginBottom: 20, display: 'inline-flex' }}>
        <ArrowLeft size={16} /> Friends
      </Link>

      {/* Profile header */}
      <div className="profile-header">
        <div className="profile-avatar" style={{ '--fc': friend.color }}>
          {friend.photo
            ? <img src={friend.photo} alt={friend.name} />
            : <span>{initials(friend.name)}</span>
          }
          <label className="profile-photo-btn" title="Change photo">
            <Camera size={16} />
            <input type="file" accept="image/*" hidden onChange={e => handlePhotoUpload(e.target.files[0])} />
          </label>
        </div>
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>{friend.name}</h1>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'system-ui,sans-serif', fontSize: '0.9rem' }}>
            {sharedEntries.length} shared {sharedEntries.length === 1 ? 'memory' : 'memories'}
          </p>
        </div>
      </div>

      <hr className="divider" />

      {sharedEntries.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📷</div>
          <div className="empty-title">No shared memories yet</div>
          <p>Tag {friend.name} in an entry to see memories here.</p>
        </div>
      ) : (
        <>
          <p className="section-title">Shared Memories</p>
          <div className="album-grid">
            {sharedEntries.map(entry => (
              <Link to={`/entry/${entry.id}`} key={entry.id} className="album-card">
                <div className="album-cover">
                  {entry.images?.[0]
                    ? <img src={entry.images[0]} alt={entry.title} className="album-cover-img" />
                    : <div className="album-cover-placeholder"><Image size={32} /></div>
                  }
                  {entry.type && (
                    <span className="album-type-badge">{TYPE_LABEL[entry.type] || entry.type}</span>
                  )}
                </div>
                <div className="album-info">
                  <div className="album-date">{formatDate(entry.date || entry.createdAt)}</div>
                  <div className="album-title">{entry.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
