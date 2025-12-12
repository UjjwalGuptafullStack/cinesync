import { useState } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Settings() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (username) formData.append('username', username);
    if (password) formData.append('password', password);
    if (avatar) formData.append('image', avatar);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await api.put('/api/users/profile', formData);
      
      // SECURITY: This merge is SAFE because:
      // 1. Endpoint is authenticated - only updates YOUR profile
      // 2. res.data contains YOUR updated data (same user ID)
      // 3. We merge to preserve existing token and fields
      localStorage.setItem('user', JSON.stringify({ ...user, ...res.data }));
      toast.success('Profile updated successfully');
      navigate(`/profile/${res.data.username}`);
    } catch (error) {
      toast.error('Update failed');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-anthracite-light border border-gray-800 rounded-xl shadow-2xl">
      <h1 className="text-3xl font-bold text-papaya mb-6 border-b border-gray-700 pb-4">Settings</h1>
      
      <form onSubmit={handleUpdate} className="space-y-6">
        <div>
          <label className="block text-gray-400 mb-2 font-bold">New Username</label>
          <input 
            type="text" 
            className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-3 text-white focus:border-papaya focus:outline-none transition"
            placeholder="Enter new username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2 font-bold">New Password</label>
          <input 
            type="password" 
            className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-3 text-white focus:border-papaya focus:outline-none transition"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2 font-bold">Profile Picture</label>
          <input 
            type="file" 
            accept="image/*"
            className="block w-full text-sm text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-papaya file:text-black
              hover:file:bg-papaya-dark
            "
            onChange={(e) => setAvatar(e.target.files[0])}
          />
        </div>

        <button type="submit" className="bg-papaya hover:bg-papaya-dark text-black font-bold py-3 px-6 rounded w-full transition uppercase tracking-wide">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default Settings;
