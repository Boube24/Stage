import 'package:flutter/material.dart';
import '../../claims/claim_model.dart';
import '../common/status_badge.dart';

class ClaimCard extends StatelessWidget {
  final Claim claim;
  final VoidCallback onTap;

  const ClaimCard({
    super.key,
    required this.claim,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    IconData getCategoryIcon() {
      switch (claim.category) {
        case "Eau & Électricité":
          return Icons.water_drop_rounded;
        case "Santé & Hôpitaux":
          return Icons.local_hospital_rounded;
        case "Éducation":
          return Icons.school_rounded;
        case "Infrastructures":
          return Icons.add_road_rounded;
        default:
          return Icons.account_balance_rounded;
      }
    }

    Color getPriorityColor() {
      switch (claim.priority) {
        case ClaimPriority.critical:
          return const Color(0xFFC1272D);
        case ClaimPriority.high:
          return Colors.orange;
        case ClaimPriority.medium:
          return const Color(0xFFD4AF37);
        case ClaimPriority.low:
          return Colors.blue;
      }
    }

    return Card(
      elevation: 1.5,
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(
          color: isDark ? Colors.slate.shade800 : Colors.slate.shade100,
          width: 1,
        ),
      ),
      color: isDark ? const Color(0xFF131B2E) : Colors.white,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Top line: Ref & Status
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                          color: getPriorityColor().withOpacity(0.1),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          getCategoryIcon(),
                          color: getPriorityColor(),
                          size: 16,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        claim.reference,
                        style: theme.textTheme.titleSmall?.copyWith(
                          fontWeight: FontWeight.black,
                          color: const Color(0xFF006B3F),
                          letterSpacing: 0.5,
                        ),
                      ),
                    ],
                  ),
                  StatusBadge(status: claim.status),
                ],
              ),
              const SizedBox(height: 12),
              
              // Title
              Text(
                claim.title,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                  letterSpacing: -0.2,
                ),
              ),
              const SizedBox(height: 6),
              
              // Description
              Text(
                claim.description,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: isDark ? Colors.slate.shade400 : Colors.slate.shade600,
                  height: 1.3,
                ),
              ),
              const SizedBox(height: 12),
              
              const Divider(height: 1, thickness: 0.5),
              const SizedBox(height: 10),
              
              // Bottom row: location + date
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Icon(
                        Icons.location_on_outlined,
                        size: 12,
                        color: isDark ? Colors.slate.shade400 : Colors.slate.shade500,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '${claim.wilaya}, ${claim.moughataa}',
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: isDark ? Colors.slate.shade400 : Colors.slate.shade500,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  Text(
                    claim.createdAt.substring(0, 10),
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: isDark ? Colors.slate.shade500 : Colors.slate.shade400,
                      fontFamily: 'monospace',
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
