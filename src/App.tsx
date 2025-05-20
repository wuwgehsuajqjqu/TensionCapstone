import React from 'react';
import { UserProvider } from './context/UserContext';
import CareReceiverApp from './screens/CareReceiverApp';

const App = () => {
  return (
    <UserProvider>
      <CareReceiverApp />
    </UserProvider>
  );
};

export default App; 