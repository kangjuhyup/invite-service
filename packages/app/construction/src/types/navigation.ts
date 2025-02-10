import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  My: undefined;
  SiteDetail: {
    siteId: string;
  };
  PhotoList: {
    siteId: string;
    folderId: string;
    folderName: string;
  };
  AddPhotoMemo: {
    imageUri: string;
  };
};

export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type MyScreenProps = NativeStackScreenProps<RootStackParamList, 'My'>;
