import React from 'react';
import { UserProvider } from './context/UserContext';
import CareReceiverApp from './components/CareReceiverApp';

const App = () => {
  return (
    <UserProvider>
      <CareReceiverApp />
    </UserProvider>
  );
};

export default App; 