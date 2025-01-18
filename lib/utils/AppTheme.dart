import 'package:careercanvas/utils/AppColors.dart';
import 'package:careercanvas/utils/Sizes.dart';
import 'package:flutter/material.dart';

class AppTheme {
  static ThemeData lightTheme = ThemeData(
    primaryColor: AppColors.blue,
    scaffoldBackgroundColor: AppColors.white,
    textTheme: TextTheme(
      headlineSmall: TextStyle(
        fontSize: Sizes.TEXT_SIZE_40,
        fontWeight: FontWeight.bold,
        color: AppColors.black,
      ),
      bodyMedium: TextStyle(
        fontSize: Sizes.TEXT_SIZE_14,
        color: AppColors.greyShade8,
        fontWeight: FontWeight.bold,
      ),
      labelLarge: TextStyle(
        fontSize: Sizes.TEXT_SIZE_14,
        fontWeight: FontWeight.w600,
      ),
    ),
  );
}



class Decorations {
  static BoxDecoration customBoxDecoration({
    Color color = AppColors.white,
    double blurRadius = 5.0,
    double borderRadius = 10.0,
  }) {
    return BoxDecoration(
      color: color,
      borderRadius: BorderRadius.circular(borderRadius),
      boxShadow: [
        BoxShadow(
          color: Colors.black26,
          blurRadius: blurRadius,
          offset: Offset(0, 4),
        ),
      ],
    );
  }
}

class Borders {
  static BorderSide customBorder({Color color = AppColors.greyShade8, double width = 1.0}) {
    return BorderSide(color: color, width: width);
  }

  static customOutlineInputBorder({color}) {}
}