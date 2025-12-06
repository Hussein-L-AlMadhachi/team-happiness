
export async function uploadImage(file, options = {}) {
    // Validate file input
    if (!(file instanceof File)) {
        throw new Error('Input must be a File object');
    }

    // Create FormData to send the file
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        console.log('Upload response:', result);

        // Handle different response scenarios based on your backend
        if (!result.success) {
            if (result.is_auth === false) {
                throw new Error('Authentication failed: ' + (result.reason || 'Unauthorized'));
            } else if (result.is_limited) {
                throw new Error('Rate limited: ' + (result.reason || 'Try again later'));
            } else {
                throw new Error('Upload failed: ' + (result.reason || 'Unknown error'));
            }
        }

        // Success - return the complete result including OCR description
        return {
            success: true,
            filename: result.filename,
            path: result.path,
            description: result.description, // OCR description from backend
            fullResponse: result
        };

    } catch (error) {
        // Handle network errors or failed promises
        console.error('Upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
    }
}
