import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import CareReceiverApp from '../../screens/CareReceiverApp';

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <CareReceiverApp />
    </NavigationContainer>
  );
};

export default AppNavigator; 