import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../widgets/inputs/custom_text_field.dart';
import '../widgets/buttons/custom_button.dart';
import '../widgets/star_crescent_emblem.dart';
import '../services/auth_service.dart';
import '../main.dart';
import 'register_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  String _nni = "";
  String _password = "";
  bool _isLoading = false;

  void _handleLogin() async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      setState(() => _isLoading = true);
      
      final authService = Provider.of<AuthService>(context, listen: false);
      final success = await authService.login(_nni, _password);
      
      setState(() => _isLoading = false);
      
      if (success) {
        if (mounted) {
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (context) => const MainNavigationScreen()),
          );
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('NNI invalide (doit comporter 10 chiffres). Veuillez réessayer.'),
              backgroundColor: Color(0xFFC1272D),
            ),
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF0B0F19) : const Color(0xFFF8FAFC),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 30.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const SizedBox(height: 20),
                const StarCrescentEmblem(size: 80),
                const SizedBox(height: 20),
                Text(
                  'Connexion Citoyenne',
                  style: theme.textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.black,
                    letterSpacing: -0.5,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  'Accédez à votre espace SAWTI sécurisé',
                  style: TextStyle(
                    color: isDark ? Colors.slate.shade400 : Colors.slate.shade600,
                    fontSize: 13,
                  ),
                ),
                const SizedBox(height: 32),

                // NNI Input
                CustomTextField(
                  label: 'Numéro National d\'Identité (NNI) *',
                  hint: 'Ex: 2890471203',
                  prefixIcon: Icons.badge_outlined,
                  keyboardType: TextInputType.number,
                  validator: (val) {
                    if (val == null || val.isEmpty) return 'Veuillez saisir votre NNI';
                    if (val.length != 10) return 'Le NNI doit être composé de 10 chiffres';
                    if (double.tryParse(val) == null) return 'Le NNI ne doit contenir que des chiffres';
                    return null;
                  },
                  onSaved: (val) => _nni = val ?? "",
                ),
                const SizedBox(height: 18),

                // Password Input
                CustomTextField(
                  label: 'Mot de passe d\'accès *',
                  hint: '••••••••',
                  prefixIcon: Icons.lock_outline_rounded,
                  obscureText: true,
                  validator: (val) {
                    if (val == null || val.isEmpty) return 'Veuillez renseigner votre mot de passe';
                    if (val.length < 4) return 'Mot de passe trop court';
                    return null;
                  },
                  onSaved: (val) => _password = val ?? "",
                ),
                const SizedBox(height: 10),

                // Forgot Password link
                Align(
                  alignment: Alignment.centerRight,
                  child: TextButton(
                    onPressed: () {},
                    child: const Text(
                      'Mot de passe oublié ?',
                      style: TextStyle(
                        color: Color(0xFF006B3F),
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Submit Button
                CustomButton(
                  text: 'Se Connecter 🇲🇷',
                  isLoading: _isLoading,
                  onPressed: _handleLogin,
                ),
                const SizedBox(height: 24),

                // No account register prompt
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Nouveau sur SAWTI ? ',
                      style: TextStyle(
                        color: isDark ? Colors.slate.shade400 : Colors.slate.shade600,
                        fontSize: 13,
                      ),
                    ),
                    GestureDetector(
                      onTap: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(builder: (context) => const RegisterScreen()),
                        );
                      },
                      child: const Text(
                        'Créer un compte',
                        style: TextStyle(
                          color: Color(0xFF006B3F),
                          fontWeight: FontWeight.black,
                          fontSize: 13,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 40),
                
                // Footer legal info
                Text(
                  'Vos données biométriques sont chiffrées selon les standards de l\'Agence Nationale du Registre des Populations (ANRPD).',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 10,
                    color: Colors.grey.shade500,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
