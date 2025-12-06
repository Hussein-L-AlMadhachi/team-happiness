import { client } from "../redis.js";



export interface RateLimitValue<T> {
    ttl: number;
    counter: number;
    limit: number;
}


export async function isRateLimited(key: string, limit: number, windowSeconds: number): Promise<boolean> {
    const current = await client.incr(key);

    if (current === 1) {
        await client.expire(key, windowSeconds);
    }

    return current > limit;
}

