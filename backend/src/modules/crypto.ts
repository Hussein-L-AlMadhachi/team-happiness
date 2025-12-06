import crypto from 'crypto';
import fs from 'fs';



export function hashFile(filePath: string, algorithm: string = 'sha256'): Promise<string> {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash(algorithm);
        const stream = fs.createReadStream(filePath);

        stream.on('error', reject);
        stream.on('data', (chunk: any) => hash.update(chunk));
        stream.on('end', () => resolve(hash.digest('hex')));
    });
}



export function generateRandomBase64(bytes = 32) {
    const buffer = new Uint8Array(bytes);
    crypto.getRandomValues(buffer);
    // Convert to base64
    const base64 = btoa(String.fromCharCode(...buffer));
    return base64;
}

