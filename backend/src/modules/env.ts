import dotenv from 'dotenv';
import path from 'path';

/**
 * Load environment variables from .env file
 * @param envPath - Path to the .env file (default: .env in current directory)
 */
export function loadEnv(envPath: string = '.env'): void {
    const result = dotenv.config({
        path: path.resolve(process.cwd(), envPath)
    });

    if (result.error) {
        console.warn(`Warning: ${envPath} file not found or couldn't be loaded`);
    } else {
        console.log(`Environment variables loaded from ${envPath}`);
    }
}
