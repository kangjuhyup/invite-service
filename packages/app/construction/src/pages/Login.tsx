import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import type { LoginScreenProps } from '../types/navigation';

/**
 * 로그인 페이지 컴포넌트
 */
const Login = ({ navigation }: LoginScreenProps) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  /**
   * 로그인 처리 함수
   */
  const handleLogin = () => {
    // TODO: 실제 로그인 API 연동
    if (id && password) {
      // 임시로 모든 로그인 시도를 성공으로 처리
      navigation.replace('My');
    } else {
      Alert.alert('알림', '아이디와 비밀번호를 입력해주세요.');
    }
  };

  /**
   * 비로그인 처리 함수
   */
  const handleContinueWithoutLogin = () => {
    navigation.replace('My');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="아이디"
          value={id}
          onChangeText={setId}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>로그인</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={handleContinueWithoutLogin}
        >
          <Text style={styles.withoutLoginText}>
            비로그인으로 사용하기
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  withoutLoginText: {
    color: '#007AFF',
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default Login;
