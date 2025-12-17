import 'user.dart';

class Post {
  final String id;
  final String content;
  final String? posterPath;
  final String? userImage;
  final String username;
  final String? mediaTitle;
  final int? season;
  final int? episode;
  final String createdAt;
  final User author;
  final String? image;
  final List<String> likes;
  final List<Comment> comments;
  final DateTime updatedAt;

  Post({
    required this.id,
    required this.content,
    this.posterPath,
    this.userImage,
    required this.username,
    this.mediaTitle,
    this.season,
    this.episode,
    required this.createdAt,
    required this.author,
    this.image,
    this.likes = const [],
    this.comments = const [],
    required this.updatedAt,
  });

  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
      id: json['_id'] ?? json['id'] ?? '',
      content: json['content'] ?? '',
      posterPath: json['posterPath'],
      userImage: json['user']?['userImage'] ?? json['userImage'],
      username:
          json['user']?['username'] ?? json['author']?['username'] ?? "Unknown",
      mediaTitle: json['mediaTitle'],
      season: json['season'],
      episode: json['episode'],
      createdAt: json['createdAt'] ?? DateTime.now().toIso8601String(),
      author: User.fromJson(json['author'] ?? json['user'] ?? {}),
      image: json['image'],
      likes: List<String>.from(json['likes'] ?? []),
      comments:
          (json['comments'] as List<dynamic>?)
              ?.map((comment) => Comment.fromJson(comment))
              .toList() ??
          [],
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
      'createdAt': createdAt,
      'updatedAt': updatedAt.toIso8601String(),
      'posterPath': posterPath,
      'mediaTitle': mediaTitle,
      'season': season,
      'episode': episode,
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
