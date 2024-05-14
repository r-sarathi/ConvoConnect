import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import Home from '../screen/home/Home';
import AllUser from '../screen/user/AllUser';
import SingleChat from '../screen/home/SingleChat';

const Stack = createStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        ...TransitionPresets.SlideFromRightIOS,
        headerShown: false,
      }}>
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="allUser" component={AllUser} />
      <Stack.Screen name="singleChat" component={SingleChat} />
    </Stack.Navigator>
  );
}
