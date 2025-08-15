import React, { useState } from 'react';
import AuthPage from './components/AuthPage';
import MainPage from './components/MainPage';
import './App.css';

function App() {
  const [authState, setAuthState] = useState(false);

  const handleAuthSuccess = () => {
    setAuthState(true);
  };

  return (
    <div>
      {authState ? (
        <MainPage />
      ) : (
        <AuthPage authSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}

export default App;
