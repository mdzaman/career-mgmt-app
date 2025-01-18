import 'package:careercanvas/utils/AppColors.dart';
import 'package:careercanvas/utils/AppTextStyles.dart';
import 'package:careercanvas/utils/CustomBackButton.dart';
import 'package:careercanvas/utils/custom_text_form_field.dart';
import 'package:flutter/material.dart';

class SignUpScreen extends StatelessWidget {
  const SignUpScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var height = MediaQuery.of(context).size.height;

    return WillPopScope(
      onWillPop: () async {
        Navigator.of(context).pop();
        return true; // Allow back navigation
      },
      child: Scaffold(
        backgroundColor: AppColors.background,
        body: GestureDetector(
          onTap: () => FocusScope.of(context).unfocus(),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Stack(
                  children: [
                    Container(
                      height: height * 0.3,
                      width: double.infinity, // Full screen width
                      decoration: const BoxDecoration(
                        color: AppColors.primary,
                        borderRadius: BorderRadius.vertical(
                          bottom: Radius.circular(24.0),
                        ),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(24.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const SizedBox(height: 40), // Offset from top
                            Text(
                              "Hello,",
                              style: AppTextStyles.headlineSmall,
                            ),
                            const SizedBox(height: 8.0),
                            Text(
                              "Sign Up",
                              style: AppTextStyles.headlineMedium,
                            ),
                          ],
                        ),
                      ),
                    ),
                    Positioned(
                      top: 30.0,
                      left: 8.0,
                      child: CustomBackButton(
                        iconColor: Colors.white,
                        onPressed: () {
                          Navigator.of(context).pop(); // Handle back navigation
                        },
                      ),
                    ),
                  ],
                ),
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      CustomTextFormField(
                        labelText: "Username",
                        hintText: "Enter your username",
                        textInputType: TextInputType.text,
                      ),
                      const SizedBox(height: 16.0),
                      CustomTextFormField(
                        labelText: "Email Address",
                        hintText: "Enter your email address",
                        keyboardType: TextInputType.emailAddress,
                      ),
                      const SizedBox(height: 16.0),
                      CustomTextFormField(
                        labelText: "Password",
                        hintText: "Enter your password",
                        obscureText: true,
                        suffixIcon:
                            const Icon(Icons.lock, color: AppColors.grey),
                      ),
                      const SizedBox(height: 24.0),
                      ElevatedButton(
                        onPressed: () {
                          // Handle sign-up logic here
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          padding: const EdgeInsets.symmetric(
                            vertical: 12.0,
                            horizontal: 32.0,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8.0),
                          ),
                        ),
                        child: Text(
                          "Sign Up",
                          style: AppTextStyles.button,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
