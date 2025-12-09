import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = { email, password };
      
      // 1. Send Login Request
      const response = await axios.post('http://localhost:5000/api/users/login', userData);

      // 2. SAVE THE DATA (The "Magic" Step) 💾
      // We store the entire user object (including the token) in localStorage
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }

      toast.success(`Welcome back, ${response.data.username}!`);
      
      // 3. Redirect to Home Feed
      navigate('/'); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">
          Login 🎬
        </h1>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
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
              className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
              placeholder="Password"
              name="password"
              value={password}
              onChange={onChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400">
          New here?{' '}
          <Link to="/register" className="text-blue-500 hover:text-blue-400">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
