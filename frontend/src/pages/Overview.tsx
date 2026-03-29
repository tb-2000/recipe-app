import { useQuery } from '@tanstack/react-query'
import { useState} from 'react'
import api from '../api/api'
import OverviewRecipes from '../components/OverviewRecipes'
import OverviewSearchedRecipes from '../components/OverviewSearchedRecipes'
import '../App.css'

export default function Overview() {
    const [categories, setCategories] = useState<string[]>([])
    const [searchActivated, setSearchActivated] = useState(false)
    const [query, setQuery] = useState('search for recipes...')

    const addCategory = (category: string) => {
        (categories.includes(category)) ? 
        setCategories(categories.filter(c => c !== category)) : 
        setCategories(prevCategories => [...prevCategories, category])
    }
    
    const fetchCategories = async () => {
        const response = await api.get('/rezepte/kategorien')
        return response.data as string[]
    }
    const { data, isLoading, error } = useQuery({
        queryKey: ['kategorien'], 
       queryFn: fetchCategories}
    )
    return (
        <div>
            <h1>Übersicht aller Rezepte</h1>
            <p>Hier findest Du eine Übersicht aller Rezepte auf Lecker-Essen</p>
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
                    {data.map((category:string) => {
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
                <OverviewSearchedRecipes   categories={categories}
                query={query.trim() !== 'search for recipes...' ? query.trim() : ''}
                edit={false}/>
            )}
            {!searchActivated && (
                <OverviewRecipes edit={false} />
            )}
        </div>
    )
}

