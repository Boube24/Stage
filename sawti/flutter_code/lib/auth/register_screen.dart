import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../widgets/inputs/custom_text_field.dart';
import '../widgets/buttons/custom_button.dart';
import '../services/auth_service.dart';
import '../services/location_service.dart';
import '../main.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _locationService = LocationService();

  String _name = "";
  String _nni = "";
  String _phone = "";
  String _email = "";
  String _selectedWilaya = "Nouakchott Ouest";
  String _selectedMoughataa = "Tevragh-Zeina";
  bool _isLoading = false;

  void _handleRegister() async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      setState(() => _isLoading = true);

      final authService = Provider.of<AuthService>(context, listen: false);
      final success = await authService.register(
        name: _name,
        nni: _nni,
        phone: _phone,
        email: _email,
        wilaya: _selectedWilaya,
        moughataa: _selectedMoughataa,
      );

      setState(() => _isLoading = false);

      if (success) {
        if (mounted) {
          Navigator.of(context).pushAndRemoveUntil(
            MaterialPageRoute(builder: (context) => const MainNavigationScreen()),
            (route) => false,
          );
        }
      }
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
        title: const Text('Création de Compte', style: TextStyle(fontWeight: FontWeight.bold)),
        elevation: 0,
        backgroundColor: Colors.transparent,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Rejoignez la Communauté SAWTI',
                  style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.black),
                ),
                const SizedBox(height: 6),
                Text(
                  'Enregistrez vos coordonnées nationales officielles pour pouvoir initier vos réclamations citoyennes.',
                  style: TextStyle(
                    color: isDark ? Colors.slate.shade400 : Colors.slate.shade600,
                    fontSize: 13,
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 28),

                // Full Name Input
                CustomTextField(
                  label: 'Nom Complet (Français ou Arabe) *',
                  hint: 'Ex: Ahmed Mahmoud',
                  prefixIcon: Icons.person_outline_rounded,
                  validator: (val) {
                    if (val == null || val.isEmpty) return 'Veuillez saisir votre nom';
                    if (val.length < 4) return 'Veuillez renseigner votre nom complet';
                    return null;
                  },
                  onSaved: (val) => _name = val ?? "",
                ),
                const SizedBox(height: 16),

                // NNI Input
                CustomTextField(
                  label: 'Numéro National d\'Identité (NNI) *',
                  hint: 'Ex: 2890471203',
                  prefixIcon: Icons.badge_outlined,
                  keyboardType: TextInputType.number,
                  validator: (val) {
                    if (val == null || val.isEmpty) return 'Veuillez saisir votre NNI';
                    if (val.length != 10) return 'Le NNI doit être composé de 10 chiffres';
                    return null;
                  },
                  onSaved: (val) => _nni = val ?? "",
                ),
                const SizedBox(height: 16),

                // Phone Input
                CustomTextField(
                  label: 'Numéro de Téléphone *',
                  hint: 'Ex: 44123456',
                  prefixIcon: Icons.phone_outlined,
                  keyboardType: TextInputType.phone,
                  validator: (val) {
                    if (val == null || val.isEmpty) return 'Veuillez saisir votre téléphone';
                    if (val.length < 8) return 'Numéro de téléphone incomplet';
                    return null;
                  },
                  onSaved: (val) => _phone = val ?? "",
                ),
                const SizedBox(height: 16),

                // Email Input
                CustomTextField(
                  label: 'Adresse E-mail *',
                  hint: 'Ex: citoyen@supnum.mr',
                  prefixIcon: Icons.email_outlined,
                  keyboardType: TextInputType.emailAddress,
                  validator: (val) {
                    if (val == null || val.isEmpty) return 'Veuillez saisir votre e-mail';
                    if (!val.contains('@')) return 'E-mail invalide';
                    return null;
                  },
                  onSaved: (val) => _email = val ?? "",
                ),
                const SizedBox(height: 18),

                // Wilaya Dropdown selection
                Text(
                  'Wilaya de Résidence *',
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
                    return DropdownMenuItem(value: w, child: Text(w));
                  }).toList(),
                  onChanged: (val) {
                    setState(() {
                      _selectedWilaya = val ?? _selectedWilaya;
                      _selectedMoughataa = _locationService.getMoughataasForWilaya(_selectedWilaya).first;
                    });
                  },
                ),
                const SizedBox(height: 16),

                // Moughataa Dropdown selection
                Text(
                  'Moughataa de Résidence *',
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
                    return DropdownMenuItem(value: m, child: Text(m));
                  }).toList(),
                  onChanged: (val) => setState(() => _selectedMoughataa = val ?? _selectedMoughataa),
                ),
                const SizedBox(height: 32),

                // Confirm Register Button
                CustomButton(
                  text: 'Créer mon Compte 🇲🇷',
                  isLoading: _isLoading,
                  onPressed: _handleRegister,
                ),
                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
