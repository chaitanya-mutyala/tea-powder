import { Client, Storage, ID } from "appwrite";

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_URL)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const storage = new Storage(client);

export const appwriteConfig = {
    url: import.meta.env.VITE_APPWRITE_URL,
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    storageId: import.meta.env.VITE_APPWRITE_BUCKET_ID,
};

export function getFileViewUrl(fileId) {
    return `${appwriteConfig.url}/storage/buckets/${appwriteConfig.storageId}/files/${fileId}/view?project=${appwriteConfig.projectId}`;
}

export function extractFileIdFromUrl(url) {
    if (!url || typeof url !== 'string') return null;
    const match = url.match(/\/files\/([^/?]+)\/view/);
    return match ? match[1] : null;
}

export async function uploadImageFile(file) {
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
    if (!fileId) return;
    try {
        await storage.deleteFile(appwriteConfig.storageId, fileId);
    } catch (err) {
        console.error('Failed to delete storage file:', err);
    }
}

export { client, storage, ID };
