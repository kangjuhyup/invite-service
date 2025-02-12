import type {Letter} from '../api/letter';

export type RootStackParamList = {
  LetterEditor: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Template: undefined;
  Settings: undefined;
  MainTabs: undefined;
  LetterDetail: {
    letter: Letter;
  };
};
