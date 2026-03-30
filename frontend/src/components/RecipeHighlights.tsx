
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import qs from 'qs'
import '../App.css'
import RecipeImage from './RecipeImage'
import ReactPaginate from 'react-paginate'
import { useEffect, useState } from 'react'

export default function RecipeHighlights({ ids, size }: { ids:number[], size:number }) {

    const [currentPage, setCurrentPage] = useState(0)
    const [pageCount, setPageCount] = useState(0)
    const [rezepte, setRezepte] = useState([])
    const [isTransitioning, setIsTransitioning] = useState(false)

    const navigate = useNavigate()

    const navigateToOverview = () => {
        navigate(`/rezepte`)
    }

    const loadPage = async (page = 0) => {
        setIsTransitioning(true)
        const params: { [key: string]: any } = {}
        params["page"] = page
        params["size"] = size
        params["ids"] = ids

        try {
            const response = await api.get('/rezepte/search/ids', {
                params,
            paramsSerializer: params=> qs.stringify(params, {arrayFormat: 'repeat'})})

            await new Promise(resolve => setTimeout(resolve, 200)) // Füge eine Verzögerung von 200 ms hinzu

            setRezepte(response.data.content)
            setPageCount(response.data.totalPages)
            setCurrentPage(response.data.number)

            setTimeout(() => {
                setIsTransitioning(false)
            }, 80)

        }catch (error) {

            console.error('Error fetching recipes:', error)
            setIsTransitioning(false)
        }
    }
    useEffect(() => {
        loadPage(0)
    }, [ids])

    const handlePageClick = (e: { selected: any }) => {
        const newPage = e.selected
        loadPage(newPage)
    }

    return (
            <div className="highlights-section">
                <ul className={`highlights-container ${isTransitioning ? 'fading' : ''}`}>
                    {rezepte.map((rezept:any) => {
                        return (
                        <a href={`/rezepte/${rezept.id}`} className="recipe-link">
                            <ul  className="highlight-element" key={rezept.id}>
                                <strong className="highlight-title">{rezept.title}</strong>
                                <div className="zoom-container-small">
                                    <RecipeImage rezept={rezept} className='highlights-recipe'/>
                                </div>
                            </ul>
                        </a>
                        )
                })}
                </ul>
                {pageCount > 1 && (
                                    <div className="pagination-wrapper">
                                        <ReactPaginate previousLabel="&larr;" nextLabel="&rarr;" 
                                        breakLabel="..." pageCount={pageCount} marginPagesDisplayed={2}
                                        pageRangeDisplayed={4} onPageChange={handlePageClick} forcePage={currentPage}
                                        containerClassName='pagination-highlights' 
                                        activeClassName='selected' 
                                        pageClassName="page-item"
                                        pageLinkClassName="page-link"
                                        previousClassName="page-item"
                                        previousLinkClassName="page-link"
                                        nextClassName="page-item"
                                        nextLinkClassName="page-link"
                                        breakClassName="page-item"
                                        breakLinkClassName="page-link"/>
                                    </div>
                )}
            </div>
    )
}
