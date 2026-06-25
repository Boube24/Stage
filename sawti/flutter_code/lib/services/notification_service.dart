import 'package:flutter/foundation.dart';

class NotificationItem {
  final String id;
  final String title;
  final String description;
  final String type;
  final String createdAt;
  bool read;

  NotificationItem({
    required this.id,
    required this.title,
    required this.description,
    required this.type,
    required this.createdAt,
    this.read = false,
  });
}

class NotificationService extends ChangeNotifier {
  final List<NotificationItem> _notifications = [
    NotificationItem(
      id: 'n1',
      title: 'Réclamation Enregistrée 🇲🇷',
      description: 'Votre dossier MRT-2026-X83H a été correctement transmis aux serveurs de l\'État.',
      type: 'info',
      createdAt: '2026-06-24T08:31:00Z',
    ),
    NotificationItem(
      id: 'n2',
      title: 'Enquête Déclenchée 🔍',
      description: 'L\'Inspecteur Régional a pris en charge le dossier de coupure d\'eau.',
      type: 'success',
      createdAt: '2026-06-24T09:00:00Z',
    ),
  ];

  List<NotificationItem> get notifications => _notifications;

  int get unreadCount => _notifications.where((n) => !n.read).length;

  void addNotification(NotificationItem item) {
    _notifications.insert(0, item);
    notifyListeners();
  }

  void markAllAsRead() {
    for (var n in _notifications) {
      n.read = true;
    }
    notifyListeners();
  }
}
