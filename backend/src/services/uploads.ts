import { uploads } from "../db.js";
import type { Metadata } from "enders-sync";
import fs from "fs";



export async function getUploads(metadata: Metadata) {
    const uid = metadata.auth.user_id;

    if (typeof uid !== "number") {
        throw new Error("Unexpected error: user_id cannot be anythin but a number");
    }

    const result = await uploads.filterUploadsByUser(uid);

    if (!result) {
        throw new Error("no uploads found");
    }

    return result;
}



export async function deleteUpload(metadata: Metadata, id: number) {
    const uid = metadata.auth.user_id;

    if (typeof uid !== "number") {
        throw new Error("Unexpected error: user_id cannot be anythin but a number");
    }

    if (typeof id !== "number") {
        throw new Error("Unexpected error: uploaded file id cannot be anythin but a number");
    }

    const [file] = await uploads.fetch(id)
    await uploads.deleteFromUploadsForUser(uid, id);

    if (!file) {
        throw new Error("failed to delete file: no such file available")
    }

    fs.unlinkSync(file.file_name);
}



export async function addToFolder(metadata: Metadata, file_id: number, folder_id: number) {
    const uid = metadata.auth.id;

    if (typeof uid !== "number") {
        throw new Error("Unexpected error: user_id cannot be anythin but a number");
    }

    const [file] = await uploads.addToFolder(uid, file_id, folder_id);

    if (!file) {
        throw new Error("failed to add file to folder")
    }

    return file.id;
}



export async function removeFromFolder(metadata: Metadata, file_id: number) {
    const uid = metadata.auth.id;

    if (typeof uid !== "number") {
        throw new Error("Unexpected error: user_id cannot be anythin but a number");
    }

    const [file] = await uploads.removeFromFolder(uid, file_id);

    if (!file) {
        throw new Error("failed to remove file from folder")
    }

    return file.id;
}