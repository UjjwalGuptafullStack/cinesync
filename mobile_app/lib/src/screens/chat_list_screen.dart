import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'chat_room_screen.dart';

class ChatListScreen extends StatefulWidget {
  const ChatListScreen({super.key});

  @override
  State<ChatListScreen> createState() => _ChatListScreenState();
}

class _ChatListScreenState extends State<ChatListScreen> {
  final ApiService _api = ApiService();
  List<dynamic> _conversations = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadChats();
  }

  void _loadChats() async {
    try {
      final data = await _api.get('/messages/conversations');
      setState(() {
        _conversations = data;
        _isLoading = false;
      });
    } catch (e) {
      print("Chat List Error: $e");
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      appBar: AppBar(
        title: const Text("Messages"),
        backgroundColor: const Color(0xFF1F2937),
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(color: Color(0xFFFF8700)),
            )
          : _conversations.isEmpty
          ? const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.chat_bubble_outline, size: 64, color: Colors.grey),
                  SizedBox(height: 16),
                  Text(
                    "No conversations yet",
                    style: TextStyle(color: Colors.grey),
                  ),
                ],
              ),
            )
          : ListView.separated(
              itemCount: _conversations.length,
              separatorBuilder: (_, __) =>
                  const Divider(color: Colors.grey, height: 1),
              itemBuilder: (context, index) {
                final chat = _conversations[index];
                final user = chat['otherUser'];

                return ListTile(
                  leading: CircleAvatar(
                    backgroundImage:
                        user['userImage'] != null &&
                            user['userImage'].isNotEmpty
                        ? NetworkImage(user['userImage'])
                        : null,
                    backgroundColor: const Color(0xFFFF8700),
                    child:
                        user['userImage'] == null || user['userImage'].isEmpty
                        ? Text(user['username'][0].toUpperCase())
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
                    chat['lastMessage'] ?? "Start chatting",
                    style: const TextStyle(color: Colors.grey),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => ChatRoomScreen(
                          receiverId: user['_id'],
                          receiverName: user['username'],
                        ),
                      ),
                    );
                  },
                );
              },
            ),
    );
  }
}
