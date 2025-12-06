import { writable } from 'svelte/store';

export const toasts = writable([]);

export const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    toasts.update(all => [...all, { id, message, type }]);

    setTimeout(() => {
        removeToast(id);
    }, duration);
};

export const removeToast = (id) => {
    toasts.update(all => all.filter(t => t.id !== id));
};
