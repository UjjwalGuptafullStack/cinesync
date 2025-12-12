import { useState, useCallback } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';

function Settings() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Cropper State
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [finalImageFile, setFinalImageFile] = useState(null); // The file to upload

  const navigate = useNavigate();

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

        <button type="submit" className="bg-papaya hover:bg-papaya-dark text-black font-bold py-3 px-6 rounded w-full transition uppercase tracking-wide">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default Settings;
