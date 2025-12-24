import 'package:flutter/material.dart';
//import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'src/screens/login_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  //await MobileAds.instance.initialize();
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
