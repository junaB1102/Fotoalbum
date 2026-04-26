import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDiary } from '../context/DiaryContext'
import { useFriends } from '../context/FriendsContext'
import { MapPin, Edit2, Trash2, ArrowLeft, Map, Music, Play, Pause } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import MiniMap from '../components/MiniMap'
import PhotoGrid from '../components/PhotoGrid'
import { getWeather } from '../utils/api'

const TYPE_LABEL = { gedicht: 'Poem', tagebuch: 'Journal Entry', gedanken: 'Thoughts' }

function formatDateHandwritten(iso) {
  return new Date(iso).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })
}

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function EntryDetail() {
  const { id } = useParams()
  const { getEntry, deleteEntry } = useDiary()
  const { getFriend } = useFriends()
  const navigate = useNavigate()
  const entry = getEntry(id)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [weather, setWeather] = useState(null)
  const [lightbox, setLightbox] = useState(null)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    if (entry?.location && entry?.date) {
      getWeather(entry.location.lat, entry.location.lng, entry.date).then(setWeather)
    }
  }, [entry?.id])

  if (!entry) {
    return (
      <div className="page">
        <div className="empty">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">Entry not found</div>
          <Link to="/memorys" className="btn btn-secondary"><ArrowLeft size={16} /> Back</Link>
        </div>
      </div>
    )
  }

  const taggedFriends = (entry.taggedFriends || []).map(id => getFriend(id)).filter(Boolean)
  const allMedia = [
    ...(entry.images || []).map(src => ({ type: 'image', src })),
    ...(entry.video ? [{ type: 'video', src: entry.video }] : []),
  ]
  const bodyContent = entry.richText || entry.text
  const hasPhotos = allMedia.length > 0

  function handleDelete() {
    deleteEntry(id)
    navigate('/memorys')
  }

  function togglePlay() {
    if (!audioRef.current) return
    if (playing) { audioRef.current.pause(); setPlaying(false) }
    else { audioRef.current.play(); setPlaying(true) }
  }

  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <Link to="/memorys" className="btn btn-ghost" style={{ marginBottom: 16, display: 'inline-flex' }}>
        <ArrowLeft size={16} /> Memories
      </Link>

      {/* ── Photos: hero block ── */}
      {hasPhotos && (
        <div className="entry-photo-hero">
          <PhotoGrid
            media={allMedia}
            captions={entry.imageCaptions || []}
            onLightbox={setLightbox}
          />
        </div>
      )}

      {/* ── Caption area: title + meta + body ── */}
      <div className="entry-caption-area">

        {/* Title row with date */}
        <div className="entry-caption-title-row">
          <h1 className="entry-caption-title">{entry.title}</h1>
          <span className="entry-caption-date">{formatDateHandwritten(entry.date || entry.createdAt)}</span>
        </div>

        {entry.type && <div className="entry-caption-type">{TYPE_LABEL[entry.type] || entry.type}</div>}

        {weather && (
          <div className="entry-weather-badge">
            <span>{weather.emoji}</span>
            <span>{weather.tempMin}°–{weather.tempMax}°C &middot; {weather.label}</span>
          </div>
        )}

        <div className="entry-caption-rule" />

        {/* Song player */}
        {entry.song && (
          <div className="song-player" style={{ marginBottom: 16 }}>
            <button className="song-player-icon" onClick={togglePlay} type="button">
              {playing ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <div className="song-player-info">
              <div className="song-player-title">{entry.songTitle || 'Song'}</div>
              <div className="song-player-sub">This memory</div>
            </div>
            <Music size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <audio
              ref={audioRef}
              src={entry.song}
              onEnded={() => setPlaying(false)}
              onPause={() => setPlaying(false)}
              onPlay={() => setPlaying(true)}
            />
          </div>
        )}

        {bodyContent && (
          <div className="entry-caption-body rich-output" dangerouslySetInnerHTML={{ __html: bodyContent }} />
        )}

        {/* Friends box */}
        {taggedFriends.length > 0 && (
          <div className="friends-box">
            <div className="friends-box-label">Friends</div>
            <div className="friends-box-chips">
              {taggedFriends.map(f => (
                <Link key={f.id} to={`/friends/${f.id}`} className="detail-friend-chip" style={{ '--fc': f.color, textDecoration: 'none' }}>
                  <span className="friend-avatar" style={{ width: 20, height: 20, fontSize: '0.6rem' }}>
                    {f.photo
                      ? <img src={f.photo} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                      : initials(f.name)}
                  </span>
                  {f.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Map below */}
      {entry.location && (
        <div className="detail-location-block" style={{ marginTop: 24 }}>
          <div className="detail-location-row">
            <MapPin size={14} />
            <span>{entry.location.name}</span>
            <Link to={`/map?focus=${id}`} className="btn btn-ghost" style={{ padding: '2px 8px', fontSize: '0.8rem', marginLeft: 'auto' }}>
              <Map size={13} /> Full map
            </Link>
          </div>
          <MiniMap location={entry.location} pinColor={entry.pinColor} interactive zoom={17} />
        </div>
      )}

      {/* Actions */}
      <div className="detail-actions">
        <Link to={`/edit/${id}`} className="btn btn-secondary">
          <Edit2 size={15} /> Edit
        </Link>
        {confirmDelete ? (
          <>
            <button className="btn btn-danger" onClick={handleDelete}><Trash2 size={15} /> Delete forever</button>
            <button className="btn btn-ghost" onClick={() => setConfirmDelete(false)}>Cancel</button>
          </>
        ) : (
          <button className="btn btn-ghost" style={{ color: 'var(--danger)' }} onClick={() => setConfirmDelete(true)}>
            <Trash2 size={15} /> Delete
          </button>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="" className="lightbox-img" />
        </div>
      )}
    </div>
  )
}
