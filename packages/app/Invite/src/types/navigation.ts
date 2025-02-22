import type {LetterCategoryCode} from '../api/letter';
import {TemplatePageItem} from '../api/template';

export type RootStackParamList = {
  TemplateDetail: {
    templateId: number;
    template: TemplatePageItem;
    imageUrl: string;
  };
  LetterEditor: {
    letterId?: number;
    meta?: {
      category: LetterCategoryCode;
      title: string;
      body?: string;
      inviteDate: string;
    };
    templateId?: number;
  };
  LetterMeta: {
    letterId?: number;
    meta?: {
      category: LetterCategoryCode;
      title: string;
      body?: string;
      inviteDate?: string;
    };
    templateId?: number;
  };
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
