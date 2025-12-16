# 🎬 Ghost Account System - Production House Architecture

## Overview
The Ghost Account system allows CineSync to pre-populate the platform with official production house profiles (Warner Bros, Disney, Marvel Studios, etc.) before they actively join. This creates an IMDb/LinkedIn-style ecosystem where:

1. **Users** can follow and engage with studio pages immediately
2. **Studios** accumulate followers and content organically
3. **When ready**, studios can claim their pre-built audience and page

---

## 🏗️ Architecture Components

### 1. Database Schema Updates (`User.js`)
New fields added to User model:
- `isClaimed` (Boolean) - True for normal users, False for ghost studios
- `tmdbCompanyId` (String) - Links to TMDB company ID (e.g., "174" for Warner Bros)
- `website` (String) - Official studio website
- `claimToken` (String) - Secure token for account claiming
- `email` & `password` - Now optional (nullable for ghost accounts)

### 2. Studio Seeder Script (`scripts/seedStudios.js`)
Pre-populates database with top 20 production houses:
- Warner Bros, Universal, Paramount, Disney, Marvel, etc.
- Each gets a username, TMDB ID, and placeholder avatar
- Marked as `isClaimed: false` and `isVerified: true`

### 3. Admin API (`controllers/adminController.js`)
Three endpoints for managing ghost accounts:
- `POST /api/admin/generate-claim/:studioId` - Generate secure claim link
- `POST /api/admin/claim-account` - Activate account with email/password
- `GET /api/admin/ghost-accounts` - List all unclaimed studios

### 4. Frontend UI Updates
- **Profile.jsx**: Shows gold checkmark, "Official Archive (Inactive)" badge, and "Claim This Page" banner
- **ClaimAccount.jsx**: Secure form for studios to set credentials
- **ContactSales.jsx**: Lead generation form for studio inquiries

---

## 🚀 Usage Guide

### Step 1: Seed Ghost Accounts
Run this command **once** to populate your database with major studios:

```bash
cd backend
node scripts/seedStudios.js
```

**Output:**
```
✅ MongoDB Connected for Studio Seeding...

✅ Created Ghost Account: Warner Bros. Pictures (@WarnerBros)
✅ Created Ghost Account: Universal Pictures (@UniversalPics)
✅ Created Ghost Account: Marvel Studios (@MarvelStudios)
...

🎬 Seeding Complete!
   Created: 20 studios
   Skipped: 0 studios
```

### Step 2: Studios Accumulate Followers
Users can now:
- Visit `/profile/WarnerBros` 
- See the verified gold checkmark ✅
- Follow the studio page
- View their filmography (when you populate it)
- See a "Claim This Page" banner if not yet claimed

### Step 3: Generate Claim Link (Admin)
When Warner Bros contacts you to claim their account:

**API Request:**
```bash
POST /api/admin/generate-claim/507f1f77bcf86cd799439011
Authorization: Bearer <ADMIN_TOKEN>
```

**Response:**
```json
{
  "success": true,
  "studio": "WarnerBros",
  "tmdbId": "174",
  "link": "https://cinesync.com/claim-account/8f4a2c7e9d3b1a5f6e8c2d4a7b9e1f3c...",
  "message": "Send this link to WarnerBros representatives to claim their account."
}
```

### Step 4: Studio Claims Account
You send the link to `partnerships@warnerbros.com`. They:
1. Click the link → `/claim-account/8f4a2c7e9d3b...`
2. Enter official email (`official@warnerbros.com`)
3. Create password
4. Submit → Account flips to `isClaimed: true`

**Result:**
- Warner Bros now owns their existing 10,000 followers
- They can log in and post updates
- Badge changes from "Inactive" to "Active & Verified"

---

## 🔒 Security Features

1. **Token-Based Claiming**: 64-character cryptographic tokens (not guessable)
2. **One-Time Use**: Token is deleted after successful claim
3. **Email Validation**: Studios must use official company email
4. **Admin-Only Generation**: Only admins can create claim links
5. **Sparse Indexes**: Database allows multiple null emails for ghost accounts

---

## 📊 Admin Dashboard Queries

### List All Unclaimed Studios
```bash
GET /api/admin/ghost-accounts
Authorization: Bearer <ADMIN_TOKEN>
```

**Response:**
```json
{
  "count": 15,
  "studios": [
    {
      "id": "507f1f77bcf86cd799439011",
      "username": "WarnerBros",
      "tmdbId": "174",
      "followers": 8234,
      "created": "2025-12-17T10:30:00.000Z"
    },
    ...
  ]
}
```

### Check Specific Studio Status
```javascript
const studio = await User.findOne({ username: 'WarnerBros' });
console.log(`
  Claimed: ${studio.isClaimed}
  Followers: ${studio.audience.length}
  TMDB ID: ${studio.tmdbCompanyId}
`);
```

---

## 🎨 Frontend UX Flow

### For Regular Users
1. Visit `/profile/WarnerBros`
2. See gold checkmark + "Official Archive (Inactive)" badge
3. Can follow immediately
4. See "Claim This Page" banner with `/contact-sales` link

### For Studio Representatives
1. Click "Claim This Page" → `/contact-sales`
2. Fill out inquiry form
3. CineSync admin generates claim link
4. Email sent to studio
5. Studio clicks link → `/claim-account/:token`
6. Sets credentials → Account activated

---

## 🛠️ Customization

### Add More Studios
Edit `backend/scripts/seedStudios.js`:

```javascript
const topStudios = [
  { name: "Studio Ghibli", tmdbId: "10342", username: "StudioGhibli" },
  { name: "A24", tmdbId: "41077", username: "A24" },
  // Add your custom studios here
];
```

### Change Claim Link Domain
In `.env`:
```
FRONTEND_URL=https://cinesync.com
```

### Customize Studio Avatars
Replace placeholder with TMDB logo fetch:
```javascript
userImage: `https://image.tmdb.org/t/p/w200${logoPath}`
```

---

## 📈 Business Benefits

1. **Pre-Built Network Effects**: Studios see existing engagement before joining
2. **Data Leverage**: "You already have 5,000 followers waiting for you"
3. **SEO & Discoverability**: Complete filmography indexed by Google
4. **Low Barrier to Entry**: Studios don't need to build audience from zero
5. **Platform Authority**: Shows you're serious about production house partnerships

---

## 🐛 Troubleshooting

### "E11000 duplicate key error"
**Cause**: Studio already exists in database  
**Fix**: Check existing records before running seeder again

### Claim token doesn't work
**Cause**: Token already used or expired  
**Fix**: Generate new token via admin API

### Ghost accounts show in public search
**Status**: This is intentional - they should be discoverable!

---

## 🔄 Migration Path

If you already have production accounts created by users:

```javascript
// Run this migration to convert existing accounts to ghost system
const existingStudios = await User.find({ role: 'production' });

for (const studio of existingStudios) {
  if (!studio.tmdbCompanyId) {
    studio.isClaimed = true; // Mark user-created studios as claimed
    await studio.save();
  }
}
```

---

## 📞 Support

For questions about the Ghost Account system:
- **Technical**: Check `adminController.js` comments
- **Business**: See `/contact-sales` page implementation
- **Database**: Review User model schema in `models/User.js`

---

**Version**: 8.6.0  
**Last Updated**: December 17, 2025  
**Maintainer**: CineSync Platform Team
