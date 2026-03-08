import { useQuery } from '@tanstack/react-query'
import api from '../api/api'
import 'App.css'

export default function OverviewRecipes() {
    const fetchRecipes = async () => {
        const response = await api.get('/rezepte')
        return response.data
    }
    const { data, isLoading, error } = useQuery({queryKey: ['rezepte'], 
       queryFn: fetchRecipes}
    )
    return (
        <div>
            <p>Here you can find an overview of all recipes currently available in the app:</p>
            {isLoading && <p>Loading...</p>}
            {error && <p>Error occurred while fetching recipes. {error.message}</p>}
            {data && (
                <ul>
                    {data.map((rezept:any) => (
                        <>
                            <li key={rezept.id}>{rezept.title}</li>
                            <li>cooktime: {rezept.cooktime} minutes, prep time: {rezept.preptime} minutes, difficulty: {rezept.difficulty}</li>
                            <li>beschreibung: {rezept.beschreibung}</li>
                            <li>categories:</li>
                            <div>
                                <ul>
                                    {(rezept?.categories ?? []).map((category:any) => (
                                        <li>{category.name}</li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    ))}
                </ul>
            )}
        </div>
    )
}