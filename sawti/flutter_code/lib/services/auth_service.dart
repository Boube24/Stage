import 'dart:async';
import 'package:flutter/foundation.dart';

class CitizenUser {
  final String name;
  final String nni; // Numéro National d'Identité
  final String phone;
  final String email;
  final String wilaya;
  final String moughataa;
  final String avatarUrl;

  CitizenUser({
    required this.name,
    required this.nni,
    required this.phone,
    required this.email,
    required this.wilaya,
    required this.moughataa,
    required this.avatarUrl,
  });
}

class AuthService extends ChangeNotifier {
  CitizenUser? _currentUser;
  bool _isAuthenticated = false;

  CitizenUser? get currentUser => _currentUser;
  bool get isAuthenticated => _isAuthenticated;

  AuthService() {
    // Default logged-in user corresponding to "Ahmed Mahmoud"
    _currentUser = CitizenUser(
      name: 'Ahmed Mahmoud',
      nni: '2890471203',
      phone: '44123456',
      email: '24012@supnum.mr',
      wilaya: 'Nouakchott Ouest',
      moughataa: 'Tevragh-Zeina',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    );
    _isAuthenticated = true;
  }

  Future<bool> login(String nni, String password) async {
    await Future.delayed(const Duration(milliseconds: 1000));
    // Simple validation match for Mauritanian NNIs starting with 1, 2, or 3
    if (nni.length == 10) {
      _currentUser = CitizenUser(
        name: 'Ahmed Mahmoud',
        nni: nni,
        phone: '44123456',
        email: '24012@supnum.mr',
        wilaya: 'Nouakchott Ouest',
        moughataa: 'Tevragh-Zeina',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      );
      _isAuthenticated = true;
      notifyListeners();
      return true;
    }
    return false;
  }

  Future<bool> register({
    required String name,
    required String nni,
    required String phone,
    required String email,
    required String wilaya,
    required String moughataa,
  }) async {
    await Future.delayed(const Duration(milliseconds: 1200));
    _currentUser = CitizenUser(
      name: name,
      nni: nni,
      phone: phone,
      email: email,
      wilaya: wilaya,
      moughataa: moughataa,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    );
    _isAuthenticated = true;
    notifyListeners();
    return true;
  }

  void logout() {
    _currentUser = null;
    _isAuthenticated = false;
    notifyListeners();
  }
}
