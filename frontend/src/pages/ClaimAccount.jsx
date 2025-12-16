import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaFilm } from 'react-icons/fa';

function ClaimAccount() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/api/admin/claim-account', {
        token,
        email: formData.email,
        password: formData.password
      });

      toast.success(res.data.message || 'Account claimed successfully!');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to claim account');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-anthracite via-anthracite-light to-anthracite flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500 rounded-full mb-4">
            <FaFilm className="text-2xl text-black" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            Claim Your Studio Account
            <FaCheckCircle className="text-yellow-500 text-2xl" />
          </h1>
          <p className="text-gray-400">
            Welcome to CineSync! Set up your official production house account below.
          </p>
        </div>

        {/* Claim Form */}
        <div className="bg-anthracite-light p-8 rounded-xl shadow-xl border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
                Official Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="official@studio.com"
                className="w-full px-4 py-3 bg-anthracite border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-papaya transition"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use your official company email address
              </p>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
                Create Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Minimum 6 characters"
                className="w-full px-4 py-3 bg-anthracite border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-papaya transition"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Re-enter password"
                className="w-full px-4 py-3 bg-anthracite border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-papaya transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 rounded-lg transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
            >
              {loading ? 'Activating Account...' : 'Claim Account & Activate'}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-anthracite rounded-lg border border-gray-700">
            <p className="text-xs text-gray-400 leading-relaxed">
              <strong className="text-papaya">What happens next:</strong><br/>
              • Your existing followers and content library will be preserved<br/>
              • You'll gain full access to post updates and engage with fans<br/>
              • Your account will be marked as "Active & Verified"
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Need help? Contact us at{' '}
          <a href="mailto:support@cinesync.com" className="text-papaya hover:underline">
            support@cinesync.com
          </a>
        </p>
      </div>
    </div>
  );
}

export default ClaimAccount;
