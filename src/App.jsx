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
    <div id="application">
      {authState ? (
        <MainPage />
      ) : (
        <AuthPage handleAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}

export default App;
