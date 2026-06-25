import 'package:flutter/material.dart';

class ClaimCategory {
  final String name;
  final String labelAr;
  final String labelFr;
  final IconData icon;
  final Color color;
  final String ministryName;

  ClaimCategory({
    required this.name,
    required this.labelAr,
    required this.labelFr,
    required this.icon,
    required this.color,
    required this.ministryName,
  });
}

class CategoryService {
  final List<ClaimCategory> _categories = [
    ClaimCategory(
      name: "Eau & Électricité",
      labelAr: "الماء والكهرباء",
      labelFr: "Eau & Électricité",
      icon: Icons.water_drop_rounded,
      color: Colors.blue,
      ministryName: "Ministère de l'Hydraulique et de l'Assainissement",
    ),
    ClaimCategory(
      name: "Santé & Hôpitaux",
      labelAr: "الصحة والمستشفيات",
      labelFr: "Santé & Hôpitaux",
      icon: Icons.local_hospital_rounded,
      color: Colors.red,
      ministryName: "Ministère de la Santé",
    ),
    ClaimCategory(
      name: "Éducation",
      labelAr: "التعليم والمدارس",
      labelFr: "Éducation",
      icon: Icons.school_rounded,
      color: Colors.amber,
      ministryName: "Ministère de l'Éducation Nationale et de la Réforme du Système Éducatif",
    ),
    ClaimCategory(
      name: "Infrastructures",
      labelAr: "البنية التحتية والطرق",
      labelFr: "Infrastructures & Routes",
      icon: Icons.add_road_rounded,
      color: Colors.brown,
      ministryName: "Ministère de l'Équipement et des Transports",
    ),
    ClaimCategory(
      name: "Administration",
      labelAr: "الإدارة والخدمات",
      labelFr: "Services Administratifs",
      icon: Icons.account_balance_rounded,
      color: Colors.teal,
      ministryName: "Ministère de l'Intérieur et de la Décentralisation",
    ),
  ];

  List<ClaimCategory> get categories => _categories;
}
