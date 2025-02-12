/**
 * 에디터 아이템 타입 정의
 */
export type EditorItemType = {
  id: string;
  type: 'text' | 'image' | 'sticker';
  content: string;
  style?: {
    fontSize?: number;
    fontWeight?: 'normal' | 'bold';
    color?: string;
    fontFamily?: string;
    width?: string;
    height?: string;
  };
  position: {
    x: number;
    y: number;
  };
  rotation?: number;
  zIndex?: number;
};

/**
 * WebView 메시지 타입 정의
 */
export type WebViewMessage = {
  type: 'debug' | 'error';
  message?: string;
  error?: string;
  stack?: string;
};
