import useLetterApi from '@/api/letter.api';
import PresignedImage from '@/components/image/presigned/presigned.image';
import useInit from '@/hooks/init.hook';
import { Container } from '@mantine/core';
import { useRouter } from 'next/router';

const ModifyLetterPage = () => {
  const router = useRouter();
  const { id: letterId } = router.query;

  const { letterDetail, getLetterDetail } = useLetterApi();

  useInit({
    apis: [() => letterId && getLetterDetail(Number(letterId))],
  });

  return (
    <div>
      <h1>Modify Letter Page</h1>
      <p>Letter ID: {letterId}</p>
      {letterDetail && (
        <>
          <p>Letter Title: {letterDetail.title}</p>
          <Container
            pos={'relative'}
            w={`${letterDetail.background.width}px`}
            h={`${letterDetail.background.height}px`}
          >
            <PresignedImage
              position={'absolute'}
              path={letterDetail.background.path}
            />
            {letterDetail.components?.map((component) => (
              <PresignedImage
                key={component.path}
                path={component.path}
                width={`${component.width}px`}
                height={`${component.height}px`}
                position={'absolute'}
                x={`${component.x}px`}
                y={`${component.y}px`}
              />
            ))}
          </Container>
        </>
      )}
    </div>
  );
};

export default ModifyLetterPage;
