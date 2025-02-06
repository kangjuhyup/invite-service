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

export interface MetaText extends MetaDefault {
  font: string;
  color: string;
  bold: boolean;
}

export interface PrepareRequest {
  thumbnailMeta: MetaDefault;

  letterMeta: MetaDefault;

  backgroundMeta: MetaDefault;

  componentMetas: MetaDetail[];

  textMetas: MetaText[];
}

export interface PrepareResponse {
  thumbnailUrl: string;
  letterUrl: string;
  backgroundUrl: string;
  componentUrls: string[];
  textUrls: string[];
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

  body: string;

  category: string;

  thumbnail: string;

  inviteDate: string;

  publicYn: boolean;

  password?: string;

  commentCount: number;

  attendCount: number;

  viewCount: number;
}

export interface GetLetterPageResponse {
  totalCount: number;

  items: LetterPageItem[];
}

interface Letter {
  title: string;
  body?: string;
  path: string;
  width: number;
  height: number;
}

interface Comment {
  id: number;
  editor: string;
  body: string;
}

export interface GetLetterResponse {
  letterId: number;
  publicYn: boolean;
  password?: string;
  letter: Letter;
  comments: Comment[];
}
export interface Background {
  path: string;

  width: number;

  height: number;
}

export interface Component {
  path: string;

  width: number;

  height: number;

  x: number;

  y: number;

  z: number;

  ang: number;

  font?: string;

  color?: string;

  bold?: boolean;
}

export interface GetLetterDetailResponse {
  title: string;

  body?: string;

  background: Background;

  components?: Component[];
}

export interface GetLetterCommentRequest {
  letterId: number;
}

export interface GetLetterCommentResponse {
  letterId: number;
  comments: Comment[];
}

export interface AddLetterCommentRequest {
  password: string;
  content: string;
  editor: string;
}

export interface ModifyLetterRequest {
  title?: string;
  body?: string;
  commentYn?: boolean;
  attendYn?: boolean;
  publicYn?: boolean;
}
