<script>
    import { toasts, removeToast } from './toastStore.js';
    import { flip } from 'svelte/animate';
    import { fade, fly } from 'svelte/transition';

    const icons = {
        success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
        error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
        warning: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
        info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
    };
</script>

<div id="toast-container">
    {#each $toasts as toast (toast.id)}
        <div 
            class="toast {toast.type}" 
            animate:flip 
            in:fly={{ x: 200, duration: 300 }} 
            out:fade={{ duration: 300 }}
        >
            <div class="toast-content">
                <div class="toast-icon">
                    {@html icons[toast.type]}
                </div>
                <div class="toast-message">
                    <div class="toast-text">{toast.message}</div>
                </div>
            </div>
        </div>
    {/each}
</div>
