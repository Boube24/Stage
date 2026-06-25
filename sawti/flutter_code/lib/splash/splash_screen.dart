import 'package:flutter/material.dart';
import '../widgets/star_crescent_emblem.dart';
import '../widgets/city_skyline_silhouette.dart';
import '../auth/login_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  void _startTimer() {
    Future.delayed(const Duration(milliseconds: 2500), () {
      if (mounted) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => const LoginScreen()),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF0B0F19) : const Color(0xFFF1F5F9),
      body: Stack(
        children: [
          // Middle Branding Content
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const StarCrescentEmblem(size: 110),
                const SizedBox(height: 24),
                Text(
                  'SAWTI',
                  style: theme.textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.black,
                    color: const Color(0xFF006B3F), // Green
                    letterSpacing: 2,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'صوتي • الصوت الوطني للمواطن',
                  textDirection: TextDirection.rtl,
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: const Color(0xFFD4AF37), // Gold
                    fontFamily: 'serif',
                  ),
                ),
                const SizedBox(height: 12),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 40.0),
                  child: Text(
                    'Plateforme Intelligente de Gestion des Réclamations Citoyennes',
                    textAlign: TextAlign.center,
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: isDark ? Colors.slate.shade400 : Colors.slate.shade600,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
          ),
          // Skyline Silhouette at the bottom
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: CitySkylineSilhouette(
              height: 120,
              color: const Color(0xFF006B3F).withOpacity(0.12),
            ),
          ),
          // Tiny loading indicator above skyline
          Positioned(
            bottom: 40,
            left: 0,
            right: 0,
            child: Center(
              child: SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation<Color>(const Color(0xFF006B3F)),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
