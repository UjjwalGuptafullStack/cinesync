import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'src/utils/constants.dart';
import 'src/screens/login_screen.dart';

void main() {
  runApp(const CineSyncApp());
}

class CineSyncApp extends StatelessWidget {
  const CineSyncApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: AppConstants.appName,
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        // Color Scheme
        scaffoldBackgroundColor: AppColors.anthracite,
        primaryColor: AppColors.papaya,
        colorScheme: ColorScheme.dark(
          primary: AppColors.papaya,
          secondary: AppColors.papaya,
          surface: AppColors.coal,
          error: AppColors.error,
        ),
        
        // Typography
        textTheme: GoogleFonts.interTextTheme(
          ThemeData.dark().textTheme.copyWith(
            displayLarge: const TextStyle(
              color: AppColors.textPrimary,
              fontSize: 32,
              fontWeight: FontWeight.bold,
            ),
            displayMedium: const TextStyle(
              color: AppColors.textPrimary,
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
            bodyLarge: const TextStyle(
              color: AppColors.textPrimary,
              fontSize: 16,
            ),
            bodyMedium: const TextStyle(
              color: AppColors.textSecondary,
              fontSize: 14,
            ),
          ),
        ),
        
        // Input Decoration
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: AppColors.coal,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(AppConstants.borderRadius),
            borderSide: const BorderSide(color: AppColors.inputBorder),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(AppConstants.borderRadius),
            borderSide: const BorderSide(color: AppColors.inputBorder),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(AppConstants.borderRadius),
            borderSide: const BorderSide(color: AppColors.papaya, width: 2),
          ),
          errorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(AppConstants.borderRadius),
            borderSide: const BorderSide(color: AppColors.error),
          ),
          contentPadding: const EdgeInsets.symmetric(
            horizontal: AppConstants.horizontalPadding,
            vertical: AppConstants.verticalPadding,
          ),
        ),
        
        // Button Theme
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.papaya,
            foregroundColor: AppColors.anthracite,
            minimumSize: const Size(double.infinity, AppConstants.buttonHeight),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(AppConstants.borderRadius),
            ),
            textStyle: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
        
        // App Bar Theme
        appBarTheme: const AppBarTheme(
          backgroundColor: AppColors.anthracite,
          elevation: 0,
          centerTitle: true,
          titleTextStyle: TextStyle(
            color: AppColors.textPrimary,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
          iconTheme: IconThemeData(color: AppColors.papaya),
        ),
      ),
      home: const LoginScreen(),
    );
  }
}
