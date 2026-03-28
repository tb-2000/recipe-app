import { BlobServiceClient } from "@azure/storage-blob";

export default async function uploadImage(file: File, sasUrl: string): Promise<string> {
    try {
        // 1. BlobServiceClient mit der SAS-URL initialisieren
        const blobServiceClient = new BlobServiceClient(sasUrl);

        // 2. Container holen
        const containerClient = blobServiceClient.getContainerClient("rezepte-bilder");

        // 3. Blob-Namen aus der SAS-URL extrahieren (das ist der entscheidende Schritt!)
        const url = new URL(sasUrl);
        const pathSegments = url.pathname.split('/').filter(Boolean);
        const blobName = pathSegments[pathSegments.length - 1];   // letzter Teil = voller Blob-Name mit UUID

        console.log("UploadImage: Verwende Blob-Name:", blobName);

        // 4. BlockBlobClient für genau diesen Namen erstellen
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // 5. Upload durchführen
        await blockBlobClient.uploadBrowserData(file, {
            blobHTTPHeaders: { 
                blobContentType: file.type 
            }
        });

        const cleanUrl = blockBlobClient.url.split("?")[0];
        console.log("✅ Upload erfolgreich! URL:", cleanUrl);

        return cleanUrl;

    } catch (error: any) {
        console.error("UploadImage Fehler:", error);
        throw error;
    }
}