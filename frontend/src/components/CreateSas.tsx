import api from '../api/api'


export default async function CreateSas(fileName: string): Promise<{ sasUrl: string; expires: string }> {
    if (!fileName?.trim()) {
        throw new Error("Kein Dateiname angegeben");
    }

    console.log("CreateSas: Fordere SAS an für Datei:", fileName);

    try {
        const { data } = await api.get<string[]>("/upload-sas", {
            params: { fileName }
        });

        if (!data || data.length < 2) {
            throw new Error("Ungültige Antwort vom SAS-Endpunkt");
        }

        const [sasUrl, expires] = data;

        console.log("CreateSas: SAS erfolgreich erhalten");
        console.log("neue sas: ", sasUrl)
        console.log("SAS läuft ab:", expires);

        return {
            sasUrl,
            expires
        };

    } catch (error: any) {
        console.error("CreateSas Fehler:", error.response?.data || error.message);
        throw new Error(`SAS konnte nicht erstellt werden: ${error.message || error}`);
    }
}