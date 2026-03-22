import { BlobServiceClient } from "@azure/storage-blob";

export default async function UploadImage({file, sasUrl}: {file: File, sasUrl: string}) {
    const blobServiceClient = new BlobServiceClient(sasUrl);
    const containerClient = blobServiceClient.getContainerClient("rezepte-bilder");
    const blobName = file.name; // oder UUID
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadBrowserData(file, {
        blobHTTPHeaders: { blobContentType: file.type }
    });

    return blockBlobClient.url.split("?")[0];
}