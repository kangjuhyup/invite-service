import {useRef} from 'react';
import {View} from 'react-native';
import {
  prepareLetter,
  uploadFile,
  addLetter,
  AddLetterRequest,
  LetterCategoryCode,
} from '../api/letter';
import {EditorItemType} from '../types/editor';
import ViewShot from 'react-native-view-shot';

export const WHITE_PIXEL =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

interface ComponentMeta {
  width: string;
  height: string;
  x: string;
  y: string;
  z: string;
  angle: string;
}

interface TextMeta extends ComponentMeta {
  font: string;
  color: string;
  bold: string;
}

interface PrepareRequest {
  thumbnailMeta: {
    width: string;
    height: string;
  };
  letterMeta: {
    width: string;
    height: string;
  };
  backgroundMeta: {
    width: string;
    height: string;
  };
  componentMetas: ComponentMeta[];
  textMetas: TextMeta[];
}

interface UseImageSaveReturn {
  editorRef: React.RefObject<View>;
  viewShotRef: React.RefObject<ViewShot>;
  handleSave: (
    backgroundImage: string | null,
    width: string,
    height: string,
    items: EditorItemType[],
    letterData: {
      category: LetterCategoryCode;
      title: string;
      body?: string;
      inviteDate: string;
    },
  ) => Promise<void>;
}

export const useImageSave = (): UseImageSaveReturn => {
  const editorRef = useRef<View>(null);
  const viewShotRef = useRef<ViewShot>(null);

  const handleSave = async (
    backgroundImage: string | null,
    width: string,
    height: string,
    items: EditorItemType[],
    letterData: {
      category: LetterCategoryCode;
      title: string;
      body?: string;
      inviteDate: string;
    },
  ) => {
    try {
      if (!viewShotRef.current) {
        throw new Error('ViewShot ref is not initialized');
      }
      console.log('letterData', letterData);
      // 메타데이터 준비
      const prepareData: PrepareRequest = {
        thumbnailMeta: {
          width: '100',
          height: '150',
        },
        letterMeta: {
          width,
          height,
        },
        backgroundMeta: {
          width,
          height,
        },
        componentMetas: items
          .filter(item => item.type === 'image')
          .map((item, idx) => ({
            width: '300',
            height: '300',
            x: item.position?.x.toString() || '0',
            y: item.position?.y.toString() || '0',
            z: idx.toString(),
            angle: '0',
          })),
        textMetas: items
          .filter(item => item.type === 'text')
          .map((item, idx) => ({
            width: '100',
            height: '30',
            x: item.position?.x.toString() || '0',
            y: item.position?.y.toString() || '0',
            z: idx.toString(),
            angle: '0',
            font: encodeURIComponent('Arial'),
            color: item.style?.color?.replace('#', '') || '000000',
            bold: item.style?.fontWeight === 'bold' ? 'true' : 'false',
          })),
      };

      // API 호출 및 URL 획득
      const response = await prepareLetter(prepareData);
      const urls = response.data;
      // 원본 이미지 캡쳐
      const uri = await viewShotRef.current.capture();
      // 레터 이미지 업로드
      await uploadFile(urls.letterUrl, uri, {
        'x-amz-meta-width': prepareData.letterMeta.width,
        'x-amz-meta-height': prepareData.letterMeta.height,
        'x-amz-meta-x': '0',
        'x-amz-meta-y': '0',
        'x-amz-meta-z': '0',
        'x-amz-meta-angle': '0',
        sessionKey: response.data.sessionKey,
      });

      console.log('레터 이미지 업로드 완료');
      // 썸네일 이미지 캡쳐
      const thumbnailUri = await viewShotRef.current.capture({
        width: parseInt(prepareData.thumbnailMeta.width),
        height: parseInt(prepareData.thumbnailMeta.height),
        quality: 0.7,
        format: 'png',
        result: 'data-uri',
      });
      // 썸네일 업로드
      await uploadFile(urls.thumbnailUrl, thumbnailUri, {
        'x-amz-meta-width': prepareData.thumbnailMeta.width,
        'x-amz-meta-height': prepareData.thumbnailMeta.height,
        'x-amz-meta-x': '0',
        'x-amz-meta-y': '0',
        'x-amz-meta-z': '0',
        'x-amz-meta-angle': '0',
        sessionKey: response.data.sessionKey,
      });
      console.log('썸네일 업로드 완료');
      // 배경 이미지 업로드
      const backgroundUri =
        backgroundImage || `data:image/png;base64,${WHITE_PIXEL}`;
      await uploadFile(urls.backgroundUrl, backgroundUri, {
        'x-amz-meta-width': prepareData.backgroundMeta.width,
        'x-amz-meta-height': prepareData.backgroundMeta.height,
        'x-amz-meta-x': '0',
        'x-amz-meta-y': '0',
        'x-amz-meta-z': '0',
        'x-amz-meta-angle': '0',
        sessionKey: response.data.sessionKey,
      });

      // 컴포넌트(이미지) 업로드
      const imageItems = items.filter(item => item.type === 'image');
      await Promise.all(
        imageItems.map(async (item, index) => {
          const meta = prepareData.componentMetas[index];
          await uploadFile(urls.componentUrls[index], item.content, {
            'x-amz-meta-width': meta.width,
            'x-amz-meta-height': meta.height,
            'x-amz-meta-x': meta.x || '0',
            'x-amz-meta-y': meta.y || '0',
            'x-amz-meta-z': meta.z || '0',
            'x-amz-meta-angle': meta.angle || '0',
            sessionKey: response.data.sessionKey,
          });
        }),
      );

      // 텍스트 업로드
      const textItems = items.filter(item => item.type === 'text');
      await Promise.all(
        textItems.map(async (item, index) => {
          const meta = prepareData.textMetas?.[index];
          if (!meta) return;

          // 텍스트 내용을 Blob으로 변환
          const textBlob = new Blob([item.content], {
            type: 'text/plain',
          } as any);
          const textUrl = URL.createObjectURL(textBlob);

          await uploadFile(urls.textUrls[index], textUrl, {
            'x-amz-meta-width': meta.width,
            'x-amz-meta-height': meta.height,
            'x-amz-meta-x': meta.x || '0',
            'x-amz-meta-y': meta.y || '0',
            'x-amz-meta-z': meta.z || '0',
            'x-amz-meta-angle': meta.angle || '0',
            'x-amz-meta-font': meta.font,
            'x-amz-meta-color': meta.color,
            'x-amz-meta-bold': meta.bold,
            sessionKey: response.data.sessionKey,
          });

          URL.revokeObjectURL(textUrl);
        }),
      );

      // 초대장 생성 API 호출
      const addLetterRequest: AddLetterRequest = {
        category: letterData.category, // TODO: 카테고리 선택 UI 추가 필요
        title: letterData.title, // TODO: 제목 입력 UI 추가 필요
        body: letterData.body, // TODO: 텍스트 입력 UI 추가 필요
        inviteDate: letterData.inviteDate,
        commentYn: true,
        attendYn: true,
      };

      await addLetter(addLetterRequest);
    } catch (error) {
      console.error('이미지 저장 실패:', error);
      throw error;
    }
  };

  return {
    editorRef,
    viewShotRef,
    handleSave,
  };
};
