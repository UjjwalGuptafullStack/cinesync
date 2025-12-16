const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

// The "Big Studios" - Add more TMDB IDs here as needed
const topStudios = [
  { name: "Warner Bros. Pictures", tmdbId: "174", username: "WarnerBros" },
  { name: "Universal Pictures", tmdbId: "33", username: "UniversalPics" },
  { name: "Paramount Pictures", tmdbId: "4", username: "Paramount" },
  { name: "Walt Disney Pictures", tmdbId: "2", username: "Disney" },
  { name: "Marvel Studios", tmdbId: "420", username: "MarvelStudios" },
  { name: "20th Century Studios", tmdbId: "25", username: "20thCentury" },
  { name: "Columbia Pictures", tmdbId: "5", username: "ColumbiaPics" },
  { name: "DreamWorks Pictures", tmdbId: "521", username: "DreamWorks" },
  { name: "Pixar", tmdbId: "3", username: "Pixar" },
  { name: "Lucasfilm", tmdbId: "1", username: "Lucasfilm" },
  { name: "New Line Cinema", tmdbId: "12", username: "NewLineCinema" },
  { name: "Metro-Goldwyn-Mayer", tmdbId: "21", username: "MGM" },
  { name: "Sony Pictures", tmdbId: "34", username: "SonyPictures" },
  { name: "Lionsgate", tmdbId: "1632", username: "Lionsgate" },
  { name: "A24", tmdbId: "41077", username: "A24" },
  { name: "Blumhouse Productions", tmdbId: "3172", username: "Blumhouse" },
  { name: "DC Films", tmdbId: "429", username: "DCFilms" },
  { name: "Legendary Pictures", tmdbId: "923", username: "Legendary" },
  { name: "Studio Ghibli", tmdbId: "10342", username: "StudioGhibli" },
  { name: "Netflix", tmdbId: "2550", username: "Netflix" }
];

const seedStudios = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected for Studio Seeding...\n");

    let created = 0;
    let skipped = 0;

    for (const studio of topStudios) {
      // Check if exists by TMDB ID or username
      const exists = await User.findOne({ 
        $or: [
          { tmdbCompanyId: studio.tmdbId },
          { username: studio.username }
        ]
      });
      
      if (!exists) {
        await User.create({
          username: studio.username,
          email: null, // No email yet - ghost account
          password: null, // No password yet - ghost account
          role: 'production',
          isClaimed: false, // <--- It is a Ghost Account
          isVerified: true, // It IS the verified entity placeholder
          tmdbCompanyId: studio.tmdbId,
          userImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(studio.username)}&background=ff8700&color=fff&size=200&bold=true`,
          library: [], // Will be populated with their filmography later
          audience: [],
          tracking: []
        });
        console.log(`✅ Created Ghost Account: ${studio.name} (@${studio.username})`);
        created++;
      } else {
        console.log(`⚠️  Skipped ${studio.name} (Already exists)`);
        skipped++;
      }
    }

    console.log(`\n🎬 Seeding Complete!`);
    console.log(`   Created: ${created} studios`);
    console.log(`   Skipped: ${skipped} studios`);
    console.log(`\n💡 To generate a claim link for a studio, use the admin API endpoint.`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
};

seedStudios();
