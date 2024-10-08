import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome message', () => {
  render(<App />);
  const welcomeElement = screen.getByText(/Welcome to Disc Golf Platform/i);
  expect(welcomeElement).toBeInTheDocument();
});

test('renders register button', () => {
  render(<App />);
  const registerButton = screen.getByRole('button', { name: /Register/i });
  expect(registerButton).toBeInTheDocument();
});
