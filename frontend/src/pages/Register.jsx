import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { username, email, password, confirmPassword } = formData;
  const navigate = useNavigate();

  // Update state when user types
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle Form Submission
  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const userData = { username, email, password };
      
      // Register and receive token
      const res = await api.post('/api/users', userData);
      
      // Auto-Login: Save user data (including token) to localStorage
      localStorage.setItem('user', JSON.stringify(res.data));
      
      toast.success(`Welcome to CineSync, ${res.data.username}!`);
      
      // Redirect directly to Home/Feed
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-anthracite-light p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-800">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">
            <span className="text-white">Cine</span><span className="text-papaya">Sync</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2 uppercase tracking-widest">Join the Community</p>
        </div>
        
        <p className="text-center text-gray-400 mb-6 text-sm">
          Start tracking your binge journey.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              className="w-full p-3 bg-anthracite border border-gray-700 rounded text-white placeholder-gray-500 focus:border-papaya focus:outline-none focus:ring-2 focus:ring-papaya/50 transition"
              placeholder="Username"
              name="username"
              value={username}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <input
              type="email"
              className="w-full p-3 bg-anthracite border border-gray-700 rounded text-white placeholder-gray-500 focus:border-papaya focus:outline-none focus:ring-2 focus:ring-papaya/50 transition"
              placeholder="Email"
              name="email"
              value={email}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <input
              type="password"
              className="w-full p-3 bg-anthracite border border-gray-700 rounded text-white placeholder-gray-500 focus:border-papaya focus:outline-none focus:ring-2 focus:ring-papaya/50 transition"
              placeholder="Password"
              name="password"
              value={password}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <input
              type="password"
              className="w-full p-3 bg-anthracite border border-gray-700 rounded text-white placeholder-gray-500 focus:border-papaya focus:outline-none focus:ring-2 focus:ring-papaya/50 transition"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-papaya hover:bg-papaya-dark text-black font-bold rounded-lg transition uppercase tracking-wider shadow-lg"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-papaya hover:text-papaya-light font-bold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
