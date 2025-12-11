require('dotenv').config(); // Load environment variables
const cloudinary = require('cloudinary').v2;

// 1. Configure
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Testing connection for cloud:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY ? '✅ Loaded' : '❌ Missing');
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? '✅ Loaded' : '❌ Missing');

// 2. Try to upload a random image from the internet
cloudinary.uploader.upload(
  "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
  { public_id: "test_image" },
  function(error, result) {
    if (error) {
      console.log("❌ FAILED:", error);
    } else {
      console.log("✅ SUCCESS! Image uploaded.");
      console.log("URL:", result.secure_url);
    }
  }
);
