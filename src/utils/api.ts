import axios from "axios";

export interface BadgeResponse {
    blob: Blob;
    number?: string;
}

export interface VideoLinkItem {
    row_number: number;
    Numero: number;
    Nome: string;
    Email: string;
    Smorfia: string;
    Storia: string;
    Video: string;
    Vincitore: string;
}

export interface VideosResponse {
    video_link: VideoLinkItem[];
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

export const getVideos = async (): Promise<VideosResponse | null> => {
    try {
        const response = await axios.get(
            "https://comwrap25.app.n8n.cloud/webhook/get-videos",
            {
                timeout: 30000,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        
        // The API returns an array with one object containing video_link
        if (Array.isArray(response.data) && response.data.length > 0) {
            return response.data[0] as VideosResponse;
        }
        
        return null;
    } catch (error) {
        console.error("Error fetching videos:", error);
        return null;
    }
};

export const getNumberByEmail = async (email: string): Promise<number | null> => {
    try {
        const videosData = await getVideos();
        
        if (!videosData || !videosData.video_link) {
            return null;
        }
        
        // Find the video link item matching the email
        const matchingItem = videosData.video_link.find(
            (item) => item.Email.toLowerCase() === email.toLowerCase()
        );
        
        if (matchingItem && matchingItem.Numero) {
            return matchingItem.Numero;
        }
        
        return null;
    } catch (error) {
        console.error("Error getting number by email:", error);
        return null;
    }
};