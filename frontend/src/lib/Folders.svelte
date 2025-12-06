<script>
    import { onMount } from "svelte";
    import { usersRPC } from "./api.js";
    import { addToast } from "./toastStore.js";

    let folders = [];
    let loading = true;
    let newFolderName = "";
    let isCreating = false;
    let editingId = null;
    let editName = "";

    const loadFolders = async () => {
        loading = true;
        try {
            folders = await usersRPC.getFolders();
        } catch (error) {
            console.error("Error loading folders:", error);
            // addToast("Failed to load folders", "error");
            folders = [];
        } finally {
            loading = false;
        }
    };

    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) return;

        isCreating = true;
        try {
            await usersRPC.newFolder(newFolderName);
            addToast("Folder created successfully", "success");
            newFolderName = "";
            await loadFolders();
        } catch (error) {
            console.error("Error creating folder:", error);
            addToast(error.message || "Failed to create folder", "error");
        } finally {
            isCreating = false;
        }
    };

    const startEdit = (folder) => {
        editingId = folder.id;
        editName = folder.name;
    };

    const cancelEdit = () => {
        editingId = null;
        editName = "";
    };

    const handleRename = async (id) => {
        if (!editName.trim()) return;

        try {
            await usersRPC.changeName(id, editName);
            addToast("Folder renamed successfully", "success");
            editingId = null;
            await loadFolders();
        } catch (error) {
            console.error("Error renaming folder:", error);
            addToast(error.message || "Failed to rename folder", "error");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this folder?")) return;

        try {
            await usersRPC.deleteFolder(id);
            addToast("Folder deleted successfully", "success");
            await loadFolders();
        } catch (error) {
            console.error("Error deleting folder:", error);
            addToast(error.message || "Failed to delete folder", "error");
        }
    };

    onMount(() => {
        loadFolders();
    });
</script>

<div class="main-content active">
    <div class="container">
        <div class="page-header">
            <h1>My Folders</h1>
            <p>Manage your document folders</p>
        </div>

        <div class="create-folder-section">
            <div class="input-group">
                <input
                    type="text"
                    placeholder="New Folder Name"
                    bind:value={newFolderName}
                    on:keydown={(e) =>
                        e.key === "Enter" && handleCreateFolder()}
                    disabled={isCreating}
                />
                <button
                    class="btn btn-primary"
                    on:click={handleCreateFolder}
                    disabled={isCreating || !newFolderName.trim()}
                >
                    {isCreating ? "Creating..." : "Create Folder"}
                </button>
            </div>
        </div>

        {#if loading}
            <div class="loading">Loading folders...</div>
        {:else if folders.length === 0}
            <div class="empty-state">
                <p>No folders found. Create one to get started!</p>
            </div>
        {:else}
            <div class="folders-grid">
                {#each folders as folder (folder.id)}
                    <div class="folder-card">
                        <div class="folder-icon">
                            <svg
                                width="48"
                                height="48"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.5"
                            >
                                <path
                                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                                ></path>
                            </svg>
                        </div>
                        <div class="folder-content">
                            {#if editingId === folder.id}
                                <div class="edit-mode">
                                    <input
                                        type="text"
                                        bind:value={editName}
                                        on:keydown={(e) =>
                                            e.key === "Enter" &&
                                            handleRename(folder.id)}
                                        autoFocus
                                    />
                                    <div class="edit-actions">
                                        <button
                                            class="btn-icon success"
                                            on:click={() =>
                                                handleRename(folder.id)}
                                            title="Save"
                                        >
                                            ✓
                                        </button>
                                        <button
                                            class="btn-icon danger"
                                            on:click={cancelEdit}
                                            title="Cancel"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            {:else}
                                <h3>{folder.name}</h3>
                                <div class="folder-actions">
                                    <button
                                        class="btn-icon"
                                        on:click={() => startEdit(folder)}
                                        title="Rename"
                                    >
                                        ✎
                                    </button>
                                    <button
                                        class="btn-icon danger"
                                        on:click={() => handleDelete(folder.id)}
                                        title="Delete"
                                    >
                                        🗑
                                    </button>
                                </div>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>

<style>
    .create-folder-section {
        margin-bottom: 2rem;
        background: var(--bg-secondary);
        padding: 1.5rem;
        border-radius: var(--radius-lg);
        border: 1px solid var(--border-color);
    }

    .input-group {
        display: flex;
        gap: 1rem;
        max-width: 500px;
    }

    .input-group input {
        flex: 1;
        padding: 0.75rem 1rem;
        border-radius: var(--radius-md);
        border: 1px solid var(--border-color);
        background: var(--bg-primary);
        color: var(--text-primary);
    }

    .folders-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
    }

    .folder-card {
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        transition: all 0.2s;
    }

    .folder-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
        border-color: var(--primary-color);
    }

    .folder-icon {
        color: var(--primary-color);
        margin-bottom: 1rem;
    }

    .folder-content {
        width: 100%;
    }

    .folder-content h3 {
        margin: 0 0 1rem 0;
        font-size: 1.1rem;
        color: var(--text-primary);
    }

    .folder-actions {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        opacity: 0.6;
        transition: opacity 0.2s;
    }

    .folder-card:hover .folder-actions {
        opacity: 1;
    }

    .btn-icon {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.25rem;
        font-size: 1.2rem;
        color: var(--text-secondary);
        transition: color 0.2s;
    }

    .btn-icon:hover {
        color: var(--primary-color);
    }

    .btn-icon.danger:hover {
        color: var(--error-color);
    }

    .btn-icon.success:hover {
        color: var(--success-color);
    }

    .edit-mode {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .edit-mode input {
        width: 100%;
        padding: 0.5rem;
        border-radius: var(--radius-sm);
        border: 1px solid var(--primary-color);
        background: var(--bg-primary);
        color: var(--text-primary);
        text-align: center;
    }

    .edit-actions {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
    }

    .loading,
    .empty-state {
        text-align: center;
        padding: 3rem;
        color: var(--text-secondary);
    }
</style>
