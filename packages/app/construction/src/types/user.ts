/**
 * 사용자 정보 타입
 */
export interface UserInfo {
  name: string;
  team: string;
  position: string;
  contact: string;
}

/**
 * 건설현장 관계자 정보 타입
 */
export interface Contact {
  id: string;
  name: string;
  position: string;
  phone: string;
  department: string;
}

/**
 * 메모 타입
 */
export interface Memo {
  id: string;
  content: string;
}

/**
 * 사진 타입
 */
export interface Photo {
  id: string;
  url: string;
  createdAt: string;
  memos: Memo[];
}

/**
 * 사진 폴더 타입
 */
export interface PhotoFolder {
  id: string;
  name: string;
  createdAt: string;
  photoCount: number;
  photos?: Photo[];
}

/**
 * 건설현장 정보 타입
 */
export interface ConstructionSite {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  status: 'in-progress' | 'completed' | 'planned';
  description: string;
  contacts: Contact[];
  photoFolders: PhotoFolder[];
  progress: number;
}
