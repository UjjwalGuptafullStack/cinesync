import 'api_service.dart';
import '../models/user.dart';
import '../utils/constants.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthService {
  final ApiService _apiService = ApiService();
  final _storage = const FlutterSecureStorage();

  // LOGIN
  Future<User> login(String email, String password) async {
    try {
      final response = await _apiService.post(
        ApiConstants.login,
        {
          'email': email,
          'password': password,
        },
      );

      // Save token and user info
      if (response['token'] != null) {
        await _apiService.saveToken(response['token']);
        await _storage.write(key: StorageKeys.userId, value: response['_id']);
        await _storage.write(key: StorageKeys.userEmail, value: response['email']);
        await _storage.write(key: StorageKeys.userName, value: response['username']);
      }

      return User.fromJson(response);
    } catch (e) {
      throw Exception('Login failed: $e');
    }
  }

  // REGISTER
  Future<User> register(String username, String email, String password) async {
    try {
      final response = await _apiService.post(
        ApiConstants.register,
        {
          'username': username,
          'email': email,
          'password': password,
        },
      );

      // Save token and user info
      if (response['token'] != null) {
        await _apiService.saveToken(response['token']);
        await _storage.write(key: StorageKeys.userId, value: response['_id']);
        await _storage.write(key: StorageKeys.userEmail, value: response['email']);
        await _storage.write(key: StorageKeys.userName, value: response['username']);
      }

      return User.fromJson(response);
    } catch (e) {
      throw Exception('Registration failed: $e');
    }
  }

  // LOGOUT
  Future<void> logout() async {
    await _apiService.deleteToken();
    await _storage.delete(key: StorageKeys.userId);
    await _storage.delete(key: StorageKeys.userEmail);
    await _storage.delete(key: StorageKeys.userName);
  }

  // CHECK IF LOGGED IN
  Future<bool> isLoggedIn() async {
    final token = await _apiService.getToken();
    return token != null;
  }

  // GET CURRENT USER
  Future<User?> getCurrentUser() async {
    try {
      final response = await _apiService.get(ApiConstants.getProfile);
      return User.fromJson(response);
    } catch (e) {
      return null;
    }
  }
}
