import type {Letter} from '../api/letter';

export type RootStackParamList = {
  LetterEditor: {
    letterId?: number;
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
