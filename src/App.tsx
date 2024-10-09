import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Container, AppBar, Toolbar, Button } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Link, useParams, useNavigate } from 'react-router-dom';
import WelcomeScreen from './WelcomeScreen';
import RegisterScreen from './RegisterScreen';
import ForumCategories from './components/ForumCategories';
import ForumSubforums from './components/ForumSubforums';
import ForumThreads from './components/ForumThreads';
import ForumPosts from './components/ForumPosts';
import theme from './theme';
import forumService from './services/forumService';

function AppContent() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [token, setToken] = useState<string | null>(null);
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // TODO: Implement a function to decode the JWT and set currentUser and isAdmin
    }
  }, []);

  const handleRegister = async (username: string, email: string, password: string, isAdmin: boolean) => {
    try {
      await forumService.register(username, email, password, isAdmin);
      setLoginMessage('Registration successful. You can now log in.');
      navigate('/');
    } catch (error) {
      setLoginMessage('Registration failed. Please try again.');
    }
  };

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await forumService.login(username, password);
      setCurrentUser(username);
      setIsAdmin(response.isAdmin);
      setToken(response.token);
      localStorage.setItem('token', response.token);
      setLoginMessage(`Welcome, ${username}! You are now logged in.${response.isAdmin ? ' (Admin)' : ''}`);
    } catch (error) {
      setLoginMessage('Invalid username or password.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    setToken(null);
    localStorage.removeItem('token');
    setLoginMessage(null);
  };

  const SubforumWrapper = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    return <ForumSubforums categoryId={Number(categoryId)} isAdmin={isAdmin} />;
  };

  const ThreadWrapper = () => {
    const { subforumId } = useParams<{ subforumId: string }>();
    return <ForumThreads subforumId={Number(subforumId)} isAdmin={isAdmin} />;
  };

  const PostWrapper = () => {
    const { threadId } = useParams<{ threadId: string }>();
    return <ForumPosts threadId={Number(threadId)} isAdmin={isAdmin} />;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/forum">Forum</Button>
          {currentUser ? (
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          ) : (
            <Button color="inherit" component={Link} to="/register">Register</Button>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={
            <WelcomeScreen
              onLogin={handleLogin}
              onRegisterClick={() => navigate('/register')}
              currentUser={currentUser}
              onLogout={handleLogout}
              loginMessage={loginMessage}
              isAdmin={isAdmin}
            />
          } />
          <Route path="/register" element={<RegisterScreen onRegister={handleRegister} />} />
          <Route path="/forum" element={<ForumCategories isAdmin={isAdmin} />} />
          <Route path="/forum/subforum/:categoryId" element={<SubforumWrapper />} />
          <Route path="/forum/thread/:subforumId" element={<ThreadWrapper />} />
          <Route path="/forum/posts/:threadId" element={<PostWrapper />} />
        </Routes>
      </Container>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
