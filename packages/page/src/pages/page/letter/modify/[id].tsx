import useLetterApi from '@/api/letter.api';
import MoveResizeImage, {
  FileInfo,
} from '@/components/image/move/move.resize.image';
import MoveText, { TextInfo } from '@/components/text/move/move.text';
import PresignedImage from '@/components/image/presigned/presigned.image';
import { Container } from '@mantine/core';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import useImageApi from '@/api/image.api';
import { useDisablePullToRefresh } from '@/hooks/disable.refresh.hook';

interface ComponentContent {
  type: string;
  text?: string;
  url?: string;
  path: string;
}

const ModifyLetterPage = () => {
  useDisablePullToRefresh();
  const router = useRouter();
  const { id: letterId } = router.query;
  const { letterDetail, getLetterDetail } = useLetterApi();
  const { getPresignedUrl, presignedUrl } = useImageApi();
  const [componentContents, setComponentContents] = useState<
    ComponentContent[]
  >([]);

  useEffect(() => {
    if (!letterId) return;
    getLetterDetail(Number(letterId));
  }, [letterId]);

  const fetchContentData = useCallback(
    async (url: string, path: string): Promise<ComponentContent> => {
      try {
        const response = await fetch(url, { method: 'GET' });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const type = response.headers.get('Content-Type') || '';
        if (type === 'text/plain') {
          const text = await response.text();
          return { type, text, url, path };
        }
        return { type, url, path };
      } catch (error) {
        console.error('Error fetching content:', error);
        return { type: '', path };
      }
    },
    [],
  );

  useEffect(() => {
    if (!letterDetail || !letterDetail.components) return;
    const fetchComponentContents = async () => {
      const contents = await Promise.all(
        letterDetail!.components!.map(async (component) => {
          const presignedUrl = await getPresignedUrl(component.path);
          if (!presignedUrl) return { type: '', path: component.path };
          return await fetchContentData(presignedUrl, component.path);
        }),
      );
      setComponentContents(
        contents.filter(
          (content): content is ComponentContent => content !== undefined,
        ),
      );
    };

    fetchComponentContents();
  }, [letterDetail]);

  return (
    <div>
      <h1>Modify Letter Page</h1>
      {letterDetail && (
        <>
          <p>Letter Title: {letterDetail.title}</p>
          <Container
            style={{
              position: 'relative',
              width: `${letterDetail.background.width}px`,
              height: `${letterDetail.background.height}px`,
            }}
          >
            <PresignedImage
              key={letterDetail.background.path}
              path={letterDetail.background.path}
            />
            {componentContents.map((content, index) => {
              const detailComponent = letterDetail.components!.find(
                (comp) => comp.path === content.path,
              );
              if (!detailComponent) return null;

              if (content.type === 'text/plain') {
                return (
                  <MoveText
                    key={content.path}
                    index={index}
                    textInfo={{
                      text: content.text!,
                      size: {
                        width: detailComponent.width,
                        height: detailComponent.height,
                      },
                      position: { x: detailComponent.x, y: detailComponent.y },
                      font: 'Noto Sans KR',
                      bold: false,
                    }}
                    onUpdate={(data: Partial<TextInfo>) => {
                      console.log('Text updated:', data);
                    }}
                    onClick={() => {
                      console.log('Text clicked');
                    }}
                  />
                );
              }

              return (
                <MoveResizeImage
                  key={content.path}
                  fileInfo={{
                    file: content.url!,
                    size: {
                      width: detailComponent.width,
                      height: detailComponent.height,
                    },
                    position: { x: detailComponent.x, y: detailComponent.y },
                  }}
                  onUpdate={(data: FileInfo) => {
                    console.log('Image updated:', data);
                  }}
                  onClick={() => {
                    //TODO : Footer 표시
                    console.log('Image clicked');
                  }}
                />
              );
            })}
          </Container>
        </>
      )}
    </div>
  );
};

export default ModifyLetterPage;
