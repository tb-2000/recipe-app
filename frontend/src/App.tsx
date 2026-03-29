import { Routes, Route, Navigate, NavLink} from 'react-router-dom'
import RecipeDetail from './pages/RecipeDetail'
import Home from './pages/Home'
import Overview from './pages/Overview'
import NotFound from './pages/NotFound'
import './App.css'
import EditRecipe from './pages/EditRecipe'
import EditRecipes from './pages/EditRecipes'
import SubmitRecipe from './pages/SubmitRecipe'
import Wishlist from './pages/Wishlist'
import ChefImg from "./logos/chef-hat.png"
import { useState } from 'react'

function App() {

  return (
    <>
      <div className="container">
        <nav className="nav">
          <span className="website-name">Lecker-Essen</span>
          <img src={ChefImg} alt="chef hat logo" className="logo"/>
          <NavLink to="/home" className="nav-link">Home</NavLink>
          <NavLink to="/rezepte" className="nav-link">Recipes</NavLink>
          <NavLink to="/submit" className="nav-link">Submit Recipe</NavLink>
          <NavLink to="/edit/rezepte" className="nav-link">Edit Recipes</NavLink>
          <NavLink to="/rezepte/wunschliste" className="nav-link">Kochbuch</NavLink>
        </nav>
      </div>

      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/rezepte" element={<Overview />} />
        <Route path="/rezepte/:id" element={<RecipeDetail />} />
        <Route path="/submit" element={<SubmitRecipe edit={false} defaultRecipe={{}} defaultCategories={[""]} />} />
        <Route path="/edit/rezepte" element={<EditRecipes />} />
        <Route path="/edit/rezepte/:id" element={<EditRecipe />} />
        <Route path="/rezepte/wunschliste" element={<Wishlist />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
