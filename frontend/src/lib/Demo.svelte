<script>
    import { Utils } from "./utils.js";
    import { demoUploads, Storage } from "./store.js";
    import { addToast } from "./toastStore.js";

    import { uploadImage } from "./uploadImage.js";

    const MAX_UPLOADS = 5;
    let currentFile = null;
    let previewSrc = "";
    let extractedText = "";
    let step = "upload"; // upload, preview, processing, result

    let dropZone;

    $: remaining = MAX_UPLOADS - $demoUploads;
    $: percentage = (remaining / MAX_UPLOADS) * 100;

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
        if ($demoUploads < MAX_UPLOADS) {
            dropZone.classList.add("drag-over");
        }
    };

    const handleDragLeave = () => {
        dropZone.classList.remove("drag-over");
    };

    const handleFile = async (file) => {
        if ($demoUploads >= MAX_UPLOADS) {
            addToast(
                "Demo limit reached. Please reset or create an account.",
                "warning",
            );
            return;
        }

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

        try {
            const result = await uploadImage(currentFile);
            extractedText = result.description;

            // Increment demo count
            demoUploads.update((n) => {
                const newVal = n + 1;
                const fingerprint = Utils.getBrowserFingerprint();
                Storage.save(`demo_${fingerprint}`, newVal);
                return newVal;
            });

            step = "result";
        } catch (error) {
            console.error("Processing error:", error);
            addToast(error.message || "Error processing image", "error");
            reset();
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

    const resetDemo = () => {
        const fingerprint = Utils.getBrowserFingerprint();
        Storage.save(`demo_${fingerprint}`, 0);
        demoUploads.set(0);
        reset();
        addToast("Demo reset successfully", "success");
    };
</script>

<main id="demo-view" class="main-content active">
    <div class="container">
        <div class="page-header">
            <h1>Demo Mode</h1>
            <p>Try OCR extraction with a 5-image limit</p>
        </div>

        <div class="demo-limit-card">
            <div class="limit-header">
                <h3>Remaining Uploads</h3>
                <span id="demo-remaining" class="limit-count"
                    >{remaining} / {MAX_UPLOADS}</span
                >
            </div>
            <div class="progress-bar">
                <div
                    id="demo-progress"
                    class="progress-fill"
                    style="width: {percentage}%"
                ></div>
            </div>
            <p class="limit-info">Upload up to 5 images in demo mode</p>
        </div>

        <div class="upload-section">
            <div class="upload-card">
                {#if $demoUploads >= MAX_UPLOADS}
                    <div id="demo-limit-reached" class="limit-reached">
                        <svg
                            width="64"
                            height="64"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.5"
                        >
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <h3>Demo Limit Reached</h3>
                        <p>
                            You've used all 5 demo uploads. Create an account
                            for unlimited access!
                        </p>
                        <button
                            id="reset-demo-btn"
                            class="btn btn-outline"
                            on:click={resetDemo}>Reset Demo</button
                        >
                    </div>
                {:else if step === "upload"}
                    <div
                        id="demo-drop-zone"
                        class="drop-zone"
                        bind:this={dropZone}
                        role="button"
                        tabindex="0"
                        on:dragover={handleDragOver}
                        on:dragleave={handleDragLeave}
                        on:drop={handleDrop}
                        on:click={() =>
                            document.getElementById("demo-file-input").click()}
                        on:keydown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                document
                                    .getElementById("demo-file-input")
                                    .click();
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
                            id="demo-file-input"
                            accept="image/*"
                            hidden
                            on:change={handleFileSelect}
                        />
                        <button
                            type="button"
                            class="btn btn-primary"
                            id="demo-browse-btn">Browse Files</button
                        >
                    </div>
                {:else if step === "preview"}
                    <div id="demo-preview-section" class="preview-section">
                        <img
                            id="demo-image-preview"
                            src={previewSrc}
                            alt="Preview"
                        />
                        <div class="preview-actions">
                            <button
                                id="demo-process-btn"
                                class="btn btn-primary"
                                on:click={processImage}>Extract Text</button
                            >
                            <button
                                id="demo-cancel-btn"
                                class="btn btn-outline"
                                on:click={reset}>Cancel</button
                            >
                        </div>
                    </div>
                {:else if step === "processing"}
                    <div
                        id="demo-processing-section"
                        class="processing-section"
                    >
                        <div class="spinner"></div>
                        <h3>Processing Image...</h3>
                        <p>Extracting text using Ollama LLaVA model</p>
                    </div>
                {:else if step === "result"}
                    <div id="demo-result-section" class="result-section">
                        <div class="result-header">
                            <h3>Extracted Text</h3>
                            <div class="result-actions">
                                <button
                                    id="demo-copy-text-btn"
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
                                    id="demo-new-upload-btn"
                                    class="btn btn-primary btn-sm"
                                    on:click={reset}>New Upload</button
                                >
                            </div>
                        </div>
                        <div id="demo-extracted-text" class="extracted-text">
                            {extractedText}
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</main>
