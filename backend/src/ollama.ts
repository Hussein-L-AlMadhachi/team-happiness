import { Ollama } from "ollama";

const host = process.env.OLLAMA_HOST || 'http://localhost:11434';

// Create an instance of the Ollama client
export const ollama = new Ollama({ host: host });
