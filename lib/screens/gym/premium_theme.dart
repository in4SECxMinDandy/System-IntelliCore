// Premium Fitness Theme
// Modern Dark Mode with Glassmorphism

import 'package:flutter/material.dart';

class PremiumTheme {
  // Colors
  static const Color background = Color(0xFF0F0F0F);
  static const Color surfaceDark = Color(0xFF1A1A1A);
  static const Color surfaceLight = Color(0xFF2A2A2A);

  // Accent Colors
  static const Color neonLime = Color(0xFFA3E635);
  static const Color electricBlue = Color(0xFF3B82F6);
  static const Color accentCyan = Color(0xFF06B6D4);

  // Text Colors
  static const Color textPrimary = Color(0xFFFFFFFF);
  static const Color textSecondary = Color(0xFF9CA3AF);
  static const Color textMuted = Color(0xFF6B7280);

  // Glassmorphism
  static Color glassBackground = Colors.white.withOpacity(0.08);
  static Color glassBorder = Colors.white.withOpacity(0.12);

  // Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [neonLime, electricBlue],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static LinearGradient cardGradient = LinearGradient(
    colors: [
      Colors.white.withOpacity(0.1),
      Colors.white.withOpacity(0.05),
    ],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  // Shadows
  static List<BoxShadow> softShadow = [
    BoxShadow(
      color: Colors.black.withOpacity(0.3),
      blurRadius: 20,
      offset: const Offset(0, 4),
    ),
  ];

  static List<BoxShadow> glowShadow(Color color) => [
    BoxShadow(
      color: color.withOpacity(0.3),
      blurRadius: 20,
      offset: const Offset(0, 4),
    ),
  ];

  // Border Radius
  static const double radiusSmall = 8.0;
  static const double radiusMedium = 12.0;
  static const double radiusLarge = 16.0;
  static const double radiusXL = 20.0;
  static const double radiusRound = 100.0;

  // Spacing
  static const double spacingXS = 4.0;
  static const double spacingS = 8.0;
  static const double spacingM = 16.0;
  static const double spacingL = 24.0;
  static const double spacingXL = 32.0;

  // Text Styles
  static const TextStyle fontFamily = TextStyle(
    fontFamily: 'Inter',
    color: textPrimary,
  );

  static TextStyle get headingLarge => fontFamily.copyWith(
    fontSize: 28,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.5,
  );

  static TextStyle get headingMedium => fontFamily.copyWith(
    fontSize: 22,
    fontWeight: FontWeight.w600,
    letterSpacing: -0.3,
  );

  static TextStyle get headingSmall => fontFamily.copyWith(
    fontSize: 18,
    fontWeight: FontWeight.w600,
  );

  static TextStyle get titleLarge => fontFamily.copyWith(
    fontSize: 16,
    fontWeight: FontWeight.w600,
  );

  static TextStyle get titleMedium => fontFamily.copyWith(
    fontSize: 14,
    fontWeight: FontWeight.w500,
  );

  static TextStyle get bodyLarge => fontFamily.copyWith(
    fontSize: 16,
    fontWeight: FontWeight.normal,
  );

  static TextStyle get bodyMedium => fontFamily.copyWith(
    fontSize: 14,
    fontWeight: FontWeight.normal,
    color: textSecondary,
  );

  static TextStyle get labelLarge => fontFamily.copyWith(
    fontSize: 12,
    fontWeight: FontWeight.w600,
    letterSpacing: 1.2,
    color: textMuted,
  );

  static TextStyle get labelMedium => fontFamily.copyWith(
    fontSize: 11,
    fontWeight: FontWeight.w500,
    letterSpacing: 1.0,
    color: textMuted,
  );

  // Data Display Styles (for key info like time, date)
  static TextStyle get dataDisplay => fontFamily.copyWith(
    fontSize: 32,
    fontWeight: FontWeight.bold,
    letterSpacing: -1.0,
  );

  static TextStyle get dataDisplaySmall => fontFamily.copyWith(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.5,
  );

  // Theme Data
  static ThemeData get darkTheme => ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    scaffoldBackgroundColor: background,
    primaryColor: neonLime,
    colorScheme: const ColorScheme.dark(
      primary: neonLime,
      secondary: electricBlue,
      surface: surfaceDark,
      onPrimary: background,
      onSecondary: textPrimary,
      onSurface: textPrimary,
    ),
    fontFamily: 'Inter',
    appBarTheme: AppBarTheme(
      backgroundColor: background,
      elevation: 0,
      centerTitle: false,
      titleTextStyle: headingMedium,
      iconTheme: const IconThemeData(color: textPrimary),
    ),
    bottomSheetTheme: BottomSheetThemeData(
      backgroundColor: surfaceDark.withOpacity(0.95),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(radiusXL)),
      ),
    ),
  );
}

// Line Icons (using Material Icons as replacement for line-art style)
class LineIcons {
  static const IconData calendar = Icons.calendar_today_outlined;
  static const IconData clock = Icons.access_time_outlined;
  static const IconData flame = Icons.local_fire_department_outlined;
  static const IconData dumbbell = Icons.fitness_center_outlined;
  static const IconData timer = Icons.timer_outlined;
  static const IconData check = Icons.check_circle_outline;
  static const IconData chevronRight = Icons.chevron_right;
  static const IconData add = Icons.add_circle_outline;
  static const IconData close = Icons.close;
  static const IconData play = Icons.play_arrow_rounded;
  static const IconData pause = Icons.pause_circle_outline;
}
