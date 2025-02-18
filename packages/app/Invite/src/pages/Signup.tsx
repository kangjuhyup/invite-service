import React, {useState} from 'react';
import {sendVerifyCode, verifyCode} from '../api/mail';
import {Alert} from 'react-native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

const Signup: React.FC<Props> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailTimer, setEmailTimer] = useState(0);

  // 3분 타이머
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isEmailSent && emailTimer > 0) {
      interval = setInterval(() => {
        setEmailTimer(prev => prev - 1);
      }, 1000);
    } else if (emailTimer === 0) {
      setIsEmailSent(false);
    }
    return () => clearInterval(interval);
  }, [emailTimer, isEmailSent]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRequestVerification = async () => {
    if (!email) {
      Alert.alert('알림', '이메일을 입력해주세요.');
      return;
    }
    try {
      const response = await sendVerifyCode(email);
      console.log(response);
      if (response.result) {
        setIsEmailSent(true);
        setEmailTimer(180); // 3분
        Alert.alert('알림', `${email}로 인증 코드를 전송했습니다.`);
      } else {
        Alert.alert('오류', '이메일 인증 요청에 실패했습니다.');
      }
    } catch (error) {
      console.error('이메일 인증 요청 실패:', error);
      Alert.alert('오류', '이메일 인증 요청에 실패했습니다.');
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      Alert.alert('알림', '인증번호를 입력해주세요.');
      return;
    }
    try {
      const response = await verifyCode({
        email,
        code: verificationCode,
      });

      if (response.result) {
        setIsEmailVerified(true);
        Alert.alert('알림', '인증 완료.');
      } else {
        Alert.alert('오류', '인증 실패.');
      }
    } catch (error) {
      console.error('인증번호 확인 실패:', error);
      Alert.alert('오류', '인증번호가 일치하지 않습니다.');
    }
  };

  const handleSignup = async () => {
    if (!isEmailVerified) {
      Alert.alert('알림', '이메일 인증이 필요합니다.');
      return;
    }

    if (!name) {
      Alert.alert('알림', '이름을 입력해주세요.');
      return;
    }

    if (!password) {
      Alert.alert('알림', '비밀번호를 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('알림', '비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      // TODO: 회원가입 API 호출
      Alert.alert('성공', '회원가입이 완료되었습니다.', [
        {
          text: '확인',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
    } catch (error) {
      console.error('회원가입 실패:', error);
      Alert.alert('오류', '회원가입에 실패했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}>
        <ScrollView>
          {/* 헤더 */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>← 뒤로</Text>
            </TouchableOpacity>
          </View>

          {/* 타이틀 */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>회원가입</Text>
            <Text style={styles.subtitle}>새로운 계정을 만들어보세요</Text>
          </View>

          {/* 회원가입 폼 */}
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="이름"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="이메일"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isEmailVerified}
            />
            {!isEmailVerified && (
              <View style={styles.verificationContainer}>
                {isEmailSent ? (
                  <>
                    <View style={styles.verificationInputContainer}>
                      <TextInput
                        style={[styles.input, styles.verificationInput]}
                        placeholder="인증번호"
                        value={verificationCode}
                        onChangeText={setVerificationCode}
                        keyboardType="number-pad"
                      />
                      <Text style={styles.timerText}>
                        {formatTime(emailTimer)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.verificationButton, styles.verifyButton]}
                      onPress={handleVerifyCode}>
                      <Text style={styles.verificationButtonText}>확인</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    style={styles.verificationButton}
                    onPress={handleRequestVerification}>
                    <Text style={styles.verificationButtonText}>
                      인증번호 받기
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            <TextInput
              style={styles.input}
              placeholder="비밀번호"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleSignup}>
              <Text style={styles.signupButtonText}>가입하기</Text>
            </TouchableOpacity>
          </View>

          {/* 이용약관 */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              가입하면 Invite의 <Text style={styles.termsLink}>이용약관</Text>과{' '}
              <Text style={styles.termsLink}>개인정보처리방침</Text>에 동의하게
              됩니다.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  verificationContainer: {
    marginBottom: 12,
  },
  verificationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  verificationInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: 8,
  },
  timerText: {
    color: '#1a73e8',
    fontSize: 16,
    fontWeight: '600',
    width: 50,
    textAlign: 'center',
  },
  verificationButton: {
    backgroundColor: '#1a73e8',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  verifyButton: {
    backgroundColor: '#34a853',
  },
  verificationButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#1a73e8',
  },
  titleContainer: {
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#202124',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#5f6368',
  },
  formContainer: {
    padding: 20,
  },
  input: {
    backgroundColor: '#f1f3f4',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    fontSize: 16,
  },
  signupButton: {
    backgroundColor: '#1a73e8',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  signupButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  termsContainer: {
    padding: 20,
  },
  termsText: {
    color: '#5f6368',
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: '#1a73e8',
  },
});

export default Signup;
