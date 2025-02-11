import React, {useState} from 'react';
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

  const handleSignup = () => {
    // 비밀번호 확인
    if (password !== confirmPassword) {
      console.log('비밀번호가 일치하지 않습니다.');
      return;
    }

    // TODO: 회원가입 로직 구현
    console.log('회원가입:', {email, password, name});
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
            />
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
            <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
              <Text style={styles.signupButtonText}>가입하기</Text>
            </TouchableOpacity>
          </View>

          {/* 이용약관 */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              가입하면 Invite의{' '}
              <Text style={styles.termsLink}>이용약관</Text>과{' '}
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
