import express from 'express';
import { createRPC } from 'enders-sync';

import { login } from './modules/auth.js';
import { registerUser, registerAdmin, update, deleteUser, getProfile } from "./services/profile.js";
import { authValidator } from './auth_roles.js';
import { addToFolder, deleteUpload, getUploads, removeFromFolder } from './services/uploads.js';



export const app = express();
app.use(express.json());



// Create a public RPC instance (no authentication required)
export const publicRPC = createRPC(app, '/api/public', () => ({
    success: true
}));



publicRPC.add(login);
publicRPC.add(registerUser)



// Admin RPC instance
export const adminsRPC = createRPC(app, '/api/admin', authValidator.admin);
adminsRPC.add(update)
adminsRPC.add(deleteUser)
adminsRPC.add(getProfile)



// Users RPC instance
export const usersRPC = createRPC(app, '/api/users', authValidator.users);
usersRPC.add(update)
usersRPC.add(deleteUser)
usersRPC.add(getProfile)

// managing uploads
usersRPC.add(getUploads)
usersRPC.add(deleteUpload)
usersRPC.add(addToFolder)
usersRPC.add(removeFromFolder)



export const rateLimitedRPC = createRPC(app, '/api/rate-limited', authValidator.users);
rateLimitedRPC.add(update)
rateLimitedRPC.add(deleteUser)
rateLimitedRPC.add(getProfile)
