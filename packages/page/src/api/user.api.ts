import { useState } from "react";
import apiClient from "../common/http.client";
import ApiResponse from "../common/response";
import useErrorStore from "../store/error.store";
import useLoginStore from "@/store/login.store";

interface ProfileResponse {
  userId: string;
  email: string;
  nickName: string;
  profileImage?: string;
}

interface UpdateProfileRequest {
  nickName: string;
}

interface PrepareImageResponse {
  url: string;
  sessionKey: string;
}

const useUserApi = () => {
  const { setError } = useErrorStore();
  const { access } = useLoginStore();
  const [profile, setProfile] = useState<ProfileResponse>();
  const [prepareUrls, setPrepareUrls] = useState<PrepareImageResponse>();

  const getProfile = async () => {
    try {
      const response = await apiClient.get<ApiResponse<ProfileResponse>>(
        "/user",
        {
          headers: {
            Authorization: `Bearer ${access ?? ""}`,
          },
        }
      );
      if (!response.result) {
        setError(response.error.message);
      } else {
        setProfile(response.data);
      }
    } catch (error) {
      setError("프로필 조회 중 오류가 발생했습니다.");
    }
  };

  const updateProfile = async (request: UpdateProfileRequest) => {
    try {
      const response = await apiClient.patch<ApiResponse<void>>(
        "/user",
        request,
        {
          headers: {
            Authorization: `Bearer ${access ?? ""}`,
          },
        }
      );
      if (!response.result) {
        setError(response.error.message);
        throw new Error(response.error.message);
      }
    } catch (error) {
      setError("프로필 업데이트 중 오류가 발생했습니다.");
      throw error;
    }
  };

  const prepareProfileImage = async () => {
    try {
      const response = await apiClient.get<ApiResponse<PrepareImageResponse>>(
        "/user/profile-image/prepare-add",
        {
          headers: {
            Authorization: `Bearer ${access ?? ""}`,
          },
        }
      );
      if (!response.result) {
        setError(response.error.message);
        throw new Error(response.error.message);
      }
      setPrepareUrls(response.data);
    } catch (error) {
      setError("프로필 이미지 업로드 준비 중 오류가 발생했습니다.");
      throw error;
    }
  };

  const validateProfileImage = async () => {
    try {
      const response = await apiClient.put<ApiResponse<void>>(
        "/user/profile-image",
        {},
        {
          headers: {
            Authorization: `Bearer ${access ?? ""}`,
          },
        }
      );
      if (!response.result) {
        setError(response.error.message);
        throw new Error(response.error.message);
      }
    } catch (error) {
      setError("프로필 이미지 검증 중 오류가 발생했습니다.");
      throw error;
    }
  };

  return {
    profile,
    getProfile,
    updateProfile,
    prepareProfileImage,
    prepareUrls,
    validateProfileImage,
  };
};

export default useUserApi;
