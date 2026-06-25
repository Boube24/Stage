import 'package:flutter/material.dart';

class CitySkylineSilhouette extends StatelessWidget {
  final double height;
  final Color color;

  const CitySkylineSilhouette({
    super.key,
    this.height = 100,
    this.color = const Color(0xFF0D3E26), // Dark Greenish tint
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: height,
      child: CustomPaint(
        painter: SkylinePainter(color: color),
      ),
    );
  }
}

class SkylinePainter extends CustomPainter {
  final Color color;

  SkylinePainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    final path = Path();
    final w = size.width;
    final h = size.height;

    path.moveTo(0, h);
    path.lineTo(0, h * 0.7);
    
    // First building
    path.lineTo(w * 0.08, h * 0.7);
    path.lineTo(w * 0.08, h * 0.45);
    path.lineTo(w * 0.15, h * 0.45);
    path.lineTo(w * 0.15, h * 0.7);

    // Traditional minaret (mosque tower) representation
    path.lineTo(w * 0.22, h * 0.7);
    path.lineTo(w * 0.22, h * 0.2); // Tall tower
    path.lineTo(w * 0.25, h * 0.15); // Pointy top
    path.lineTo(w * 0.28, h * 0.2);
    path.lineTo(w * 0.28, h * 0.7);

    // Domed structure
    path.lineTo(w * 0.32, h * 0.7);
    path.arcToPoint(
      Offset(w * 0.44, h * 0.7),
      radius: Radius.circular(w * 0.06),
      clockwise: false,
    );

    // Modern office blocks
    path.lineTo(w * 0.52, h * 0.7);
    path.lineTo(w * 0.52, h * 0.3);
    path.lineTo(w * 0.62, h * 0.3);
    path.lineTo(w * 0.62, h * 0.5);
    path.lineTo(w * 0.68, h * 0.5);
    path.lineTo(w * 0.68, h * 0.7);

    // Palm tree silhouette
    path.lineTo(w * 0.75, h * 0.7);
    path.quadraticBezierTo(w * 0.77, h * 0.5, w * 0.76, h * 0.4); // Trunk
    path.lineTo(w * 0.72, h * 0.36); // Left branch
    path.lineTo(w * 0.76, h * 0.4);
    path.lineTo(w * 0.8, h * 0.36); // Right branch
    path.lineTo(w * 0.76, h * 0.4);
    path.lineTo(w * 0.76, h * 0.7); // Back to bottom

    // Final building block
    path.lineTo(w * 0.85, h * 0.7);
    path.lineTo(w * 0.85, h * 0.4);
    path.lineTo(w * 0.95, h * 0.4);
    path.lineTo(w * 0.95, h * 0.8);
    
    path.lineTo(w, h * 0.8);
    path.lineTo(w, h);
    path.close();

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
