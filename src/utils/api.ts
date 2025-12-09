import axios from "axios";

export interface BadgeResponse {
    blob: Blob;
    number?: string;
}

export const generateBadge = async (
    formData: FormData
): Promise<BadgeResponse> => {
    try {
        const response = await axios.post(
            "https://comwrap25.app.n8n.cloud/webhook/get-christmas-comics",
            formData,
            {
                timeout: 180000,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                responseType: "blob",
            }
        );
        
        // Extract badge number from response headers if present
        const badgeNumber = response.headers["x-badge-number"] || undefined;
        
        return {
            blob: response.data,
            number: badgeNumber
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.error ||
                error.message ||
                "Error during badge generation"
            );
        }
        throw new Error("Network error. Retry later.");
    }
};