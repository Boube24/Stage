import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';
import '../services/claim_service.dart';
import '../services/category_service.dart';
import '../widgets/flag_wave_ribbon.dart';
import '../widgets/cards/claim_card.dart';
import '../claims/claim_detail_screen.dart';
import '../claims/claim_model.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String _selectedCategory = "Tous";
  final CategoryService _categoryService = CategoryService();

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    final authService = Provider.of<AuthService>(context);
    final claimService = Provider.of<ClaimService>(context);
    
    final citizen = authService.currentUser;
    final allClaims = claimService.claims;
    
    // Filter claims
    final filteredClaims = allClaims.where((c) {
      if (_selectedCategory == "Tous") return true;
      return c.category == _selectedCategory;
    }).toList();

    // Stats
    final totalCount = allClaims.length;
    final resolvedCount = allClaims.where((c) => c.status == ClaimStatus.resolved).length;
    final ongoingCount = allClaims.where((c) => c.status == ClaimStatus.investigating || c.status == ClaimStatus.processing).length;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF0B0F19) : const Color(0xFFF8FAFC),
      body: CustomScrollView(
        slivers: [
          // App Bar
          SliverAppBar(
            pinned: true,
            expandedHeight: 120,
            flexibleSpace: FlexibleSpaceBar(
              title: const Text(
                'SAWTI CITOYEN',
                style: TextStyle(
                  fontWeight: FontWeight.black,
                  fontSize: 16,
                  letterSpacing: 1.0,
                ),
              ),
              background: Container(
                color: isDark ? const Color(0xFF0F1E2E) : const Color(0xFF006B3F),
              ),
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.logout_rounded),
                onPressed: () {
                  authService.logout();
                },
              )
            ],
          ),
          
          // National decorative bar below app bar
          const SliverToBoxAdapter(
            child: FlagWaveRibbon(height: 5),
          ),

          // User Welcome Card
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: isDark
                        ? [const Color(0xFF131B2E), const Color(0xFF1E2942)]
                        : [const Color(0xFFE2F0D9), const Color(0xFFF1F8EC)],
                  ),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: const Color(0xFF006B3F).withOpacity(0.15),
                    width: 1,
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Bienvenue, ${citizen?.name ?? "Citoyen"} 🇲🇷',
                          style: theme.textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.black,
                            fontSize: 17,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFFC1272D), // Red
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Text(
                            'NNI CONFIRMÉ',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 9,
                              fontWeight: FontWeight.black,
                            ),
                          ),
                        )
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Déclarez vos incidents publics, suivez leur résolution administrative et contribuez à l\'amélioration du service public.',
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: isDark ? Colors.slate.shade300 : Colors.slate.shade700,
                        height: 1.3,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Quick statistics count
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: GridView.count(
                crossAxisCount: 3,
                shrinkWrap: true,
                childAspectRatio: 2.1,
                crossAxisSpacing: 10,
                physics: const NeverScrollableScrollPhysics(),
                children: [
                  _buildStatTile("Total Dossiers", totalCount.toString(), Colors.blue),
                  _buildStatTile("En Cours", ongoingCount.toString(), Colors.orange),
                  _buildStatTile("Résolus", resolvedCount.toString(), Colors.emerald),
                ],
              ),
            ),
          ),

          // Category Scroll bar
          SliverToBoxAdapter(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.only(left: 16.0, top: 22.0, bottom: 8.0),
                  child: Text(
                    'Filtrer par Département',
                    style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.black),
                  ),
                ),
                SizedBox(
                  height: 40,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.only(left: 16.0),
                    children: [
                      _buildCategoryChip("Tous", Icons.all_inclusive_rounded),
                      ..._categoryService.categories.map((c) {
                        return _buildCategoryChip(c.name, c.icon);
                      }),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
              ],
            ),
          ),

          // Title
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
              child: Text(
                'Vos Réclamations (${filteredClaims.length})',
                style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.black),
              ),
            ),
          ),

          // Live claims listing
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            sliver: filteredClaims.isEmpty
                ? SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 40.0),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.inbox_outlined, size: 50, color: Colors.grey.shade400),
                          const SizedBox(height: 10),
                          Text(
                            'Aucune réclamation trouvée pour cette catégorie.',
                            style: TextStyle(color: Colors.grey.shade500, fontSize: 13),
                          ),
                        ],
                      ),
                    ),
                  )
                : SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        final claim = filteredClaims[index];
                        return ClaimCard(
                          claim: claim,
                          onTap: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (context) => ClaimDetailScreen(claim: claim),
                              ),
                            );
                          },
                        );
                      },
                      childCount: filteredClaims.length,
                    ),
                  ),
          ),
          
          const SliverToBoxAdapter(
            child: SizedBox(height: 30),
          )
        ],
      ),
    );
  }

  Widget _buildStatTile(String label, String value, Color color) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF131B2E) : Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: color.withOpacity(0.2),
          width: 1,
        ),
      ),
      padding: const EdgeInsets.all(10),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: TextStyle(fontSize: 10, color: Colors.grey.shade500, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 2),
          Text(
            value,
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.black, color: color),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryChip(String categoryName, IconData icon) {
    final isSelected = _selectedCategory == categoryName;
    return Padding(
      padding: const EdgeInsets.only(right: 8.0),
      child: FilterChip(
        selected: isSelected,
        label: Text(categoryName),
        avatar: Icon(icon, size: 14, color: isSelected ? Colors.white : const Color(0xFF006B3F)),
        onSelected: (selected) {
          setState(() {
            _selectedCategory = categoryName;
          });
        },
        selectedColor: const Color(0xFF006B3F),
        checkmarkColor: Colors.white,
        labelStyle: TextStyle(
          color: isSelected ? Colors.white : Colors.slate.shade700,
          fontWeight: FontWeight.bold,
          fontSize: 12,
        ),
      ),
    );
  }
}
