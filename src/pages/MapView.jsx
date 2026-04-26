import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDiary } from '../context/DiaryContext'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

function coloredIcon(color) {
  const c = color || '#e74c3c'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
    <path d="M12 0C5.4 0 0 5.4 0 12c0 7.2 12 24 12 24s12-16.8 12-24C24 5.4 18.6 0 12 0z" fill="${c}" stroke="rgba(0,0,0,0.25)" stroke-width="1"/>
    <circle cx="12" cy="12" r="5" fill="white" opacity="0.9"/>
  </svg>`
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -38],
  })
}

function FocusEntries({ entries, focusId }) {
  const map = useMap()
  useEffect(() => {
    if (focusId) {
      const entry = entries.find(e => e.id === focusId)
      if (entry?.location) map.setView([entry.location.lat, entry.location.lng], 13)
    } else if (entries.length === 1) {
      map.setView([entries[0].location.lat, entries[0].location.lng], 10)
    } else if (entries.length > 1) {
      const bounds = L.latLngBounds(entries.map(e => [e.location.lat, e.location.lng]))
      map.fitBounds(bounds, { padding: [40, 40] })
    }
  }, [focusId, entries, map])
  return null
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function MapView() {
  const { entries } = useDiary()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const focusId = searchParams.get('focus')

  const withLocation = entries.filter(e => e.location)

  return (
    <div style={{ position: 'fixed', top: 'var(--nav-h)', left: 0, right: 0, bottom: 0 }}>
      {withLocation.length === 0 ? (
        <div className="page">
          <div className="empty" style={{ paddingTop: 80 }}>
            <div className="empty-icon">🗺️</div>
            <div className="empty-title">No locations yet</div>
            <p>Add a location to your entries to see them on the map.</p>
          </div>
        </div>
      ) : (
        <MapContainer center={[48.8566, 2.3522]} zoom={4} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FocusEntries entries={withLocation} focusId={focusId} />
          {withLocation.map(entry => (
            <Marker
              key={entry.id}
              position={[entry.location.lat, entry.location.lng]}
              icon={coloredIcon(entry.pinColor)}
            >
              <Popup>
                {entry.images?.[0] && (
                  <img src={entry.images[0]} alt="" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 6, marginBottom: 6 }} />
                )}
                <div className="map-popup-title">{entry.title}</div>
                <div className="map-popup-date">{formatDate(entry.date || entry.createdAt)}</div>
                {entry.location.name && <div className="map-popup-date" style={{ marginTop: 2 }}>{entry.location.name}</div>}
                <a
                  className="map-popup-link"
                  href={`/entry/${entry.id}`}
                  onClick={e => { e.preventDefault(); navigate(`/entry/${entry.id}`) }}
                >
                  Read entry →
                </a>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  )
}
