import 'package:flutter/material.dart';

class FlagWaveRibbon extends StatelessWidget {
  final double height;

  const FlagWaveRibbon({
    super.key,
    this.height = 6,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height,
      width: double.infinity,
      child: Row(
        children: [
          Expanded(
            flex: 4,
            child: Container(
              decoration: const BoxDecoration(
                color: Color(0xFF006B3F), // Mauritanian Green
                borderRadius: BorderRadius.only(bottomRight: Radius.circular(3)),
              ),
            ),
          ),
          Expanded(
            flex: 1,
            child: Container(
              color: const Color(0xFFD4AF37), // Mauritanian Gold
            ),
          ),
          Expanded(
            flex: 4,
            child: Container(
              color: const Color(0xFF006B3F),
            ),
          ),
          Expanded(
            flex: 1,
            child: Container(
              color: const Color(0xFFC1272D), // Mauritanian Red
            ),
          ),
          Expanded(
            flex: 4,
            child: Container(
              decoration: const BoxDecoration(
                color: Color(0xFF006B3F),
                borderRadius: BorderRadius.only(bottomLeft: Radius.circular(3)),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
