# Fotoalbum

A personal photo diary web app built with React. Capture memories with photos, written entries, locations on a map, weather data, and friends — all stored locally in your browser.

---

## Features

### Memories
Browse all your entries as a photo album. Each entry shows its cover photo, date, title, and location. Use the search bar to filter by title, location, or text, and filter by entry type (Journal Entry, Poem, Thoughts).

### New Entry
Create an entry with:
- **Rich text editor** — bold, italic, underline, text colors, and highlighter
- **Entry type** — Journal Entry, Poem, or Thoughts
- **Photos** — upload up to 15 photos, each with an optional caption
- **Video** — attach a short video clip
- **Song** — attach an audio file that plays while reading the entry
- **Location** — search by street, city, or place name (powered by OpenStreetMap / Nominatim)
- **Pin color** — choose a color for the map marker
- **Friends** — tag friends who were part of the memory

### Photo Arrangement
After saving an entry with photos, you are taken to an arrangement page. Each photo count from 1 to 15 has its own unique editorial grid layout. Tap two photos to swap their positions until the layout looks just right.

### Entry Detail
Reading an entry shows:
- Photos in a full-width hero grid at the top
- Title, date, entry type, and weather conditions for that day
- Body text below
- A music player if a song was attached
- A friends box listing everyone tagged
- An interactive map showing the exact location (street-level)

### Map
A full-screen interactive map showing all entries that have a location. Click a marker to see a preview and jump to the full entry. From the Memories list, each card also has a direct button to focus that entry on the map.

### Friends
Manage a list of friends with profile photos and color avatars. Tag friends in entries and view all shared memories on their profile page.

### Weather
Historical and forecast weather is automatically fetched from the [Open-Meteo API](https://open-meteo.com/) based on the entry's location and date. Shown as a small badge (temperature range + condition).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build tool | Vite |
| Routing | React Router v6 |
| Rich text | TipTap (StarterKit, Underline, Color, Highlight) |
| Maps | Leaflet + react-leaflet |
| Icons | Lucide React |
| Geocoding | OpenStreetMap Nominatim API |
| Weather | Open-Meteo API |
| Storage | localStorage (no backend required) |

---

## Getting Started

**Prerequisites:** 

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app runs entirely in the browser — no server, no database, no account needed. All data is saved in `localStorage`.

---

## Project Structure

```
src/
├── assets/          # Static assets (app icon)
├── components/      # Reusable UI components
│   ├── EntryForm.jsx      # Create/edit form with all fields
│   ├── Navigation.jsx     # Top navigation bar
│   ├── PhotoGrid.jsx      # Adaptive photo grid (1–15 photos)
│   ├── MiniMap.jsx        # Embedded map preview
│   └── RichEditor.jsx     # TipTap rich text editor
├── context/         # React Context for global state
│   ├── DiaryContext.jsx   # Entries (CRUD, localStorage)
│   └── FriendsContext.jsx # Friends (CRUD, localStorage)
├── pages/           # Route-level page components
│   ├── Landing.jsx        # Home / start page
│   ├── Memorys.jsx        # Entry list with search & filter
│   ├── NewEntry.jsx       # Create new entry
│   ├── EditEntry.jsx      # Edit existing entry
│   ├── EntryDetail.jsx    # Read a single entry
│   ├── PhotoArrange.jsx   # Arrange photo order after saving
│   ├── MapView.jsx        # Full-screen map of all locations
│   ├── Friends.jsx        # Friends list
│   └── FriendProfile.jsx  # Single friend profile & shared memories
└── utils/
    ├── api.js             # Nominatim, Open-Meteo, image compression
    └── photoLayouts.js    # Grid config for each photo count (1–15)
```

---

## APIs Used

- **[Nominatim](https://nominatim.openstreetmap.org/)** — free geocoding API by OpenStreetMap, used for location search and reverse geocoding
- **[Open-Meteo](https://open-meteo.com/)** — free weather API, used to fetch historical and forecast weather for entry dates

Both APIs are free and require no API key.
