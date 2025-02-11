import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import type {RootStackParamList} from './src/types/navigation';

// 페이지 import
import Login from './src/pages/Login';
import Signup from './src/pages/Signup';
import Home from './src/pages/Home';
import Template from './src/pages/Template';
import Settings from './src/pages/Settings';
import LetterDetail from './src/pages/LetterDetail';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1a73e8',
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: '초대장',
        }}
      />
      <Tab.Screen
        name="Template"
        component={Template}
        options={{
          title: '템플릿',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          title: '설정',
        }}
      />
    </Tab.Navigator>
  );
}

function App(): React.JSX.Element {
  return (
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
