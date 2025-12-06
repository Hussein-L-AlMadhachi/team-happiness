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



export function generateRandomBase64() {
    // Generate random bytes and convert to base64
    const randomBytes = crypto.randomBytes(32); // Adjust size as needed
    let base64 = randomBytes.toString('base64');

    // Replace unsafe URL characters
    base64 = base64
        .replace(/\//g, '_')    // Replace / with _
        .replace(/\+/g, '-')    // Replace + with -
        .replace(/=/g, '');     // Remove padding

    return base64;
}
