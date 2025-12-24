import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:share_plus/share_plus.dart';
import '../models/post.dart';
import '../services/api_service.dart';
import 'comments_sheet.dart';

class PostCard extends StatefulWidget {
  final Post post;
  const PostCard({super.key, required this.post});

  @override
  State<PostCard> createState() => _PostCardState();
}

class _PostCardState extends State<PostCard> {
  final ApiService _api = ApiService();
  bool isLiked = false;
  bool isDisliked = false;
  int likeCount = 0;
  int dislikeCount = 0;
  String? _currentUserId;

  @override
  void initState() {
    super.initState();
    _loadCurrentUser();
  }

  Future<void> _loadCurrentUser() async {
    try {
      final userData = await _api.get('/users/me');
      setState(() {
        _currentUserId = userData['_id'];
      });
    } catch (e) {
      print('Error loading current user: $e');
    }
  }

  void _toggleLike() {
    setState(() {
      if (isDisliked) {
        isDisliked = false;
        dislikeCount--;
      }
      isLiked = !isLiked;
      likeCount += isLiked ? 1 : -1;
    });
    _api.likePost(widget.post.id);
  }

  void _toggleDislike() {
    setState(() {
      if (isLiked) {
        isLiked = false;
        likeCount--;
      }
      isDisliked = !isDisliked;
      dislikeCount += isDisliked ? 1 : -1;
    });
    // TODO: Add dislikePost API endpoint if backend supports it
  }

  void _deletePost() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1F2937),
        title: const Text('Delete Post', style: TextStyle(color: Colors.white)),
        content: const Text(
          'Are you sure you want to delete this post?',
          style: TextStyle(color: Colors.grey),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel', style: TextStyle(color: Colors.grey)),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Delete', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );

    if (confirm == true) {
      try {
        await _api.delete('/posts/${widget.post.id}');
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Post deleted'),
              backgroundColor: Colors.green,
            ),
          );
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Delete failed: $e'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    }
  }

  void _openComments() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => CommentsSheet(postId: widget.post.id),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1F2937),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 1. Header (User Info)
          Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                CircleAvatar(
                  backgroundImage: widget.post.userImage != null
                      ? NetworkImage(widget.post.userImage!)
                      : null,
                  backgroundColor: Colors.grey[800],
                  child: widget.post.userImage == null
                      ? Text(widget.post.username[0])
                      : null,
                ),
                const SizedBox(width: 10),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      widget.post.username,
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    if (widget.post.mediaTitle != null)
                      Text(
                        widget.post.mediaTitle!,
                        style: const TextStyle(
                          color: Color(0xFFFF8700),
                          fontSize: 12,
                        ),
                      ),
                  ],
                ),
              ],
            ),
          ),

          // 2. Main Image
          if (widget.post.posterPath != null)
            Image.network(
              "https://image.tmdb.org/t/p/w500${widget.post.posterPath}",
              width: double.infinity,
              height: 350,
              fit: BoxFit.cover,
            ),

          // 3. Action Bar (Like, Dislike, Comment, Delete, Share)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            child: Row(
              children: [
                // LIKE BUTTON
                IconButton(
                  icon: Icon(
                    isLiked
                        ? FontAwesomeIcons.solidHeart
                        : FontAwesomeIcons.heart,
                    color: isLiked ? Colors.red : Colors.white,
                  ),
                  onPressed: _toggleLike,
                ),
                Text("$likeCount", style: const TextStyle(color: Colors.white)),

                const SizedBox(width: 16),

                // DISLIKE BUTTON
                IconButton(
                  icon: Icon(
                    isDisliked
                        ? FontAwesomeIcons.solidThumbsDown
                        : FontAwesomeIcons.thumbsDown,
                    color: isDisliked ? const Color(0xFFFF8700) : Colors.white,
                  ),
                  onPressed: _toggleDislike,
                ),
                Text(
                  "$dislikeCount",
                  style: const TextStyle(color: Colors.white),
                ),

                const SizedBox(width: 16),

                // COMMENT BUTTON
                IconButton(
                  icon: const Icon(
                    FontAwesomeIcons.comment,
                    color: Colors.white,
                  ),
                  onPressed: _openComments,
                ),

                const Spacer(),

                // DELETE BUTTON (Only for post owner)
                if (_currentUserId != null &&
                    _currentUserId == widget.post.author.id)
                  IconButton(
                    icon: const Icon(
                      FontAwesomeIcons.trash,
                      color: Colors.red,
                      size: 18,
                    ),
                    onPressed: _deletePost,
                  ),

                // SHARE BUTTON
                IconButton(
                  icon: const Icon(
                    FontAwesomeIcons.paperPlane,
                    color: Colors.white,
                  ),
                  onPressed: () {
                    Share.share(
                      'Check out this review for ${widget.post.mediaTitle ?? "this movie"} on CineSync! https://cinesync.com/posts/${widget.post.id}',
                      subject: 'CineSync - ${widget.post.mediaTitle}',
                    );
                  },
                ),
              ],
            ),
          ),

          // 4. Content Text
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            child: Text(
              widget.post.content,
              style: const TextStyle(color: Colors.white70),
            ),
          ),
        ],
      ),
    );
  }
}
