import 'package:flutter/foundation.dart';
import '../claims/claim_model.dart';

class ClaimService extends ChangeNotifier {
  final List<Claim> _claims = [];

  List<Claim> get claims => _claims;

  ClaimService() {
    // Bootstrap initial data
    _claims.addAll([
      Claim(
        id: 'c1',
        reference: 'MRT-2026-X83H',
        title: 'Coupure d\'eau prolongée secteur Tevragh-Zeina',
        description: 'Le réseau d\'eau potable est coupé depuis 72 heures au niveau de la rue du Palais des Congrès.',
        category: 'Eau & Électricité',
        status: ClaimStatus.investigating,
        priority: ClaimPriority.high,
        wilaya: 'Nouakchott Ouest',
        moughataa: 'Tevragh-Zeina',
        gpsLocation: '18.0864° N, 15.9753° W',
        attachments: ['recu_sonede_juin.pdf'],
        createdAt: '2026-06-24T08:30:00Z',
        updatedAt: '2026-06-24T08:30:00Z',
        timeline: [
          ClaimTimelineEvent(
            id: 'evt1',
            status: 'submitted',
            titleAr: 'تم إرسال الشكوى',
            titleFr: 'Réclamation enregistrée',
            comment: 'Dossier transmis au service d\'administration.',
            agentName: 'Système SAWTI',
            timestamp: '2026-06-24T08:30:00Z',
          )
        ],
      ),
      Claim(
        id: 'c2',
        reference: 'MRT-2026-A49P',
        title: 'Manque d\'équipements de premier secours au centre médical Dar-Naim',
        description: 'Le dispensaire local ne dispose plus de bandages ni de thermomètres de base.',
        category: 'Santé & Hôpitaux',
        status: ClaimStatus.submitted,
        priority: ClaimPriority.critical,
        wilaya: 'Nouakchott Nord',
        moughataa: 'Dar-Naim',
        attachments: [],
        createdAt: '2026-06-23T14:15:00Z',
        updatedAt: '2026-06-23T14:15:00Z',
        timeline: [
          ClaimTimelineEvent(
            id: 'evt2',
            status: 'submitted',
            titleAr: 'تم إرسال الشكوى',
            titleFr: 'Réclamation enregistrée',
            comment: 'Dossier transmis au service d\'administration.',
            agentName: 'Système SAWTI',
            timestamp: '2026-06-23T14:15:00Z',
          )
        ],
      ),
    ]);
  }

  void submitClaim(Claim claim) {
    _claims.insert(0, claim);
    notifyListeners();
  }

  void updateClaimStatus(String id, ClaimStatus status, {ClaimTimelineEvent? event}) {
    final index = _claims.indexWhere((c) => c.id == id);
    if (index != -1) {
      final old = _claims[index];
      final List<ClaimTimelineEvent> updatedTimeline = List.from(old.timeline);
      if (event != null) {
        updatedTimeline.add(event);
      }
      _claims[index] = old.copyWith(
        status: status,
        updatedAt: DateTime.now().toIso8601String(),
        timeline: updatedTimeline,
      );
      notifyListeners();
    }
  }
}
