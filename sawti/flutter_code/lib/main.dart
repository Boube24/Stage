import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

import 'splash/splash_screen.dart';
import 'home/home_screen.dart';
import 'claims/claim_list_screen.dart';
import 'claims/create_claim_screen.dart';
import 'notifications/notification_list_screen.dart';
import 'profile/profile_screen.dart';

import 'services/auth_service.dart';
import 'services/claim_service.dart';
import 'services/notification_service.dart';
import 'widgets/flag_wave_ribbon.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthService()),
        ChangeNotifierProvider(create: (_) => ClaimService()),
        ChangeNotifierProvider(create: (_) => NotificationService()),
      ],
      child: const SawtiApp(),
    ),
  );
}

class SawtiApp extends StatelessWidget {
  const SawtiApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SAWTI Mauritanie',
      debugShowCheckedModeBanner: false,
      themeMode: ThemeMode.system,
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.light,
        primaryColor: const Color(0xFF006B3F), // Green Mauritania
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF006B3F),
          primary: const Color(0xFF006B3F),
          secondary: const Color(0xFFD4AF37), // Gold
          error: const Color(0xFFC1272D), // Red
          background: const Color(0xFFF8FAFC),
        ),
        textTheme: GoogleFonts.interTextTheme(ThemeData.light().textTheme),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          foregroundColor: Colors.black,
          elevation: 0,
        ),
      ),
      darkTheme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        primaryColor: const Color(0xFF006B3F),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF006B3F),
          brightness: Brightness.dark,
          primary: const Color(0xFF006B3F),
          secondary: const Color(0xFFD4AF37),
          error: const Color(0xFFC1272D),
          background: const Color(0xFF0B0F19),
        ),
        textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF0B0F19),
          foregroundColor: Colors.white,
          elevation: 0,
        ),
      ),
      home: const SplashScreen(),
    );
  }
}

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    const HomeScreen(),
    const ClaimListScreen(),
    const CreateClaimScreen(),
    const NotificationListScreen(),
    const ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final unreadNotifs = Provider.of<NotificationService>(context).unreadCount;

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // Mauritanian Flag Top Decorative Bar
            const FlagWaveRibbon(height: 5),
            Expanded(child: _screens[_currentIndex]),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        selectedItemColor: const Color(0xFF006B3F),
        unselectedItemColor: isDark ? Colors.slate.shade600 : Colors.slate.shade400,
        type: BottomNavigationBarType.fixed,
        backgroundColor: isDark ? const Color(0xFF0B0F19) : Colors.white,
        selectedFontSize: 11,
        unselectedFontSize: 11,
        selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold),
        items: [
          const BottomNavigationBarItem(
            icon: Icon(Icons.dashboard_rounded, size: 22),
            label: 'Tableau',
          ),
          const BottomNavigationBarItem(
            icon: Icon(Icons.view_headline_rounded, size: 22),
            label: 'Dossiers',
          ),
          const BottomNavigationBarItem(
            icon: Icon(Icons.add_circle_outline_rounded, size: 24),
            label: 'Nouveau',
          ),
          BottomNavigationBarItem(
            icon: Badge(
              label: Text(unreadNotifs.toString()),
              isLabelVisible: unreadNotifs > 0,
              child: const Icon(Icons.notifications_outlined, size: 22),
            ),
            label: 'Notifs',
          ),
          const BottomNavigationBarItem(
            icon: Icon(Icons.person_outline_rounded, size: 22),
            label: 'Profil',
          ),
        ],
      ),
    );
  }
}
