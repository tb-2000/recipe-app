import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../api/api'
import RecipeImage from '../components/RecipeImage'
import '../App.css'

export default function RecipeDetail() {
    const { id } = useParams()
    const { data, isLoading, error } = useQuery({
        queryKey: ['recipe', id],
        queryFn: async () => {
            const response = await api.get(`/rezepte/${id}`)
            return response.data
        }
    })
    return (
        <div>
            <p>Here you can find the details of the selected recipe {id}:</p>
           {isLoading && <p>Loading recipe details...</p>}
           {error && <p>Error occurred while fetching recipe details. {error.message}</p>}
           {data && (
               <div>
                   <h1>{data.title}</h1>
                   <p>{data.description}</p>
                   <RecipeImage rezept={data}/>
                   <ul>
                        <li>Zubereitungszeit: {data.cooktime} Minuten, Vorbereitungszeit: {data.preptime} Minuten, Anspruch: {data.difficulty}</li>
                        <li>Kochbuch: {data.cookbook}, Seite: {data.page}</li>
                        <li>Kategorien:</li>
                        {(data?.categories ?? []).map((category: any, index: number) => (
                            <li key={index}>
                                {category.name ?? '—'} 
                                {/*  ↓ das ist der wichtige Teil ↓ */}
                                <small style={{color:'gray', marginLeft:'12px'}}>
                                    {JSON.stringify(category)}
                                </small>
                            </li>
                        ))}
                        <li>Zutaten:</li>
                            {(data?.ingredients ?? []).map((ingredient: any, index: number) => (
                                <li key={index}>
                                    <small style={{color:'gray', marginLeft:'12px'}}>
                                        {'—'} {ingredient.menge ?? '-'} {ingredient.einheit ?? '-'} {ingredient.name ?? '—'}
                                    </small>
                                </li>
                            ))}
                   </ul>
                   <p>Anleitung: {data.instructions ?? <p>Anleitung nicht gelesen</p>}</p>
               </div>
           )}
        </div>
    )
}