import type {Letter, LetterCategoryCode} from '../api/letter';

export type RootStackParamList = {
  LetterEditor: {
    letterId?: number;
    meta?: {
      category: LetterCategoryCode;
      title: string;
      body?: string;
      inviteDate: string;
    };
  };
  LetterMeta: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Template: undefined;
  Settings: undefined;
  MainTabs: undefined;
  My: undefined;
  Profile: undefined;
  Notifications: undefined;
  Notice: undefined;
  LetterDetail: {
    letterId: number;
  };
};
