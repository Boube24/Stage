import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/notification_service.dart';

class NotificationListScreen extends StatelessWidget {
  const NotificationListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    final notifService = Provider.of<NotificationService>(context);
    final list = notifService.notifications;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF0B0F19) : const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Notifications Admin', style: TextStyle(fontWeight: FontWeight.black)),
        actions: [
          TextButton(
            onPressed: () {
              notifService.markAllAsRead();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Toutes les notifications marquées comme lues')),
              );
            },
            child: const Text(
              'Tout lire',
              style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF006B3F)),
            ),
          )
        ],
      ),
      body: list.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.notifications_none_rounded, size: 50, color: Colors.grey.shade400),
                  const SizedBox(height: 10),
                  Text(
                    'Aucune notification récente.',
                    style: TextStyle(color: Colors.grey.shade500),
                  ),
                ],
              ),
            )
          : ListView.separated(
              padding: const EdgeInsets.all(16.0),
              itemCount: list.length,
              separatorBuilder: (context, idx) => const SizedBox(height: 10),
              itemBuilder: (context, idx) {
                final item = list[idx];
                return Container(
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF131B2E) : Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: item.read
                          ? (isDark ? Colors.slate.shade900 : Colors.slate.shade100)
                          : const Color(0xFFD4AF37).withOpacity(0.3),
                      width: 1.2,
                    ),
                  ),
                  padding: const EdgeInsets.all(14),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: item.read ? Colors.grey.withOpacity(0.1) : const Color(0xFF006B3F).withOpacity(0.1),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          Icons.notifications_active_rounded,
                          color: item.read ? Colors.grey : const Color(0xFF006B3F),
                          size: 16,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              item.title,
                              style: TextStyle(
                                fontWeight: FontWeight.black,
                                fontSize: 13,
                                color: item.read ? Colors.grey.shade600 : (isDark ? Colors.white : Colors.black),
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              item.description,
                              style: TextStyle(
                                fontSize: 12,
                                color: isDark ? Colors.slate.shade400 : Colors.slate.shade600,
                                height: 1.3,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              item.createdAt.substring(11, 16),
                              style: TextStyle(
                                fontSize: 10,
                                fontFamily: 'monospace',
                                color: Colors.grey.shade500,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
    );
  }
}
