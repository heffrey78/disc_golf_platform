import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';

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
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '300px' }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">Welcome to Disc Golf Platform</Card.Title>
          {loginMessage && <Alert variant="success">{loginMessage}</Alert>}
          {currentUser ? (
            <div>
              <p>Welcome, {currentUser}!</p>
              <Button variant="primary" onClick={onLogout} className="w-100">
                Log Out
              </Button>
            </div>
          ) : (
            <>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                  />
                </Form.Group>
                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 mb-2">
                  Log In
                </Button>
              </Form>
              <Button variant="secondary" onClick={onRegisterClick} className="w-100">
                Register
              </Button>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default WelcomeScreen;