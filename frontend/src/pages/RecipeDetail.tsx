import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../api/api'
import RecipeImage from '../components/RecipeImage'
import '../App.css'
import { useEffect, useMemo, useState } from 'react'
import ChangeAmount from '../components/ChangeAmount'
import DisplayInstructions from '../components/DisplayInstructions'
import ZutatenImg from '../logos/zutaten.png'
import { useWishlist } from '../context/WishlistContext'

export default function RecipeDetail() {
    const { id } = useParams()
    const [anzahlPersonen, setAnzahlPersonen] = useState<number>(2)

    const { wishlist } = useWishlist();

    const { data, isLoading, error } = useQuery({
        queryKey: ['recipe', id],
        queryFn: async () => {
            const response = await api.get(`/rezepte/${id}`)
            return response.data
        }
    })

    const recipe = useMemo(() => {
        if(!data) return null
        return ChangeAmount(anzahlPersonen, data)
    }, [data, anzahlPersonen])

    const handleAmountChange = (e: { target: { value: any } }) => {
        const neueMenge = e.target.value
        setAnzahlPersonen(neueMenge)
    }
    const handleAmountAddition = () => {
        setAnzahlPersonen(anzahlPersonen+1)
    }
    const handleAmountSubtraction = () => {
        setAnzahlPersonen(Math.max(1, anzahlPersonen-1))  
    }

    if (isLoading) return <p>Rezept wird geladen...</p>
    if (error) return <p>Fehler beim Laden des Rezepts: {error.message}</p>
    if (!recipe) return <p>Rezept nicht gefunden.</p>

    return (      
            <div className="recipe-detail-container">
                <h1>{recipe.title}</h1>
                <div className="zoom-container-detail">
                    <RecipeImage rezept={recipe} className='recipe-day'/>
                </div>     
                <div className="description-detail">
                    {recipe.description}
                </div> 
                <ul>
                    <div className="detail-description-container">
                        <li><strong>Zubereitungszeit:</strong> {recipe.cooktime} Minuten</li>
                        <li><strong>Vorbereitungszeit:</strong> {recipe.preptime} Minuten</li>
                        <li><strong>Anspruch:</strong> {recipe.difficulty}</li>
                        <li><strong>Kochbuch:</strong> {recipe.cookbook}</li>
                        <li><strong>Seite:</strong> {recipe.page}</li>
                        <li><strong>Kategorien:</strong></li>
                        <div className="categories-detail-container">
                            {(recipe?.categories ?? []).map((category: any, index: number) => (
                            <li key={index}> 
                                <small className="categories-detail">
                                    {JSON.stringify(category)}
                                </small>
                            </li>
                        ))}
                        </div>
                    </div>
                    <li>
                        <div className="description-item">
                            <strong>Zutaten</strong>
                            <img src={ZutatenImg} alt="zutaten bild" className="logo" />
                        </div>
                    </li>
                    <p style={{marginLeft:"auto", marginRight:"auto"}}>Für wie viele Personen ist es gedacht:</p>
                    <div className="change-amount-buttons">
                        <button type="button" onClick={handleAmountSubtraction} style={{width:50}}>-</button>
                        <input type="text" value={anzahlPersonen} onChange={handleAmountChange} style={{width:'60px', height:'40px'}}></input>
                        <button type="button" onClick={handleAmountAddition} style={{width:50}}>+</button>
                    </div>
                    <div className="ingredients-list">
                        {(recipe?.ingredients ?? []).map((ingredient: any, index: number) => (
                            <li key={index}>
                                <small style={{color:'black', marginLeft:'12px', fontSize:'15px'}}>
                                    {ingredient.menge ?? '-'} {ingredient.einheit ?? '-'} {ingredient.name ?? '—'}
                                </small>
                            </li>
                        ))}
                    </div>
                </ul>
                <div>Anleitung: {recipe.instructions ? <DisplayInstructions instructions={recipe.instructions}/> : <p>Anleitung nicht gelesen</p>}</div>
            </div>       
)
}