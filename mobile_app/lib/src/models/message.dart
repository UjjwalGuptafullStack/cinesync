class Message {
  final String id;
  final String content;
  final String senderId;
  final String? image;
  final String createdAt;

  Message({
    required this.id,
    required this.content,
    required this.senderId,
    this.image,
    required this.createdAt,
  });

  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      id: json['_id'],
      content: json['content'] ?? "",
      senderId: json['sender'] is Map ? json['sender']['_id'] : json['sender'],
      image: json['image'],
      createdAt: json['createdAt'],
    );
  }
}
