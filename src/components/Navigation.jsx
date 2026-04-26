import { NavLink } from 'react-router-dom'
import { Images, Map, Users } from 'lucide-react'
import cameraIcon from '../assets/kamer.png'

export default function Navigation() {
  return (
    <nav className="nav">
      <NavLink to="/" className="nav-brand" style={{ textDecoration: 'none' }}>
        <img src={cameraIcon} alt="" style={{ height: 42, width: 'auto', display: 'block' }} />
        Fotoalbum
      </NavLink>
      <div className="nav-links">
        <NavLink to="/memorys" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
          <Images size={16} /><span>Memories</span>
        </NavLink>
        <NavLink to="/map" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
          <Map size={16} /><span>Map</span>
        </NavLink>
        <NavLink to="/friends" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
          <Users size={16} /><span>Friends</span>
        </NavLink>
      </div>
    </nav>
  )
}
