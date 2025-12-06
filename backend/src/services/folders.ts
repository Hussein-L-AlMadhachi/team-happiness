import { folders, users } from "../db.js";
import type { Metadata } from "enders-sync";





export async function getFolders(metadata: Metadata) {
    const uid = metadata.auth.id;

    if (typeof uid !== "number") {
        throw new Error("Unexpected error: user_id cannot be anythin but a number");
    }

    const result = await folders.filterByUser(uid);

    if (!result) {
        throw new Error("no folders found");
    }

    return result;
}



export async function newFolder(metadata: Metadata, name: string) {
    const uid = metadata.auth.id;

    if (typeof uid !== "number") {
        throw new Error("Unexpected error: user_id cannot be anythin but a number");
    }

    const [file] = await folders.insert({ owner: uid, name: name });

    if (!file) {
        throw new Error("failed to add file")
    }

    return file.id;
}



export async function rename(metadata: Metadata, file_id: number, new_name: string) {
    const uid = metadata.auth.id;

    if (typeof uid !== "number") {
        throw new Error("Unexpected error: user_id cannot be anythin but a number");
    }

    const [file] = await folders.rename(uid, file_id, new_name);

    if (!file) {
        throw new Error("failed to rename file")
    }

    return file.id;
}


