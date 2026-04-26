import { useState, useCallback } from 'react'
import { MapPin, X, ImagePlus, Video, Loader, UserPlus, Check, ExternalLink, Music } from 'lucide-react'
import { searchLocation, compressImage, readVideoAsDataUrl } from '../utils/api'
import { Link } from 'react-router-dom'
import RichEditor from './RichEditor'
import MiniMap from './MiniMap'
import { useFriends } from '../context/FriendsContext'

const ENTRY_TYPES = [
  { value: 'tagebuch', label: 'Journal Entry' },
  { value: 'gedicht',  label: 'Poem' },
  { value: 'gedanken', label: 'Thoughts' },
]

const PIN_COLORS = [
  { value: '#e74c3c', label: 'Red' },
  { value: '#e67e22', label: 'Orange' },
  { value: '#f1c40f', label: 'Yellow' },
  { value: '#27ae60', label: 'Green' },
  { value: '#2980b9', label: 'Blue' },
  { value: '#8e44ad', label: 'Purple' },
  { value: '#e91e8c', label: 'Pink' },
]

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function EntryForm({ initial = {}, onSubmit, submitLabel = 'Speichern' }) {
  const { friends, addFriend } = useFriends()

  const [title, setTitle]               = useState(initial.title || '')
  const [date, setDate]                 = useState(initial.date || new Date().toISOString().slice(0, 10))
  const [type, setType]                 = useState(initial.type || 'tagebuch')
  const [richText, setRichText]         = useState(initial.richText || initial.text || '')
  const [location, setLocation]         = useState(initial.location || null)
  const [locationQuery, setLocationQuery] = useState(initial.location?.name || '')
  const [pinColor, setPinColor]         = useState(initial.pinColor || '#e74c3c')
  const [suggestions, setSuggestions]   = useState([])
  const [locLoading, setLocLoading]     = useState(false)
  const [images, setImages]             = useState(initial.images || [])
  const [imageCaptions, setImageCaptions] = useState(initial.imageCaptions || [])
  const [video, setVideo]               = useState(initial.video || null)
  const [song, setSong]                 = useState(initial.song || null)
  const [songTitle, setSongTitle]       = useState(initial.songTitle || '')
  const [taggedFriends, setTaggedFriends] = useState(initial.taggedFriends || [])
  const [newFriendName, setNewFriendName] = useState('')
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [saving, setSaving]             = useState(false)
  const [error, setError]               = useState('')

  const searchDebounced = useCallback(async (q) => {
    if (!q.trim()) { setSuggestions([]); return }
    setLocLoading(true)
    try {
      const results = await searchLocation(q)
      setSuggestions(results)
    } catch { setSuggestions([]) }
    finally { setLocLoading(false) }
  }, [])

  function handleLocationInput(e) {
    const val = e.target.value
    setLocationQuery(val)
    if (!val.trim()) { setLocation(null); setSuggestions([]); return }
    searchDebounced(val)
  }

  function pickSuggestion(s) {
    setLocation({ lat: parseFloat(s.lat), lng: parseFloat(s.lon), name: s.display_name.split(',').slice(0, 2).join(', ') })
    setLocationQuery(s.display_name.split(',').slice(0, 2).join(', '))
    setSuggestions([])
  }

  function clearLocation() { setLocation(null); setLocationQuery(''); setSuggestions([]) }

  async function handleImages(e) {
    const files = Array.from(e.target.files)
    for (const file of files) {
      setImages(prev => {
        if (prev.filter(Boolean).length >= 15) return prev
        return [...prev, null]
      })
      const b64 = await compressImage(file)
      setImages(prev => {
        const a = [...prev]
        const idx = a.lastIndexOf(null)
        if (idx === -1) return prev
        a[idx] = b64
        return a.filter(Boolean).slice(0, 15)
      })
    }
    e.target.value = ''
  }

  async function handleVideo(e) {
    const file = e.target.files[0]
    if (!file) return
    setVideo(await readVideoAsDataUrl(file))
    e.target.value = ''
  }

  async function handleSong(e) {
    const file = e.target.files[0]
    if (!file) return
    if (!songTitle) setSongTitle(file.name.replace(/\.[^.]+$/, ''))
    const reader = new FileReader()
    reader.onload = ev => setSong(ev.target.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function toggleFriend(id) {
    setTaggedFriends(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])
  }

  function handleAddFriend(e) {
    e.preventDefault()
    if (!newFriendName.trim()) return
    const f = addFriend(newFriendName)
    if (f) setTaggedFriends(prev => [...prev, f.id])
    setNewFriendName('')
    setShowAddFriend(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) { setError('Please enter a title.'); return }
    setSaving(true); setError('')
    try {
      await onSubmit({ title: title.trim(), date, type, richText, text: richText, location, pinColor, images, imageCaptions, video, song, songTitle, taggedFriends })
    } catch {
      setError('Error saving entry.')
      setSaving(false)
    }
  }

  const placeholders = {
    tagebuch:  'What did you experience, see, feel today?',
    gedicht:   'Let words become melody…',
    gedanken:  'Let your thoughts flow, without filter…',
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{ background: '#fde8e8', color: '#c81e1e', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontFamily: 'system-ui,sans-serif', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      {/* ── Notebook page ── */}
      <div className="notebook-page">

        {/* Banner image */}
        {images[0] && (
          <div className="notebook-banner">
            <img src={images[0]} alt="" />
          </div>
        )}

        {/* Title + Date row */}
        <div className="notebook-header-row">
          <input
            className="notebook-title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Title…"
          />
          <input
            className="notebook-date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>

        <div className="notebook-divider" />

        {/* Rich text editor */}
        <RichEditor
          content={richText}
          onChange={setRichText}
          placeholder={placeholders[type] || placeholders.tagebuch}
        />
      </div>

      {/* ── Entry type ── */}
      <div className="nb-section">
        <p className="form-label" style={{ marginBottom: 10 }}>Entry type</p>
        <div className="type-selector">
          {ENTRY_TYPES.map(t => (
            <span key={t.value}>
              <input
                type="radio"
                id={`type-${t.value}`}
                name="entry-type"
                value={t.value}
                checked={type === t.value}
                onChange={() => setType(t.value)}
                className="type-option"
              />
              <label htmlFor={`type-${t.value}`} className="type-label">{t.label}</label>
            </span>
          ))}
        </div>
      </div>

      {/* ── Location ── */}
      <div className="nb-section">
        <p className="form-label" style={{ marginBottom: 8 }}>Location</p>
        <div style={{ position: 'relative' }}>
          <input
            className="form-input"
            value={locationQuery}
            onChange={handleLocationInput}
            placeholder="Street, house number, city…"
            style={{ paddingRight: location ? 36 : 14 }}
            autoComplete="off"
          />
          {locLoading && <Loader size={14} className="loc-spinner" />}
          {location && !locLoading && (
            <button type="button" onClick={clearLocation} className="loc-clear"><X size={14} /></button>
          )}
          {suggestions.length > 0 && (
            <div className="location-suggestions">
              {suggestions.map(s => (
                <div key={s.place_id} className="location-suggestion" onClick={() => pickSuggestion(s)}>
                  {s.display_name}
                </div>
              ))}
            </div>
          )}
        </div>
        {location && <div className="location-tag"><MapPin size={12} /> {location.name}</div>}

        {location && <MiniMap location={location} pinColor={pinColor} />}

        {location && (
          <div style={{ marginTop: 12 }}>
            <p className="form-label" style={{ marginBottom: 8 }}>Pin color</p>
            <div className="color-picker">
              {PIN_COLORS.map(c => (
                <span key={c.value}>
                  <input type="radio" id={`pin-${c.value}`} name="pin-color" value={c.value}
                    checked={pinColor === c.value} onChange={() => setPinColor(c.value)} className="color-swatch-input" />
                  <label htmlFor={`pin-${c.value}`} className="color-swatch" title={c.label} style={{ background: c.value }} />
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Fotos ── */}
      <div className="nb-section">
        <p className="form-label" style={{ marginBottom: 8 }}>Photos</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {images.map((src, i) => src && (
            <div key={i} className="photo-caption-row">
              <div className="media-thumb" style={{ flexShrink: 0, width: 100 }}>
                <img src={src} alt="" />
                <button type="button" className="media-thumb-remove" onClick={() => { setImages(p => p.filter((_, idx) => idx !== i)); setImageCaptions(p => p.filter((_, idx) => idx !== i)) }}>×</button>
              </div>
              <input
                className="form-input photo-caption-input"
                value={imageCaptions[i] || ''}
                onChange={e => {
                  const val = e.target.value
                  setImageCaptions(prev => { const n = [...prev]; n[i] = val; return n })
                }}
                placeholder="Caption…"
              />
            </div>
          ))}
          {images.length < 15
            ? (
              <label className="upload-btn" style={{ maxWidth: 160 }}>
                <ImagePlus size={20} /><span>Add photo</span>
                <input type="file" accept="image/*" multiple hidden onChange={handleImages} />
              </label>
            ) : (
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Maximum of 15 photos reached.</p>
            )
          }
        </div>
      </div>

      {/* ── Video ── */}
      <div className="nb-section">
        <p className="form-label" style={{ marginBottom: 8 }}>Video</p>

        {video ? (
          <div className="media-thumb" style={{ maxWidth: 240 }}>
            <video src={video} controls />
            <button type="button" className="media-thumb-remove" onClick={() => setVideo(null)}>×</button>
          </div>
        ) : (
          <label className="upload-btn" style={{ maxWidth: 140 }}>
            <Video size={20} /><span>Video</span>
            <input type="file" accept="video/*" hidden onChange={handleVideo} />
          </label>
        )}
      </div>

      {/* ── Song ── */}
      <div className="nb-section">
        <p className="form-label" style={{ marginBottom: 8 }}>Song</p>

        {song ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-2)', borderRadius: 8, padding: '8px 12px', border: '1px solid var(--border)' }}>
              <Music size={15} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              <input
                className="form-input"
                value={songTitle}
                onChange={e => setSongTitle(e.target.value)}
                placeholder="Song title…"
                style={{ border: 'none', background: 'transparent', padding: 0, fontStyle: 'italic' }}
              />
            </div>
            <button type="button" className="btn btn-ghost" style={{ padding: '6px 10px' }} onClick={() => { setSong(null); setSongTitle('') }}>
              <X size={14} />
            </button>
          </div>
        ) : (
          <label className="upload-btn" style={{ maxWidth: 160 }}>
            <Music size={20} /><span>Add song</span>
            <input type="file" accept="audio/*" hidden onChange={handleSong} />
          </label>
        )}
      </div>

      {/* ── Friends ── */}
      <div className="nb-section">
        <p className="form-label" style={{ marginBottom: 10 }}>Who was there?</p>
        <div className="friends-row">
          {friends.map(f => {
            const tagged = taggedFriends.includes(f.id)
            return (
              <span key={f.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                <button
                  type="button"
                  className={'friend-chip' + (tagged ? ' tagged' : '')}
                  style={{ '--fc': f.color }}
                  onClick={() => toggleFriend(f.id)}
                  title={f.name}
                >
                  <span className="friend-avatar" style={{ background: f.photo ? 'transparent' : undefined }}>
                    {f.photo ? <img src={f.photo} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : initials(f.name)}
                  </span>
                  <span className="friend-name">{f.name}</span>
                  {tagged && <Check size={12} className="friend-check" />}
                </button>
                <Link to={`/friends/${f.id}`} tabIndex={-1} style={{ color: 'var(--text-muted)', display: 'flex', padding: '2px 2px' }} title="Profil ansehen">
                  <ExternalLink size={11} />
                </Link>
              </span>
            )
          })}

          {showAddFriend ? (
            <form onSubmit={handleAddFriend} className="add-friend-inline">
              <input
                autoFocus
                value={newFriendName}
                onChange={e => setNewFriendName(e.target.value)}
                placeholder="Name…"
                className="add-friend-input"
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '5px 12px', fontSize: '0.82rem' }}>+</button>
              <button type="button" className="btn btn-ghost" style={{ padding: '5px 10px' }} onClick={() => setShowAddFriend(false)}>
                <X size={13} />
              </button>
            </form>
          ) : (
            <button type="button" className="add-friend-btn" onClick={() => setShowAddFriend(true)}>
              <UserPlus size={14} /> Add friend
            </button>
          )}
        </div>
      </div>

      <div className="nb-section" style={{ borderTop: 'none', paddingTop: 0 }}>
        <button type="submit" className="btn btn-primary" disabled={saving} style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
          {saving ? 'Saving…' : submitLabel}
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }`}</style>
    </form>
  )
}
