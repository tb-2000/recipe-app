import { BlobServiceClient } from "@azure/storage-blob";

export default async function uploadImage(file: File, sasUrl: string): Promise<string> {
    try {
        // 1. BlobServiceClient mit der SAS-URL initialisieren
        // const blobServiceClient = new BlobServiceClient(sasUrl);

        const url = new URL(sasUrl);
        const sasToken = url.search;                    // ?sv=...&sig=...
        const baseUrl = url.origin; 
        const pathSegments = url.pathname.split('/').filter(Boolean);
        const blobName = pathSegments[pathSegments.length - 1];   // letzter Teil = voller Blob-Name mit UUID

        console.log("UploadImage: Verwende Blob-Name:", blobName);

        // BlobServiceClient mit Base-URL + SAS-Token erstellen (nicht mit voller URL!)
        const blobServiceClient = new BlobServiceClient(baseUrl + sasToken);

        // Container holen
        const containerClient = blobServiceClient.getContainerClient("rezepte-bilder");

        // BlockBlobClient für genau diesen Namen erstellen
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // 5. Upload durchführen
        //await blockBlobClient.uploadBrowserData(file, {
        //    blobHTTPHeaders: { 
        //        blobContentType: file.type 
        //    }
        //});

        await blockBlobClient.upload(file, file.size, {
            blobHTTPHeaders: { 
            blobContentType: file.type 
        }
});

        const cleanUrl = blockBlobClient.url.split("?")[0];
        console.log("✅ Upload erfolgreich! URL:", cleanUrl);
        console.log("Werde Blobnamen/ Imagenamen zurückgeben: ", blobName)

        return blobName;

    } catch (error: any) {
        console.error("UploadImage Fehler:", error);
        throw error;
    }
}