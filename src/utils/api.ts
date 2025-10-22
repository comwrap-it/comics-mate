import axios from "axios";

export interface GenerateBadgeRequest {
  name: string;
  email: string;
  style: string;
  character: string;
  ai_model: string;
  dimensions?: string;
  quality?: string;
  action_prompt: string;
  photo: string; // base64 encoded image
}

export interface GenerateBadgeResponse {
  success: boolean;
  image_url?: string;
  error?: string;
}

const API_BASE_URL = "https://mysite"; // Replace with actual API URL

export const generateBadge = async (
  data: GenerateBadgeRequest
): Promise<GenerateBadgeResponse> => {
  try {
    const response = await axios.post<GenerateBadgeResponse>(
      `${API_BASE_URL}/generate`,
      data,
      {
        timeout: 60000, // 60 seconds timeout
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error ||
          error.message ||
          "Errore durante la generazione del badge"
      );
    }
    throw new Error("Errore di rete. Riprova più tardi.");
  }
};

// Mock API for local development/testing
export const generateBadgeMock = async (
  data: GenerateBadgeRequest
): Promise<GenerateBadgeResponse> => {
  console.log("Mock API call with data:", data);
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Return a placeholder image
  return {
    success: true,
    image_url:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='800' height='600' fill='%23f0f0f0'/%3E%3Ctext x='400' y='300' font-family='Arial' font-size='24' fill='%23333' text-anchor='middle'%3EBadge Generato%3C/text%3E%3Ctext x='400' y='340' font-family='Arial' font-size='18' fill='%23666' text-anchor='middle'%3E${data.name} - ${data.style}%3C/text%3E%3C/svg%3E",
  };
};
