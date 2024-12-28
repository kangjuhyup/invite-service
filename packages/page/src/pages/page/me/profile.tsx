import useLetterApi from '@/api/letter.api';
import useUserApi from '@/api/user.api';
import { Container } from '@mantine/core';
import { useEffect } from 'react';

const ProfilePage = () => {
  const { profile, getProfile } = useUserApi();
  const { letterPage, getLetterPage } = useLetterApi();
  useEffect(() => {
    getProfile();
    getLetterPage(10, 0);
  }, []);
  return (
    <Container>
      <div>{JSON.stringify(profile)}</div>
      <div>{JSON.stringify(letterPage)}</div>
    </Container>
  );
};

export default ProfilePage;
