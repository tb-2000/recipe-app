import api from '../api/api'

export default async function GetSas(fileName: string, handleSas: (sas: string) => void, handleExpires: (exp: string) => void) {

        if (!fileName) throw new Error("Kein Dateiname")
        console.log("Fordere SAS für:", fileName)
        const { data } = await api.get<string[]>("/fetch-sas", { params: { fileName } })
        console.log("SAS erhalten:", data)
        handleSas(data[0])
        handleExpires(data[1])
        return data as string[]
    
}