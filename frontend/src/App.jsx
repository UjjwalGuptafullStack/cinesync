import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import FindFriends from './pages/FindFriends';
import FriendRequests from './pages/FriendRequests';
import Profile from './pages/Profile';

function App() {
  return (
    <>
      <Router>
        <div className="container mx-auto px-4 min-h-screen bg-gray-900 text-white">
          <Header />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/find-friends" element={<FindFriends />} />
            <Route path="/requests" element={<FriendRequests />} />
            <Route path="/profile/:username" element={<Profile />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
