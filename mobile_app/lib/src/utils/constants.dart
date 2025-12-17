import 'package:flutter/material.dart';

// CineSync Color Palette
class AppColors {
  // Primary Colors
  static const Color papaya = Color(0xFFFF8700); // Primary Brand Color
  static const Color anthracite = Color(0xFF111827); // Dark Background
  static const Color coal = Color(0xFF1F2937); // Card Background

  // Text Colors
  static const Color textPrimary = Color(0xFFF9FAFB); // White text
  static const Color textSecondary = Color(0xFF9CA3AF); // Gray text

  // UI Elements
  static const Color inputBorder = Color(0xFF374151);
  static const Color error = Color(0xFFEF4444);
  static const Color success = Color(0xFF10B981);
}

// API Configuration
class ApiConstants {
  // Physical Device: Use your computer's WiFi IP address
  // Run: ip addr | grep inet
  // Look for: inet 192.168.x.x
  static const String baseUrl = 'http://192.168.1.48:5000/api';

  // Alternative if using adb reverse:
  // static const String baseUrl = 'http://127.0.0.1:5000/api';

  // For emulator (10.0.2.2):
  // static const String baseUrl = 'http://10.0.2.2:5000/api';

  // Endpoints
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String googleAuth = '/auth/google';
  static const String getPosts = '/posts';
  static const String createPost = '/posts';
  static const String getProfile = '/users/profile';
}

// Storage Keys
class StorageKeys {
  static const String jwtToken = 'jwt_token';
  static const String userId = 'user_id';
  static const String userEmail = 'user_email';
  static const String userName = 'user_name';
}

// App Constants
class AppConstants {
  static const String appName = 'CineSync';
  static const double borderRadius = 8.0;
  static const double buttonHeight = 48.0;
  static const double horizontalPadding = 24.0;
  static const double verticalPadding = 16.0;
}
