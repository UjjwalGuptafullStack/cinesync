import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/post.dart';
import '../widgets/post_card.dart';
import 'settings_screen.dart';
import 'user_list_screen.dart';

class ProfileScreen extends StatefulWidget {
  final String? userId; // If null, it shows the current user (Me)
  const ProfileScreen({super.key, this.userId});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen>
    with SingleTickerProviderStateMixin {
  final ApiService _api = ApiService();
  late TabController _tabController;
  Map<String, dynamic>? _userData;
  List<Post> _userPosts = [];
  List<dynamic> _watchlist = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    try {
      // 1. Fetch User Data (Profile Info)
      final endpoint = widget.userId == null
          ? '/users/me'
          : '/users/${widget.userId}';
      final data = await _api.get(endpoint);

      // 2. Fetch Posts (Created by user)
      final postsData = await _api.get('/posts/user/${data['_id']}');
      List<Post> posts = (postsData as List)
          .map((p) => Post.fromJson(p))
          .toList();

      setState(() {
        _userData = data;
        _userPosts = posts;
        _watchlist = data['watchlist'] ?? [];
        _isLoading = false;
      });
    } catch (e) {
      print("Profile Error: $e");
      setState(() => _isLoading = false);
    }
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading)
      return const Scaffold(
        backgroundColor: Color(0xFF111827),
        body: Center(
          child: CircularProgressIndicator(color: Color(0xFFFF8700)),
        ),
      );
    if (_userData == null)
      return const Scaffold(
        backgroundColor: Color(0xFF111827),
        body: Center(
          child: Text("User not found", style: TextStyle(color: Colors.white)),
        ),
      );

    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      appBar: AppBar(
        title: Text(
          _userData!['username'],
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: const Color(0xFF1F2937),
        actions: [
          if (widget.userId == null)
            IconButton(
              icon: const Icon(Icons.settings),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const SettingsScreen()),
                );
              },
            ),
        ],
      ),
      body: NestedScrollView(
        headerSliverBuilder: (context, _) => [
          SliverToBoxAdapter(child: _buildProfileHeader()),
          SliverPersistentHeader(
            delegate: _SliverAppBarDelegate(
              TabBar(
                controller: _tabController,
                indicatorColor: const Color(0xFFFF8700),
                labelColor: const Color(0xFFFF8700),
                unselectedLabelColor: Colors.grey,
                tabs: const [
                  Tab(text: "Posts"),
                  Tab(text: "Watchlist"),
                  Tab(text: "Reviews"),
                ],
              ),
            ),
            pinned: true,
          ),
        ],
        body: TabBarView(
          controller: _tabController,
          children: [
            _buildPostsTab(),
            _buildGridTab(),
            const Center(
              child: Text(
                "Reviews Coming Soon",
                style: TextStyle(color: Colors.grey),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileHeader() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          CircleAvatar(
            radius: 50,
            backgroundImage: _userData!['userImage'] != null
                ? NetworkImage(_userData!['userImage'])
                : null,
            backgroundColor: const Color(0xFFFF8700),
            child: _userData!['userImage'] == null
                ? Text(
                    _userData!['username'][0],
                    style: const TextStyle(fontSize: 40, color: Colors.black),
                  )
                : null,
          ),
          const SizedBox(height: 16),
          if (_userData!['role'] == 'production_house')
            const Chip(
              label: Text("Official Studio"),
              avatar: Icon(Icons.verified, size: 16, color: Colors.yellow),
              backgroundColor: Colors.black,
            ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _statItem(
                "Followers",
                _userData!['followers']?.length ?? 0,
                '/users/${_userData!['_id']}/followers',
              ),
              _statItem(
                "Following",
                _userData!['following']?.length ?? 0,
                '/users/${_userData!['_id']}/following',
              ),
              _statItem("Posts", _userPosts.length, null),
            ],
          ),
        ],
      ),
    );
  }

  Widget _statItem(String label, int count, String? endpoint) {
    Widget content = Column(
      children: [
        Text(
          "$count",
          style: const TextStyle(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(label, style: const TextStyle(color: Colors.grey)),
      ],
    );

    if (endpoint == null) return content;

    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => UserListScreen(title: label, endpoint: endpoint),
          ),
        );
      },
      child: content,
    );
  }

  Widget _buildPostsTab() {
    if (_userPosts.isEmpty) {
      return const Center(
        child: Text("No posts yet", style: TextStyle(color: Colors.grey)),
      );
    }
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _userPosts.length,
      itemBuilder: (ctx, index) => Padding(
        padding: const EdgeInsets.only(bottom: 16.0),
        child: PostCard(post: _userPosts[index]),
      ),
    );
  }

  Widget _buildGridTab() {
    if (_watchlist.isEmpty) {
      return const Center(
        child: Text("Watchlist is empty", style: TextStyle(color: Colors.grey)),
      );
    }
    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        childAspectRatio: 0.7,
        crossAxisSpacing: 10,
        mainAxisSpacing: 10,
      ),
      itemCount: _watchlist.length,
      itemBuilder: (ctx, index) {
        final movie = _watchlist[index];
        return ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: Image.network(
            "https://image.tmdb.org/t/p/w200${movie['posterPath']}",
            fit: BoxFit.cover,
            errorBuilder: (_, __, ___) => Container(
              color: Colors.grey[800],
              child: const Icon(Icons.movie, color: Colors.grey),
            ),
          ),
        );
      },
    );
  }
}

// Helper class for the sticky tab bar
class _SliverAppBarDelegate extends SliverPersistentHeaderDelegate {
  final TabBar _tabBar;
  _SliverAppBarDelegate(this._tabBar);

  @override
  double get minExtent => _tabBar.preferredSize.height;

  @override
  double get maxExtent => _tabBar.preferredSize.height;

  @override
  Widget build(
    BuildContext context,
    double shrinkOffset,
    bool overlapsContent,
  ) {
    return Container(color: const Color(0xFF111827), child: _tabBar);
  }

  @override
  bool shouldRebuild(_SliverAppBarDelegate oldDelegate) => false;
}
