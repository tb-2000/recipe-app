import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../api/api'
import '../App.css'
import SubmitRecipe from './SubmitRecipe'

export default function EditRecipe() {
    const { id } = useParams()

    const { data, isLoading, error } = useQuery({
        queryKey: ['recipe', id],
        queryFn: async () => {
            const response = await api.get(`/rezepte/${id}`)
            return response.data
        }
    })
    const[recipe, _] = useState({
        id: data?.id,
      title: data?.title,
      cookbook: data?.cookbook,
      page: data?.page,
      cooktime: data?.page,
      preptime: data?.preptime,
      difficulty: data?.difficulty,
      description: data?.description,
      instructions: data?.instructions,
      ingredients: data?.ingredients.map((ing: { menge: any; einheit: any; name: any }) => ({
        menge: ing?.menge, einheit:ing?.einheit, name:ing?.name 
      })),
      categories: data?.categories,
      filename: data?.filename
    })
    {console.log("The default Recipe: ", recipe)}
    return (
        <div>
            <p>Here you can change the content of the selected recipe {id}:</p>
           {isLoading && <p>Loading recipe details...</p>}
           {error && <p>Error occurred while fetching recipe details. {error.message}</p>}
           {data && (
               <div>
                   <SubmitRecipe edit={true} defaultRecipe={recipe} defaultCategories={recipe.categories}/>
               </div>
           )}
        </div>
    )
}