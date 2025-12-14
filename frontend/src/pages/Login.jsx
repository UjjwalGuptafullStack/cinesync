import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import api from '../api';
import { toast } from 'react-toastify';
import { FaPlay, FaHeart, FaComment } from 'react-icons/fa';

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
      localStorage.setItem('user', JSON.stringify(res.data));
      toast.success("Welcome back!");
      navigate('/');
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post('/api/users/google-login', { token: credentialResponse.credential });
      localStorage.setItem('user', JSON.stringify(res.data));
      toast.success("Google Login Successful!");
      navigate('/');
      window.location.reload();
    } catch (error) {
      toast.error("Google Login Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-0">
      
      {/* --- MAX WIDTH CONTAINER (Keeps content centered on huge screens) --- */}
      <div className="flex w-full max-w-4xl gap-8 items-center justify-center">

        {/* ================= LEFT SIDE: THE PHONE SHOWCASE (Hidden on Mobile) ================= */}
        <div className="hidden md:flex relative w-1/2 justify-end">
            
            {/* PHONE FRAME */}
            <div className="relative border-[12px] border-gray-900 rounded-[2.5rem] h-[550px] w-[280px] bg-black shadow-2xl overflow-hidden z-10">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-gray-900 rounded-b-xl z-20"></div>
                
                {/* SCREEN CONTENT (Grid of Posters) */}
                <div className="grid grid-cols-2 gap-1 p-2 mt-6 h-full bg-anthracite overflow-hidden opacity-90">
                    {/* Batman */}
                    <img src="https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg" className="rounded mb-1 w-full h-40 object-cover" alt="Batman" />
                    {/* Stranger Things */}
                    <img src="https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg" className="rounded mb-1 w-full h-40 object-cover" alt="Stranger Things" />
                    {/* Oppenheimer */}
                    <img src="https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg" className="rounded mb-1 w-full h-40 object-cover" alt="Oppenheimer" />
                    {/* Barbie */}
                    <img src="https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg" className="rounded mb-1 w-full h-40 object-cover" alt="Barbie" />
                    {/* Rush (F1) */}
                    <img src="https://image.tmdb.org/t/p/w500/cjEepSetYE1vj4tcivilian8oyB0l6.jpg" className="rounded mb-1 w-full h-40 object-cover" alt="Rush" />
                    {/* Interstellar */}
                    <img src="https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg" className="rounded mb-1 w-full h-40 object-cover" alt="Interstellar" />
                </div>
            </div>

            {/* FLOATING ICONS (Behind/Around Phone) - The "3D" Feel */}
            <div className="absolute top-20 right-10 bg-white p-3 rounded-full shadow-xl animate-bounce z-20 text-red-500">
                <FaHeart className="text-xl" />
            </div>
            <div className="absolute bottom-32 right-12 bg-white p-3 rounded-full shadow-xl animate-pulse z-20 text-blue-500 delay-700">
                <FaComment className="text-xl" />
            </div>
            <div className="absolute top-40 right-48 bg-papaya p-2 rounded-lg shadow-lg -rotate-12 z-0 opacity-80">
                <span className="text-black font-bold text-xs">JUST WATCHED</span>
            </div>
        </div>

        {/* ================= RIGHT SIDE: THE LOGIN FORM ================= */}
        <div className="w-full md:w-[350px] flex flex-col gap-4">
          
          {/* CARD 1: Login Inputs */}
          <div className="bg-white border border-gray-300 p-8 rounded-sm shadow-sm flex flex-col items-center">
            
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
               <div className="w-8 h-8 bg-papaya rounded-lg flex items-center justify-center -rotate-6">
                 <FaPlay className="text-black text-xs ml-0.5" />
               </div>
               <h1 className="text-3xl font-bold tracking-tighter text-gray-900">CineSync</h1>
            </div>

            <p className="text-gray-500 font-semibold mb-6 text-center text-sm">
                Welcome back, we were waiting for you!
            </p>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
              <input 
                type="email" 
                name="email"
                placeholder="Email" 
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-sm rounded-sm focus:ring-1 focus:ring-gray-400 focus:border-gray-400 block w-full p-2.5 outline-none text-gray-900 placeholder-gray-500"
                required
              />
              <input 
                type="password" 
                name="password"
                placeholder="Password" 
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-sm rounded-sm focus:ring-1 focus:ring-gray-400 focus:border-gray-400 block w-full p-2.5 outline-none text-gray-900 placeholder-gray-500"
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
          <div className="bg-white border border-gray-300 p-4 rounded-sm shadow-sm text-center">
            <p className="text-sm text-gray-800">
              Don't have an account? <Link to="/register" className="text-papaya font-bold">Sign up</Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;
