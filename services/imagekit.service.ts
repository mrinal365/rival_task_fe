import api from "./api";
import axios from "axios";

interface ImageKitAuthResponse {
  token: string;
  expire: number;
  signature: string;
}

/**
 * Fetch authentication signature params from backend for client-side upload.
 */
export const getImageKitAuthParams = (): Promise<ImageKitAuthResponse> => {
  return api.get("/imagekit/auth").then((res) => res.data?.data || res.data);
};

/**
 * Upload a file (image/pdf) directly to ImageKit CDN.
 */
export const uploadToImageKit = async (file: File): Promise<string> => {
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !urlEndpoint) {
    throw new Error(
      "ImageKit public key or URL endpoint is not configured in the environment."
    );
  }

  // Get auth credentials from backend
  const auth = await getImageKitAuthParams();

  // Prepare form data
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", file.name);
  formData.append("publicKey", publicKey);
  formData.append("signature", auth.signature);
  formData.append("expire", String(auth.expire));
  formData.append("token", auth.token);

  // Send request directly to ImageKit CDN upload endpoint
  const uploadResponse = await axios.post(
    "https://upload.imagekit.io/api/v1/files/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  const url = uploadResponse.data?.url;
  if (!url) {
    throw new Error("Failed to get URL from upload response");
  }

  return url;
};
