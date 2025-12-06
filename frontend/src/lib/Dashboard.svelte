<script>
    import { Utils } from "./utils.js";
    import {
        currentUser,
        cache,
        stats,
        saveUpload,
        saveToCache,
        incrementCacheHits,
    } from "./store.js";
    import { addToast } from "./toastStore.js";

    let currentFile = null;
    let previewSrc = "";
    let isProcessing = false;
    let extractedText = "";
    let fromCache = false;
    let step = "upload"; // upload, preview, processing, result

    let dropZone;

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (file) await handleFile(file);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        dropZone.classList.remove("drag-over");
        const file = e.dataTransfer.files[0];
        if (file) await handleFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        dropZone.classList.add("drag-over");
    };

    const handleDragLeave = () => {
        dropZone.classList.remove("drag-over");
    };

    const handleFile = async (file) => {
        // Validate file type
        if (!file.type.startsWith("image/")) {
            addToast("Please select an image file", "error");
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            addToast("Image size must be less than 10MB", "error");
            return;
        }

        currentFile = file;
        previewSrc = await Utils.fileToBase64(file);
        step = "preview";
    };

    const processImage = async () => {
        if (!currentFile) return;

        step = "processing";
        isProcessing = true;

        try {
            // Generate hash for caching
            const hash = await Utils.hashImage(currentFile);

            // Check cache
            if ($cache[hash]) {
                extractedText = $cache[hash];
                fromCache = true;
                incrementCacheHits();
                addToast("Result loaded from cache!", "success");
            } else {
                const imageData = await Utils.fileToBase64(currentFile);
                extractedText = await Utils.simulateOCR(imageData);
                fromCache = false;
                saveToCache(hash, extractedText);
            }

            // Save to history
            const upload = {
                id: Utils.generateId(),
                image: await Utils.fileToBase64(currentFile),
                text: extractedText,
                timestamp: Date.now(),
                hash: hash,
            };
            saveUpload(upload);

            step = "result";
        } catch (error) {
            console.error("Processing error:", error);
            addToast("Error processing image", "error");
            reset();
        } finally {
            isProcessing = false;
        }
    };

    const copyText = () => {
        navigator.clipboard.writeText(extractedText);
        addToast("Text copied to clipboard", "success");
    };

    const reset = () => {
        currentFile = null;
        previewSrc = "";
        extractedText = "";
        step = "upload";
    };
</script>

<main id="dashboard-view" class="main-content active">
    <div class="container">
        <div class="page-header">
            <h1>Extract Text from Images</h1>
            <p>Upload an image to extract text using AI-powered OCR</p>
        </div>

        <div class="upload-section">
            <div class="upload-card">
                {#if step === "upload"}
                    <div
                        id="drop-zone"
                        class="drop-zone"
                        bind:this={dropZone}
                        role="button"
                        tabindex="0"
                        on:dragover={handleDragOver}
                        on:dragleave={handleDragLeave}
                        on:drop={handleDrop}
                        on:click={() =>
                            document.getElementById("file-input").click()}
                        on:keydown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                document.getElementById("file-input").click();
                            }
                        }}
                    >
                        <svg
                            width="64"
                            height="64"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.5"
                        >
                            <path
                                d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
                            ></path>
                        </svg>
                        <h3>Drop your image here</h3>
                        <p>or click to browse</p>
                        <input
                            type="file"
                            id="file-input"
                            accept="image/*"
                            hidden
                            on:change={handleFileSelect}
                        />
                        <button
                            type="button"
                            class="btn btn-primary"
                            id="browse-btn">Browse Files</button
                        >
                    </div>
                {:else if step === "preview"}
                    <div id="preview-section" class="preview-section">
                        <img
                            id="image-preview"
                            src={previewSrc}
                            alt="Preview"
                        />
                        <div class="preview-actions">
                            <button
                                id="process-btn"
                                class="btn btn-primary"
                                on:click={processImage}>Extract Text</button
                            >
                            <button
                                id="cancel-btn"
                                class="btn btn-outline"
                                on:click={reset}>Cancel</button
                            >
                        </div>
                    </div>
                {:else if step === "processing"}
                    <div id="processing-section" class="processing-section">
                        <div class="spinner"></div>
                        <h3>Processing Image...</h3>
                        <p>Extracting text using Ollama LLaVA model</p>
                    </div>
                {:else if step === "result"}
                    <div id="result-section" class="result-section">
                        <div class="result-header">
                            <h3>Extracted Text</h3>
                            <div class="result-actions">
                                <button
                                    id="copy-text-btn"
                                    class="btn btn-outline btn-sm"
                                    on:click={copyText}
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                    >
                                        <rect
                                            x="9"
                                            y="9"
                                            width="13"
                                            height="13"
                                            rx="2"
                                            ry="2"
                                        ></rect>
                                        <path
                                            d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
                                        ></path>
                                    </svg>
                                    Copy
                                </button>
                                <button
                                    id="new-upload-btn"
                                    class="btn btn-primary btn-sm"
                                    on:click={reset}>New Upload</button
                                >
                            </div>
                        </div>
                        {#if fromCache}
                            <div id="cache-indicator" class="cache-indicator">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                                    ></path>
                                </svg>
                                Result from cache (instant)
                            </div>
                        {/if}
                        <div id="extracted-text" class="extracted-text">
                            {extractedText}
                        </div>
                    </div>
                {/if}
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"
                            ></path>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <h4>Total Uploads</h4>
                        <p id="total-uploads">{$stats.totalUploads}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <h4>Cache Hits</h4>
                        <p id="cache-hits">{$stats.cacheHits}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>
