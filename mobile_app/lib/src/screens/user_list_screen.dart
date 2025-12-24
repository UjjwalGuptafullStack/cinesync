import 'package:flutter/material.dart';
import '../services/api_service.dart';

class UserListScreen extends StatefulWidget {
  final String title;
  final String endpoint; // e.g., '/users/:id/followers'

  const UserListScreen({
    super.key,
    required this.title,
    required this.endpoint,
  });

  @override
  State<UserListScreen> createState() => _UserListScreenState();
}

class _UserListScreenState extends State<UserListScreen> {
  final ApiService _api = ApiService();

  Future<List<dynamic>> _fetchUsers() async {
    final data = await _api.get(widget.endpoint);
    return data as List<dynamic>;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      appBar: AppBar(
        title: Text(widget.title),
        backgroundColor: const Color(0xFF1F2937),
      ),
      body: FutureBuilder<List<dynamic>>(
        future: _fetchUsers(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(
              child: CircularProgressIndicator(color: Color(0xFFFF8700)),
            );
          }

          if (snapshot.hasError) {
            return Center(
              child: Text(
                "Error: ${snapshot.error}",
                style: const TextStyle(color: Colors.red),
              ),
            );
          }

          final users = snapshot.data ?? [];
          if (users.isEmpty) {
            return const Center(
              child: Text(
                "List is empty",
                style: TextStyle(color: Colors.grey, fontSize: 16),
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: users.length,
            itemBuilder: (ctx, i) {
              final user = users[i];
              return ListTile(
                leading: CircleAvatar(
                  backgroundImage: user['userImage'] != null
                      ? NetworkImage(user['userImage'])
                      : null,
                  backgroundColor: const Color(0xFF374151),
                  child: user['userImage'] == null
                      ? const Icon(Icons.person, color: Colors.grey)
                      : null,
                ),
                title: Text(
                  user['username'] ?? 'Unknown',
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                subtitle: user['email'] != null
                    ? Text(
                        user['email'],
                        style: const TextStyle(
                          color: Colors.grey,
                          fontSize: 12,
                        ),
                      )
                    : null,
              );
            },
          );
        },
      ),
    );
  }
}
