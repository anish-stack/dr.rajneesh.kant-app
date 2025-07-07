import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../../context/AuthContext';
import Layout from '../../layout/Layout';
import Hero from '../../common/Hero';
import Treatments from '../../ui/Treatments';

type RootStackParamList = {
  Home: undefined;
  Details: undefined;
  Login: undefined;
};

export default function HomeScreen() {
  const { logout } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleLogout = () => {
    logout();

    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });

  };

  return (
    <Layout>
      <Hero navigation={navigation} />
      <Treatments navigation={navigation} />
    </Layout>
  );
}
