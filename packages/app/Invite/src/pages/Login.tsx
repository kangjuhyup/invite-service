import React, {useState, useEffect} from 'react';
import {googleLogin, login, resignToken} from '../api/auth';
import {
  saveTokens,
  getAccessToken,
  getRefreshToken,
  clearTokens,
} from '../utils/token';
import messaging from '@react-native-firebase/messaging';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const Login: React.FC<Props> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // FCM 토큰 갱신 이벤트 리스너

    const checkLoginStatus = async () => {
      try {
        const accessToken = await getAccessToken();
        const refreshToken = await getRefreshToken();

        if (!accessToken && !refreshToken) {
          // 로그인되지 않은 상태
          return;
        }

        if (!accessToken && refreshToken) {
          // access token이 만료되고 refresh token이 있는 경우
          try {
            const response = await resignToken(refreshToken);
            await saveTokens(response.data.access, response.data.refresh);
            navigation.replace('MainTabs');
          } catch (error) {
            console.error('토큰 갱신 실패:', error);
            // refresh token도 만료된 경우
            await clearTokens();
          }
        } else if (accessToken) {
          // access token이 있는 경우
          navigation.replace('MainTabs');
        }
      } catch (error) {
        console.error('토큰 확인 실패:', error);
        await clearTokens();
      }
    };

    checkLoginStatus();

    // 컴포넌트 언마운트 시 리스너 제거
  }, [navigation]);

  const handleLogin = async () => {
    const response = await login(email, password);
    if (!response.result || !response.data) {
      // 로그인 실패 시 에러 처리
      Alert.alert('로그인 실패');
      return;
    }
    const {access, refresh} = response.data;
    await saveTokens(access, refresh);
    navigation.replace('MainTabs');
  };

  const handleGoogleLogin = async () => {
    const response = await googleLogin();
    if (!response.result || !response.data) {
      // 로그인 실패 시 에러 처리
      Alert.alert('구글 로그인 실패');
      return;
    }
    // 로그인 성공 시 토큰 저장
    await saveTokens(response.data.access, response.data.refresh);
    // 메인 화면으로 이동
    navigation.replace('MainTabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}>
        {/* 로고 또는 타이틀 */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Invite</Text>
          <Text style={styles.subtitle}>함께하는 초대장</Text>
        </View>

        {/* 로그인 폼 */}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="이메일"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>로그인</Text>
          </TouchableOpacity>

          {/* 구글 로그인 버튼 */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}>
            <Text style={styles.googleButtonText}>Google로 로그인</Text>
          </TouchableOpacity>
        </View>

        {/* 회원가입 링크 */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>계정이 없으신가요?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupLink}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a73e8',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#5f6368',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: '#f1f3f4',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#1a73e8',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  googleButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dadce0',
  },
  googleButtonText: {
    color: '#3c4043',
    fontSize: 16,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#5f6368',
    marginRight: 4,
  },
  signupLink: {
    color: '#1a73e8',
    fontWeight: '600',
  },
});

export default Login;
