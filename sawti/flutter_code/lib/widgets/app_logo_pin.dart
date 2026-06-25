import 'package:flutter/material.dart';

class AppLogoPin extends StatelessWidget {
  final double size;
  final Color pinColor;
  final Color innerColor;

  const AppLogoPin({
    super.key,
    this.size = 80,
    this.pinColor = const Color(0xFFC1272D), // Mauritanian Red
    this.innerColor = const Color(0xFF006B3F), // Mauritanian Green
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // The Outer Location Pin Path
          CustomPaint(
            size: Size(size, size),
            painter: PinPainter(color: pinColor),
          ),
          // Inner circular content
          Positioned(
            top: size * 0.12,
            child: Container(
              width: size * 0.5,
              height: size * 0.5,
              decoration: const BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
              ),
              padding: const EdgeInsets.all(2),
              child: Container(
                decoration: BoxDecoration(
                  color: innerColor,
                  shape: BoxShape.circle,
                ),
                alignment: Alignment.center,
                child: Text(
                  'S',
                  style: TextStyle(
                    color: const Color(0xFFD4AF37), // Gold
                    fontWeight: FontWeight.black,
                    fontSize: size * 0.28,
                    fontFamily: 'monospace',
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class PinPainter extends CustomPainter {
  final Color color;

  PinPainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    final path = Path();
    final w = size.width;
    final h = size.height;

    path.moveTo(w / 2, h);
    // Left curve up to top circle
    path.cubicTo(w * 0.05, h * 0.65, 0, h * 0.45, 0, h * 0.35);
    path.cubicTo(0, h * 0.15, w * 0.22, 0, w / 2, 0);
    // Right curve down to point
    path.cubicTo(w * 0.78, 0, w, h * 0.15, w, h * 0.35);
    path.cubicTo(w, h * 0.45, w * 0.95, h * 0.65, w / 2, h);
    path.close();

    // Drop Shadow
    final shadowPaint = Paint()
      ..color = Colors.black.withOpacity(0.15)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 4);
    canvas.drawCircle(Offset(w / 2, h), 4, shadowPaint);

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
