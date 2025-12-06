import { writable, get } from 'svelte/store';

// ===================================
// Storage Manager
// ===================================
const Storage = {
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('Storage error:', e);
        }
    },

    load(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error('Storage error:', e);
            return defaultValue;
        }
    },

    remove(key) {
        localStorage.removeItem(key);
    },

    clear() {
        localStorage.clear();
    }
};

// ===================================
// Stores
// ===================================

// Current User
const savedUser = Storage.load('currentUser');
export const currentUser = writable(savedUser);

currentUser.subscribe(value => {
    if (value) {
        Storage.save('currentUser', value);
    } else {
        Storage.remove('currentUser');
    }
});

// Current View
export const currentView = writable('dashboard');

// Uploads
export const uploads = writable([]);

// Cache
export const cache = writable({});

// Demo Uploads
export const demoUploads = writable(0);

// Tokens
export const tokens = writable([]);

// Stats
export const stats = writable({
    totalUploads: 0,
    cacheHits: 0
});

// ===================================
// Actions
// ===================================

export const loadUserData = () => {
    const user = get(currentUser);
    if (!user) return;

    const userUploads = Storage.load(`uploads_${user.email}`, []);
    const userProjects = Storage.load(`projects_${user.email}`, []);
    const userCache = Storage.load(`cache_${user.email}`, {});
    const userTokens = Storage.load(`tokens_${user.email}`, []);

    uploads.set(userUploads);
    projects.set(userProjects);
    cache.set(userCache);
    tokens.set(userTokens);

    stats.set({
        totalUploads: userUploads.length,
        cacheHits: 0 // Reset on load
    });
};

export const saveUpload = (upload) => {
    const user = get(currentUser);
    if (!user) return;

    uploads.update(u => {
        const newUploads = [upload, ...u];
        Storage.save(`uploads_${user.email}`, newUploads);
        return newUploads;
    });

    stats.update(s => ({ ...s, totalUploads: s.totalUploads + 1 }));
};

export const deleteUpload = (uploadId) => {
    const user = get(currentUser);
    if (!user) return;

    uploads.update(u => {
        const newUploads = u.filter(item => item.id !== uploadId);
        Storage.save(`uploads_${user.email}`, newUploads);
        return newUploads;
    });

    stats.update(s => {
        const currentUploads = get(uploads);
        return { ...s, totalUploads: currentUploads.length };
    });
};

export const clearHistory = () => {
    const user = get(currentUser);
    if (!user) return;

    uploads.set([]);
    Storage.save(`uploads_${user.email}`, []);

    stats.update(s => ({ ...s, totalUploads: 0, cacheHits: 0 }));
};

export const saveToCache = (hash, text) => {
    const user = get(currentUser);
    if (!user) return;

    cache.update(c => {
        const newCache = { ...c, [hash]: text };
        Storage.save(`cache_${user.email}`, newCache);
        return newCache;
    });
};

export const incrementCacheHits = () => {
    stats.update(s => ({ ...s, cacheHits: s.cacheHits + 1 }));
};

export const saveToken = (token) => {
    const user = get(currentUser);
    if (!user) return;

    tokens.update(t => {
        const newTokens = [token, ...t];
        Storage.save(`tokens_${user.email}`, newTokens);
        return newTokens;
    });
};

export const revokeToken = (tokenId) => {
    const user = get(currentUser);
    if (!user) return;

    tokens.update(t => {
        const newTokens = t.filter(token => token.id !== tokenId);
        Storage.save(`tokens_${user.email}`, newTokens);
        return newTokens;
    });
};

// Auth Actions
export const login = (email, password) => {
    const users = Storage.load('users', {});
    const user = users[email];

    if (!user || user.password !== password) {
        return false;
    }

    currentUser.set({ email: user.email, name: user.name });
    loadUserData();
    return true;
};

export const register = (name, email, password) => {
    const users = Storage.load('users', {});
    if (users[email]) {
        return false; // User exists
    }

    users[email] = { name, email, password };
    Storage.save('users', users);

    currentUser.set({ email, name });
    loadUserData();
    return true;
};

export const logout = () => {
    currentUser.set(null);
    uploads.set([]);
    projects.set([]);
    cache.set({});
    tokens.set([]);
    stats.set({ totalUploads: 0, cacheHits: 0 });
};

// ===================================
// Project Actions
// ===================================

// Projects Store
export const projects = writable([]);

export const createProject = (name) => {
    const user = get(currentUser);
    if (!user) return;

    const newProject = {
        id: crypto.randomUUID(),
        name,
        created: new Date().toISOString(),
        uploadIds: []
    };

    projects.update(p => {
        const newProjects = [newProject, ...p];
        Storage.save(`projects_${user.email}`, newProjects);
        return newProjects;
    });

    return newProject;
};

export const deleteProject = (projectId) => {
    const user = get(currentUser);
    if (!user) return;

    projects.update(p => {
        const newProjects = p.filter(project => project.id !== projectId);
        Storage.save(`projects_${user.email}`, newProjects);
        return newProjects;
    });
};

export const updateProject = (projectId, updates) => {
    const user = get(currentUser);
    if (!user) return;

    projects.update(p => {
        const newProjects = p.map(project =>
            project.id === projectId ? { ...project, ...updates } : project
        );
        Storage.save(`projects_${user.email}`, newProjects);
        return newProjects;
    });
};

export const addUploadToProject = (projectId, uploadId) => {
    const user = get(currentUser);
    if (!user) return;

    projects.update(p => {
        const newProjects = p.map(project => {
            if (project.id === projectId) {
                if (!project.uploadIds.includes(uploadId)) {
                    return { ...project, uploadIds: [...project.uploadIds, uploadId] };
                }
            }
            return project;
        });
        Storage.save(`projects_${user.email}`, newProjects);
        return newProjects;
    });
};

export const removeUploadFromProject = (projectId, uploadId) => {
    const user = get(currentUser);
    if (!user) return;

    projects.update(p => {
        const newProjects = p.map(project => {
            if (project.id === projectId) {
                return {
                    ...project,
                    uploadIds: project.uploadIds.filter(id => id !== uploadId)
                };
            }
            return project;
        });
        Storage.save(`projects_${user.email}`, newProjects);
        return newProjects;
    });
};

export { Storage };
