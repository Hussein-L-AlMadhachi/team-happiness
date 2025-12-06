import { createClient } from 'redis';

export const client = createClient({
    url: 'redis://localhost:6379' // default URL
});

client.on('error', (err) => console.log('Redis Client Error', err));
client.on('connect', () => console.log('Connected to Redis'));

await client.connect();

