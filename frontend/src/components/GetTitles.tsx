import { useQuery } from '@tanstack/react-query'
import api from '../api/api'

export default async function GetTitles(searchItem:string){
        const { data } = useQuery({
        queryKey: ['title', 'id'],
        queryFn: async () => {
            const response = await api.get<string[]>("/rezepte/title", {params: {searchItem}})
            return response.data
        }
    })
    return data
}
    