import { Link } from 'react-router-dom'
import { useDiary } from '../context/DiaryContext'
import { Plus, Image } from 'lucide-react'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
}

const TYPE_LABEL = { gedicht: 'Gedicht', tagebuch: 'Tagebuch', gedankenflow: 'Gedankenflow' }

export default function Home() {
  const { entries } = useDiary()

  const sorted = [...entries].sort((a, b) => {
    const da = new Date(a.date || a.createdAt)
    const db = new Date(b.date || b.createdAt)
    return db - da
  })

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 2 }}>Memorys</h1>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem' }}>
            {entries.length} Eintrag{entries.length !== 1 ? 'e' : ''}
          </p>
        </div>
        <Link to="/new" className="btn btn-primary">
          <Plus size={16} /> Neu
        </Link>
      </div>

      {entries.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📷</div>
          <div className="empty-title">Noch keine Einträge</div>
          <p>Füge deinen ersten Eintrag mit einem Foto hinzu.</p>
          <Link to="/new" className="btn btn-primary" style={{ marginTop: 12 }}>
            <Plus size={16} /> Ersten Eintrag erstellen
          </Link>
        </div>
      ) : (
        <div className="album-grid">
          {sorted.map(entry => (
            <Link to={`/entry/${entry.id}`} key={entry.id} className="album-card">
              <div className="album-cover">
                {entry.images?.[0] ? (
                  <img src={entry.images[0]} alt={entry.title} className="album-cover-img" />
                ) : (
                  <div className="album-cover-placeholder">
                    <Image size={32} />
                  </div>
                )}
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
      )}
    </div>
  )
}
