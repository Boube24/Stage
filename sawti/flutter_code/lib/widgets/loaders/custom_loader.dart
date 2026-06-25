import 'package:flutter/material.dart';

class CustomLoader extends StatefulWidget {
  final double size;
  final String? message;

  const CustomLoader({
    super.key,
    this.size = 50,
    this.message,
  });

  @override
  State<CustomLoader> createState() => _CustomLoaderState();
}

class _CustomLoaderState extends State<CustomLoader> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        mainAxisSize: MainAxisSize.min,
        children: [
          RotationTransition(
            turns: _controller,
            child: SizedBox(
              width: widget.size,
              height: widget.size,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  CircularProgressIndicator(
                    valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF006B3F)),
                    strokeWidth: 3,
                    backgroundColor: const Color(0xFFD4AF37).withOpacity(0.2),
                  ),
                  Icon(
                    Icons.star_rounded,
                    color: const Color(0xFFD4AF37),
                    size: widget.size * 0.45,
                  ),
                ],
              ),
            ),
          ),
          if (widget.message != null) ...[
            const SizedBox(height: 14),
            Text(
              widget.message!,
              style: TextStyle(
                color: Colors.grey.shade600,
                fontSize: 13,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
