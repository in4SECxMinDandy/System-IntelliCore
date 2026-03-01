// Premium Gym Session Card
// Glassmorphism UI Component

import 'dart:ui';
import 'package:flutter/material.dart';
import 'premium_theme.dart';
import 'gym_session.dart';

class GymSessionCard extends StatelessWidget {
  final GymSession session;
  final VoidCallback? onTap;
  final VoidCallback? onComplete;
  final Color? accentColor;

  const GymSessionCard({
    super.key,
    required this.session,
    this.onTap,
    this.onComplete,
    this.accentColor,
  });

  @override
  Widget build(BuildContext context) {
    final accent = accentColor ?? PremiumTheme.neonLime;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: PremiumTheme.spacingM),
        decoration: BoxDecoration(
          gradient: PremiumTheme.cardGradient,
          borderRadius: BorderRadius.circular(PremiumTheme.radiusXL),
          border: Border.all(color: PremiumTheme.glassBorder, width: 1),
          boxShadow: PremiumTheme.softShadow,
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(PremiumTheme.radiusXL),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
            child: Padding(
              padding: const EdgeInsets.all(PremiumTheme.spacingL),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header Row: Gym Type + Status
                  _buildHeader(accent),
                  const SizedBox(height: PremiumTheme.spacingL),

                  // Info Grid
                  _buildInfoGrid(accent),

                  // Action Row
                  if (onComplete != null && !session.isCompleted)
                    _buildActionRow(accent),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(Color accent) {
    return Row(
      children: [
        // Gym Type Badge
        Container(
          padding: const EdgeInsets.symmetric(
            horizontal: PremiumTheme.spacingM,
            vertical: PremiumTheme.spacingS,
          ),
          decoration: BoxDecoration(
            color: accent.withOpacity(0.15),
            borderRadius: BorderRadius.circular(PremiumTheme.radiusMedium),
            border: Border.all(color: accent.withOpacity(0.3), width: 1),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(LineIcons.dumbbell, color: accent, size: 18),
              const SizedBox(width: PremiumTheme.spacingS),
              Text(
                session.gymType,
                style: PremiumTheme.titleMedium.copyWith(
                  color: accent,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),

        const Spacer(),

        // Status Badge
        _buildStatusBadge(),
      ],
    );
  }

  Widget _buildStatusBadge() {
    Color bgColor;
    Color textColor;
    String text;
    IconData icon;

    if (session.isCompleted) {
      bgColor = PremiumTheme.neonLime.withOpacity(0.15);
      textColor = PremiumTheme.neonLime;
      text = 'HOÀN THÀNH';
      icon = LineIcons.check;
    } else if (session.isOverdue) {
      bgColor = Colors.red.withOpacity(0.15);
      textColor = Colors.red.shade400;
      text = 'QUÁ HẠN';
      icon = Icons.warning_amber_outlined;
    } else if (session.isUpcoming) {
      bgColor = PremiumTheme.electricBlue.withOpacity(0.15);
      textColor = PremiumTheme.electricBlue;
      text = 'SẮP TỚI';
      icon = LineIcons.clock;
    } else {
      bgColor = PremiumTheme.textMuted.withOpacity(0.15);
      textColor = PremiumTheme.textMuted;
      text = 'HÔM NAY';
      icon = LineIcons.calendar;
    }

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: PremiumTheme.spacingM,
        vertical: PremiumTheme.spacingS,
      ),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(PremiumTheme.radiusMedium),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: textColor, size: 14),
          const SizedBox(width: 6),
          Text(
            text,
            style: PremiumTheme.labelMedium.copyWith(
              color: textColor,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoGrid(Color accent) {
    return Row(
      children: [
        // Date
        Expanded(
          child: _InfoTile(
            icon: LineIcons.calendar,
            label: 'NGÀY',
            value: _formatDate(session.scheduledTime),
            accentColor: accent,
          ),
        ),

        // Time
        Expanded(
          child: _InfoTile(
            icon: LineIcons.clock,
            label: 'GIỜ',
            value: session.timeStr,
            accentColor: accent,
          ),
        ),

        // Duration
        Expanded(
          child: _InfoTile(
            icon: LineIcons.timer,
            label: 'THỜI LƯỢNG',
            value: session.durationStr,
            accentColor: accent,
          ),
        ),
      ],
    );
  }

  Widget _buildActionRow(Color accent) {
    return Padding(
      padding: const EdgeInsets.only(top: PremiumTheme.spacingL),
      child: Row(
        children: [
          // Calories
          Container(
            padding: const EdgeInsets.symmetric(
              horizontal: PremiumTheme.spacingM,
              vertical: PremiumTheme.spacingS,
            ),
            decoration: BoxDecoration(
              color: PremiumTheme.surfaceLight.withOpacity(0.5),
              borderRadius: BorderRadius.circular(PremiumTheme.radiusMedium),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(LineIcons.flame, color: Colors.orange.shade400, size: 16),
                const SizedBox(width: 6),
                Text(
                  '~${session.estimatedCalories.toInt()} calo',
                  style: PremiumTheme.labelLarge.copyWith(
                    color: PremiumTheme.textSecondary,
                  ),
                ),
              ],
            ),
          ),

          const Spacer(),

          // Complete Button
          GestureDetector(
            onTap: onComplete,
            child: Container(
              padding: const EdgeInsets.symmetric(
                horizontal: PremiumTheme.spacingL,
                vertical: PremiumTheme.spacingM,
              ),
              decoration: BoxDecoration(
                gradient: PremiumTheme.primaryGradient,
                borderRadius: BorderRadius.circular(PremiumTheme.radiusMedium),
                boxShadow: PremiumTheme.glowShadow(accent),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(
                    LineIcons.check,
                    color: PremiumTheme.background,
                    size: 18,
                  ),
                  const SizedBox(width: PremiumTheme.spacingS),
                  Text(
                    'Hoàn thành',
                    style: PremiumTheme.titleMedium.copyWith(
                      color: PremiumTheme.background,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    final months = [
      'T1',
      'T2',
      'T3',
      'T4',
      'T5',
      'T6',
      'T7',
      'T8',
      'T9',
      'T10',
      'T11',
      'T12',
    ];
    return '${date.day}/${months[date.month - 1]}';
  }
}

// Individual Info Tile
class _InfoTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color accentColor;

  const _InfoTile({
    required this.icon,
    required this.label,
    required this.value,
    required this.accentColor,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Label
        Row(
          children: [
            Icon(icon, color: accentColor, size: 14),
            const SizedBox(width: 6),
            Text(label, style: PremiumTheme.labelLarge),
          ],
        ),
        const SizedBox(height: PremiumTheme.spacingS),

        // Value - Large display
        Text(
          value,
          style: PremiumTheme.dataDisplaySmall.copyWith(
            color: PremiumTheme.textPrimary,
          ),
        ),
      ],
    );
  }
}

// Compact Card Variant (for list views)
class GymSessionCardCompact extends StatelessWidget {
  final GymSession session;
  final VoidCallback? onTap;
  final Color? accentColor;

  const GymSessionCardCompact({
    super.key,
    required this.session,
    this.onTap,
    this.accentColor,
  });

  @override
  Widget build(BuildContext context) {
    final accent = accentColor ?? PremiumTheme.neonLime;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: PremiumTheme.spacingS),
        padding: const EdgeInsets.all(PremiumTheme.spacingM),
        decoration: BoxDecoration(
          gradient: PremiumTheme.cardGradient,
          borderRadius: BorderRadius.circular(PremiumTheme.radiusLarge),
          border: Border.all(color: PremiumTheme.glassBorder, width: 1),
        ),
        child: Row(
          children: [
            // Time Circle
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: accent.withOpacity(0.15),
                shape: BoxShape.circle,
                border: Border.all(color: accent.withOpacity(0.3), width: 2),
              ),
              child: Center(
                child: Text(
                  session.timeStr,
                  style: PremiumTheme.titleMedium.copyWith(
                    color: accent,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
            const SizedBox(width: PremiumTheme.spacingM),

            // Info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(session.gymType, style: PremiumTheme.titleLarge),
                  const SizedBox(height: 4),
                  Text(session.durationStr, style: PremiumTheme.bodyMedium),
                ],
              ),
            ),

            // Status Icon
            Icon(
              session.isCompleted ? LineIcons.check : LineIcons.chevronRight,
              color: session.isCompleted
                  ? PremiumTheme.neonLime
                  : PremiumTheme.textMuted,
            ),
          ],
        ),
      ),
    );
  }
}
