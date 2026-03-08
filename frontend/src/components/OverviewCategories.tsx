import { useQuery } from '@tanstack/react-query'
import api from '../api/api'
import 'App.css'

export default function OverviewCategories() {
    const fetchCategories = async () => {
        const response = await api.get('/rezepte/kategorien')
        return response.data
    }
    const { data, isLoading, error } = useQuery({queryKey: ['kategorien'], 
       queryFn: fetchCategories}
    )
    return (
        <div>
            <p>Here you can find an overview of all categories currently available in the app:</p>
            {isLoading && <p>Loading...</p>}
            {error && <p>Error occurred while fetching categories. {error.message}</p>}
            {data && (
                <div className="flex-container-categories">
                    {data.map((category:String) => (
                        <div>{category}</div>
                    ))}
                </div>
            )}  
        </div>
    )
}
