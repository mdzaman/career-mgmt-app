import 'package:careercanvas/login/signup_screen.dart';
import 'package:careercanvas/utils/AppColors.dart';
import 'package:careercanvas/utils/AppRoutes.dart';
import 'package:careercanvas/utils/AppSpace.dart';
import 'package:careercanvas/utils/AppTextStyles.dart';
import 'package:careercanvas/utils/AppTheme.dart';
import 'package:careercanvas/utils/CustomButton.dart';
import 'package:careercanvas/utils/CustomClipperWithShadow%20.dart';
import 'package:careercanvas/utils/Sizes.dart';
import 'package:careercanvas/utils/StringConst.dart';
import 'package:careercanvas/utils/custom_text_form_field.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_icon_class/font_awesome_icon_class.dart';

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  bool isSwitched = false;

  @override
  Widget build(BuildContext context) {
    var height = MediaQuery.of(context).size.height;

    final theme = Theme.of(context);
    final screenHeight = MediaQuery.of(context).size.height;

    return Scaffold(
      body: GestureDetector(
        onTap: () {
          FocusScope.of(context).unfocus();
        },
        child: Stack(
          children: [
            //_buildHeaderBackground(screenHeight, screenWidth, theme),
            Container(
              height: height * 0.3,
              width: double
                  .infinity, // Ensure the container covers the full screen width

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
                    Text(
                      StringConst.WELCOME_BACK,
                        style: AppTextStyles.headlineSmall,
                    ),
                    Text(
                      StringConst.User,
                        style: AppTextStyles.headlineMedium,
                    ),
                  ],
                ),
              ),
            ),
            ListView(
              padding: EdgeInsets.zero,
              children: [
                SizedBox(height: screenHeight * 0.35),
                Padding(
                  padding: EdgeInsets.symmetric(horizontal: Sizes.MARGIN_20),
                  child: _buildForm(theme),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeaderBackground(
      double screenHeight, double screenWidth, ThemeData theme) {
    return CustomClipperWithShadow(
      height: screenHeight * 0.4,
      width: screenWidth,
      child: Padding(
        padding:
            EdgeInsets.only(left: Sizes.MARGIN_24, top: screenHeight * 0.1),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              StringConst.WELCOME_BACK,
              style: AppTextStyles.customTextStyle,
            ),
            Text(
              StringConst.User,
              style: AppTextStyles.customTextStyle,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildForm(ThemeData theme) {
    return Column(
      children: [
        CustomTextFormField(
          textInputType: TextInputType.text,
          labelText: StringConst.EMAIL_ADDRESS,
          border: Borders.customOutlineInputBorder(),
          enabledBorder: Borders.customOutlineInputBorder(),
          focusedBorder:
              Borders.customOutlineInputBorder(color: AppColors.violetShade200),
          labelStyle: AppTextStyles.customTextStyle,
          hintTextStyle: AppTextStyles.customTextStyle,
          textStyle: AppTextStyles.customTextStyle,
        ),
        SpaceH20(),
        CustomTextFormField(
          textInputType: TextInputType.text,
          labelText: StringConst.PASSWORD,
          obscureText: true,
          hasSuffixIcon: true,
          suffixIcon:
              Icon(FontAwesomeIcons.lock, color: AppColors.blackShade10),
          border: Borders.customOutlineInputBorder(),
          enabledBorder: Borders.customOutlineInputBorder(),
          focusedBorder:
              Borders.customOutlineInputBorder(color: AppColors.violetShade200),
          labelStyle: AppTextStyles.customTextStyle,
          hintTextStyle: AppTextStyles.customTextStyle,
          textStyle: AppTextStyles.customTextStyle,
        ),
        SpaceH12(),
        _buildRememberMeRow(theme),
        SpaceH8(),
        _buildLoginButton(theme),

        SpaceH2(),
        GestureDetector(
          child: Container(
            child: Text("Don't have an account? Sign Up", style: AppTextStyles.customTextStyle,)),
          onTap: () {
            Navigator.pushNamed(context, Routes.signUpScreen);
          },
        ),
        //_buildFacebookButton(context),
        SpaceH24(),
        //_buildEmailButton(context),
        SpaceH24(),
        _buildSocialMediaButtons(),
      ],
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

  Widget _buildCustomButton({
    required String title,
    required Color color,
    required VoidCallback onPressed,
    Icon? icon,
    BorderSide? borderSide,
  }) {
    return Container(
      //decoration: Decorations.customBoxDecoration(blurRadius: 10),
      width: MediaQuery.of(context).size.width * 0.8, // Full width of screen
      child: CustomButton(
        title: title,
        elevation: Sizes.ELEVATION_12,
        hasIcon: icon != null,
        icon: icon,
        color: color,
        borderSide: borderSide,
        textStyle:
            AppTextStyles.button, // Using AppTextStyles for consistent styling
        onPressed: onPressed,
      ),
    );
  }

  Widget _buildEmailButton(BuildContext context) {
    return Container(
      width: MediaQuery.of(context).size.width * 0.6,
      child: _buildCustomButton(
        title: StringConst.USE_EMAIL,
        color: AppColors.blue,
        borderSide: Borders.customBorder(width: 1.5),
        onPressed: () {
          // Use Navigator.push if ExtendedNavigator isn't used.
          // Navigator.pushNamed(context, Routes.signUpScreen);
        },
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
        SpaceW16(),
        _buildSocialMediaButton(
          AppColors.facebookBlue,
          FontAwesomeIcons.facebook,
          "facebook",
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

  Widget _buildRememberMeRow(ThemeData theme) {
    return Row(
      children: [
        Switch(
          value: isSwitched,
          onChanged: (value) => setState(() => isSwitched = value),
          activeTrackColor: AppColors.greyShade8,
          activeColor: AppColors.blue,
        ),
        Text(
          StringConst.REMEMBER_ME,
          style: theme.textTheme.labelSmall?.copyWith(
              color: AppColors.blackShade10, fontSize: Sizes.TEXT_SIZE_14),
        ),
        Spacer(),
        Text(
          StringConst.FORGOT_PASSWORD,
          style: theme.textTheme.titleSmall?.copyWith(
            color: AppColors.blackShade10,
            fontSize: Sizes.TEXT_SIZE_14,
          ),
        ),
      ],
    );
  }

  Widget _buildLoginButton(ThemeData theme) {
    return Container(
      width: Sizes.WIDTH_180,
      child: CustomButton(
        title: StringConst.LOG_IN,
        elevation: Sizes.ELEVATION_8,
        textStyle: AppTextStyles.bodyText,
        color: AppColors.blue,
        height: Sizes.HEIGHT_40,
        onPressed: () {
          // Handle login action here
        },
      ),
    );
  }
}
