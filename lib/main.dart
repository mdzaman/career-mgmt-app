import 'package:careercanvas/login/LoginScreen.dart';
import 'package:careercanvas/utils/AppRoutes.dart';
import 'package:flutter/material.dart';
import 'package:careercanvas/login/signup_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Career Canvas',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      initialRoute: Routes.loginScreen,  // Set the initial route
      routes: {
        Routes.signUpScreen: (context) => SignUpScreen(),
        Routes.loginScreen: (context) => LoginScreen(),
        // You can add more routes for other screens here
        // Routes.homeScreen: (context) => HomeScreen(),
        // Routes.profileScreen: (context) => ProfileScreen(),
      },
    );
  }
}
