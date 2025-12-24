import 'package:flutter/material.dart';
import '../services/api_service.dart';

class SearchMovieScreen extends StatefulWidget {
  const SearchMovieScreen({super.key});

  @override
  State<SearchMovieScreen> createState() => _SearchMovieScreenState();
}

class _SearchMovieScreenState extends State<SearchMovieScreen> {
  final _controller = TextEditingController();
  final _api = ApiService();
  List<dynamic> _movies = [];
  bool _isLoading = false;

  void _search(String query) async {
    if (query.isEmpty) return;
    setState(() => _isLoading = true);
    try {
      // GET /tmdb/search?query=Avatar
      final res = await _api.get('/tmdb/search?query=$query');
      setState(() => _movies = res);
    } catch (e) {
      print(e);
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1F2937),
        title: TextField(
          controller: _controller,
          style: const TextStyle(color: Colors.white),
          decoration: const InputDecoration(
            hintText: "Search TMDB...",
            border: InputBorder.none,
            hintStyle: TextStyle(color: Colors.grey),
          ),
          onSubmitted: _search,
        ),
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(color: Color(0xFFFF8700)),
            )
          : ListView.builder(
              itemCount: _movies.length,
              itemBuilder: (ctx, i) {
                final m = _movies[i];
                return ListTile(
                  leading: m['poster_path'] != null
                      ? Image.network(
                          "https://image.tmdb.org/t/p/w92${m['poster_path']}",
                        )
                      : const Icon(Icons.movie, color: Colors.grey),
                  title: Text(
                    m['title'] ?? "Unknown",
                    style: const TextStyle(color: Colors.white),
                  ),
                  subtitle: Text(
                    m['release_date']?.substring(0, 4) ?? "N/A",
                    style: const TextStyle(color: Colors.grey),
                  ),
                  onTap: () {
                    // Return the selected movie to the previous screen
                    Navigator.pop(context, m);
                  },
                );
              },
            ),
    );
  }
}
