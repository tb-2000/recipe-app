import ReactPaginate from 'react-paginate'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import '../App.css'
import RecipeImage from './RecipeImage'
import { useEffect, useState } from 'react'
import qs from 'qs'
import SelectLogo from './SelectLogo'
import clockImg from "../logos/clock.png"
import { useWishlist } from '../context/WishlistContext'
import { Link } from 'react-router-dom'

export default function OverviewRecipesPage({edit}:{edit:boolean}) {
    const [currentPage, setCurrentPage] = useState(0)
    const [pageCount, setPageCount] = useState(0)
    const [rezepte, setRezepte] = useState([])

    const { wishlist } = useWishlist();
    
    const navigate = useNavigate()

    const navigateToEdit = (id:Number) => {
        navigate(`/edit/rezepte/${id}`)
    }

    const loadPage = async (page = 0) => {
        const params: { [key: string]: any } = {}
        params["page"] = page
        params["size"] = 5
        const response = await api.get('/rezepte', {
            params,
        paramsSerializer: params=> qs.stringify(params, {arrayFormat: 'repeat'})})
        console.log("rezepte: ", response.data.content)
        setRezepte(response.data.content)
        setPageCount(response.data.totalPages)
        setCurrentPage(response.data.number)
    }

    const handleClick = (event: { selected: any }) => {
        const newPage = event.selected
        loadPage(newPage)
    }
    useEffect(() => {
        loadPage(0)
    }, [])

    return (
        <div>
            {rezepte && (
                <ul style={{gap:20}}>
                    {rezepte.map((rezept:any) => {
                        return (
                            <>
                                <Link to={`/rezepte/${rezept.id}`} className="recipe-link">
                                <div style={{margin:"10px"}}>
                                    <ul key={rezept.id}>
                                        <h3>{rezept.title}</h3>
                                        <div className="zoom-container-normal">
                                        <RecipeImage rezept={rezept} className='normal-recipe'/>
                                       </div>
                                        <li className='description-item'>
                                            <img src={clockImg} alt="a clock symbol" className="logo" /> 
                                            <span>{rezept.cooktime + rezept.preptime} Minuten, Anspruch: </span>
                                            <img src = {SelectLogo(rezept.difficulty)} alt="difficulty logo" className="logo"/>
                                        </li>
                                        <li><div className="description-container">{rezept.description}</div></li>
                                        <li>
                                            <div>
                                            <p className="categories-list">
                                                {rezept?.categories.join(', ')}
                                            </p> 
                                        </div>
                                        </li>
                                    </ul>
                                </div>
                                </Link>
                                {edit && <button type="button" onClick={() => navigateToEdit(rezept.id)}>Rezept bearbeiten</button>}
                            </>
                        )
                    })}
                    {pageCount > 1 && (
                                    <div>
                                        <ReactPaginate previousLabel="Zurück" nextLabel="Weiter" 
                                        breakLabel="..." pageCount={pageCount} marginPagesDisplayed={2}
                                        pageRangeDisplayed={4} onPageChange={handleClick} forcePage={currentPage} 
                                        containerClassName='pagination-container' activeClassName='selected'/>
                                    </div>
                                )}
                </ul> 
                
            )}
        </div>
    )
}

