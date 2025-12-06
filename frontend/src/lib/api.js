import { RPC } from 'enders-sync-client';

// Create a public RPC instance (no authentication required)
export const publicRPC = new RPC('/api/public');

// Register public functions
publicRPC.load(
    'login',
    'registerUser'
);

// Users RPC instance
export const usersRPC = new RPC('/api/users');

// Register user functions
usersRPC.load(
    'update',
    'deleteUser',
    'getProfile',
    'getUploads',
    'deleteUpload',
    'addToFolder',
    'removeFromFolder',
    'getFolders',
    'newFolder',
    'changeName',
    'deleteFolder'
);
