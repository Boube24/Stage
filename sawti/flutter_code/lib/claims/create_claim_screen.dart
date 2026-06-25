import 'dart:math';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../widgets/inputs/custom_text_field.dart';
import '../widgets/buttons/custom_button.dart';
import '../widgets/loaders/custom_loader.dart';
import '../services/claim_service.dart';
import '../services/location_service.dart';
import '../services/category_service.dart';
import 'claim_model.dart';

class CreateClaimScreen extends StatefulWidget {
  const CreateClaimScreen({super.key});

  @override
  State<CreateClaimScreen> createState() => _CreateClaimScreenState();
}

class _CreateClaimScreenState extends State<CreateClaimScreen> {
  final _formKey = GlobalKey<FormState>();
  final _locationService = LocationService();
  final _categoryService = CategoryService();

  String _title = "";
  String _category = "Eau & Électricité";
  String _selectedWilaya = "Nouakchott Ouest";
  String _selectedMoughataa = "Tevragh-Zeina";
  String _description = "";
  String? _gpsLocation;
  List<String> _attachedPhotos = [];
  bool _isLocating = false;
  bool _isUploading = false;

  void _captureGPS() async {
    setState(() => _isLocating = true);
    final coords = await _locationService.getCurrentGPSCoordinates();
    setState(() {
      _gpsLocation = coords;
      _isLocating = false;
    });
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Coordonnées GPS capturées avec succès ! 🛰️')),
      );
    }
  }

  void _attachPhoto() async {
    setState(() => _isUploading = true);
    await Future.delayed(const Duration(milliseconds: 1000));
    setState(() {
      _attachedPhotos.add("incident_photo_${_attachedPhotos.length + 1}.jpg");
      _isUploading = false;
    });
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Photo jointe avec succès 📸')),
      );
    }
  }

  void _submitClaim() {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();

      // Create reference code
      final random = Random();
      final chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      final code = List.generate(4, (index) => chars[random.nextInt(chars.length)]).join();
      final reference = 'MRT-2026-$code';

      final newClaim = Claim(
        id: 'comp-${DateTime.now().millisecondsSinceEpoch}',
        reference: reference,
        title: _title,
        description: _description,
        category: _category,
        status: ClaimStatus.submitted,
        priority: ClaimPriority.medium,
        wilaya: _selectedWilaya,
        moughataa: _selectedMoughataa,
        gpsLocation: _gpsLocation,
        attachments: _attachedPhotos,
        createdAt: DateTime.now().toIso8601String(),
        updatedAt: DateTime.now().toIso8601String(),
        timeline: [
          ClaimTimelineEvent(
            id: 'evt-init-${DateTime.now().millisecondsSinceEpoch}',
            status: 'submitted',
            titleAr: 'تم إرسال الشكوى',
            titleFr: 'Réclamation soumise',
            comment: 'Soumission initiale par le citoyen.',
            agentName: 'Système SAWTI',
            timestamp: DateTime.now().toIso8601String(),
          )
        ],
      );

      Provider.of<ClaimService>(context, listen: false).submitClaim(newClaim);

      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          icon: const Icon(Icons.check_circle_rounded, color: Color(0xFF006B3F), size: 48),
          title: const Text('Soumission Réussie 🇲🇷'),
          content: Text(
            'Votre réclamation a été transmise aux autorités avec la référence :\n\n$reference\n\nVous serez notifié dès qu\'un agent administratif prendra en charge votre dossier.',
            textAlign: TextAlign.center,
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                Navigator.of(context).pop(); // Back to home list
              },
              child: const Text('OK', style: TextStyle(fontWeight: FontWeight.black, color: Color(0xFF006B3F))),
            ),
          ],
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final moughataas = _locationService.getMoughataasForWilaya(_selectedWilaya);

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF0B0F19) : const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Nouvelle Réclamation', style: TextStyle(fontWeight: FontWeight.black)),
      ),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Alert warning
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFC1272D).withOpacity(0.08),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFC1272D).withOpacity(0.2)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.warning_amber_rounded, color: Color(0xFFC1272D)),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'Toute fausse déclaration ou calomnie est passible de poursuites pénales.',
                        style: TextStyle(fontSize: 11, fontWeight: FontWeight.black, color: const Color(0xFFC1272D)),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Title Field
              CustomTextField(
                label: 'Titre de la réclamation *',
                hint: 'Ex: Fuite d\'eau potable',
                prefixIcon: Icons.title_rounded,
                validator: (val) {
                  if (val == null || val.isEmpty) return 'Titre requis';
                  if (val.length < 5) return 'Titre trop court';
                  return null;
                },
                onSaved: (val) => _title = val ?? "",
              ),
              const SizedBox(height: 16),

              // Category
              Text(
                'Catégorie de Réclamation *',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.bold,
                  color: isDark ? Colors.slate.shade300 : Colors.slate.shade700,
                ),
              ),
              const SizedBox(height: 6),
              DropdownButtonFormField<String>(
                value: _category,
                decoration: InputDecoration(
                  filled: true,
                  fillColor: isDark ? const Color(0xFF131B2E) : Colors.grey.shade50,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
                items: _categoryService.categories.map((c) {
                  return DropdownMenuItem(value: c.name, child: Text(c.name));
                }).toList(),
                onChanged: (val) => setState(() => _category = val ?? _category),
              ),
              const SizedBox(height: 16),

              // Wilaya / Moughataa Cascading
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Wilaya *',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: isDark ? Colors.slate.shade300 : Colors.slate.shade700,
                          ),
                        ),
                        const SizedBox(height: 6),
                        DropdownButtonFormField<String>(
                          value: _selectedWilaya,
                          decoration: InputDecoration(
                            filled: true,
                            fillColor: isDark ? const Color(0xFF131B2E) : Colors.grey.shade50,
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          items: _locationService.wilayas.map((w) {
                            return DropdownMenuItem(value: w, child: Text(w, overflow: TextOverflow.ellipsis));
                          }).toList(),
                          onChanged: (val) {
                            setState(() {
                              _selectedWilaya = val ?? _selectedWilaya;
                              _selectedMoughataa = _locationService.getMoughataasForWilaya(_selectedWilaya).first;
                            });
                          },
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Moughataa *',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: isDark ? Colors.slate.shade300 : Colors.slate.shade700,
                          ),
                        ),
                        const SizedBox(height: 6),
                        DropdownButtonFormField<String>(
                          value: _selectedMoughataa,
                          decoration: InputDecoration(
                            filled: true,
                            fillColor: isDark ? const Color(0xFF131B2E) : Colors.grey.shade50,
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          items: moughataas.map((m) {
                            return DropdownMenuItem(value: m, child: Text(m, overflow: TextOverflow.ellipsis));
                          }).toList(),
                          onChanged: (val) => setState(() => _selectedMoughataa = val ?? _selectedMoughataa),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Description
              CustomTextField(
                label: 'Description détaillée *',
                hint: 'Détaillez le problème rencontré, l\'adresse précise...',
                maxLines: 4,
                validator: (val) {
                  if (val == null || val.isEmpty) return 'Description requise';
                  if (val.length < 15) return 'La description doit faire plus de 15 caractères';
                  return null;
                },
                onSaved: (val) => _description = val ?? "",
              ),
              const SizedBox(height: 20),

              // Actions: GPS and camera
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: _isLocating ? null : _captureGPS,
                      icon: const Icon(Icons.my_location_rounded),
                      label: Text(_isLocating ? 'Géolocalisation...' : 'Capturer GPS'),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: _isUploading ? null : _attachPhoto,
                      icon: const Icon(Icons.camera_alt_rounded),
                      label: Text(_isUploading ? 'Chargement...' : 'Joindre Photo'),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                    ),
                  ),
                ],
              ),

              // GPS status display
              if (_gpsLocation != null) ...[
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Colors.emerald.withOpacity(0.08),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.check_circle_rounded, color: Colors.emerald, size: 16),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Coordonnées GPS: $_gpsLocation',
                          style: const TextStyle(fontSize: 11, color: Colors.emerald, fontWeight: FontWeight.bold),
                        ),
                      )
                    ],
                  ),
                ),
              ],

              // Photo attachment display
              if (_attachedPhotos.isNotEmpty) ...[
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8,
                  children: _attachedPhotos.map((p) {
                    return Chip(
                      label: Text(p, style: const TextStyle(fontSize: 10)),
                      onDeleted: () {
                        setState(() {
                          _attachedPhotos.remove(p);
                        });
                      },
                    );
                  }).toList(),
                )
              ],

              const SizedBox(height: 30),

              // Submit
              CustomButton(
                text: 'Transmettre aux Autorités 🇲🇷',
                onPressed: _submitClaim,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
