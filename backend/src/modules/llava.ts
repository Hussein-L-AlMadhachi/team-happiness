import fs from 'fs';
import process from 'process';

import { ollama } from '../ollama.js';



export async function analyzeImage(image_path: string) {
    try {
        if (!fs.existsSync(image_path)) {
            console.error('File not found:', image_path);
            process.exit(1);
        }
        // Read the image file and convert it to base64
        const imageData = await fs.promises.readFile(image_path);
        const base64Image = imageData.toString('base64');

        // Send a request to Ollama with the LLaVA model and the image data
        const message = {
            role: 'user',
            content: 'What is in this image?',
            images: [base64Image]
        };
        const response = await ollama.chat({
            model: 'llava',
            messages: [message]
        });

        return response.message.content;
    } catch (error) {
        console.error('Error analyzing image:', error);
    }
}
