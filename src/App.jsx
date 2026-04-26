import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DiaryProvider } from './context/DiaryContext'
import { FriendsProvider } from './context/FriendsContext'
import Navigation from './components/Navigation'
import Landing from './pages/Landing'
import Memorys from './pages/Memorys'
import NewEntry from './pages/NewEntry'
import EditEntry from './pages/EditEntry'
import MapView from './pages/MapView'
import EntryDetail from './pages/EntryDetail'
import Friends from './pages/Friends'
import FriendProfile from './pages/FriendProfile'
import PhotoArrange from './pages/PhotoArrange'

export default function App() {
  return (
    <FriendsProvider>
      <DiaryProvider>
        <BrowserRouter>
          <div className="app-wrapper">
            <Navigation />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/memorys" element={<Memorys />} />
                <Route path="/new" element={<NewEntry />} />
                <Route path="/edit/:id" element={<EditEntry />} />
                <Route path="/map" element={<MapView />} />
                <Route path="/entry/:id" element={<EntryDetail />} />
                <Route path="/arrange/:id" element={<PhotoArrange />} />
                <Route path="/friends" element={<Friends />} />
                <Route path="/friends/:id" element={<FriendProfile />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </DiaryProvider>
    </FriendsProvider>
  )
}
