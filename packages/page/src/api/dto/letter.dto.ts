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

export interface AddLetterRequest {
  category: string;
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

  category: string;

  thumbnail: string;
}

export interface GetLetterPageResponse {
  totalCount: number;

  items: LetterPageItem[];
}

interface Letter {
  path: string;
  width: number;
  height: number;
}

interface Comment {
  name: string;
  body: string;
}

export interface GetLetterResponse {
  letterId: number;
  letter: Letter;
  comments: Comment[];
}
interface Background {
  path: string;

  width: number;

  height: number;
}

interface Image {
  path: string;

  width: number;

  height: number;

  x: number;

  y: number;

  z: number;

  ang: number;
}

export interface GetLetterDetailResponse {
  title: string;

  body?: string;

  background: Background;

  components?: Image[];
}
