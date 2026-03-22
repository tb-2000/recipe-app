import { Routes, Route, Navigate, NavLink} from 'react-router-dom'
import RecipeDetail from './pages/RecipeDetail'
import Home from './pages/Home'
import Overview from './pages/Overview'
import NotFound from './pages/NotFound'
import './App.css'
import EditRecipe from './pages/EditRecipe'
import EditRecipes from './pages/EditRecipes'
import SubmitRecipe from './pages/SubmitRecipe'

function App() {
  return (
    <>
      <nav className="nav">
        <NavLink to="/home" className="nav-link">Home</NavLink> |{" "}
        <NavLink to="/rezepte" className="nav-link">Recipes</NavLink> |{" "}
        <NavLink to="/submit" className="nav-link">Submit Recipe</NavLink> |{" "}
        <NavLink to="/edit/rezepte" className="nav-link">Edit Recipes</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/rezepte" element={<Overview />} />
        <Route path="/rezepte/:id" element={<RecipeDetail />} />
        <Route path="/submit" element={<SubmitRecipe edit={false} defaultRecipe={{}} defaultCategories={[""]}/>} />
        <Route path="/edit/rezepte" element={<EditRecipes />} />
        <Route path="/edit/rezepte/:id" element={<EditRecipe />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
