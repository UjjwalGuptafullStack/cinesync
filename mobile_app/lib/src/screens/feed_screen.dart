import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/post.dart';
import '../widgets/post_card.dart';
import '../widgets/network_carousel.dart';
import 'notifications_screen.dart';

class FeedScreen extends StatefulWidget {
  const FeedScreen({super.key});

  @override
  State<FeedScreen> createState() => _FeedScreenState();
}

class _FeedScreenState extends State<FeedScreen> {
  final _apiService = ApiService();
  List<dynamic> _feedItems = []; // Can be Post, Ad, or "NetworkBlock"
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadSmartFeed();
  }

  Future<void> _loadSmartFeed() async {
    try {
      // 1. Fetch Posts (Backend now returns hybrid feed: following OR global public)
      List<Post> posts = await _apiService.getFeed();

      // 2. Fetch Network Suggestions
      List<dynamic> suggestions = await _apiService.getNetworkSuggestions();

      // 3. Smart Injection Logic
      List<dynamic> mixedFeed = [];

      for (int i = 0; i < posts.length; i++) {
        mixedFeed.add(posts[i]);

        // Smart Network Panel Injection:
        // - After 2nd post (index 1) if there are more posts
        // - OR after 1st post (index 0) if that's the only post
        // - OR after last post if exactly 2 posts
        bool shouldInject = false;

        if (posts.length == 1 && i == 0) {
          // Only 1 post, inject after it
          shouldInject = true;
        } else if (posts.length == 2 && i == 1) {
          // Exactly 2 posts, inject after 2nd
          shouldInject = true;
        } else if (posts.length >= 3 && i == 1) {
          // 3+ posts, inject after 2nd
          shouldInject = true;
        }

        if (shouldInject && suggestions.isNotEmpty) {
          mixedFeed.add({'type': 'network_block', 'data': suggestions});
        }
      }

      if (mounted) {
        setState(() {
          _feedItems = mixedFeed;
          _isLoading = false;
        });
      }
    } catch (e) {
      print("Feed Error: $e");
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      appBar: AppBar(
        title: const Text(
          "CineSync",
          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
        ),
        backgroundColor: const Color(0xFF111827),
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications, color: Colors.white),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const NotificationsScreen(),
                ),
              );
            },
          ),
        ],
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(color: Color(0xFFFF8700)),
            )
          : _feedItems.isEmpty
          ? Center(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(
                      Icons.movie_filter,
                      size: 80,
                      color: Color(0xFFFF8700),
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      "Welcome to CineSync!",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      "Start by following some movie buffs:",
                      style: TextStyle(color: Colors.grey, fontSize: 16),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 24),
                    FutureBuilder<List<dynamic>>(
                      future: _apiService.getNetworkSuggestions(),
                      builder: (context, snapshot) {
                        if (snapshot.hasData && snapshot.data!.isNotEmpty) {
                          return NetworkCarousel(users: snapshot.data!);
                        }
                        return const SizedBox.shrink();
                      },
                    ),
                  ],
                ),
              ),
            )
          : RefreshIndicator(
              color: const Color(0xFFFF8700),
              onRefresh: _loadSmartFeed,
              child: ListView.separated(
                padding: const EdgeInsets.all(16),
                itemCount: _feedItems.length,
                separatorBuilder: (ctx, index) => const SizedBox(height: 24),
                itemBuilder: (context, index) {
                  final item = _feedItems[index];

                  // CASE 1: It's a Movie Post
                  if (item is Post) {
                    return PostCard(post: item);
                  }

                  // CASE 2: It's the "Network Suggestions" Block
                  if (item is Map && item['type'] == 'network_block') {
                    return NetworkCarousel(users: item['data']);
                  }

                  return const SizedBox.shrink();
                },
              ),
            ),
    );
  }
}
