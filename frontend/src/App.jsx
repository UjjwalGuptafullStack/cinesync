import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import FindFriends from './pages/FindFriends';
import FriendRequests from './pages/FriendRequests';
import Profile from './pages/Profile';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* PUBLIC ROUTES (No Sidebar needed) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* PROTECTED ROUTES (Wrapped in Layout Cockpit) */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/find-friends" element={<FindFriends />} />
            <Route path="/requests" element={<FriendRequests />} />
            <Route path="/profile/:username" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer position="bottom-right" theme="dark" />
    </ThemeProvider>
  );
}

export default App;
