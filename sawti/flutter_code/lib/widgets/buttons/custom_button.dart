import 'package:flutter/material.dart';

enum ButtonVariant { primary, secondary, danger, outline }

class CustomButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final IconData? icon;
  final ButtonVariant variant;
  final double height;
  final double borderRadius;

  const CustomButton({
    super.key,
    required this.text,
    this.onPressed,
    this.isLoading = false,
    this.icon,
    this.variant = ButtonVariant.primary,
    this.height = 50,
    this.borderRadius = 12,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    Color getBgColor() {
      if (onPressed == null) return Colors.grey.shade300;
      switch (variant) {
        case ButtonVariant.primary:
          return const Color(0xFF006B3F); // Mauritanian Green
        case ButtonVariant.secondary:
          return const Color(0xFFD4AF37); // Gold
        case ButtonVariant.danger:
          return const Color(0xFFC1272D); // Red
        case ButtonVariant.outline:
          return Colors.transparent;
      }
    }

    Color getFgColor() {
      if (onPressed == null) return Colors.grey.shade600;
      switch (variant) {
        case ButtonVariant.primary:
        case ButtonVariant.danger:
          return Colors.white;
        case ButtonVariant.secondary:
          return Colors.slate.shade900;
        case ButtonVariant.outline:
          return const Color(0xFF006B3F);
      }
    }

    Border? getBorder() {
      if (variant == ButtonVariant.outline) {
        return Border.all(
          color: onPressed == null ? Colors.grey.shade400 : const Color(0xFF006B3F),
          width: 2,
        );
      }
      return null;
    }

    return SizedBox(
      width: double.infinity,
      height: height,
      child: Container(
        decoration: BoxDecoration(
          color: getBgColor(),
          borderRadius: BorderRadius.circular(borderRadius),
          border: getBorder(),
          boxShadow: variant != ButtonVariant.outline && onPressed != null
              ? [
                  BoxShadow(
                    color: getBgColor().withOpacity(0.2),
                    blurRadius: 8,
                    offset: const Offset(0, 3),
                  )
                ]
              : null,
        ),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: isLoading ? null : onPressed,
            borderRadius: BorderRadius.circular(borderRadius),
            child: Center(
              child: isLoading
                  ? SizedBox(
                      width: height * 0.45,
                      height: height * 0.45,
                      child: CircularProgressIndicator(
                        strokeWidth: 2.5,
                        valueColor: AlwaysStoppedAnimation<Color>(getFgColor()),
                      ),
                    )
                  : Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        if (icon != null) ...[
                          Icon(icon, color: getFgColor(), size: height * 0.42),
                          const SizedBox(width: 8),
                        ],
                        Text(
                          text,
                          style: theme.textTheme.labelLarge?.copyWith(
                            color: getFgColor(),
                            fontWeight: FontWeight.bold,
                            fontSize: 15,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ],
                    ),
            ),
          ),
        ),
      ),
    );
  }
}
