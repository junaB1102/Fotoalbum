const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org'

const headers = {
  'Accept-Language': 'de,en;q=0.9',
  'User-Agent': 'DiaryMapApp/1.0',
}

/**
 * Search for locations by name using OpenStreetMap Nominatim API.
 * Returns array of results with lat, lon, display_name, place_id.
 */
export async function searchLocation(query) {
  if (!query.trim()) return []
  const url = `${NOMINATIM_BASE}/search?format=json&q=${encodeURIComponent(query)}&limit=8&addressdetails=1&namedetails=1`
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`Nominatim search failed: ${res.status}`)
  return res.json()
}

/**
 * Reverse geocode lat/lng to a human-readable place name.
 */
export async function reverseGeocode(lat, lng) {
  const url = `${NOMINATIM_BASE}/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14`
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`Reverse geocode failed: ${res.status}`)
  return res.json()
}

// WMO weather code → emoji + label
const WEATHER_CODES = {
  0:  { emoji: '☀️',  label: 'Klarer Himmel' },
  1:  { emoji: '🌤️', label: 'Überwiegend klar' },
  2:  { emoji: '⛅',  label: 'Teils bewölkt' },
  3:  { emoji: '☁️',  label: 'Bewölkt' },
  45: { emoji: '🌫️', label: 'Nebel' },
  48: { emoji: '🌫️', label: 'Reifnebel' },
  51: { emoji: '🌦️', label: 'Leichter Nieselregen' },
  53: { emoji: '🌦️', label: 'Nieselregen' },
  55: { emoji: '🌧️', label: 'Starker Nieselregen' },
  61: { emoji: '🌧️', label: 'Leichter Regen' },
  63: { emoji: '🌧️', label: 'Regen' },
  65: { emoji: '🌧️', label: 'Starker Regen' },
  71: { emoji: '❄️',  label: 'Leichter Schneefall' },
  73: { emoji: '❄️',  label: 'Schneefall' },
  75: { emoji: '❄️',  label: 'Starker Schneefall' },
  80: { emoji: '🌦️', label: 'Regenschauer' },
  81: { emoji: '🌧️', label: 'Starke Regenschauer' },
  82: { emoji: '⛈️', label: 'Heftige Schauer' },
  85: { emoji: '🌨️', label: 'Schneeschauer' },
  86: { emoji: '🌨️', label: 'Starke Schneeschauer' },
  95: { emoji: '⛈️', label: 'Gewitter' },
  96: { emoji: '⛈️', label: 'Gewitter mit Hagel' },
  99: { emoji: '⛈️', label: 'Starkes Gewitter' },
}

/**
 * Fetch weather for a given location and date using Open-Meteo.
 * Uses archive API for past dates, forecast API for today/future.
 * Returns { tempMin, tempMax, emoji, label } or null on error.
 */
export async function getWeather(lat, lng, date) {
  try {
    const today = new Date().toISOString().slice(0, 10)
    const isPast = date < today
    const base = isPast
      ? 'https://archive-api.open-meteo.com/v1/archive'
      : 'https://api.open-meteo.com/v1/forecast'
    const url = `${base}?latitude=${lat}&longitude=${lng}&start_date=${date}&end_date=${date}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    const code    = data.daily?.weathercode?.[0]
    const tempMax = data.daily?.temperature_2m_max?.[0]
    const tempMin = data.daily?.temperature_2m_min?.[0]
    if (tempMax == null) return null
    const weather = WEATHER_CODES[code] || { emoji: '🌡️', label: 'Unbekannt' }
    return { tempMin: Math.round(tempMin), tempMax: Math.round(tempMax), ...weather }
  } catch {
    return null
  }
}

/**
 * Compress an image file to a base64 string with max width/height.
 */
export function compressImage(file, maxSize = 800) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img
        if (width > height) {
          if (width > maxSize) { height = (height * maxSize) / width; width = maxSize }
        } else {
          if (height > maxSize) { width = (width * maxSize) / height; height = maxSize }
        }
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.75))
      }
      img.onerror = reject
      img.src = e.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Read a video file as a base64 data URL (no compression).
 */
export function readVideoAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
