import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Box, Alert } from '@mui/material';

interface WelcomeScreenProps {
  onLogin: (username: string, password: string) => void;
  onRegisterClick: () => void;
  currentUser: string | null;
  onLogout: () => void;
  loginMessage: string | null;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onLogin,
  onRegisterClick,
  currentUser,
  onLogout,
  loginMessage,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onLogin(username, password);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom align="center">
            Welcome to Disc Golf Platform
          </Typography>
          {loginMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {loginMessage}
            </Alert>
          )}
          {currentUser ? (
            <Box>
              <Typography variant="body1" gutterBottom>
                Welcome, {currentUser}!
              </Typography>
              <Button variant="contained" onClick={onLogout} fullWidth>
                Log Out
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Log In
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={onRegisterClick}
              >
                Register
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default WelcomeScreen;