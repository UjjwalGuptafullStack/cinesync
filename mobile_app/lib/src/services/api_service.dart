import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../utils/constants.dart';

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
}
