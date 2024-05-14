import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import AuthStack from './src/navigation/AuthStack';
import AppStack from './src/navigation/AppStack';
import Navigation from './src/service/Navigation';
import Auth from './src/service/Auth';
import {useDispatch, useSelector} from 'react-redux';
import {setUser} from './src/redux/reducer/user';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const Stack = createStackNavigator();

export default function App() {
  const dispatch = useDispatch();
  const {userData, login} = useSelector(state => state.user);
  const [loginCheck, setLoginCheck] = useState(true);
  useEffect(() => {
    getUser();
  }, []);
  const getUser = async () => {
    let data = await Auth.getAccount();
    if (data != null) {
      dispatch(setUser(data));
      setLoginCheck(false);
    } else {
      setLoginCheck(false);
    }
  };
  if (loginCheck) {
    return null;
  }
  return (
    <SafeAreaProvider>
      <NavigationContainer ref={r => Navigation.setTopLevelNavigator(r)}>
        <Stack.Navigator
          detachInactiveScreens={false}
          initialRouteName="authStack"
          screenOptions={{
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            ...TransitionPresets.SlideFromRightIOS,
            headerShown: false,
          }}>
          {!login ? (
            <Stack.Screen name="authStack" component={AuthStack} />
          ) : (
            <Stack.Screen name="appStack" component={AppStack} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
