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
      
      // CALL THE BACKEND API
      await api.post('/api/users', userData);

      toast.success('Registration successful! Please login.');
      navigate('/login'); // Redirect to login page
    } catch (error) {
      // Show the error message from the backend (e.g., "User already exists")
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="card-theme p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-center text-papaya">
          Join CineSync 🎬
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          Start tracking your binge journey.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              className="input-theme w-full p-3 rounded"
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
          <div>
            <input
              type="password"
              className="input-theme w-full p-3 rounded"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary w-full py-3 rounded font-bold transition duration-300"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-papaya hover:text-papaya-dark font-bold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
