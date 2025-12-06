<script>
    import { Utils } from "./utils.js";
    import { uploads, deleteUpload, clearHistory } from "./store.js";
    import { addToast } from "./toastStore.js";
    import { fade, scale } from "svelte/transition";

    let searchQuery = "";
    let selectedUpload = null;
    let showModal = false;

    $: filteredUploads = searchQuery
        ? $uploads.filter((u) =>
              u.text.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : $uploads;

    const handleClearHistory = () => {
        if (confirm("Are you sure you want to clear all history?")) {
            clearHistory();
            addToast("History cleared", "success");
        }
    };

    const openModal = (upload) => {
        selectedUpload = upload;
        showModal = true;
    };

    const closeModal = () => {
        showModal = false;
        selectedUpload = null;
    };

    const copyModalText = () => {
        if (selectedUpload) {
            navigator.clipboard.writeText(selectedUpload.text);
            addToast("Text copied to clipboard", "success");
        }
    };

    const deleteModalUpload = () => {
        if (selectedUpload) {
            deleteUpload(selectedUpload.id);
            closeModal();
            addToast("Upload deleted", "success");
        }
    };
</script>

<main id="history-view" class="main-content active">
    <div class="container">
        <div class="page-header">
            <h1>Upload History</h1>
            <p>View all your processed images and extracted text</p>
        </div>

        <div class="history-controls">
            <input
                type="text"
                id="search-history"
                class="search-input"
                placeholder="Search history..."
                bind:value={searchQuery}
            />
            <button
                id="clear-history-btn"
                class="btn btn-outline"
                on:click={handleClearHistory}>Clear All</button
            >
        </div>

        <div id="history-grid" class="history-grid">
            {#if filteredUploads.length === 0}
                <div class="empty-state">
                    <svg
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                    >
                        <path
                            d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"
                        ></path>
                    </svg>
                    <h3>No uploads found</h3>
                    <p>
                        {searchQuery
                            ? "Try a different search term"
                            : "Upload your first image to get started"}
                    </p>
                </div>
            {:else}
                {#each filteredUploads as upload (upload.id)}
                    <div
                        class="history-item"
                        role="button"
                        tabindex="0"
                        on:click={() => openModal(upload)}
                        on:keydown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                openModal(upload);
                            }
                        }}
                    >
                        <img
                            src={upload.image}
                            alt="Upload"
                            class="history-item-image"
                        />
                        <div class="history-item-content">
                            <div class="history-item-date">
                                {Utils.formatDate(upload.timestamp)}
                            </div>
                            <div class="history-item-text">{upload.text}</div>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
    </div>
</main>

{#if showModal && selectedUpload}
    <div id="history-modal" class="modal active">
        <div
            class="modal-overlay"
            role="button"
            tabindex="0"
            aria-label="Close modal"
            on:click={closeModal}
            on:keydown={(e) => {
                if (e.key === "Escape") closeModal();
            }}
            transition:fade={{ duration: 200 }}
        ></div>
        <div
            class="modal-content"
            transition:scale={{ duration: 200, start: 0.95 }}
        >
            <button
                class="modal-close"
                aria-label="Close modal"
                on:click={closeModal}
            >
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
            </button>
            <div class="modal-body">
                <img
                    id="modal-image"
                    src={selectedUpload.image}
                    alt="Full size"
                />
                <div class="modal-details">
                    <h3>Extracted Text</h3>
                    <p id="modal-date" class="modal-date">
                        {Utils.formatDate(selectedUpload.timestamp)}
                    </p>
                    <div id="modal-text" class="modal-text">
                        {selectedUpload.text}
                    </div>
                    <div class="modal-actions">
                        <button
                            id="modal-copy-btn"
                            class="btn btn-outline"
                            on:click={copyModalText}>Copy Text</button
                        >
                        <button
                            id="modal-delete-btn"
                            class="btn btn-danger"
                            on:click={deleteModalUpload}>Delete</button
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}
