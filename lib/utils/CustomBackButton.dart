import 'package:flutter/material.dart';

class CustomBackButton extends StatelessWidget {
  final VoidCallback? onPressed;
  final Color? iconColor;

  const CustomBackButton({
    Key? key,
    this.onPressed,
    this.iconColor,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return IconButton(
      icon: Icon(
        size:20,
        Icons.arrow_back_ios,
        color: iconColor ?? Colors.white, // Default to white if no color is provided
      ),
      onPressed: onPressed ?? () => Navigator.of(context).pop(),
    );
  }
}
