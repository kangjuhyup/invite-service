export interface MetaDefault {
  width: string;
  height: string;
}

export interface MetaDetail extends MetaDefault {
  x?: string;
  y?: string;

  z?: string;

  angle?: string;
}

export interface PrepareRequest {
  thumbnailMeta: MetaDefault;

  letterMeta: MetaDefault;

  backgroundMeta: MetaDefault;

  componentMetas: MetaDetail[];
}

export interface PrepareResponse {
  thumbnailUrl: string;
  letterUrl: string;
  backgroundUrl: string;
  componentUrls: string[];
  expires: number;
  sessionKey: string;
}

export class AddLetterRequest {
  category: 'LT001' | 'LT002' | 'LT003';
  title: string;
  body?: string;
  commentYn?: boolean;
  attendYn?: boolean;
}

export interface AddLetterResponse {
  letterId: number;
}

interface LetterPageItem {
  id: number;

  title: string;

  category: 'LT001' | 'LT002' | 'LT003';

  thumbnail: string;
}

export interface GetLetterPageResponse {
  totalCount: number;

  items: LetterPageItem[];
}
