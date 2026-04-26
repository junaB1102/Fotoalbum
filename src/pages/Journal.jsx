import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDiary } from '../context/DiaryContext'
import { MapPin, BookOpen, Image, Search, Plus } from 'lucide-react'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function Journal() {
  const { entries } = useDiary()
  const [query, setQuery] = useState('')

  const filtered = entries.filter(e => {
    const q = query.toLowerCase()
    return (
      e.title?.toLowerCase().includes(q) ||
      e.text?.toLowerCase().includes(q) ||
      e.location?.name?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <h1 className="page-title">Tagebuch</h1>
        <Link to="/new" className="btn btn-primary" style={{ marginTop: 6 }}>
          <Plus size={16} /> Neu
        </Link>
      </div>
      <p className="page-subtitle">{entries.length} Eintrag{entries.length !== 1 ? 'e' : ''} insgesamt</p>

      <div className="search-bar">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Einträge durchsuchen…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {entries.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📔</div>
          <div className="empty-title">Noch keine Einträge</div>
          <p>Dein Tagebuch ist noch leer.</p>
          <Link to="/new" className="btn btn-primary"><Plus size={16} /> Ersten Eintrag erstellen</Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">Keine Treffer</div>
          <p>Keine Einträge für „{query}" gefunden.</p>
        </div>
      ) : (
        filtered.map(entry => (
          <Link to={`/entry/${entry.id}`} key={entry.id} style={{ display: 'block' }}>
            <div className="entry-card">
              <div className="entry-card-header">
                <div>
                  <div className="entry-card-title">{entry.title}</div>
                  <div className="entry-card-meta">
                    <span><BookOpen size={12} />{formatDate(entry.date || entry.createdAt)}</span>
                    {entry.location && <span><MapPin size={12} />{entry.location.name}</span>}
                    {entry.images?.length > 0 && <span><Image size={12} />{entry.images.length} Foto{entry.images.length > 1 ? 's' : ''}</span>}
                  </div>
                </div>
                {entry.images?.[0] && (
                  <img src={entry.images[0]} alt="" className="entry-card-thumb" />
                )}
              </div>
              {entry.text && <div className="entry-card-preview">{entry.text}</div>}
            </div>
          </Link>
        ))
      )}
    </div>
  )
}
