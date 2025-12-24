import 'package:flutter/material.dart';
import '../services/api_service.dart';

class NetworkCarousel extends StatelessWidget {
  final List<dynamic> users;
  const NetworkCarousel({super.key, required this.users});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1F2937),
        borderRadius: BorderRadius.circular(16),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'People You May Know',
            style: TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          SizedBox(
            height: 140,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: users.length,
              separatorBuilder: (_, __) => const SizedBox(width: 12),
              itemBuilder: (context, index) {
                final user = users[index];
                return _buildUserCard(user, context);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildUserCard(dynamic user, BuildContext context) {
    return Container(
      width: 120,
      decoration: BoxDecoration(
        color: const Color(0xFF374151),
        borderRadius: BorderRadius.circular(12),
      ),
      padding: const EdgeInsets.all(12),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CircleAvatar(
            radius: 30,
            backgroundImage: user['userImage'] != null
                ? NetworkImage(user['userImage'])
                : null,
            backgroundColor: Colors.grey[700],
            child: user['userImage'] == null
                ? Text(
                    (user['username'] ?? 'U')[0].toUpperCase(),
                    style: const TextStyle(color: Colors.white, fontSize: 24),
                  )
                : null,
          ),
          const SizedBox(height: 8),
          Text(
            user['username'] ?? 'Unknown',
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 12,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          ElevatedButton(
            onPressed: () async {
              try {
                final api = ApiService();
                await api.followUser(user['_id']);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Followed ${user['username']}'),
                    backgroundColor: Colors.green,
                    duration: const Duration(seconds: 1),
                  ),
                );
              } catch (e) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Follow failed: $e'),
                    backgroundColor: Colors.red,
                  ),
                );
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFFF8700),
              foregroundColor: Colors.black,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              minimumSize: const Size(0, 28),
              textStyle: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.bold,
              ),
            ),
            child: const Text('Follow'),
          ),
        ],
      ),
    );
  }
}
