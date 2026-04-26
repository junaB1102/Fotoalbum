import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDiary } from '../context/DiaryContext'
import { Plus, Image, Search, MapPin, Map } from 'lucide-react'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })
}

const TYPE_LABEL = { gedicht: 'Poem', tagebuch: 'Journal Entry', gedanken: 'Thoughts' }
const TYPES = [
  { value: '',          label: 'All' },
  { value: 'tagebuch',  label: 'Journal Entry' },
  { value: 'gedicht',   label: 'Poem' },
  { value: 'gedanken',  label: 'Thoughts' },
]

export default function Memorys() {
  const { entries } = useDiary()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const filtered = [...entries]
    .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
    .filter(e => {
      const q = query.toLowerCase()
      const matchText = !q ||
        e.title?.toLowerCase().includes(q) ||
        e.location?.name?.toLowerCase().includes(q) ||
        e.text?.toLowerCase().includes(q)
      const matchType = !typeFilter || e.type === typeFilter
      return matchText && matchType
    })

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 2 }}>Memories</h1>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'system-ui,sans-serif', fontSize: '0.9rem' }}>
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </p>
        </div>
        <Link to="/new" className="btn btn-primary">
          <Plus size={16} /> New
        </Link>
      </div>

      {/* Search */}
      <div className="search-bar">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Search by title, location or text…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {/* Type filter */}
      <div className="type-selector" style={{ marginBottom: 24 }}>
        {TYPES.map(t => (
          <span key={t.value}>
            <input
              type="radio"
              id={`filter-${t.value}`}
              name="type-filter"
              checked={typeFilter === t.value}
              onChange={() => setTypeFilter(t.value)}
              className="type-option"
            />
            <label htmlFor={`filter-${t.value}`} className="type-label">{t.label}</label>
          </span>
        ))}
      </div>

      {entries.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📷</div>
          <div className="empty-title">No memories yet</div>
          <p>Add your first memory.</p>
          <Link to="/new" className="btn btn-primary" style={{ marginTop: 12 }}>
            <Plus size={16} /> Create first memory
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">No results</div>
          <p>No entries match your search.</p>
        </div>
      ) : (
        <div className="album-grid">
          {filtered.map(entry => (
            <div key={entry.id} className="album-card-wrapper">
              <Link to={`/entry/${entry.id}`} className="album-card">
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
                  {entry.location && (
                    <div className="album-location">
                      <MapPin size={11} /> {entry.location.name}
                    </div>
                  )}
                </div>
              </Link>
              {entry.location && (
                <button
                  className="album-map-btn"
                  title="Show on map"
                  onClick={() => navigate(`/map?focus=${entry.id}`)}
                >
                  <Map size={13} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
