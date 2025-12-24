import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'search_movie_screen.dart';
import '../services/api_service.dart';

class CreatePostScreen extends StatefulWidget {
  const CreatePostScreen({super.key});

  @override
  State<CreatePostScreen> createState() => _CreatePostScreenState();
}

class _CreatePostScreenState extends State<CreatePostScreen> {
  final _contentController = TextEditingController();
  final _api = ApiService();

  Map<String, dynamic>? _selectedMovie;
  File? _postImage;
  bool _isSpoiler = false;
  double _rating = 5.0;
  bool _isSubmitting = false;

  void _pickMovie() async {
    final movie = await Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => const SearchMovieScreen()),
    );
    if (movie != null) {
      setState(() => _selectedMovie = movie);
    }
  }

  void _pickImage() async {
    final picker = ImagePicker();
    final picked = await picker.pickImage(source: ImageSource.gallery);
    if (picked != null) {
      setState(() => _postImage = File(picked.path));
    }
  }

  void _submitPost() async {
    if (_contentController.text.isEmpty || _selectedMovie == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Pick a movie and write something!")),
      );
      return;
    }

    setState(() => _isSubmitting = true);
    try {
      await _api.createPostWithImage({
        'content': _contentController.text,
        'tmdbId': _selectedMovie!['id'].toString(),
        'mediaTitle': _selectedMovie!['title'],
        'posterPath': _selectedMovie!['poster_path'] ?? '',
        'rating': _rating.toString(),
        'isSpoiler': _isSpoiler.toString(),
      }, _postImage);
      if (mounted) {
        Navigator.pop(context);
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text("Post Created!")));
      }
    } catch (e) {
      if (mounted)
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text("Error: $e")));
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      appBar: AppBar(
        title: const Text("New Review"),
        backgroundColor: const Color(0xFF1F2937),
        actions: [
          TextButton(
            onPressed: _isSubmitting ? null : _submitPost,
            child: const Text(
              "POST",
              style: TextStyle(
                color: Color(0xFFFF8700),
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // MOVIE SELECTOR
            GestureDetector(
              onTap: _pickMovie,
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFF1F2937),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  children: [
                    if (_selectedMovie != null &&
                        _selectedMovie!['poster_path'] != null)
                      Image.network(
                        "https://image.tmdb.org/t/p/w92${_selectedMovie!['poster_path']}",
                        height: 60,
                      ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        _selectedMovie == null
                            ? "Select a Movie..."
                            : _selectedMovie!['title'],
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const Icon(
                      Icons.arrow_forward_ios,
                      color: Colors.grey,
                      size: 16,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // IMAGE PICKER
            GestureDetector(
              onTap: _pickImage,
              child: Container(
                height: 150,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: const Color(0xFF1F2937),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: _postImage != null
                    ? ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.file(_postImage!, fit: BoxFit.cover),
                      )
                    : const Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.add_a_photo, color: Colors.grey, size: 40),
                          SizedBox(height: 8),
                          Text(
                            "Add Photo (Optional)",
                            style: TextStyle(color: Colors.grey),
                          ),
                        ],
                      ),
              ),
            ),
            const SizedBox(height: 20),

            // TEXT INPUT
            TextField(
              controller: _contentController,
              maxLines: 5,
              style: const TextStyle(color: Colors.white),
              decoration: const InputDecoration(
                hintText: "What did you think of the movie?",
                hintStyle: TextStyle(color: Colors.grey),
                filled: true,
                fillColor: Color(0xFF1F2937),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.all(Radius.circular(12)),
                ),
              ),
            ),
            const SizedBox(height: 20),

            // RATING
            const Text("Rating", style: TextStyle(color: Colors.grey)),
            Slider(
              value: _rating,
              min: 1,
              max: 10,
              divisions: 9,
              activeColor: const Color(0xFFFF8700),
              label: _rating.toString(),
              onChanged: (val) => setState(() => _rating = val),
            ),

            // SPOILER TOGGLE
            SwitchListTile(
              title: const Text(
                "Contains Spoilers?",
                style: TextStyle(color: Colors.white),
              ),
              value: _isSpoiler,
              activeColor: Colors.red,
              onChanged: (val) => setState(() => _isSpoiler = val),
            ),
          ],
        ),
      ),
    );
  }
}
