import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import { FaPlay, FaFilm, FaTheaterMasks } from 'react-icons/fa';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    isProduction: false,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.isProduction ? 'production' : 'user'
      };
      
      const res = await api.post('/api/users', userData);
      localStorage.setItem('user', JSON.stringify(res.data));
      toast.success("Account created successfully!");
      navigate('/feed');
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-0 w-full">
      
      {/* --- MAX WIDTH CONTAINER --- */}
      <div className="flex w-full max-w-4xl gap-8 items-center justify-center">

        {/* ================= LEFT SIDE: THE PHONE SHOWCASE (Hidden on Mobile) ================= */}
        <div className="hidden md:flex relative w-1/2 justify-end">
            
            {/* PHONE FRAME */}
            <div className="relative border-[12px] border-gray-900 rounded-[2.5rem] h-[550px] w-[280px] bg-black shadow-2xl overflow-hidden z-10">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-gray-900 rounded-b-xl z-20"></div>
                
                {/* SCREEN CONTENT (Grid of Posters) */}
                <div className="grid grid-cols-2 gap-1 p-2 mt-6 h-full bg-anthracite overflow-hidden opacity-90">
                    {/* The Dark Knight */}
                    <img src="https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg" className="rounded mb-1 w-full h-40 object-cover" alt="The Dark Knight" />
                    {/* Stranger Things */}
                    <img src="https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg" className="rounded mb-1 w-full h-40 object-cover" alt="Stranger Things" />
                    {/* Oppenheimer */}
                    <img src="https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg" className="rounded mb-1 w-full h-40 object-cover" alt="Oppenheimer" />
                    {/* Barbie */}
                    <img src="https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg" className="rounded mb-1 w-full h-40 object-cover" alt="Barbie" />
                    {/* Rush */}
                    <img src="https://image.tmdb.org/t/p/w500/cjEepSetYE1vj4tcivilian8oyB0l6.jpg" className="rounded mb-1 w-full h-40 object-cover" alt="Rush" />
                    {/* Interstellar */}
                    <img src="https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg" className="rounded mb-1 w-full h-40 object-cover" alt="Interstellar" />
                </div>
            </div>

            {/* FLOATING ICONS */}
            <div className="absolute top-20 right-10 bg-white p-3 rounded-full shadow-xl animate-bounce z-20 text-papaya">
                <FaFilm className="text-xl" />
            </div>
            <div className="absolute bottom-32 right-12 bg-white p-3 rounded-full shadow-xl animate-pulse z-20 text-purple-500 delay-700">
                <FaTheaterMasks className="text-xl" />
            </div>
            <div className="absolute top-40 right-48 bg-papaya p-2 rounded-lg shadow-lg rotate-12 z-0 opacity-80">
                <span className="text-black font-bold text-xs">JOIN NOW</span>
            </div>
        </div>

        {/* ================= RIGHT SIDE: THE REGISTER FORM ================= */}
        <div className="w-full md:w-[350px] flex flex-col gap-4">
          
          {/* CARD 1: Register Inputs */}
          <div className="bg-transparent p-8 flex flex-col items-center">
            
            {/* Logo */}
            <div className="flex items-center gap-2 mb-6">
               <div className="w-8 h-8 bg-papaya rounded-lg flex items-center justify-center -rotate-6">
                 <FaPlay className="text-black text-xs ml-0.5" />
               </div>
               <h1 className="text-3xl font-bold tracking-tighter text-gray-800">CineSync</h1>
            </div>

            <p className="text-gray-600 font-semibold mb-4 text-center text-sm">
                Sign up to see what your friends are watching
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
                type="text" 
                name="username"
                placeholder="Username" 
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
              <input 
                type="password" 
                name="confirmPassword"
                placeholder="Confirm Password" 
                onChange={handleChange}
                className="bg-white border border-gray-300 text-sm rounded-sm focus:ring-1 focus:ring-papaya focus:border-papaya block w-full p-2.5 outline-none text-gray-900 placeholder-gray-500 shadow-sm"
                required
              />

              {/* Production House Toggle */}
              <div className="flex items-center gap-2 mt-2 p-3 bg-white rounded-sm border border-gray-300 shadow-sm">
                <input
                  type="checkbox"
                  name="isProduction"
                  id="isProduction"
                  checked={formData.isProduction}
                  onChange={handleChange}
                  className="w-4 h-4 text-papaya bg-gray-100 border-gray-300 rounded focus:ring-papaya focus:ring-2"
                />
                <label htmlFor="isProduction" className="text-xs text-gray-700 font-medium cursor-pointer">
                  I'm a Production House / Creator
                </label>
              </div>

              <button 
                type="submit" 
                className="mt-2 text-white bg-papaya hover:bg-orange-600 focus:ring-4 focus:ring-blue-300 font-bold rounded-md text-sm px-5 py-2.5 w-full transition"
              >
                Sign Up
              </button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
              By signing up, you agree to our <span className="font-semibold text-gray-700">Terms</span>, <span className="font-semibold text-gray-700">Privacy Policy</span> and <span className="font-semibold text-gray-700">Cookies Policy</span>.
            </p>
          </div>

          {/* CARD 2: Login Link (Instagram Style) */}
          <div className="bg-transparent p-4 text-center">
            <p className="text-sm text-gray-700">
              Have an account? <Link to="/login" className="text-papaya font-bold hover:text-orange-600">Log in</Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Register;
