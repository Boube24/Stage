import 'package:flutter/material.dart';
import 'claim_model.dart';
import '../widgets/common/status_badge.dart';

class ClaimDetailScreen extends StatelessWidget {
  final Claim claim;

  const ClaimDetailScreen({
    super.key,
    required this.claim,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF0B0F19) : const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text(claim.reference, style: const TextStyle(fontWeight: FontWeight.black)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status and Title Header Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF131B2E) : Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isDark ? Colors.slate.shade800 : Colors.slate.shade200,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      StatusBadge(status: claim.status),
                      Text(
                        'Priorité: ${claim.priority.name.toUpperCase()}',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.black,
                          color: claim.priority == ClaimPriority.critical ? const Color(0xFFC1272D) : Colors.orange,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    claim.title,
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.black,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Soumis le: ${claim.createdAt.substring(0, 10)} à ${claim.createdAt.substring(11, 16)}',
                    style: TextStyle(color: Colors.grey.shade500, fontSize: 11),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Description Section
            Text(
              'Description de l\'incident',
              style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.black),
            ),
            const SizedBox(height: 8),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF131B2E) : Colors.white,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Text(
                claim.description,
                style: const TextStyle(fontSize: 14, height: 1.4),
              ),
            ),
            const SizedBox(height: 20),

            // Location details
            Text(
              'Géolocalisation & Zone',
              style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.black),
            ),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF131B2E) : Colors.white,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  const Icon(Icons.map_rounded, color: Color(0xFF006B3F)),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '${claim.wilaya} • ${claim.moughataa}',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                        ),
                        if (claim.gpsLocation != null) ...[
                          const SizedBox(height: 2),
                          Text(
                            claim.gpsLocation!,
                            style: TextStyle(color: Colors.grey.shade500, fontSize: 11, fontFamily: 'monospace'),
                          ),
                        ]
                      ],
                    ),
                  )
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Attachments
            if (claim.attachments.isNotEmpty) ...[
              Text(
                'Pièces Jointes (${claim.attachments.length})',
                style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.black),
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                children: claim.attachments.map((f) {
                  return Chip(
                    avatar: const Icon(Icons.insert_drive_file_outlined, size: 14, color: Color(0xFF006B3F)),
                    label: Text(f, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                    backgroundColor: isDark ? const Color(0xFF131B2E) : Colors.white,
                  );
                }).toList(),
              ),
              const SizedBox(height: 20),
            ],

            // Timeline
            Text(
              'Suivi d\'Enquête Administrative',
              style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.black),
            ),
            const SizedBox(height: 12),
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: claim.timeline.length,
              itemBuilder: (context, idx) {
                final evt = claim.timeline[idx];
                final isLast = idx == claim.timeline.length - 1;

                return Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Dot and line decoration
                    Column(
                      children: [
                        Container(
                          width: 14,
                          height: 14,
                          decoration: const BoxDecoration(
                            color: Color(0xFF006B3F),
                            shape: BoxShape.circle,
                          ),
                          child: const Center(
                            child: Icon(Icons.check, size: 9, color: Colors.white),
                          ),
                        ),
                        if (!isLast)
                          Container(
                            width: 2,
                            height: 50,
                            color: Colors.grey.shade300,
                          ),
                      ],
                    ),
                    const SizedBox(width: 16),
                    // Timeline item description
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                evt.titleFr,
                                style: const TextStyle(fontWeight: FontWeight.black, fontSize: 13),
                              ),
                              Text(
                                evt.timestamp.substring(11, 16),
                                style: TextStyle(color: Colors.grey.shade500, fontSize: 11),
                              ),
                            ],
                          ),
                          Text(
                            evt.titleAr,
                            textDirection: TextDirection.rtl,
                            style: const TextStyle(
                              fontSize: 12,
                              color: Color(0xFFD4AF37),
                              fontWeight: FontWeight.bold,
                              fontFamily: 'serif',
                            ),
                          ),
                          if (evt.comment != null) ...[
                            const SizedBox(height: 4),
                            Text(
                              evt.comment!,
                              style: TextStyle(color: Colors.grey.shade600, fontSize: 12),
                            ),
                          ],
                          const SizedBox(height: 2),
                          Text(
                            'Par: ${evt.agentName}',
                            style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF006B3F)),
                          ),
                          const SizedBox(height: 16),
                        ],
                      ),
                    ),
                  ],
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
