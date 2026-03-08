import { useParams } from 'react-router-dom'

export default function RecipeDetail() {
    const { id } = useParams()
    return (
        <div>
            <h1>Recipe {id}</h1>
            <p>This is the recipe detail page. Here you can see the details of the specific recipe {id}.</p>
        </div>
    )
}