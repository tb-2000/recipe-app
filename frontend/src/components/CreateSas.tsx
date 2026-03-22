import api from '../api/api'
import { useQuery } from '@tanstack/react-query'


export default function CreateSas({ fileName, handleSas }: { fileName: string; handleSas: (sas: string) => void }) {
    const getSasUrl = async () => {
        if (!fileName) throw new Error("Kein Dateiname")
        console.log("Fordere SAS für:", fileName)
        const { data } = await api.get<string>("/upload-sas", { params: { fileName } })
        console.log("SAS erhalten:", data)
        handleSas(data)
        return data as string
    }

    const { data: sasUrl, isLoading, isError, error } = useQuery({
        queryKey: ['sas-url', fileName],     
        queryFn: getSasUrl,
        enabled: !!fileName,                  
        staleTime: 5 * 60 * 1000,             
    })
    if (isLoading) return <p>Lade Bild...</p>
    if (isError)   return <p>Fehler: {error?.message || "Unbekannt"}</p>
    if (!sasUrl)   return <p>Kein Bild verfügbar</p>
}