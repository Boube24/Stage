import 'dart:async';

class LocationService {
  final Map<String, List<String>> _geographicMap = {
    "Nouakchott Ouest": ["Tevragh-Zeina", "Ksar", "Sebkha"],
    "Nouakchott Nord": ["Dar-Naim", "Teyarett", "Toujounine"],
    "Nouakchott Sud": ["Arafat", "El Mina", "Riyad"],
    "Dakhlet Nouadhibou": ["Nouadhibou", "Boulenouar", "Chami"],
    "Trarza": ["Rosso", "Boutilimit", "Méderdra"],
    "Adrar": ["Atar", "Chinguetti", "Ouadane"],
  };

  Map<String, List<String>> get geographicMap => _geographicMap;

  List<String> get wilayas => _geographicMap.keys.toList();

  List<String> getMoughataasForWilaya(String wilaya) {
    return _geographicMap[wilaya] ?? [];
  }

  Future<String> getCurrentGPSCoordinates() async {
    // Simulate geolocator query delay
    await Future.delayed(const Duration(milliseconds: 1500));
    return "18.0864° N, 15.9753° W"; // Standard center coordinates of Tevragh-Zeina
  }
}
