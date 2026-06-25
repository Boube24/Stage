import 'package:flutter/material.dart';
import '../../claims/claim_model.dart';

class StatusBadge extends StatelessWidget {
  final ClaimStatus status;

  const StatusBadge({
    super.key,
    required this.status,
  });

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color fg;
    String label;

    switch (status) {
      case ClaimStatus.submitted:
        bg = Colors.amber.shade50;
        fg = Colors.amber.shade900;
        label = 'ENVOYÉ';
        break;
      case ClaimStatus.processing:
        bg = Colors.blue.shade50;
        fg = Colors.blue.shade900;
        label = 'REÇU';
        break;
      case ClaimStatus.investigating:
        bg = Colors.orange.shade50;
        fg = Colors.orange.shade900;
        label = 'EN ENQUÊTE';
        break;
      case ClaimStatus.resolved:
        bg = Colors.emerald.shade50;
        fg = Colors.emerald.shade900;
        label = 'RÉSOLU';
        break;
      case ClaimStatus.rejected:
        bg = Colors.red.shade50;
        fg = Colors.red.shade900;
        label = 'REJETÉ';
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: fg.withOpacity(0.2),
          width: 0.8,
        ),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: fg,
          fontSize: 10,
          fontWeight: FontWeight.black,
          letterSpacing: 0.5,
        ),
      ),
    );
  }
}
