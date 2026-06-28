import { Client, Storage, ID } from "appwrite";

const APPWRITE_URL = import.meta.env.VITE_APPWRITE_URL || "https://syd.cloud.appwrite.io/v1";
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || "68c7f07b000ea45dca30";
const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || "68c7f19500054b00d3cb";
const APPWRITE_BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID || "68c7f52500385b17c1c9";

const client = new Client()
    .setEndpoint(APPWRITE_URL)
    .setProject(APPWRITE_PROJECT_ID);

const storage = new Storage(client);

export const appwriteConfig = {
    url: APPWRITE_URL,
    projectId: APPWRITE_PROJECT_ID,
    databaseId: APPWRITE_DATABASE_ID,
    storageId: APPWRITE_BUCKET_ID,
};

export function getFileViewUrl(fileId) {
    if (!fileId) return '';
    return `${appwriteConfig.url}/storage/buckets/${appwriteConfig.storageId}/files/${fileId}/view?project=${appwriteConfig.projectId}`;
}

export function extractFileIdFromUrl(url) {
    if (!url || typeof url !== 'string') return null;
    const match = url.match(/\/files\/([^/?]+)\/view/);
    return match ? match[1] : null;
}

export async function uploadImageFile(file) {
    if (!appwriteConfig.storageId) {
        throw new Error("Appwrite Storage Bucket ID is not configured.");
    }
    const uploadedFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        file
    );
    return {
        fileId: uploadedFile.$id,
        url: getFileViewUrl(uploadedFile.$id),
    };
}

export async function uploadImageFiles(files, onProgress) {
    const results = [];
    for (let i = 0; i < files.length; i++) {
        const result = await uploadImageFile(files[i]);
        results.push(result);
        onProgress?.(i + 1, files.length);
    }
    return results;
}

export async function deleteStorageFile(fileIdOrUrl) {
    const fileId = fileIdOrUrl?.includes('/')
        ? extractFileIdFromUrl(fileIdOrUrl)
        : fileIdOrUrl;
    if (!fileId || !appwriteConfig.storageId) return;
    try {
        await storage.deleteFile(appwriteConfig.storageId, fileId);
    } catch (err) {
        console.error('Failed to delete storage file:', err);
    }
}

export { client, storage, ID };

