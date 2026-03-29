import clockImg from "../logos/clock.png"
import RecipeImage from "./RecipeImage"
import { useQuery } from "@tanstack/react-query"
import api from "../api/api"
import SelectLogo from "./SelectLogo"


export default function RecipeOfTheDay({ id }: { id: number }) {

    const { data:rezept, isLoading, error } = useQuery({
        queryKey: ['recipe', id],
        queryFn: async () => {
            const response = await api.get(`/rezepte/${id}`)
            return response.data
        }
    })

    return (
        <>
            {isLoading && <p>Loading recipe of the day...</p>}
            {error && <p>Error occurred while fetching recipe of the day. {error.message}</p>}
            {rezept && (
                <div className="container">        
                    <a href={`/rezepte/${rezept.id}`} className="recipe-link">
                        <ul key={rezept.id}>
                            <strong className="recipe-day-title">{rezept.title}</strong>
                            <div className="zoom-container">
                                <RecipeImage rezept={rezept} className="recipe-day"/>
                            </div>
                            <li className="description-item">
                                <img src={clockImg} alt="a clock symbol" className="logo" /> 
                                <span>{rezept.cooktime + rezept.preptime} Minuten, Anspruch: </span>
                                <img src = {SelectLogo(rezept.difficulty)} alt="difficulty logo" className="logo"/>
                            </li>
                        </ul>
                    </a>     
                </div>   
            )}
        </>
    )
}