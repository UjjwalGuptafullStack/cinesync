class User {
  final String id;
  final String username;
  final String email;
  final String? userImage;
  final String? bio;
  final String role;
  final bool isClaimed;
  final int followersCount;
  final int followingCount;
  final DateTime createdAt;

  User({
    required this.id,
    required this.username,
    required this.email,
    this.userImage,
    this.bio,
    this.role = 'user',
    this.isClaimed = true,
    this.followersCount = 0,
    this.followingCount = 0,
    required this.createdAt,
  });

  // From JSON
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['_id'] ?? json['id'] ?? '',
      username: json['username'] ?? '',
      email: json['email'] ?? '',
      userImage: json['userImage'],
      bio: json['bio'],
      role: json['role'] ?? 'user',
      isClaimed: json['isClaimed'] ?? true,
      followersCount: json['followersCount'] ?? 0,
      followingCount: json['followingCount'] ?? 0,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : DateTime.now(),
    );
  }

  // To JSON
  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'username': username,
      'email': email,
      'userImage': userImage,
      'bio': bio,
      'role': role,
      'isClaimed': isClaimed,
      'followersCount': followersCount,
      'followingCount': followingCount,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  // Copy with
  User copyWith({
    String? id,
    String? username,
    String? email,
    String? userImage,
    String? bio,
    String? role,
    bool? isClaimed,
    int? followersCount,
    int? followingCount,
    DateTime? createdAt,
  }) {
    return User(
      id: id ?? this.id,
      username: username ?? this.username,
      email: email ?? this.email,
      userImage: userImage ?? this.userImage,
      bio: bio ?? this.bio,
      role: role ?? this.role,
      isClaimed: isClaimed ?? this.isClaimed,
      followersCount: followersCount ?? this.followersCount,
      followingCount: followingCount ?? this.followingCount,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}
