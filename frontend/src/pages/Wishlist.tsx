
import api from '../api/api'
import RecipeImage from "../components/RecipeImage"
import SelectLogo from "../components/SelectLogo"
import clockImg from '../logos/clock.png'
import ReactPaginate from "react-paginate"
import { useEffect, useState } from "react"
import { useWishlist } from '../context/WishlistContext'
import { Link } from 'react-router-dom'

export default function Wishlist() {
    const { wishlist, toggleWishlist } = useWishlist();

    const [currentPage, setCurrentPage] = useState(0)
    const [pageCount, setPageCount] = useState(0)
    const [rezepte, setRezepte] = useState([])
    
    const loadPage = async (page = 0) => {
        const params: { [key: string]: any } = {}
        params["page"] = page
        params["size"] = Math.min(5, wishlist.length)
        const ids = wishlist
        
        const response = await api.get('/rezepte/search/ids', {
            params: { ids } })
        
        console.log("wishlist: " + ids)
        console.log("response: " + response.data)

        setRezepte(response.data.content)
        setPageCount(response.data.totalPages)
        setCurrentPage(response.data.number)
    }

    useEffect(() => {
        loadPage(0)
    }, [wishlist])

    const handlePageClick = (e: { selected: any }) => {
        const newPage = e.selected
        loadPage(newPage)
    }

    return (
        <div>
            <h1>Dein Kochbuch</h1>
            <p>Hier findest du alle Rezepte, die du deiner Wunschliste hinzugefügt hast.</p>
            {wishlist.length === 0 ? (
                <p>Deine Wunschliste ist leer. Füge Rezepte hinzu, um sie hier zu sehen!</p>
            ) : (
                <ul>
                    {/* {wishlist.map((rezeptId) => (
                        <li key={rezeptId}>{rezeptId}</li>
                    ))} */}
                    {rezepte.map((rezept:any) => {
                        return (  
                        <>
                            <Link to={`/rezepte/${rezept.id}`} className="recipe-link">
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
                                    <li>Beschreibung: {rezept.description}</li>
                                    <li>Kategorien:</li>
                                    <div>
                                        <p className='categories-list'>
                                            {rezept?.categories.join(', ')}
                                        </p> 
                                    </div>
                                </ul>
                            </Link>
                        </>
                        )
                        })}
                        {pageCount > 1 && (
                            <div>
                                <ReactPaginate previousLabel="Zurück" nextLabel="Weiter" 
                                breakLabel="..." pageCount={pageCount} marginPagesDisplayed={2}
                                pageRangeDisplayed={4} onPageChange={handlePageClick} forcePage={currentPage}
                                containerClassName='pagination-container' activeClassName='selected' />
                            </div>
                        )}
                </ul>
            )}
        </div>
    )
}