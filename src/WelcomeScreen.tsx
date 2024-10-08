import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';

const WelcomeScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Implement login logic
    console.log('Login attempted with:', { username, password });
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '300px' }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">Welcome to Disc Golf Platform</Card.Title>
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
            <Button variant="primary" type="submit" className="w-100">
              Log In
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default WelcomeScreen;