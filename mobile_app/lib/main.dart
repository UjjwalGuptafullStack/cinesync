import 'package:flutter/material.dart';
import 'src/screens/login_screen.dart';

void main() {
  runApp(const CineSyncApp());
}

class CineSyncApp extends StatelessWidget {
  const CineSyncApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CineSync',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF111827),
      ),
      home: const LoginScreen(),
    );
  }
}
