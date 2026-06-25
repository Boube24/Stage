enum ClaimStatus {
  submitted,
  processing,
  investigating,
  resolved,
  rejected
}

enum ClaimPriority {
  low,
  medium,
  high,
  critical
}

class Claim {
  final String id;
  final String reference;
  final String title;
  final String description;
  final String category;
  final ClaimStatus status;
  final ClaimPriority priority;
  final String wilaya;
  final String moughataa;
  final String? gpsLocation;
  final List<String> attachments;
  final String createdAt;
  final String updatedAt;
  final List<ClaimTimelineEvent> timeline;

  Claim({
    required this.id,
    required this.reference,
    required this.title,
    required this.description,
    required this.category,
    required this.status,
    required this.priority,
    required this.wilaya,
    required this.moughataa,
    this.gpsLocation,
    required this.attachments,
    required this.createdAt,
    required this.updatedAt,
    required this.timeline,
  });

  Claim copyWith({
    String? id,
    String? reference,
    String? title,
    String? description,
    String? category,
    ClaimStatus? status,
    ClaimPriority? priority,
    String? wilaya,
    String? moughataa,
    String? gpsLocation,
    List<String>? attachments,
    String? createdAt,
    String? updatedAt,
    List<ClaimTimelineEvent>? timeline,
  }) {
    return Claim(
      id: id ?? this.id,
      reference: reference ?? this.reference,
      title: title ?? this.title,
      description: description ?? this.description,
      category: category ?? this.category,
      status: status ?? this.status,
      priority: priority ?? this.priority,
      wilaya: wilaya ?? this.wilaya,
      moughataa: moughataa ?? this.moughataa,
      gpsLocation: gpsLocation ?? this.gpsLocation,
      attachments: attachments ?? this.attachments,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      timeline: timeline ?? this.timeline,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'reference': reference,
      'title': title,
      'description': description,
      'category': category,
      'status': status.name,
      'priority': priority.name,
      'wilaya': wilaya,
      'moughataa': moughataa,
      'gpsLocation': gpsLocation,
      'attachments': attachments,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
      'timeline': timeline.map((x) => x.toMap()).toList(),
    };
  }

  factory Claim.fromMap(Map<String, dynamic> map) {
    return Claim(
      id: map['id'] ?? '',
      reference: map['reference'] ?? '',
      title: map['title'] ?? '',
      description: map['description'] ?? '',
      category: map['category'] ?? '',
      status: ClaimStatus.values.byName(map['status'] ?? 'submitted'),
      priority: ClaimPriority.values.byName(map['priority'] ?? 'medium'),
      wilaya: map['wilaya'] ?? '',
      moughataa: map['moughataa'] ?? '',
      gpsLocation: map['gpsLocation'],
      attachments: List<String>.from(map['attachments'] ?? []),
      createdAt: map['createdAt'] ?? '',
      updatedAt: map['updatedAt'] ?? '',
      timeline: List<ClaimTimelineEvent>.from(
        (map['timeline'] as List<dynamic>? ?? []).map((x) => ClaimTimelineEvent.fromMap(x)),
      ),
    );
  }
}

class ClaimTimelineEvent {
  final String id;
  final String status;
  final String titleAr;
  final String titleFr;
  final String? comment;
  final String agentName;
  final String timestamp;

  ClaimTimelineEvent({
    required this.id,
    required this.status,
    required this.titleAr,
    required this.titleFr,
    this.comment,
    required this.agentName,
    required this.timestamp,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'status': status,
      'titleAr': titleAr,
      'titleFr': titleFr,
      'comment': comment,
      'agentName': agentName,
      'timestamp': timestamp,
    };
  }

  factory ClaimTimelineEvent.fromMap(Map<String, dynamic> map) {
    return ClaimTimelineEvent(
      id: map['id'] ?? '',
      status: map['status'] ?? '',
      titleAr: map['titleAr'] ?? '',
      titleFr: map['titleFr'] ?? '',
      comment: map['comment'],
      agentName: map['agentName'] ?? '',
      timestamp: map['timestamp'] ?? '',
    );
  }
}
