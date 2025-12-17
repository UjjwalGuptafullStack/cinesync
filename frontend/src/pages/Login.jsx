import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import api from '../api';
import { toast } from 'react-toastify';
import { FaPlay, FaHeart, FaComment, FaStar } from 'react-icons/fa';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/users/login', formData);
      
      // Validate response data
      if (!res.data || !res.data.token) {
        toast.error("Invalid server response. Please try again.");
        return;
      }

      localStorage.setItem('user', JSON.stringify(res.data));
      toast.success("Welcome back!");
      
      // Small delay to ensure localStorage is set
      setTimeout(() => {
        navigate('/feed');
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post('/api/users/google-login', { token: credentialResponse.credential });
      
      // Validate response data
      if (!res.data || !res.data.token) {
        toast.error("Invalid server response. Please try again.");
        return;
      }

      localStorage.setItem('user', JSON.stringify(res.data));
      toast.success("Google Login Successful!");
      
      // Small delay to ensure localStorage is set
      setTimeout(() => {
        navigate('/feed');
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(error.response?.data?.message || "Google Login Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-0 w-full">
      
      {/* --- MAX WIDTH CONTAINER (Keeps content centered on huge screens) --- */}
      <div className="flex w-full max-w-4xl gap-8 items-center justify-center">

        {/* ================= LEFT SIDE: THE PHONE SHOWCASE (Hidden on Mobile) ================= */}
        <div className="hidden md:flex relative justify-end perspective-1000">
            
            {/* PHONE FRAME */}
            <div className="relative border-[14px] border-gray-900 rounded-[3rem] h-[600px] w-[300px] bg-black shadow-2xl overflow-hidden z-10 transform rotate-[-5deg] hover:rotate-0 transition duration-500 ease-out">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-32 bg-gray-900 rounded-b-xl z-20"></div>
                
                {/* SCREEN CONTENT - Grid of Posters */}
                <div className="grid grid-cols-2 gap-1 p-2 mt-8 h-full bg-anthracite opacity-90">
                    <img src="https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg" className="rounded-lg w-full h-48 object-cover" alt="Batman" />
                    <img src="https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg" className="rounded-lg w-full h-48 object-cover" alt="Oppenheimer" />
                    <img src="https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg" className="rounded-lg w-full h-48 object-cover" alt="Barbie" />
                    <img src="https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg" className="rounded-lg w-full h-48 object-cover" alt="Interstellar" />
                    {/* FIXED: Replaced broken "Rush" link with "The Matrix" */}
                    <img src="https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg" className="rounded-lg w-full h-48 object-cover" alt="The Matrix" />
                    <img src="https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg" className="rounded-lg w-full h-48 object-cover" alt="Arrival" />
                </div>
            </div>

            {/* FIXED: Floating Icons (Positioned Further Out & Better Colors) */}
            
            {/* Icon 1: Top Left - Star (Rating) */}
            <div className="absolute top-24 -left-12 bg-gray-800 p-4 rounded-2xl shadow-xl z-20 animate-bounce delay-100 border border-gray-700">
                <FaStar className="text-2xl text-papaya" />
            </div>

            {/* Icon 2: Bottom Right - Heart (Like) */}
            <div className="absolute bottom-32 -right-12 bg-white p-4 rounded-2xl shadow-xl z-20 animate-bounce delay-300 border border-red-300">
                <FaHeart className="text-2xl text-red-500" />
            </div>

            {/* Icon 3: Middle Right - Comment (Chat) */}
            <div className="absolute top-1/2 -right-16 bg-papaya p-3 rounded-full shadow-lg z-0 opacity-80 animate-pulse">
                <FaComment className="text-xl text-black" />
            </div>
        </div>

        {/* ================= RIGHT SIDE: THE LOGIN FORM ================= */}
        <div className="w-full md:w-[350px] flex flex-col gap-4">
          
          {/* CARD 1: Login Inputs */}
          <div className="bg-transparent p-8 flex flex-col items-center">
            
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
               <div className="w-8 h-8 bg-papaya rounded-lg flex items-center justify-center -rotate-6">
                 <FaPlay className="text-black text-xs ml-0.5" />
               </div>
               <h1 className="text-3xl font-bold tracking-tighter text-gray-800">CineSync</h1>
            </div>

            <p className="text-gray-600 font-semibold mb-6 text-center text-sm">
                Welcome back, we were waiting for you!
            </p>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
              <input 
                type="email" 
                name="email"
                placeholder="Email" 
                onChange={handleChange}
                className="bg-white border border-gray-300 text-sm rounded-sm focus:ring-1 focus:ring-papaya focus:border-papaya block w-full p-2.5 outline-none text-gray-900 placeholder-gray-500 shadow-sm"
                required
              />
              <input 
                type="password" 
                name="password"
                placeholder="Password" 
                onChange={handleChange}
                className="bg-white border border-gray-300 text-sm rounded-sm focus:ring-1 focus:ring-papaya focus:border-papaya block w-full p-2.5 outline-none text-gray-900 placeholder-gray-500 shadow-sm"
                required
              />

              <button 
                type="submit" 
                className="mt-2 text-white bg-papaya hover:bg-orange-600 focus:ring-4 focus:ring-blue-300 font-bold rounded-md text-sm px-5 py-2.5 mr-2 mb-2 w-full transition"
              >
                Log In
              </button>
            </form>

            {/* Divider OR */}
            <div className="flex items-center w-full my-4">
                <div className="h-px bg-gray-300 flex-1"></div>
                <span className="px-4 text-gray-400 text-xs font-bold">OR</span>
                <div className="h-px bg-gray-300 flex-1"></div>
            </div>

            {/* Google Login Container */}
            <div className="w-full flex justify-center">
                 <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error("Login Failed")}
                    type="standard"
                    theme="outline"
                    size="large"
                    shape="pill"
                    width="250"
                    text="continue_with"
                 />
            </div>

            <Link to="/forgot-password" className="text-xs text-blue-900 mt-4 cursor-pointer">Forgot password?</Link>
          </div>

          {/* CARD 2: Sign Up Link (Instagram Style) */}
          <div className="bg-transparent p-4 text-center">
            <p className="text-sm text-gray-700">
              Don't have an account? <Link to="/register" className="text-papaya font-bold hover:text-orange-600">Sign up</Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;
