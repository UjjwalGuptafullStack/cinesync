# CineSync Mobile App

Flutter mobile application for CineSync - Connect with filmmakers worldwide.

## 📱 Features

- **Authentication**: Login with email/password
- **Secure Storage**: JWT tokens stored securely using flutter_secure_storage
- **Professional UI**: Matches web design with Papaya (#FF8700) and Anthracite (#111827) theme
- **API Integration**: Ready to connect to CineSync backend

## 🏗️ Architecture

```
lib/
├── src/
│   ├── models/          # Data models (User, Post)
│   ├── screens/         # UI screens (Login, Register, Home)
│   ├── widgets/         # Reusable UI components
│   ├── services/        # API and business logic
│   └── utils/           # Constants, formatters, helpers
└── main.dart            # App entry point
```

## 🛠️ Setup Instructions

### Prerequisites

- Flutter 3.38.1 or higher
- Android Studio (for Android SDK)
- JDK 17

### Installation

1. **Install Dependencies**
```bash
flutter pub get
```

2. **Configure Backend URL**

Edit `lib/src/utils/constants.dart`:

```dart
class ApiConstants {
  // For Android Emulator:
  static const String baseUrl = 'http://10.0.2.2:5000/api';
  
  // For Physical Device (replace with your laptop's IP):
  // static const String baseUrl = 'http://YOUR_LAPTOP_IP:5000/api';
}
```

To find your laptop's IP:
```bash
# Linux/Mac
ip addr show | grep "inet "

# Or
ifconfig | grep "inet "
```

3. **Start Backend Server**

In the `cinesync/backend` directory:
```bash
npm run server
```

Make sure it's running on port 5000.

## 🚀 Running the App

### Android Emulator

1. **Start Emulator**
```bash
flutter emulators --launch <emulator_id>
```

2. **Run App**
```bash
flutter run
```

### Physical Device

1. **Enable USB Debugging** on your Android device
2. **Connect device** via USB
3. **Run App**
```bash
flutter run
```

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `http` | ^1.2.0 | API networking (like Axios) |
| `flutter_secure_storage` | ^9.0.0 | Secure JWT storage |
| `provider` | ^6.1.1 | State management |
| `google_fonts` | ^6.1.0 | Inter font family |
| `font_awesome_flutter` | ^10.6.0 | Icon library |
| `intl` | ^0.19.0 | Date formatting |

## 🎨 Theme

### Colors

- **Papaya**: `#FF8700` - Primary brand color
- **Anthracite**: `#111827` - Dark background
- **Coal**: `#1F2937` - Card background

### Typography

Using **Inter** font family via Google Fonts.

## 🔐 Authentication Flow

1. User enters email/password
2. App sends POST request to `/api/auth/login`
3. Backend returns JWT token
4. Token stored securely using `flutter_secure_storage`
5. Token automatically added to API headers

## 📡 API Endpoints

Configured in `lib/src/utils/constants.dart`:

```dart
static const String login = '/auth/login';
static const String register = '/auth/register';
static const String googleAuth = '/auth/google';
static const String getPosts = '/posts';
static const String createPost = '/posts';
static const String getProfile = '/users/profile';
```

## 🐛 Troubleshooting

### Cannot connect to backend

**Android Emulator:**
- Use `10.0.2.2` instead of `localhost`
- Check backend is running on port 5000

**Physical Device:**
- Use your laptop's IP address (not localhost)
- Make sure device and laptop are on same WiFi network
- Check firewall settings

### flutter doctor issues

```bash
# Accept Android licenses
flutter doctor --android-licenses

# Check installation
flutter doctor -v
```

### Build errors

```bash
# Clean build
flutter clean
flutter pub get
flutter run
```

## 📝 Next Steps

- [ ] Implement Register screen
- [ ] Add Google Sign In
- [ ] Create Home/Feed screen
- [ ] Build Post creation UI
- [ ] Add Profile screen
- [ ] Implement image upload
- [ ] Add pull-to-refresh
- [ ] Implement infinite scroll
- [ ] Add push notifications

## 🤝 Contributing

This is part of the CineSync monorepo. See main project README for contribution guidelines.

## 📄 License

Same as main CineSync project.
