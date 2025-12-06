// ===================================
// Utility Functions
// ===================================
export const Utils = {
    // Generate unique ID
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },

    // Format date
    formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Generate SHA-256 hash for image
    async hashImage(file) {
        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    // Convert file to base64
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },

    // Simulate OCR processing with Ollama LLaVA
    async simulateOCR(imageData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

        // Mock extracted text (in real app, this would call Ollama API)
        const mockTexts = [
            "Invoice\nDate: 2024-03-15\nTotal: $1,234.56\nThank you for your business!",
            "Meeting Notes\n- Project deadline: March 30\n- Team review on Friday\n- Budget approved",
            "Recipe: Chocolate Cake\nIngredients:\n- 2 cups flour\n- 1 cup sugar\n- 3 eggs\nBake at 350°F for 30 minutes",
            "Product Label\nName: Premium Coffee Beans\nWeight: 500g\nOrigin: Colombia\nRoast: Medium",
            "Business Card\nJohn Doe\nSenior Developer\njohn@example.com\n+1 (555) 123-4567"
        ];

        return mockTexts[Math.floor(Math.random() * mockTexts.length)];
    },

    // Get browser fingerprint (for demo IP simulation)
    getBrowserFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('fingerprint', 2, 2);
        return canvas.toDataURL();
    }
};
