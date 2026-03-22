
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import qs from 'qs'
import '../App.css'
import RecipeImage from './RecipeImage'
import ReactPaginate from 'react-paginate'
import { useEffect, useState } from 'react'

export default function OverviewSearchedRecipes({categories, query, edit}: {categories: String[], query: string, edit:boolean}) {
    const hasCategories = categories.length > 0 && categories !== null && categories !== undefined
    const hasQuery = query.trim().length > 0 && query !== null && query !== undefined && query !== 'search for recipes...'

    const [currentPage, setCurrentPage] = useState(0)
    const [pageCount, setPageCount] = useState(0)
    const [rezepte, setRezepte] = useState([])

    const navigate = useNavigate()

    const navigateToEdit = (id:Number) => {
        navigate(`/edit/rezepte/${id}`)
    }

    const loadPage = async (page = 0) => {
        const params: { [key: string]: any } = {}
        params["page"] = page
        params["size"] = 5
        if(hasCategories)
            params["categories"] = Array.isArray(categories) ? categories : [categories]
        if(hasQuery)
            params["query"] = query
        
        const response = await api.get('/rezepte/search', {
            params,
        paramsSerializer: params=> qs.stringify(params, {arrayFormat: 'repeat'})})

        setRezepte(response.data.content)
        setPageCount(response.data.totalPages)
        setCurrentPage(response.data.number)
    }
    useEffect(() => {
        loadPage(0)
    }, [query,categories])

    const handlePageClick = (e: { selected: any }) => {
        const newPage = e.selected
        loadPage(newPage)
    }

    return (
    <div>
        <p>Here you can find all searched recipes:</p>
        {rezepte && (
            <div>
                <h3>Search Results</h3>
                <ul>
                    {rezepte.map((rezept:any) => {
                        return (
                        <>
                            <a href={`/rezepte/${rezept.id}`} className="recipe-link">
                                <ul key={rezept.id}>
                                    <strong>{rezept.title}</strong>
                                    <RecipeImage rezept={rezept} />
                                    <li>cooktime: {rezept.cooktime} minutes, prep time: {rezept.preptime} minutes, difficulty: {rezept.difficulty}</li>
                                    <li>beschreibung: {rezept.description}</li>
                                    <li>categories:</li>
                                    <div>
                                        <p style={{color: 'gray', marginLeft: '12px'}}>
                                            {rezept?.categories.join(', ')}
                                        </p> 
                                    </div>
                                </ul>
                            </a>
                                {edit && <button type="button" onClick={() => navigateToEdit(rezept.id)}>Edit recipe</button>}
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
            </div>
        )}
    </div>
    )
}
