import express from 'express';
import { createRPC } from 'enders-sync';
import cookieParser from 'cookie-parser';

import { login } from './modules/auth.js';
import { authValidator } from './auth_roles.js';
import { registerUser, update, deleteUser, getProfile } from "./services/profile.js";
import { addToFolder, deleteUpload, getUploads, removeFromFolder } from './services/uploads.js';
import { changeName, deleteFolder, getFolders, newFolder } from './services/folders.js';
import { setupUploadRoutes } from "./costum_routes/uploadImage.js";



export const app = express();
app.use(cookieParser());

app.use(express.json());



app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

setupUploadRoutes(app);


// Create a public RPC instance (no authentication required)
export const publicRPC = createRPC(app, '/api/public', () => { return { success: true } });

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

app.listen(8080, () => {
    console.log("Server started on port 8080");
});
