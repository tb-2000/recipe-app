import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import '../App.css'
import RecipeImage from './RecipeImage'

export default function OverviewRecipesPage({edit}:{edit:boolean}) {
    const navigate = useNavigate()

    const navigateToEdit = (id:Number) => {
        navigate(`/edit/rezepte/${id}`)
    }

    const fetchRecipes = async () => {
        const response = await api.get('/rezepte')
        return response.data
    }
    const { data, isLoading, error } = useQuery({
        queryKey: ['rezepte'],
        queryFn: fetchRecipes
    })
    return (
        <div>
            <p>Here you can find an overview of all recipes currently available in the app:</p>
            {isLoading && <p>Loading all recipes...</p>}
            {error && <p>Error occurred while fetching all recipes. {error.message}</p>}
            {data && (
                <ul>
                    {data.map((rezept:any) => {
                        return (
                            <>
                                <a href={`/rezepte/${rezept.id}`} className="recipe-link">
                                    <ul key={rezept.id}>
                                        <strong>{rezept.title}</strong>
                                        <RecipeImage fileName={rezept.filename}/>
                                        <li>cooktime: {rezept.cooktime} minutes, prep time: {rezept.preptime} minutes, difficulty: {rezept.difficulty}</li>
                                        <li>beschreibung: {rezept.beschreibung}</li>
                                        <li>categories:</li>
                                        <div>
                                            <p style={{color: 'gray', marginLeft: '12px'}}>
                                                {rezept?.categories.join(', ')}
                                            </p> 
                                        </div>
                                    </ul>
                                </a>
                                {edit && <button type="button" onClick={() => navigateToEdit(rezept.id)}>Edit recipe</button>}
                            </>
                        )
                    })}
                </ul> 
                
            )}
        </div>
    )
}

