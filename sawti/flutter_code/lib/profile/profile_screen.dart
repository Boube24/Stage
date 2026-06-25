import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    final authService = Provider.of<AuthService>(context);
    final citizen = authService.currentUser;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF0B0F19) : const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Profil Citoyen', style: TextStyle(fontWeight: FontWeight.black)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const SizedBox(height: 10),
            
            // Avatar and Name
            Center(
              child: Stack(
                children: [
                  CircleAvatar(
                    radius: 46,
                    backgroundImage: NetworkImage(citizen?.avatarUrl ?? ''),
                    backgroundColor: const Color(0xFF006B3F).withOpacity(0.1),
                  ),
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: Container(
                      padding: const EdgeInsets.all(4),
                      decoration: const BoxDecoration(
                        color: Color(0xFF006B3F),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.verified_user_rounded,
                        color: Colors.white,
                        size: 16,
                      ),
                    ),
                  )
                ],
              ),
            ),
            const SizedBox(height: 16),
            Text(
              citizen?.name ?? "Nom Inconnu",
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.black,
                fontSize: 18,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Identité Numérique Nationale Confirmée',
              style: TextStyle(color: Colors.grey.shade500, fontSize: 12),
            ),
            const SizedBox(height: 24),

            // Profile info lines
            _buildInfoCard(context, [
              _buildProfileLine(context, Icons.badge_outlined, "Numéro National (NNI)", citizen?.nni ?? "-"),
              _buildProfileLine(context, Icons.phone_android_rounded, "Téléphone Mobile", citizen?.phone ?? "-"),
              _buildProfileLine(context, Icons.alternate_email_rounded, "Adresse E-mail", citizen?.email ?? "-"),
              _buildProfileLine(context, Icons.map_outlined, "Wilaya", citizen?.wilaya ?? "-"),
              _buildProfileLine(context, Icons.location_city_outlined, "Moughataa", citizen?.moughataa ?? "-"),
            ]),

            const SizedBox(height: 24),

            // Security disclaimer
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.blue.withOpacity(0.08),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  const Icon(Icons.shield_outlined, color: Colors.blue),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Toutes vos données sont sécurisées et synchronisées sous la tutelle de la direction nationale de la cybersécurité.',
                      style: TextStyle(fontSize: 11, color: Colors.blue.shade900, height: 1.3),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoCard(BuildContext context, List<Widget> children) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF131B2E) : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark ? Colors.slate.shade900 : Colors.slate.shade100,
        ),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        children: children,
      ),
    );
  }

  Widget _buildProfileLine(BuildContext context, IconData icon, String label, String value) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10.0),
      child: Row(
        children: [
          Icon(icon, size: 20, color: const Color(0xFF006B3F)),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: TextStyle(fontSize: 11, color: Colors.grey.shade500, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 2),
              Text(
                value,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.black,
                  color: isDark ? Colors.white : Colors.black87,
                ),
              ),
            ],
          )
        ],
      ),
    );
  }
}
