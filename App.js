import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import DidYouKnowScreen from './src/screens/DidYouKnowScreen';
import FlashCardScreen from './src/screens/FlashCardScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'TinyPal' }}
          />
          <Stack.Screen
            name="DidYouKnow"
            component={DidYouKnowScreen}
            options={{ title: 'Did You Know' }}
          />
          <Stack.Screen
            name="FlashCard"
            component={FlashCardScreen}
            options={{ title: 'Flash Cards' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}