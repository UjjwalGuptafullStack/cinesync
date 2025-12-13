import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
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

      // Removed excessive welcome toast - redirect is enough feedback
      
      // 3. Redirect to Home Feed and reload to ensure full session initialization
      navigate('/');
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
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
          <p className="text-gray-400 text-sm mt-2 uppercase tracking-widest">Welcome Back, We were waiting for you!</p>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-5">
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
          <button
            type="submit"
            className="w-full py-3 bg-papaya hover:bg-papaya-dark text-black font-bold rounded-lg transition uppercase tracking-wider shadow-lg"
          >
            Login
          </button>
        </form>

        {/* Google OAuth Divider */}
        <div className="my-6 border-t border-gray-700 pt-6">
          <p className="text-center text-gray-400 text-sm mb-4">Or sign in with verified account</p>
          
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  // Send the token to backend
                  const res = await api.post('/api/users/google-login', {
                    token: credentialResponse.credential
                  });
                  
                  localStorage.setItem('user', JSON.stringify(res.data));
                  toast.success("Login Successful!");
                  navigate('/');
                  window.location.reload();
                } catch (error) {
                  toast.error(error.response?.data?.message || "Google Login Failed");
                }
              }}
              onError={() => {
                toast.error("Login Failed");
              }}
              theme="filled_black"
              shape="pill"
            />
          </div>
        </div>

        <p className="mt-6 text-center text-gray-400">
          New here?{' '}
          <Link to="/register" className="text-papaya hover:text-papaya-light font-bold">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
