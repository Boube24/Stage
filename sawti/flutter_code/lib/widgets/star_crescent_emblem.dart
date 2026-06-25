import 'package:flutter/material.dart';

class StarCrescentEmblem extends StatelessWidget {
  final double size;
  final Color primaryColor;
  final Color accentColor;

  const StarCrescentEmblem({
    super.key,
    this.size = 100,
    this.primaryColor = const Color(0xFF006B3F),
    this.accentColor = const Color(0xFFD4AF37),
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: primaryColor.withOpacity(0.1),
        shape: BoxShape.circle,
        border: Border.all(
          color: accentColor.withOpacity(0.5),
          width: 2,
        ),
        boxShadow: [
          BoxShadow(
            color: accentColor.withOpacity(0.05),
            blurRadius: 10,
            spreadRadius: 2,
          )
        ],
      ),
      padding: EdgeInsets.all(size * 0.12),
      child: Container(
        decoration: BoxDecoration(
          color: primaryColor,
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.15),
              blurRadius: 6,
              offset: const Offset(0, 3),
            )
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.star_rounded,
              color: accentColor,
              size: size * 0.28,
            ),
            SizedBox(height: size * 0.02),
            CustomPaint(
              size: Size(size * 0.35, size * 0.15),
              painter: EmblemCrescentPainter(color: accentColor),
            ),
          ],
        ),
      ),
    );
  }
}

class EmblemCrescentPainter extends CustomPainter {
  final Color color;

  EmblemCrescentPainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    final path = Path();
    path.moveTo(0, 0);
    path.quadraticBezierTo(size.width / 2, size.height * 1.6, size.width, 0);
    path.quadraticBezierTo(size.width / 2, size.height * 0.7, 0, 0);
    path.close();

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
