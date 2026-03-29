import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import api from '../api/api'
import OverviewRecipes from '../components/OverviewRecipes'
import OverviewSearchedRecipes from '../components/OverviewSearchedRecipes'
import '../App.css'

export default function EditRecipes() {
  const [categories, setCategories] = useState<String[]>([])
    const [searchActivated, setSearchActivated] = useState(false)
    const [query, setQuery] = useState('search for recipes...')

    const addCategory = (category: String) => {
        (categories.includes(category)) ? 
        setCategories(categories.filter(c => c !== category)) : 
        setCategories(prevCategories => [...prevCategories, category])
    }

    useEffect(() => {
        console.log(categories)
    }, [categories])
    
    const fetchCategories = async () => {
        const response = await api.get('/rezepte/kategorien')
        return response.data as String[]
    }
    const { data, isLoading, error } = useQuery({
        queryKey: ['kategorien'], 
       queryFn: fetchCategories}
    )
    return (
        <div>
          <h1>Edit Recipes</h1>
          <p>This is the edit recipes page.</p>
          <form>
              <input
                  type="text"
                  placeholder={query}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
              />
          </form>
          {isLoading && <p>Loading...</p>}
          {error && <p>Error occurred while fetching categories. {error.message}</p>}
          {data && (
              <div className="flex-container-categories">
                  {data.map((category:String) => {
                      const isActive = categories.includes(category);

                      return (
                      <button className={`cButton ${isActive ? 'active' : ''}`} type="button" onClick={() => addCategory(category)}>
                          {category}
                      </button>
                      )})}
              </div>
          )}
          <button className="searchButton" type="button" onClick={() => setSearchActivated(true)}>Search</button>
          {searchActivated && (
              <OverviewSearchedRecipes categories={categories} query={query} edit={true} />
          )}
          {!searchActivated && (
              <OverviewRecipes edit={true}/>
          )}
        </div>
  )
}