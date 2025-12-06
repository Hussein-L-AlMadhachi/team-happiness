import express from 'express';
import { createRPC } from 'enders-sync';

import { login } from './modules/auth.js';
import { registerUser, registerAdmin, update, deleteUser, getProfile } from "./services/profile.js";
import { authValidator } from './auth_roles.js';
import { addToFolder, deleteUpload, getUploads, removeFromFolder } from './services/uploads.js';
import { changeName, deleteFolder, getFolders, newFolder } from './services/folders.js';



export const app = express();
app.use(express.json());



// Create a public RPC instance (no authentication required)
export const publicRPC = createRPC(app, '/api/public', () => ({
    success: true
}));

publicRPC.add(login);
publicRPC.add(registerUser)


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

// managing folders
usersRPC.add(getFolders)
usersRPC.add(newFolder)
usersRPC.add(changeName)
usersRPC.add(deleteFolder)

