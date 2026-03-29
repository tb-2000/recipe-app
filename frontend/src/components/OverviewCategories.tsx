import { useQuery } from '@tanstack/react-query'
import api from '../api/api'
import { useState, useEffect } from 'react'
import '../App.css'

interface OverviewCategoriesProps {
    onCategoriesChange: (categories: string[]) => void;
    defaultCategories?: string[];
}

export default function OverviewCategories({onCategoriesChange, defaultCategories}: OverviewCategoriesProps) {
    const [categories, setCategories] = useState<string[]>(() => {
        if(defaultCategories){
            return defaultCategories
        }
        return []
})

    const addCategory = (category: string) => {
        const updatedCategories = (categories.includes(category)) ? categories.filter(c => c !== category) : [...categories, category]
        setCategories(updatedCategories)
        onCategoriesChange(updatedCategories)
    }

    useEffect(() => {
        console.log(categories)
    }, [categories])
    
    const fetchCategories = async () => {
        const response = await api.get('/rezepte/kategorien')
        return response.data as string[]
    }
    const { data, isLoading, error } = useQuery({queryKey: ['kategorien'], 
       queryFn: fetchCategories}
    )
    return (
        <div>
            <p>Hier sind alle auf Lecker-Essen.com verfügbaren Kategorien für die Rezepte:</p>
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
        </div>
    )
}
