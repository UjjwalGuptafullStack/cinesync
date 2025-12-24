import 'package:flutter/material.dart';
import '../services/api_service.dart';

class ExploreScreen extends StatefulWidget {
  const ExploreScreen({super.key});

  @override
  State<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends State<ExploreScreen> {
  final _searchController = TextEditingController();
  final _apiService = ApiService();

  List<dynamic> _results = [];
  bool _isLoading = false;
  String? _error;

  void _onSearchChanged(String query) async {
    if (query.isEmpty) {
      setState(() => _results = []);
      return;
    }

    setState(() => _isLoading = true);

    try {
      final users = await _apiService.searchUsers(query);
      setState(() {
        _results = users;
        _isLoading = false;
        _error = null;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
        _error = "Failed to find users";
      });
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      appBar: AppBar(
        backgroundColor: const Color(0xFF111827),
        elevation: 0,
        title: TextField(
          controller: _searchController,
          onChanged: _onSearchChanged,
          style: const TextStyle(color: Colors.white),
          decoration: InputDecoration(
            hintText: "Search for people...",
            hintStyle: TextStyle(color: Colors.grey[400]),
            border: InputBorder.none,
            icon: const Icon(Icons.search, color: Colors.grey),
          ),
        ),
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return const Center(
        child: CircularProgressIndicator(color: Color(0xFFFF8700)),
      );
    }

    if (_error != null) {
      return Center(
        child: Text(_error!, style: const TextStyle(color: Colors.red)),
      );
    }

    if (_results.isEmpty && _searchController.text.isNotEmpty) {
      return const Center(
        child: Text("No users found.", style: TextStyle(color: Colors.grey)),
      );
    }

    if (_results.isEmpty) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.people_outline, size: 64, color: Colors.grey),
            SizedBox(height: 16),
            Text(
              "Find your friends on CineSync",
              style: TextStyle(color: Colors.grey),
            ),
          ],
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: _results.length,
      separatorBuilder: (_, __) => const SizedBox(height: 16),
      itemBuilder: (context, index) {
        final user = _results[index];
        return ListTile(
          contentPadding: EdgeInsets.zero,
          leading: CircleAvatar(
            backgroundImage:
                user['userImage'] != null && user['userImage'].isNotEmpty
                ? NetworkImage(user['userImage'])
                : null,
            backgroundColor: const Color(0xFFFF8700),
            child: user['userImage'] == null || user['userImage'].isEmpty
                ? Text(
                    user['username'][0].toUpperCase(),
                    style: const TextStyle(color: Colors.black),
                  )
                : null,
          ),
          title: Text(
            user['username'],
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
          subtitle: Text(
            user['email'] ?? "CineSync User",
            style: TextStyle(color: Colors.grey[400], fontSize: 12),
          ),
          trailing: ElevatedButton(
            onPressed: () {
              _apiService.followUser(user['_id']);
              ScaffoldMessenger.of(
                context,
              ).showSnackBar(const SnackBar(content: Text("Followed!")));
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF1F2937),
              side: const BorderSide(color: Color(0xFFFF8700)),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
            ),
            child: const Text(
              "Follow",
              style: TextStyle(color: Colors.white, fontSize: 12),
            ),
          ),
        );
      },
    );
  }
}
