import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
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
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-anthracite text-white">
          <Header />
          
          <main className="container mx-auto px-4 py-8 max-w-4xl">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<CreatePost />} />
              <Route path="/find-friends" element={<FindFriends />} />
              <Route path="/requests" element={<FriendRequests />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/notifications" element={<NotificationPage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/chat" element={<ChatList />} />
              <Route path="/chat/:userId" element={<ChatPage />} />
              
              {/* 404 Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
        <ToastContainer position="bottom-right" theme="dark" />
      </Router>
    </ThemeProvider>
  );
}

export default App;
