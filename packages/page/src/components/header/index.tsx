import { Button, Grid } from '@mantine/core';
import { useRouter } from 'next/router';

const Header = () => {
  const router = useRouter();
  return (
    <Grid>
      <Grid.Col span={4}>
        <Button onClick={() => router.replace('/page/my')}>MY</Button>
      </Grid.Col>
      <Grid.Col span={4}>
        <Button onClick={() => router.replace('/page/create')}>CREATE</Button>
      </Grid.Col>
    </Grid>
  );
};

export default Header;
