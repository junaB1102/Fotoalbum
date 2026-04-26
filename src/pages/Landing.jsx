import { Link } from 'react-router-dom'
import { useDiary } from '../context/DiaryContext'
import { Images, Map, Users, Plus, MapPin, Image } from 'lucide-react'
import cameraIcon from '../assets/kamer.png'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function Landing() {
  const { entries } = useDiary()

  const totalLocations = entries.filter(e => e.location).length
  const totalImages    = entries.reduce((sum, e) => sum + (e.images?.length || 0), 0)
  const recent         = [...entries]
    .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
    .slice(0, 3)

  return (
    <div className="page">

      {/* Hero */}
      <div className="landing-hero">
        <img src={cameraIcon} alt="" className="landing-hero-icon" />
        <h1 className="landing-title">Fotoalbum</h1>
        <p className="landing-subtitle">
          Capture your most beautiful memories — with photos, stories and places on the map.
        </p>
        <Link to="/new" className="btn btn-primary" style={{ fontSize: '1rem', padding: '11px 24px' }}>
          <Plus size={18} /> New Memory
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginTop: 40 }}>
        <div className="stat-card">
          <div className="stat-value">{entries.length}</div>
          <div className="stat-label">Memories</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalLocations}</div>
          <div className="stat-label">Places</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalImages}</div>
          <div className="stat-label">Photos</div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="feature-grid">
        <Link to="/memorys" className="feature-card">
          <Images size={28} />
          <div className="feature-card-title">Memories</div>
          <div className="feature-card-desc">Browse and search all your memories as a photo album</div>
        </Link>
        <Link to="/map" className="feature-card">
          <Map size={28} />
          <div className="feature-card-title">Map</div>
          <div className="feature-card-desc">Explore places and see your memories on the world map</div>
        </Link>
        <Link to="/friends" className="feature-card">
          <Users size={28} />
          <div className="feature-card-title">Friends</div>
          <div className="feature-card-desc">Manage friends and view shared memories together</div>
        </Link>
      </div>

      {/* Recent entries */}
      {recent.length > 0 && (
        <>
          <p className="section-title" style={{ marginTop: 40 }}>Recently added</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recent.map(entry => (
              <Link to={`/entry/${entry.id}`} key={entry.id} style={{ display: 'block' }}>
                <div className="entry-card">
                  <div className="entry-card-header">
                    <div>
                      <div className="entry-card-title">{entry.title}</div>
                      <div className="entry-card-meta">
                        <span>{formatDate(entry.date || entry.createdAt)}</span>
                        {entry.location && <span><MapPin size={12} />{entry.location.name}</span>}
                        {entry.images?.length > 0 && <span><Image size={12} />{entry.images.length} {entry.images.length === 1 ? 'photo' : 'photos'}</span>}
                      </div>
                    </div>
                    {entry.images?.[0] && <img src={entry.images[0]} alt="" className="entry-card-thumb" />}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <Link to="/memorys" className="btn btn-secondary" style={{ marginTop: 12 }}>
            View all memories →
          </Link>
        </>
      )}
    </div>
  )
}
