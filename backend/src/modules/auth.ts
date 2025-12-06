import jwt from 'jsonwebtoken';
import { type Request, type Response } from 'express';

import { type Metadata, type Validator } from 'enders-sync';
import { users } from '../db.js';
import { authValidator } from '../auth_roles.js';



interface TokenMetadata {
    user_id: number,
    role: string
}



if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined");
}
const JWT_SECRET = process.env.JWT_SECRET;



export function generateRoleAuth(role: string): Validator {
    return (req: Request) => {
        try {
            const token = req.cookies["auth-token"];

            if (!token) {
                return { success: false };
            }

            const decoded = jwt.verify(token, JWT_SECRET as string) as unknown as TokenMetadata;

            if (typeof decoded.user_id !== "number" || typeof decoded.role !== "string") {
                return {
                    success: false
                }
            }

            if (decoded.role !== role) {
                return {
                    success: false
                }
            }

            return {
                success: true,
                metadata: {
                    auth: {
                        user_id: decoded.user_id,
                        role: decoded.role
                    }

                }
            };

        } catch (error) {
            console.error(error);

            return { success: false };
        }
    }
}



interface loggedIn {
    role: string,
    user_id: number,
}




export async function login(
    metadata: Metadata, username: string | undefined, password: string | undefined
): Promise<loggedIn> {

    if (typeof password !== "string" || typeof username !== "string") {
        throw new TypeError("RPC expects a username:string , password:string as input")
    }

    const user = await users.fetchAfterAuth(
        username, password,
        ["role", "id"]
    );

    if (!user) {
        throw new Error("Unauthorized");
    }

    const user_id: number = user.id;
    const user_role: string = user.role;

    try {

        const token = jwt.sign(
            { role: user_role, user_id: user_id },
            JWT_SECRET,
            {
                expiresIn: 60 * 60 * 24 * 1000 * 1000, // Token expires in 1 hour
                issuer: `${user_role}-auth-service`,
                audience: user_role
            }
        );

        metadata.res!.cookie("auth-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 1000 * 1000 // 1 day
        });

        return {
            role: user_role,
            user_id: user_id
        };

    } catch (error) {
        throw new Error('Error creating token');
    }

}



export function isValidNoRPC(req: Request, res: Response) {
    const validation = authValidator.users(req);
    if (validation.success === false) {
        return null;
    }

    const auth = validation.metadata?.auth;

    return auth?.user_id;
}