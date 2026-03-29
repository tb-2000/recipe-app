
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

    const navigate = useNavigate()

    const navigateToOverview = () => {
        navigate(`/rezepte`)
    }

    const loadPage = async (page = 0) => {
        const params: { [key: string]: any } = {}
        params["page"] = page
        params["size"] = size
        params["ids"] = ids
        
        const response = await api.get('/rezepte/search/ids', {
            params,
        paramsSerializer: params=> qs.stringify(params, {arrayFormat: 'repeat'})})

        setRezepte(response.data.content)
        setPageCount(response.data.totalPages)
        setCurrentPage(response.data.number)
    }
    useEffect(() => {
        loadPage(0)
    }, [ids])

    const handlePageClick = (e: { selected: any }) => {
        const newPage = e.selected
        loadPage(newPage)
    }

    return (
    <>
        {rezepte && (
            <>
                <div className="overview-link-container">
                    <a href={"/rezepte"} className="overview-link">Mehr ansehen<span className="arrow-right">&rarr;</span></a>
                </div>
                <ul className="highlights-container">
                    {rezepte.map((rezept:any) => {
                        return (
                        <div>
                            <a href={`/rezepte/${rezept.id}`} className="recipe-link">
                                <ul key={rezept.id}>
                                    <strong style={{color:"black"}}>{rezept.title}</strong>
                                    <RecipeImage rezept={rezept} className='highlights-recipe'/>
                                </ul>
                            </a>
                        </div>
                        )
                })}
                </ul>
                {pageCount > 1 && (
                                    <div>
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
                
            </>
        )}
    </>
    )
}
