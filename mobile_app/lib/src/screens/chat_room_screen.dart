import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:image_picker/image_picker.dart';
import '../services/api_service.dart';
import '../models/message.dart';
import '../utils/constants.dart';

class ChatRoomScreen extends StatefulWidget {
  final String receiverId;
  final String receiverName;

  const ChatRoomScreen({
    super.key,
    required this.receiverId,
    required this.receiverName,
  });

  @override
  State<ChatRoomScreen> createState() => _ChatRoomScreenState();
}

class _ChatRoomScreenState extends State<ChatRoomScreen> {
  final TextEditingController _msgController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final ApiService _api = ApiService();
  late IO.Socket socket;

  List<Message> _messages = [];
  bool _isLoading = true;
  String? _currentUserId;

  @override
  void initState() {
    super.initState();
    _initChat();
  }

  Future<void> _initChat() async {
    await _getCurrentUserId();
    _connectSocket();
    _loadMessages();
  }

  Future<void> _getCurrentUserId() async {
    try {
      final userData = await _api.get('/users/me');
      _currentUserId = userData['_id'];
    } catch (e) {
      print("Error getting current user: $e");
    }
  }

  void _connectSocket() {
    // Use localhost for ADB reverse
    socket = IO.io('http://localhost:5000', <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': false,
    });

    socket.connect();

    socket.on('connect', (_) {
      print('Connected to socket server');
      if (_currentUserId != null) {
        socket.emit('setup', _currentUserId);
      }
    });

    socket.on('message received', (data) {
      if (mounted) {
        setState(() {
          _messages.add(Message.fromJson(data));
        });
        _scrollToBottom();
      }
    });

    socket.on('disconnect', (_) {
      print('Disconnected from socket server');
    });
  }

  void _loadMessages() async {
    try {
      final msgs = await _api.getMessages(widget.receiverId);
      setState(() {
        _messages = msgs;
        _isLoading = false;
      });
      _scrollToBottom();
    } catch (e) {
      print("Load messages error: $e");
      setState(() => _isLoading = false);
    }
  }

  void _sendMessage() async {
    if (_msgController.text.isEmpty) return;

    final content = _msgController.text;
    _msgController.clear();

    try {
      final newMessage = await _api.sendMessage(widget.receiverId, content);

      socket.emit('new message', {
        '_id': newMessage.id,
        'sender': _currentUserId,
        'receiver': widget.receiverId,
        'content': content,
        'createdAt': DateTime.now().toIso8601String(),
      });

      setState(() {
        _messages.add(newMessage);
      });
      _scrollToBottom();
    } catch (e) {
      print("Send error: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Failed to send message"),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  void _pickImage() async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: ImageSource.gallery);

    if (image != null) {
      // TODO: Implement image upload to backend
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Image upload coming soon!")),
      );
    }
  }

  void _scrollToBottom() {
    Future.delayed(const Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  void dispose() {
    socket.disconnect();
    socket.dispose();
    _msgController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      appBar: AppBar(
        title: Text(widget.receiverName),
        backgroundColor: const Color(0xFF1F2937),
      ),
      body: Column(
        children: [
          Expanded(
            child: _isLoading
                ? const Center(
                    child: CircularProgressIndicator(color: Color(0xFFFF8700)),
                  )
                : _messages.isEmpty
                ? const Center(
                    child: Text(
                      "No messages yet. Say hi! 👋",
                      style: TextStyle(color: Colors.grey),
                    ),
                  )
                : ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.all(16),
                    itemCount: _messages.length,
                    itemBuilder: (context, index) {
                      final msg = _messages[index];
                      final isMe = msg.senderId == _currentUserId;
                      return Align(
                        alignment: isMe
                            ? Alignment.centerRight
                            : Alignment.centerLeft,
                        child: Container(
                          margin: const EdgeInsets.symmetric(vertical: 4),
                          padding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 10,
                          ),
                          constraints: BoxConstraints(
                            maxWidth: MediaQuery.of(context).size.width * 0.7,
                          ),
                          decoration: BoxDecoration(
                            color: isMe
                                ? const Color(0xFFFF8700)
                                : const Color(0xFF374151),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Text(
                            msg.content,
                            style: TextStyle(
                              color: isMe ? Colors.black : Colors.white,
                              fontSize: 15,
                            ),
                          ),
                        ),
                      );
                    },
                  ),
          ),
          _buildInputArea(),
        ],
      ),
    );
  }

  Widget _buildInputArea() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
      decoration: const BoxDecoration(
        color: Color(0xFF1F2937),
        boxShadow: [
          BoxShadow(
            color: Colors.black26,
            blurRadius: 4,
            offset: Offset(0, -2),
          ),
        ],
      ),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.photo, color: Colors.grey),
            onPressed: _pickImage,
          ),
          Expanded(
            child: TextField(
              controller: _msgController,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: "Type a message...",
                hintStyle: const TextStyle(color: Colors.grey),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(24),
                  borderSide: BorderSide.none,
                ),
                filled: true,
                fillColor: const Color(0xFF374151),
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 10,
                ),
              ),
              onSubmitted: (_) => _sendMessage(),
            ),
          ),
          const SizedBox(width: 8),
          IconButton(
            icon: const Icon(Icons.send, color: Color(0xFFFF8700)),
            onPressed: _sendMessage,
          ),
        ],
      ),
    );
  }
}
