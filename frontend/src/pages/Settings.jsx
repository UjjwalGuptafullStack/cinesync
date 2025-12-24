import { useState, useCallback, useEffect } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';

function Settings() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  
  // Cropper State
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [finalImageFile, setFinalImageFile] = useState(null); // The file to upload

  const navigate = useNavigate();

  // Load current user settings on mount
  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.username) {
          const res = await api.get(`/api/users/profile/${user.username}`);
          setIsPrivate(res.data.isPrivate || false);
        }
      } catch (error) {
        console.error('Failed to load user settings:', error);
      }
    };
    loadUserSettings();
  }, []);

  // 1. Handle File Select
  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageSrc(reader.result));
      reader.readAsDataURL(file);
    }
  };

  // 2. Capture Crop Area
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // 3. Generate Final Blob
  const showCroppedImage = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const file = new File([croppedImageBlob], "profile.jpg", { type: "image/jpeg" });
      setFinalImageFile(file);
      setImageSrc(null); // Close modal
      toast.info("Image cropped and ready to save!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to crop image");
    }
  };

  // 4. Submit to Backend
  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (username) formData.append('username', username);
    if (password) formData.append('password', password);
    if (finalImageFile) formData.append('image', finalImageFile);
    formData.append('isPrivate', isPrivate); // Always send privacy state

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await api.put('/api/users/profile', formData);
      
      console.log('Profile update response:', res.data);
      console.log('New userImage:', res.data.userImage);
      
      // SECURITY: This merge is SAFE because:
      // 1. Endpoint is authenticated - only updates YOUR profile
      // 2. res.data contains YOUR updated data (same user ID)
      // 3. We merge to preserve existing token and fields
      const updatedUser = { ...user, ...res.data };
      console.log('Updated user object:', updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Notify Header component to re-render with new user data
      window.dispatchEvent(new Event('userUpdated'));
      
      toast.success('Profile updated successfully');
      navigate(`/profile/${res.data.username}`);
    } catch (error) {
      console.error(error); // Log exact error
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  // 5. Delete Account Handler
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      '⚠️ WARNING: This action is irreversible!\n\n' +
      'Deleting your account will:\n' +
      '• Permanently remove all your posts\n' +
      '• Remove you from all followers/following lists\n' +
      '• Delete all your data from CineSync\n\n' +
      'Are you absolutely sure you want to continue?'
    );

    if (!confirmed) return;

    try {
      await api.delete('/api/users/profile');
      localStorage.removeItem('user');
      toast.success('Account deleted successfully');
      navigate('/login');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to delete account');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-anthracite-light border border-gray-800 rounded-xl shadow-2xl relative">
      <h1 className="text-3xl font-bold text-papaya mb-6 border-b border-gray-700 pb-4">Settings</h1>
      
      {/* CROPPER MODAL */}
      {imageSrc && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4">
          <div className="relative w-full max-w-md h-96 bg-gray-900 rounded-lg overflow-hidden mb-4">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1} // Square aspect ratio for avatars
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className="flex flex-col gap-4 items-center">
            <div className="flex items-center gap-3">
              <span className="text-white text-sm">Zoom:</span>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(e.target.value)}
                className="w-48"
              />
            </div>
            <div className="flex gap-3">
              <button 
                onClick={showCroppedImage} 
                className="bg-papaya hover:bg-papaya-dark text-black font-bold py-2 px-6 rounded transition uppercase tracking-wide"
              >
                Set Profile Picture
              </button>
              <button 
                onClick={() => setImageSrc(null)} 
                className="bg-gray-700 hover:bg-red-600 text-white font-bold py-2 px-6 rounded transition uppercase tracking-wide"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
            onChange={onFileChange}
          />
          {finalImageFile && (
            <p className="text-green-500 text-sm mt-2 font-bold">✓ New image selected and cropped</p>
          )}
        </div>

        {/* PRIVACY TOGGLE */}
        <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-white font-bold text-lg">Private Account</h3>
              <p className="text-gray-400 text-sm mt-1">
                Only your followers can see your posts and watchlist
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-papaya/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-papaya"></div>
            </label>
          </div>
        </div>

        <button type="submit" className="bg-papaya hover:bg-papaya-dark text-black font-bold py-3 px-6 rounded w-full transition uppercase tracking-wide">
          Save Changes
        </button>
      </form>

      {/* DANGER ZONE */}
      <div className="mt-10 border-t border-red-900/50 pt-6">
        <h3 className="text-red-500 font-bold text-xl mb-3 flex items-center gap-2">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Danger Zone
        </h3>
        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
          Once you delete your account, there is no going back. All your posts, watchlist, 
          and connections will be permanently removed from CineSync.
        </p>
        
        <button 
          onClick={handleDeleteAccount}
          className="bg-red-600/20 text-red-500 border-2 border-red-600 px-6 py-3 rounded-lg hover:bg-red-600 hover:text-white transition font-bold uppercase tracking-wide flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Delete Account
        </button>
      </div>
    </div>
  );
}

export default Settings;
