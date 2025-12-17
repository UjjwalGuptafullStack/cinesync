import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../utils/constants.dart';
import '../models/user.dart';
import '../models/post.dart';
import '../models/message.dart';

class ApiService {
  final _storage = const FlutterSecureStorage();

  // GET Token from storage
  Future<String?> getToken() async {
    return await _storage.read(key: StorageKeys.jwtToken);
  }

  // SAVE Token to storage
  Future<void> saveToken(String token) async {
    await _storage.write(key: StorageKeys.jwtToken, value: token);
  }

  // DELETE Token from storage
  Future<void> deleteToken() async {
    await _storage.delete(key: StorageKeys.jwtToken);
  }

  // LOGIN FUNCTION
  Future<User> login(String email, String password) async {
    final url = Uri.parse('${ApiConstants.baseUrl}/users/login');

    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);

        // Create User Object
        User user = User.fromJson(data);

        // Save Token Securely
        await _storage.write(key: 'jwt_token', value: user.token);
        await _storage.write(key: 'user_data', value: jsonEncode(data));

        return user;
      } else {
        final errorData = jsonDecode(response.body);
        throw Exception(errorData['message'] ?? 'Login failed');
      }
    } catch (e) {
      throw Exception('Connection Error: $e');
    }
  }

  // GENERIC GET REQUEST
  Future<dynamic> get(String endpoint) async {
    final url = Uri.parse('${ApiConstants.baseUrl}$endpoint');
    final token = await getToken();

    try {
      final response = await http.get(
        url,
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      );

      return _handleResponse(response);
    } catch (e) {
      throw Exception('Network Error: $e');
    }
  }

  // GENERIC POST REQUEST
  Future<dynamic> post(String endpoint, Map<String, dynamic> data) async {
    final url = Uri.parse('${ApiConstants.baseUrl}$endpoint');
    final token = await getToken();

    try {
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: jsonEncode(data),
      );

      return _handleResponse(response);
    } catch (e) {
      throw Exception('Network Error: $e');
    }
  }

  // GENERIC PUT REQUEST
  Future<dynamic> put(String endpoint, Map<String, dynamic> data) async {
    final url = Uri.parse('${ApiConstants.baseUrl}$endpoint');
    final token = await getToken();

    try {
      final response = await http.put(
        url,
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: jsonEncode(data),
      );

      return _handleResponse(response);
    } catch (e) {
      throw Exception('Network Error: $e');
    }
  }

  // GENERIC DELETE REQUEST
  Future<dynamic> delete(String endpoint) async {
    final url = Uri.parse('${ApiConstants.baseUrl}$endpoint');
    final token = await getToken();

    try {
      final response = await http.delete(
        url,
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      );

      return _handleResponse(response);
    } catch (e) {
      throw Exception('Network Error: $e');
    }
  }

  // RESPONSE HANDLER
  dynamic _handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      if (response.body.isEmpty) {
        return null;
      }
      return jsonDecode(response.body);
    } else if (response.statusCode == 400) {
      final error = jsonDecode(response.body);
      throw Exception(error['message'] ?? 'Bad Request');
    } else if (response.statusCode == 401) {
      throw Exception('Unauthorized - Please login again');
    } else if (response.statusCode == 403) {
      final error = jsonDecode(response.body);
      throw Exception(error['message'] ?? 'Forbidden');
    } else if (response.statusCode == 404) {
      throw Exception('Resource not found');
    } else if (response.statusCode >= 500) {
      throw Exception('Server Error - Please try again later');
    } else {
      throw Exception('Error: ${response.statusCode}');
    }
  }

  // --- FEED ---
  Future<List<Post>> getFeed() async {
    final response = await get('/posts');
    return (response as List).map((p) => Post.fromJson(p)).toList();
  }

  // --- CHAT ---
  Future<List<Message>> getMessages(String receiverId) async {
    final response = await get('/messages/$receiverId');
    return (response as List).map((m) => Message.fromJson(m)).toList();
  }

  Future<Message> sendMessage(
    String receiverId,
    String content, {
    String? imagePath,
  }) async {
    final response = await post('/messages/send', {
      'receiverId': receiverId,
      'content': content,
      'image': imagePath,
    });
    return Message.fromJson(response);
  }
}
