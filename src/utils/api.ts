import axios from "axios";

export const generateBadge = async (
    formData: FormData
): Promise<Blob> => {
    try {
        const response = await axios.post(
            "https://comwrap25.app.n8n.cloud/webhook-test/get-christmas-comics",
            formData,
            {
                timeout: 180000,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                responseType: "blob",
            }
        );
        return response.data;
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