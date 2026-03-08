import { Routes, Route, Navigate, NavLink} from 'react-router-dom'
import RecipeDetail from './pages/RecipeDetail'
import Home from './pages/Home'
import Overview from './pages/Overview'
import NotFound from './pages/NotFound'
import './App.css'

function App() {
  return (
    <>
      <nav className="nav">
        <NavLink to="/home" className="nav-link">Home</NavLink> |{" "}
        <NavLink to="/rezepte" className="nav-link">Rezepte</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/rezepte" element={<Overview />} />
        <Route path="/rezepte/:id" element={<RecipeDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
