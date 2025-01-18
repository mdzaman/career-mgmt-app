import 'package:careercanvas/utils/AppColors.dart';
import 'package:careercanvas/utils/AppRoutes.dart';
import 'package:careercanvas/utils/AppSpace.dart';
import 'package:careercanvas/utils/AppTextStyles.dart';
import 'package:careercanvas/utils/AppTheme.dart';
import 'package:careercanvas/utils/CustomButton.dart';
import 'package:careercanvas/utils/Sizes.dart';
import 'package:careercanvas/utils/StringConst.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_icon_class/font_awesome_icon_class.dart';

class SignUpScreen extends StatelessWidget {
  final ThemeData theme;

  SignUpScreen({required this.theme});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: <Widget>[
            Spacer(flex: 1),
            Icon(
              Icons.all_inclusive,
              size: 200,
              color: AppColors.blue,
            ),
            Spacer(flex: 1),
            _buildHeader(context),
            _buildSubtitle(context),
            // Spacer(flex: 1),
            // _buildFacebookButton(context),
            // SpaceH24(),
            // _buildEmailButton(context),
            // Spacer(flex: 1),
            // _buildSocialMediaButtons(),
            Spacer(flex: 1),
            _buildFooter(context),
            Spacer(flex: 1),
          ],
        ),
      ),
    );
  }
Widget _buildHeader(BuildContext context) {
  return Text(
    StringConst.SIGN_UP,
    style: AppTextStyles.headlineMedium.copyWith(
      color: AppColors.black,
    ),
  );
}

Widget _buildSubtitle(BuildContext context) {
  return Text(
    StringConst.EASY_SIGN_UP,
    style: AppTextStyles.subtitle.copyWith(
      color: AppColors.greyShade8,
      fontWeight: FontWeight.bold,
    ),
  );
}

Widget _buildFacebookButton(BuildContext context) {
  return _buildCustomButton(
    title: StringConst.CONTINUE_WITH_FACEBOOK,
    icon: Icon(FontAwesomeIcons.facebookF, color: AppColors.white),
    color: AppColors.blue,
    onPressed: () {
      // Handle Facebook button action
    },
  );
}


  Widget _buildEmailButton(BuildContext context) {
  final double buttonWidth = MediaQuery.of(context).size.width * 0.6;

  return Container(
    width: buttonWidth,
    child: _buildCustomButton(
      title: StringConst.USE_EMAIL,
      color: AppColors.white,
      borderSide: Borders.customBorder(width: 1.5),
      onPressed: () {
        // Use Navigator.push if ExtendedNavigator isn't used.
        //Navigator.pushNamed(context, Routes.signUpScreen);
      },
    ),
  );
}

Widget _buildCustomButton({
  required String title,
  required Color color,
  required VoidCallback onPressed,
  Icon? icon,
  BorderSide? borderSide,
}) {
  return Container(
    decoration: Decorations.customBoxDecoration(blurRadius: 10),
    width: 0.8, // Assuming this refers to the width ratio of the screen, modify as needed
    child: CustomButton(
      title: title,
      elevation: Sizes.ELEVATION_12,
      hasIcon: icon != null,
      icon: icon,
      color: color,
      borderSide: borderSide,
      textStyle: AppTextStyles.button, // Using AppTextStyles for consistent styling
      onPressed: onPressed,
    ),
  );
}

  Widget _buildSocialMediaButtons() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget>[
        _buildSocialMediaButton(
          AppColors.twitterBlue,
          FontAwesomeIcons.twitter,
          "twitter",
        ),
        SpaceW16(),
        _buildSocialMediaButton(
          AppColors.googleRed,
          FontAwesomeIcons.google,
          "google",
        ),
        SpaceW16(),
        _buildSocialMediaButton(
          AppColors.linkedInBlue,
          FontAwesomeIcons.linkedin,
          "linkedIn",
        ),
      ],
    );
  }

  Widget _buildSocialMediaButton(Color color, IconData icon, String heroTag) {
    return FloatingActionButton(
      backgroundColor: color,
      onPressed: () {},
      mini: true,
      child: Icon(
        icon,
        color: AppColors.white,
        size: Sizes.ICON_SIZE_18,
      ),
      heroTag: heroTag,
    );
  }

  Widget _buildFooter(BuildContext context) {
    return InkWell(
      onTap: () => Navigator.pushNamed(context, Routes.loginScreen),
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: RichText(
          text: TextSpan(
            children: [
              TextSpan(
                text: StringConst.ALREADY_HAVE_AN_ACCOUNT,
                style: Theme.of(context).textTheme.labelSmall?.copyWith(
                      color: AppColors.greyShade8,
                      fontSize: Sizes.TEXT_SIZE_14,
                      fontWeight: FontWeight.bold,
                    ),
              ),
              TextSpan(
                text: StringConst.LOG_IN,
                style: Theme.of(context).textTheme.titleSmall?.copyWith(
                      color: AppColors.purple,
                      fontSize: Sizes.TEXT_SIZE_14,
                      decoration: TextDecoration.underline,
                      fontWeight: FontWeight.bold,
                    ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
