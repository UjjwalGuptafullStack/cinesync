import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFilm, FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

function ContactSales() {
  const [formData, setFormData] = useState({
    studioName: '',
    contactName: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In production, send this to your backend/email service
    console.log('Contact Form Submission:', formData);
    
    toast.success('Thank you! Our team will contact you within 24 hours.');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-anthracite via-anthracite-light to-anthracite flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
            <FaCheckCircle className="text-4xl text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Request Received!</h1>
          <p className="text-gray-400 mb-8">
            Our partnerships team will review your request and contact you at <strong className="text-papaya">{formData.email}</strong> within 24 hours.
          </p>
          <Link to="/" className="bg-papaya text-black px-6 py-3 rounded-full font-bold hover:bg-orange-600 transition inline-block">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-anthracite via-anthracite-light to-anthracite py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-papaya rounded-full mb-4">
            <FaFilm className="text-2xl text-black" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Claim Your Studio Page</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Is your production house already on CineSync? Claim your official page to engage with fans, post updates, and manage your filmography.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="bg-anthracite-light p-8 rounded-xl border border-gray-800 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Why Claim Your Page?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <FaCheckCircle className="text-yellow-500 text-xl mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-white mb-1">Verified Status</h3>
                <p className="text-sm text-gray-400">Official gold checkmark badge on your profile</p>
              </div>
            </div>
            <div className="flex gap-3">
              <FaCheckCircle className="text-yellow-500 text-xl mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-white mb-1">Existing Audience</h3>
                <p className="text-sm text-gray-400">Keep followers we've already built for you</p>
              </div>
            </div>
            <div className="flex gap-3">
              <FaCheckCircle className="text-yellow-500 text-xl mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-white mb-1">Post Updates</h3>
                <p className="text-sm text-gray-400">Share news, trailers, and behind-the-scenes content</p>
              </div>
            </div>
            <div className="flex gap-3">
              <FaCheckCircle className="text-yellow-500 text-xl mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-white mb-1">Fan Engagement</h3>
                <p className="text-sm text-gray-400">Reply to reviews and interact with your community</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-anthracite-light p-8 rounded-xl border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <FaEnvelope />
            Request Account Access
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
                  Studio Name
                </label>
                <input
                  type="text"
                  name="studioName"
                  value={formData.studioName}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Warner Bros. Pictures"
                  className="w-full px-4 py-3 bg-anthracite border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-papaya transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
                  Your Name
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                  placeholder="Full name"
                  className="w-full px-4 py-3 bg-anthracite border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-papaya transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
                Official Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="yourname@studio.com"
                className="w-full px-4 py-3 bg-anthracite border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-papaya transition"
              />
              <p className="text-xs text-gray-500 mt-1">Please use your company email address</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
                Message (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                placeholder="Tell us about your role and why you'd like to claim this page..."
                className="w-full px-4 py-3 bg-anthracite border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-papaya transition resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-papaya hover:bg-orange-600 text-black font-bold py-4 rounded-lg transition shadow-lg uppercase tracking-wide"
            >
              Submit Request
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          Questions? Email us at{' '}
          <a href="mailto:partnerships@cinesync.com" className="text-papaya hover:underline">
            partnerships@cinesync.com
          </a>
        </p>
      </div>
    </div>
  );
}

export default ContactSales;
