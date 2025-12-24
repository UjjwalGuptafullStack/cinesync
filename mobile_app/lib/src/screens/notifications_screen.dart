import 'package:flutter/material.dart';
import '../services/api_service.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  final ApiService _api = ApiService();

  Future<List<dynamic>> _fetchNotifications() async {
    try {
      final data = await _api.get('/notifications');
      return data as List<dynamic>;
    } catch (e) {
      print("Notifications Error: $e");
      return [];
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      appBar: AppBar(
        title: const Text("Notifications"),
        backgroundColor: const Color(0xFF1F2937),
      ),
      body: FutureBuilder<List<dynamic>>(
        future: _fetchNotifications(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(
              child: CircularProgressIndicator(color: Color(0xFFFF8700)),
            );
          }
          if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(
              child: Text(
                "No new notifications",
                style: TextStyle(color: Colors.grey),
              ),
            );
          }

          return ListView.separated(
            itemCount: snapshot.data!.length,
            separatorBuilder: (_, __) =>
                const Divider(color: Colors.grey, height: 1),
            itemBuilder: (context, index) {
              final notif = snapshot.data![index];
              return ListTile(
                leading: Icon(
                  _getIconForType(notif['type']),
                  color: _getColorForType(notif['type']),
                ),
                title: Text(
                  notif['text'] ?? "New activity",
                  style: const TextStyle(color: Colors.white),
                ),
                subtitle: Text(
                  _formatTime(notif['createdAt']),
                  style: const TextStyle(color: Colors.grey, fontSize: 12),
                ),
                tileColor: const Color(0xFF111827),
              );
            },
          );
        },
      ),
    );
  }

  IconData _getIconForType(String? type) {
    switch (type) {
      case 'like':
        return Icons.favorite;
      case 'comment':
        return Icons.comment;
      case 'follow':
        return Icons.person_add;
      default:
        return Icons.notifications;
    }
  }

  Color _getColorForType(String? type) {
    switch (type) {
      case 'like':
        return Colors.red;
      case 'comment':
        return Colors.blue;
      case 'follow':
        return const Color(0xFFFF8700);
      default:
        return Colors.grey;
    }
  }

  String _formatTime(String? timestamp) {
    if (timestamp == null) return "";
    try {
      final dateTime = DateTime.parse(timestamp);
      final now = DateTime.now();
      final difference = now.difference(dateTime);

      if (difference.inDays > 7) {
        return "${dateTime.month}/${dateTime.day}/${dateTime.year}";
      } else if (difference.inDays > 0) {
        return "${difference.inDays}d ago";
      } else if (difference.inHours > 0) {
        return "${difference.inHours}h ago";
      } else if (difference.inMinutes > 0) {
        return "${difference.inMinutes}m ago";
      } else {
        return "Just now";
      }
    } catch (e) {
      return "";
    }
  }
}
