import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

function coloredIcon(color) {
  const c = color || '#1b4332'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
    <path d="M12 0C5.4 0 0 5.4 0 12c0 7.2 12 24 12 24s12-16.8 12-24C24 5.4 18.6 0 12 0z" fill="${c}" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
    <circle cx="12" cy="12" r="5" fill="white" opacity="0.9"/>
  </svg>`
  return L.divIcon({ html: svg, className: '', iconSize: [24, 36], iconAnchor: [12, 36], popupAnchor: [0, -38] })
}

export default function MiniMap({ location, pinColor, interactive = false, zoom = 14 }) {
  if (!location) return null
  return (
    <div className="minimap-wrapper">
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={interactive}
        dragging={interactive}
        zoomControl={interactive}
        doubleClickZoom={interactive}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[location.lat, location.lng]} icon={coloredIcon(pinColor)} />
      </MapContainer>
    </div>
  )
}
