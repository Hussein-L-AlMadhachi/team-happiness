<script>
    import { currentView, currentUser, logout } from "./store.js";
    import { addToast } from "./toastStore.js";
    import { slide } from "svelte/transition";

    let isMenuOpen = false;

    const handleLogout = () => {
        logout();
        addToast("Logged out successfully", "success");
        isMenuOpen = false;
    };

    const navigate = (view) => {
        currentView.set(view);
        isMenuOpen = false;
    };
</script>

<nav class="navbar">
    <div class="nav-container">
        <div class="nav-header">
            <div class="nav-brand">
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                    <rect
                        width="48"
                        height="48"
                        rx="12"
                        fill="url(#gradient2)"
                    />
                    <path
                        d="M16 24L22 30L32 18"
                        stroke="white"
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <defs>
                        <linearGradient
                            id="gradient2"
                            x1="0"
                            y1="0"
                            x2="48"
                            y2="48"
                        >
                            <stop offset="0%" stop-color="#667eea" />
                            <stop offset="100%" stop-color="#764ba2" />
                        </linearGradient>
                    </defs>
                </svg>
                <span>OCR Extraction</span>
            </div>
            <button
                class="mobile-menu-btn"
                on:click={() => (isMenuOpen = !isMenuOpen)}
                aria-label="Toggle menu"
            >
                {#if isMenuOpen}
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                {:else}
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                {/if}
            </button>
        </div>

        <div class="nav-content" class:active={isMenuOpen}>
            <div class="nav-menu">
                <a
                    href="#dashboard"
                    class="nav-link"
                    class:active={$currentView === "dashboard"}
                    on:click|preventDefault={() => navigate("dashboard")}
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                    Dashboard
                </a>
                <a
                    href="#history"
                    class="nav-link"
                    class:active={$currentView === "history"}
                    on:click|preventDefault={() => navigate("history")}
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                    </svg>
                    History
                </a>
                <a
                    href="#demo"
                    class="nav-link"
                    class:active={$currentView === "demo"}
                    on:click|preventDefault={() => navigate("demo")}
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                    </svg>
                    Demo
                </a>
                <a
                    href="#tokens"
                    class="nav-link"
                    class:active={$currentView === "tokens"}
                    on:click|preventDefault={() => navigate("tokens")}
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"
                        ></rect>
                        <path d="M7 11V7a5 5 0 0110 0v4"></path>
                    </svg>
                    API Tokens
                </a>
                <a
                    href="#folders"
                    class="nav-link"
                    class:active={$currentView === "folders"}
                    on:click|preventDefault={() => navigate("folders")}
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                        ></path>
                    </svg>
                    Folders
                </a>
            </div>
            <div class="nav-user">
                <div class="user-info">
                    <span id="user-name">{$currentUser?.name || "User"}</span>
                    <button
                        id="logout-btn"
                        class="btn btn-outline btn-sm"
                        on:click={handleLogout}>Logout</button
                    >
                </div>
            </div>
        </div>
    </div>
</nav>
