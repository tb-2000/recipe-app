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
    return (
        <div>
            <p>Hier kannst du das Rezept {id} bearbeiten:</p>
           {isLoading && <p>Loading recipe details...</p>}
           {error && <p>Error occurred while fetching recipe details. {error.message}</p>}
           {data && (
               <div>
                   <SubmitRecipe edit={true} defaultRecipe={data} defaultCategories={data.categories}/>
               </div>
           )}
        </div>
    )
}