import useUserApi from '@/api/user.api';
import apiClient from '@/common/http.client';
import useLoginStore from '@/store/login.store';
import { useEffect } from 'react';

const ProfilePage = () => {
  const { access } = useLoginStore();
  const { profile, getProfile } = useUserApi();
  useEffect(() => {
    getProfile();
  }, []);
  return <div>{JSON.stringify(profile) ?? '프로필 없음'}</div>;
};

export default ProfilePage;
