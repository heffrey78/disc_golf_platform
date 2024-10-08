import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import WelcomeScreen from './WelcomeScreen';
import RegisterScreen from './RegisterScreen';

interface User {
  username: string;
  password: string;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'register'>('welcome');
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [loginMessage, setLoginMessage] = useState<string | null>(null);

  const handleRegister = (username: string, password: string) => {
    if (users.some(user => user.username === username)) {
      alert('Username already exists. Please choose a different one.');
      return;
    }
    setUsers([...users, { username, password }]);
    setCurrentScreen('welcome');
    alert('Registration successful. You can now log in.');
  };

  const handleLogin = (username: string, password: string) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(username);
      setLoginMessage(`Welcome, ${username}! You are now logged in.`);
    } else {
      alert('Invalid username or password.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginMessage(null);
  };

  return (
    <div className="App">
      {currentScreen === 'welcome' ? (
        <WelcomeScreen
          onLogin={handleLogin}
          onRegisterClick={() => setCurrentScreen('register')}
          currentUser={currentUser}
          onLogout={handleLogout}
          loginMessage={loginMessage}
        />
      ) : (
        <RegisterScreen onRegister={handleRegister} />
      )}
    </div>
  );
}

export default App;
