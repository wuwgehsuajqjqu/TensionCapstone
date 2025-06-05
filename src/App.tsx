import React from 'react';
import { UserProvider } from './context/UserContext';
import AppNavigator from './components/common/AppNavigator';

const App = () => {
  return (
    <UserProvider>
      <AppNavigator />
    </UserProvider>
  );
};

export default App;