/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './src/pages/Login';
import My from './src/pages/My';
import SiteDetail from './src/pages/SiteDetail';
import PhotoList from './src/pages/PhotoList';
import AddPhotoMemo from './src/pages/AddPhotoMemo';
import type {RootStackParamList} from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * 메인 앱 컴포넌트
 */
function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="My" component={My} />
        <Stack.Screen name="SiteDetail" component={SiteDetail} />
        <Stack.Screen name="PhotoList" component={PhotoList} />
        <Stack.Screen name="AddPhotoMemo" component={AddPhotoMemo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
