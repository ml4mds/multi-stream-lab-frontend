import React, { useState } from 'react';

const AuthPage = ({ handleAuthSuccess }) => {
  const [token, setToken] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // TODO: auth function
    // In a real application, you'd send this data to your backend
    // for authentication. Let's simulate a successful login for now.
    console.log("Attempting authorize with:", { token });

    try {
      // Simulate an API call
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username, password }),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Login failed');
      // }
      
      // const data = await response.json();
      // console.log('Login successful', data);
      
      // Call the success callback
      handleAuthSuccess();

    } catch (error) {
      console.error("Authorization error:", error);
      // You'd handle displaying an error message to the user here
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <form onSubmit={handleSubmit}>
          <label htmlFor="token">Token:</label>
          <input
            type="token"
            id="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <button type="submit">Start</button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
