import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import FindFriends from './pages/FindFriends';
import FriendRequests from './pages/FriendRequests';
import Profile from './pages/Profile';
import NotificationPage from './pages/NotificationPage';
import Settings from './pages/Settings';
import ChatList from './pages/ChatList';
import ChatPage from './pages/ChatPage';
import MediaHub from './pages/MediaHub'; // V8.0: Media Hub
import NotFound from './pages/NotFound';
import api from './api';

function AppContent() {
  const location = useLocation();
  const hideHeaderPaths = ['/', '/login', '/register'];
  const shouldShowHeader = !hideHeaderPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-anthracite text-white">
      {shouldShowHeader && <Header />}
      
      <main className={shouldShowHeader ? "container mx-auto px-4 py-8 max-w-4xl" : ""}>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/feed" element={<Home />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/find-friends" element={<FindFriends />} />
          <Route path="/requests" element={<FriendRequests />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/hub/:tmdbId" element={<MediaHub />} /> {/* V8.0: Media Hub */}
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/chat" element={<ChatList />} />
          <Route path="/chat/:userId" element={<ChatPage />} />
          
          {/* 404 Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  // V8.3: Heartbeat for online status
  useEffect(() => {
    const sendPing = () => {
      if (localStorage.getItem('user')) {
        api.put('/api/users/ping').catch(err => console.error('Ping failed:', err));
      }
    };

    // 1. Ping immediately on load
    sendPing();

    // 2. Ping every 60 seconds
    const interval = setInterval(sendPing, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <AppContent />
        <ToastContainer position="bottom-right" theme="dark" />
      </Router>
    </ThemeProvider>
  );
}

export default App;
