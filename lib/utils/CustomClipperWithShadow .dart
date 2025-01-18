import 'package:careercanvas/utils/AppColors.dart';
import 'package:flutter/material.dart';

class CustomClipperWithShadow extends StatelessWidget {
  final Widget child;
  final double height;
  final double width;

  const CustomClipperWithShadow({required this.child, required this.height, required this.width});

  @override
  Widget build(BuildContext context) {
    return ClipPath(
      clipper: _CustomClipper(), // Ensure we are calling the right custom clipper
      child: Container(
        height: height,
        width: width,
        decoration: BoxDecoration(
          color: AppColors.blue,
          boxShadow: [
            BoxShadow(
              blurRadius: 24,
              color: AppColors.blue,
            ),
          ],
        ),
        child: child,
      ),
    );
  }
}

class _CustomClipper extends CustomClipper<Path> {  // Naming the class with an underscore to make it private
  @override
  Path getClip(Size size) {
    final path = Path();
    path.lineTo(0, 0);
    path.quadraticBezierTo(size.width * 0.3, size.height * 0.2, size.width, 0);
    path.lineTo(size.width, size.height);
    path.lineTo(0, size.height);
    path.close();
    return path;
  }

  @override
  bool shouldReclip(CustomClipper<Path> oldClipper) {
    return false;
  }
}
