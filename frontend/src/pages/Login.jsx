import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api';

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
      const response = await api.post('/api/users/login', userData);

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
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="card-theme p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200 dark:border-gray-700">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img 
            src="/cinesync-logo.svg" 
            alt="CineSync Logo" 
            className="h-24 w-24"
          />
        </div>
        
        <h1 className="text-3xl font-bold mb-6 text-center text-papaya">
          Login
        </h1>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              className="input-theme w-full p-3 rounded"
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
              className="input-theme w-full p-3 rounded"
              placeholder="Password"
              name="password"
              value={password}
              onChange={onChange}
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary w-full py-3 rounded font-bold transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
          New here?{' '}
          <Link to="/register" className="text-papaya hover:text-papaya-dark font-bold">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
