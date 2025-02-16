import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import type {RootStackParamList} from './src/types/navigation';
import {initializeApp, getApp} from '@react-native-firebase/app';
import {
  getMessaging,
  getToken,
  onMessage,
} from '@react-native-firebase/messaging';

// 페이지 import
import Login from './src/pages/Login';
import Signup from './src/pages/Signup';
import My from './src/pages/My';
import Template from './src/pages/Template';
import Settings from './src/pages/Settings';
import LetterDetail from './src/pages/LetterDetail';
import LetterEditor from './src/pages/LetterEditor';
import {LetterMeta} from './src/pages/LetterMeta';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1a73e8',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={My}
        options={{
          title: '초대장',
          tabBarIcon: ({color, size}) => (
            <Icon name="mail" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Template"
        component={Template}
        options={{
          title: '템플릿',
          tabBarIcon: ({color, size}) => (
            <Icon name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          title: '설정',
          tabBarIcon: ({color, size}) => (
            <Icon name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Profile from './src/pages/Profile';

function App(): React.JSX.Element {
  // Firebase 초기화 및 FCM 권한 요청
  useEffect(() => {
    console.log('App 노드');
    const initFirebase = async () => {
      try {
        console.log('Firebase 초기화 시작');

        // Firebase 앱 초기화
        try {
          getApp();
        } catch (e) {
          console.log('Firebase 앱 초기화 실패');
          initializeApp();
        }

        const app = getApp();
        const messaging = getMessaging(app);

        // FCM 권한 요청
        const authStatus = await messaging.requestPermission();
        console.log('FCM 권한 요청 시작', authStatus);

        // FCM 토큰 가져오기
        const fcmToken = await getToken(messaging);
        console.log('FCM 토큰:', fcmToken);

        // 토큰 갱신 리스너
        const unsubscribe = onMessage(messaging, message => {
          console.log('새로운 FCM 메시지:', message);
        });

        console.log('FCM 초기화 완료');
        return () => unsubscribe();
      } catch (error) {
        console.error('Firebase 초기화 오류:', error);
      }
    };

    // initFirebase();
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen
            name="LetterDetail"
            component={LetterDetail}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="LetterMeta"
            component={LetterMeta}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="LetterEditor"
            component={LetterEditor}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
