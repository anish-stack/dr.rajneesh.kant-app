import React from 'react';
import "./global.css";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import HomeScreen from './components/screens/Home/HomeScreen';
import { AuthProvider } from './context/AuthContext';
import onboarding from './components/screens/onboarding/onboarding';
import Splash from './components/screens/splash/spalsh';
import { StatusBar } from 'react-native';
import Login from './components/pages/login/Login';
import Register from './components/pages/register/register';
import OtpVerify from './components/pages/otp-verify/Otp-Verify';
import BookingNow from './components/pages/Booking-Now/BookingNow';
import { BookingProvider } from './context/BookingContext';
import Profile from './components/screens/Profile/Profile';
import Gallery from './components/screens/gallery/Gallery';
import Treatments from './components/ui/Treatments';

const Stack = createNativeStackNavigator();

const RootApp = () => {
  




  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen
            name="Splash"
            component={Splash}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="onboarding" component={onboarding} />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Login" component={Login} />
          <Stack.Screen
            options={{ headerShown: false }}
            name="register" component={Register} />
          <Stack.Screen
            options={{ headerShown: false }}
            name="verify-otp" component={OtpVerify} />
          <Stack.Screen
            options={{ headerShown: false }}
            name="booking-now" component={BookingNow} />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Profile" component={Profile} />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Gallery" component={Gallery} />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Treatments" component={Treatments} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BookingProvider>
      <StatusBar barStyle={'default'} />
      <RootApp />


      </BookingProvider>
    </AuthProvider>
  );
};

export default App;
