import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import Layout from '../../layout/Layout';
import Hero from '../../common/Hero';
import Treatments from '../../ui/Treatments';

type RootStackParamList = {
  Home: undefined;
  Details: undefined;
  Login: undefined;
};

export default function HomeScreen() {

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  

  return (
    <Layout>
      <Hero navigation={navigation} />
      <Treatments navigation={navigation} />
    </Layout>
  );
}
