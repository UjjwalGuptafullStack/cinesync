import 'user.dart';

class Post {
  final String id;
  final User author;
  final String content;
  final String? image;
  final List<String> likes;
  final List<Comment> comments;
  final DateTime createdAt;
  final DateTime updatedAt;

  Post({
    required this.id,
    required this.author,
    required this.content,
    this.image,
    this.likes = const [],
    this.comments = const [],
    required this.createdAt,
    required this.updatedAt,
  });

  // From JSON
  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
      id: json['_id'] ?? json['id'] ?? '',
      author: User.fromJson(json['author'] ?? {}),
      content: json['content'] ?? '',
      image: json['image'],
      likes: List<String>.from(json['likes'] ?? []),
      comments: (json['comments'] as List<dynamic>?)
              ?.map((comment) => Comment.fromJson(comment))
              .toList() ??
          [],
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : DateTime.now(),
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'])
          : DateTime.now(),
    );
  }

  // To JSON
  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'author': author.toJson(),
      'content': content,
      'image': image,
      'likes': likes,
      'comments': comments.map((comment) => comment.toJson()).toList(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  // Helper getters
  int get likesCount => likes.length;
  int get commentsCount => comments.length;
  bool isLikedBy(String userId) => likes.contains(userId);
}

class Comment {
  final String id;
  final User author;
  final String text;
  final DateTime createdAt;

  Comment({
    required this.id,
    required this.author,
    required this.text,
    required this.createdAt,
  });

  factory Comment.fromJson(Map<String, dynamic> json) {
    return Comment(
      id: json['_id'] ?? json['id'] ?? '',
      author: User.fromJson(json['author'] ?? {}),
      text: json['text'] ?? '',
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'author': author.toJson(),
      'text': text,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
