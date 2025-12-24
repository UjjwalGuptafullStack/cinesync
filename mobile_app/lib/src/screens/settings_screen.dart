import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../services/api_service.dart';
import 'login_screen.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  final ApiService _api = ApiService();
  File? _imageFile;
  bool _isUploading = false;
  bool _isPrivate = false;
  bool _isLoadingSettings = true;

  @override
  void initState() {
    super.initState();
    _loadUserSettings();
  }

  Future<void> _loadUserSettings() async {
    try {
      final userData = await _api.get('/users/me');
      setState(() {
        _isPrivate = userData['isPrivate'] ?? false;
        _isLoadingSettings = false;
      });
    } catch (e) {
      print('Error loading settings: $e');
      setState(() => _isLoadingSettings = false);
    }
  }

  Future<void> _togglePrivacy(bool value) async {
    setState(() => _isPrivate = value);
    try {
      await _api.updateUserProfile({'isPrivate': value});
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              value ? "Account is now private" : "Account is now public",
            ),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      setState(() => _isPrivate = !value); // Revert on error
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Update failed: $e"),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  Future<void> _pickAndUploadImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);

    if (pickedFile != null) {
      setState(() {
        _imageFile = File(pickedFile.path);
        _isUploading = true;
      });

      try {
        // Backend (MERN) will handle the Cloudinary upload
        await _api.uploadProfileImage(_imageFile!);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text("Profile Image Updated!"),
              backgroundColor: Colors.green,
            ),
          );
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text("Upload Failed: $e"),
              backgroundColor: Colors.red,
            ),
          );
        }
      } finally {
        if (mounted) setState(() => _isUploading = false);
      }
    }
  }

  void _logout() async {
    await _api.logout(); // Clear token
    if (mounted) {
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (_) => const LoginScreen()),
        (route) => false,
      );
    }
  }

  Future<void> _deleteAccount() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1F2937),
        title: const Text(
          'Delete Account',
          style: TextStyle(color: Colors.red),
        ),
        content: const Text(
          'Are you sure you want to delete your account? This action cannot be undone. All your posts and connections will be permanently removed.',
          style: TextStyle(color: Colors.white),
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
        await _api.deleteAccount();
        if (mounted) {
          Navigator.pushAndRemoveUntil(
            context,
            MaterialPageRoute(builder: (_) => const LoginScreen()),
            (route) => false,
          );
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text("Account deleted successfully"),
              backgroundColor: Colors.green,
            ),
          );
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text("Delete failed: $e"),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      appBar: AppBar(
        title: const Text("Settings"),
        backgroundColor: const Color(0xFF1F2937),
      ),
      body: _isLoadingSettings
          ? const Center(
              child: CircularProgressIndicator(color: Color(0xFFFF8700)),
            )
          : ListView(
              padding: const EdgeInsets.all(16),
              children: [
                // Profile Pic Upload
                Center(
                  child: GestureDetector(
                    onTap: _pickAndUploadImage,
                    child: CircleAvatar(
                      radius: 50,
                      backgroundColor: const Color(0xFF1F2937),
                      backgroundImage: _imageFile != null
                          ? FileImage(_imageFile!)
                          : null,
                      child: _isUploading
                          ? const CircularProgressIndicator(
                              color: Color(0xFFFF8700),
                            )
                          : (_imageFile == null
                                ? const Icon(
                                    Icons.camera_alt,
                                    size: 30,
                                    color: Colors.grey,
                                  )
                                : null),
                    ),
                  ),
                ),
                const SizedBox(height: 10),
                const Center(
                  child: Text(
                    "Tap to change profile picture",
                    style: TextStyle(color: Colors.grey, fontSize: 14),
                  ),
                ),

                const Divider(color: Colors.grey, height: 40),

                // PRIVACY TOGGLE
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1F2937),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              "Private Account",
                              style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                            const SizedBox(height: 4),
                            const Text(
                              "Only followers can see your posts and watchlist",
                              style: TextStyle(
                                color: Colors.grey,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Switch(
                        value: _isPrivate,
                        onChanged: _togglePrivacy,
                        activeColor: const Color(0xFFFF8700),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 16),

                ListTile(
                  leading: const Icon(Icons.logout, color: Colors.red),
                  title: const Text(
                    "Log Out",
                    style: TextStyle(color: Colors.red, fontSize: 16),
                  ),
                  onTap: _logout,
                ),

                const Divider(color: Colors.red, height: 40, thickness: 0.5),

                // DANGER ZONE
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 8),
                  child: Text(
                    "Danger Zone",
                    style: TextStyle(
                      color: Colors.red,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const Text(
                  "Once you delete your account, there is no going back. All your posts and connections will be removed.",
                  style: TextStyle(color: Colors.grey, fontSize: 12),
                ),
                const SizedBox(height: 16),
                OutlinedButton.icon(
                  onPressed: _deleteAccount,
                  icon: const Icon(Icons.delete_forever, color: Colors.red),
                  label: const Text(
                    "Delete Account",
                    style: TextStyle(color: Colors.red),
                  ),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: Colors.red),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 12,
                    ),
                  ),
                ),
              ],
            ),
    );
  }
}
