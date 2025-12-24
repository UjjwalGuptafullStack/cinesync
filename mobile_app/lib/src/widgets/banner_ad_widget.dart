// TODO: Uncomment when AdMob App ID is configured in Google AdMob Console
// import 'package:flutter/material.dart';
// import 'package:google_mobile_ads/google_mobile_ads.dart';

// class BannerAdWidget extends StatefulWidget {
//   const BannerAdWidget({super.key});

//   @override
//   State<BannerAdWidget> createState() => _BannerAdWidgetState();
// }

// class _BannerAdWidgetState extends State<BannerAdWidget> {
//   BannerAd? _bannerAd;
//   bool _isLoaded = false;

//   // TEST UNIT ID for Android
//   final String _adUnitId = 'ca-app-pub-3940256099942544/6300978111';

//   @override
//   void initState() {
//     super.initState();
//     _loadAd();
//   }

//   void _loadAd() {
//     _bannerAd = BannerAd(
//       adUnitId: _adUnitId,
//       request: const AdRequest(),
//       size: AdSize.banner,
//       listener: BannerAdListener(
//         onAdLoaded: (_) => setState(() => _isLoaded = true),
//         onAdFailedToLoad: (ad, err) {
//           ad.dispose();
//           print('Ad Failed to Load: $err');
//         },
//       ),
//     )..load();
//   }

//   @override
//   void dispose() {
//     _bannerAd?.dispose();
//     super.dispose();
//   }

//   @override
//   Widget build(BuildContext context) {
//     if (!_isLoaded || _bannerAd == null) return const SizedBox.shrink();

//     return Container(
//       height: _bannerAd!.size.height.toDouble(),
//       width: double.infinity,
//       color: Colors.black, // Placeholder bg
//       alignment: Alignment.center,
//       child: AdWidget(ad: _bannerAd!),
//     );
//   }
// }
