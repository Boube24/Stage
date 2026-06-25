import 'package:flutter/material.dart';

class MauritaniaFlag extends StatelessWidget {
  final double width;
  final double height;
  final double borderRadius;

  const MauritaniaFlag({
    super.key,
    this.width = 120,
    this.height = 80,
    this.borderRadius = 8,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(borderRadius),
      child: Container(
        width: width,
        height: height,
        decoration: const BoxDecoration(
          color: Color(0xFF006B3F), // Mauritanian Green
        ),
        child: Stack(
          children: [
            // Top Red Stripe
            Positioned(
              top: 0,
              left: 0,
              right: 0,
              height: height * 0.15,
              child: Container(color: const Color(0xFFC1272D)),
            ),
            // Bottom Red Stripe
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              height: height * 0.15,
              child: Container(color: const Color(0xFFC1272D)),
            ),
            // Crescent and Star center decoration
            Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Star (Five-pointed)
                  Icon(
                    Icons.star,
                    color: const Color(0xFFD4AF37),
                    size: height * 0.22,
                  ),
                  SizedBox(height: height * 0.02),
                  // Crescent Moon (custom drawn using clip or overlayed containers)
                  SizedBox(
                    width: height * 0.35,
                    height: height * 0.2,
                    child: CustomPaint(
                      painter: CrescentPainter(color: const Color(0xFFD4AF37)),
                    ),
                  )
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class CrescentPainter extends CustomPainter {
  final Color color;

  CrescentPainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    final path = Path();
    // Simple upward crescent representation
    path.moveTo(0, 0);
    path.quadraticBezierTo(size.width / 2, size.height * 1.5, size.width, 0);
    path.quadraticBezierTo(size.width / 2, size.height * 0.6, 0, 0);
    path.close();

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
