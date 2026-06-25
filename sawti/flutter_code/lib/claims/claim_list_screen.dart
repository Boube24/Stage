import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/claim_service.dart';
import '../widgets/cards/claim_card.dart';
import 'claim_detail_screen.dart';

class ClaimListScreen extends StatefulWidget {
  const ClaimListScreen({super.key});

  @override
  State<ClaimListScreen> createState() => _ClaimListScreenState();
}

class _ClaimListScreenState extends State<ClaimListScreen> {
  String _searchQuery = "";

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    final claimService = Provider.of<ClaimService>(context);
    final allClaims = claimService.claims;

    final filtered = allClaims.where((c) {
      final query = _searchQuery.toLowerCase();
      return c.title.toLowerCase().contains(query) ||
          c.reference.toLowerCase().contains(query) ||
          c.moughataa.toLowerCase().contains(query) ||
          c.wilaya.toLowerCase().contains(query);
    }).toList();

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF0B0F19) : const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Mes Dossiers Nationaux', style: TextStyle(fontWeight: FontWeight.black)),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(60),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
            child: TextField(
              onChanged: (val) {
                setState(() {
                  _searchQuery = val;
                });
              },
              decoration: InputDecoration(
                hintText: 'Rechercher par référence, moughataa...',
                prefixIcon: const Icon(Icons.search_rounded),
                filled: true,
                fillColor: isDark ? const Color(0xFF131B2E) : Colors.grey.shade100,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                contentPadding: const EdgeInsets.symmetric(vertical: 10),
              ),
            ),
          ),
        ),
      ),
      body: filtered.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.search_off_rounded, size: 50, color: Colors.grey.shade400),
                  const SizedBox(height: 12),
                  Text(
                    'Aucun dossier ne correspond à votre recherche.',
                    style: TextStyle(color: Colors.grey.shade500, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16.0),
              itemCount: filtered.length,
              itemBuilder: (context, idx) {
                final claim = filtered[idx];
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
            ),
    );
  }
}
