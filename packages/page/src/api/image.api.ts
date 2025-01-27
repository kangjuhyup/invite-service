import { useState } from "react";
import apiClient from "../common/http.client";
import ApiResponse from "../common/response";
import useErrorStore from "../store/error.store";

export interface ImageMetaData {
  type: "image" | "text";
  width?: string;
  height?: string;
  x?: string;
  y?: string;
  z?: string;
  angle?: string;
  session?: string;
  font?: string;
  color?: string;
  bold?: string;
}

const useImageApi = () => {
  const [presignedUrl, setPresignedUrl] = useState<string>();
  const getPresignedUrl = async (path: string) => {
    const response = await apiClient.get<ApiResponse<string>>(`/image/${path}`);
    setPresignedUrl(response.data);
    return response.data;
  };

  const removeBackground = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient.post<ArrayBuffer>("/image/bg-remove", formData, {
      responseType: "arraybuffer",
    });
  };

  const putImageToPresignedUrl = async (
    url: string,
    file: File | string,
    metadata: ImageMetaData
  ) => {
    console.log("putImageToPresignedUrl", url, file, metadata);
    try {
      const response = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type":
            metadata.type === "image" ? "image/png" : "text/plain",
          "x-amz-meta-session": metadata.session || "",
          ...(metadata.height && { "x-amz-meta-height": metadata.height }),
          ...(metadata.width && { "x-amz-meta-width": metadata.width }),
          ...(metadata.x && { "x-amz-meta-x": metadata.x }),
          ...(metadata.y && { "x-amz-meta-y": metadata.y }),
          ...(metadata.z && { "x-amz-meta-z": metadata.z }),
          ...(metadata.angle && { "x-amz-meta-angle": metadata.angle }),
          ...(metadata.font && { "x-amz-meta-font": metadata.font }),
          ...(metadata.color && { "x-amz-meta-color": metadata.color }),
          ...(metadata.bold && { "x-amz-meta-bold": metadata.bold }),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      return response;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  return {
    presignedUrl,
    getPresignedUrl,
    removeBackground,
    putImageToPresignedUrl,
  };
};

export default useImageApi;
