<script>
    import { Utils } from "./utils.js";
    import {
        uploads,
        deleteUpload,
        projects,
        createProject,
        deleteProject,
        updateProject,
        addUploadToProject,
        removeUploadFromProject,
    } from "./store.js";
    import { addToast } from "./toastStore.js";
    import { fade, scale } from "svelte/transition";

    let searchQuery = "";
    let selectedUpload = null;
    let showModal = false;
    let isSidebarOpen = true;
    let selectedProject = null; // null means "All Uploads"

    $: filteredUploads = $uploads.filter((u) => {
        const matchesSearch =
            !searchQuery ||
            u.text.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesProject =
            !selectedProject ||
            $projects
                .find((p) => p.id === selectedProject)
                ?.uploadIds.includes(u.id);
        return matchesSearch && matchesProject;
    });

    const handleCreateProject = () => {
        const name = prompt("Enter project name:");
        if (name) {
            createProject(name);
            addToast("Project created", "success");
        }
    };

    const handleDeleteProject = (id) => {
        if (confirm("Are you sure you want to delete this project?")) {
            if (selectedProject === id) selectedProject = null;
            deleteProject(id);
            addToast("Project deleted", "success");
        }
    };

    const promptRenameProject = (project) => {
        const newName = prompt("Enter new project name:", project.name);
        if (newName && newName !== project.name) {
            updateProject(project.id, { name: newName });
            addToast("Project renamed", "success");
        }
    };

    const toggleProjectForUpload = (uploadId, projectId) => {
        const project = $projects.find((p) => p.id === projectId);
        if (!project) return;

        if (project.uploadIds.includes(uploadId)) {
            removeUploadFromProject(projectId, uploadId);
            addToast("Removed from project", "info");
        } else {
            addUploadToProject(projectId, uploadId);
            addToast("Added to project", "success");
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

    const deleteModalUpload = async () => {
        if (selectedUpload) {
            try {
                await deleteUpload(selectedUpload.id);
                closeModal();
                addToast("Upload deleted", "success");
            } catch (e) {
                addToast("Failed to delete upload", "error");
            }
        }
    };
</script>

<main id="history-view" class="main-content active">
    <div class="history-layout">
        <!-- Sidebar -->
        <div class="history-sidebar" class:collapsed={!isSidebarOpen}>
            <div class="sidebar-header">
                <h3>Projects</h3>
                <button
                    class="btn-icon"
                    on:click={() => (isSidebarOpen = !isSidebarOpen)}
                >
                    {#if isSidebarOpen}
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    {:else}
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    {/if}
                </button>
            </div>

            {#if isSidebarOpen}
                <div
                    class="sidebar-content"
                    transition:fade={{ duration: 200 }}
                >
                    <button
                        class="sidebar-item"
                        class:active={selectedProject === null}
                        on:click={() => (selectedProject = null)}
                    >
                        <svg
                            width="18"
                            height="18"
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
                        All Uploads
                    </button>

                    <div class="projects-list">
                        {#each $projects as project (project.id)}
                            <div
                                class="project-item"
                                class:active={selectedProject === project.id}
                            >
                                <button
                                    class="project-name"
                                    on:click={() =>
                                        (selectedProject = project.id)}
                                >
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                    >
                                        <path
                                            d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
                                        ></path>
                                    </svg>
                                    {project.name}
                                </button>
                                <div class="project-actions">
                                    <button
                                        class="btn-icon small"
                                        title="Rename"
                                        on:click={() =>
                                            promptRenameProject(project)}
                                    >
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                        >
                                            <path
                                                d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                                            ></path>
                                            <path
                                                d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                                            ></path>
                                        </svg>
                                    </button>
                                    <button
                                        class="btn-icon small danger"
                                        title="Delete"
                                        on:click={() =>
                                            handleDeleteProject(project.id)}
                                    >
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                        >
                                            <polyline points="3 6 5 6 21 6"
                                            ></polyline>
                                            <path
                                                d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                                            ></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        {/each}
                    </div>

                    <button
                        class="btn btn-outline w-full mt-4"
                        on:click={handleCreateProject}
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        New Project
                    </button>
                </div>
            {/if}
        </div>

        <!-- Main Content -->
        <div class="history-main">
            <div class="page-header">
                <h1>
                    {selectedProject
                        ? $projects.find((p) => p.id === selectedProject)?.name
                        : "All Uploads"}
                </h1>
                <p>
                    {selectedProject
                        ? "Manage images in this project"
                        : "View all your processed images and extracted text"}
                </p>
            </div>

            <div class="history-controls">
                <input
                    type="text"
                    id="search-history"
                    class="search-input"
                    placeholder="Search history..."
                    bind:value={searchQuery}
                />
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
                                <div class="history-item-text">
                                    {upload.text}
                                </div>
                            </div>
                        </div>
                    {/each}
                {/if}
            </div>
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

                    <div class="modal-projects">
                        <h4>Add to Project</h4>
                        <div class="project-tags">
                            {#each $projects as project (project.id)}
                                <button
                                    class="project-tag"
                                    class:active={project.uploadIds.includes(
                                        selectedUpload.id,
                                    )}
                                    on:click={() =>
                                        toggleProjectForUpload(
                                            selectedUpload.id,
                                            project.id,
                                        )}
                                >
                                    {project.name}
                                    {#if project.uploadIds.includes(selectedUpload.id)}
                                        <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="3"
                                        >
                                            <polyline points="20 6 9 17 4 12"
                                            ></polyline>
                                        </svg>
                                    {/if}
                                </button>
                            {/each}
                            {#if $projects.length === 0}
                                <p class="text-sm text-muted">
                                    No projects created yet.
                                </p>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}
