<script>
    import { Utils } from "./utils.js";
    import { tokens, saveToken, revokeToken } from "./store.js";
    import { addToast } from "./toastStore.js";

    const handleGenerateToken = () => {
        const token = {
            id: Utils.generateId(),
            value: `ocr_${Math.random().toString(36).substr(2, 32)}`,
            created: Date.now(),
            lastUsed: null,
        };
        saveToken(token);
        addToast("Token generated successfully", "success");
    };

    const handleRevokeToken = (id) => {
        revokeToken(id);
        addToast("Token revoked", "success");
    };

    const copyToken = (value) => {
        navigator.clipboard.writeText(value);
        addToast("Token copied to clipboard", "success");
    };
</script>

<main id="tokens-view" class="main-content active">
    <div class="container">
        <div class="page-header">
            <h1>API Access Tokens</h1>
            <p>Generate and manage tokens for programmatic access</p>
        </div>

        <div class="tokens-section">
            <div class="generate-token-card">
                <h3>Generate New Token</h3>
                <p>
                    Create a new access token to use the OCR API
                    programmatically
                </p>
                <button
                    id="generate-token-btn"
                    class="btn btn-primary"
                    on:click={handleGenerateToken}
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Generate Token
                </button>
            </div>

            <div class="tokens-list">
                <h3>Active Tokens</h3>
                <div id="tokens-container">
                    {#if $tokens.length === 0}
                        <div class="empty-state">
                            <svg
                                width="64"
                                height="64"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.5"
                            >
                                <rect
                                    x="3"
                                    y="11"
                                    width="18"
                                    height="11"
                                    rx="2"
                                    ry="2"
                                ></rect>
                                <path d="M7 11V7a5 5 0 0110 0v4"></path>
                            </svg>
                            <h3>No tokens yet</h3>
                            <p>Generate your first API token to get started</p>
                        </div>
                    {:else}
                        {#each $tokens as token (token.id)}
                            <div class="token-item">
                                <div class="token-info">
                                    <div class="token-value">{token.value}</div>
                                    <div class="token-meta">
                                        Created: {Utils.formatDate(
                                            token.created,
                                        )}
                                    </div>
                                </div>
                                <div class="token-actions">
                                    <button
                                        class="btn btn-outline btn-sm copy-token"
                                        on:click={() => copyToken(token.value)}
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
                                        class="btn btn-danger btn-sm revoke-token"
                                        on:click={() =>
                                            handleRevokeToken(token.id)}
                                        >Revoke</button
                                    >
                                </div>
                            </div>
                        {/each}
                    {/if}
                </div>
            </div>

            <div class="api-docs-card">
                <h3>API Usage Example</h3>
                <pre><code
                        >curl -X POST https://api.ocr-extraction.com/v1/extract \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "image=@/path/to/image.jpg"</code
                    ></pre>
            </div>
        </div>
    </div>
</main>
