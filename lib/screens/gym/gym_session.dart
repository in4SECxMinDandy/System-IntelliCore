// Gym Session Model
// Stores workout schedule and completion tracking
import 'package:uuid/uuid.dart';

class GymSession {
  final String id;
  final DateTime scheduledTime;
  final DateTime? endTime;
  final DateTime? actualTime;
  final String gymType;
  final double estimatedCalories;
  final bool isCompleted;
  final int durationMinutes;

  GymSession({
    String? id,
    required this.scheduledTime,
    this.endTime,
    this.actualTime,
    required this.gymType,
    required this.estimatedCalories,
    this.isCompleted = false,
    this.durationMinutes = 60,
  }) : id = id ?? const Uuid().v4();

  /// Predefined gym types with calories per hour (MET-based calculation)
  static const List<Map<String, dynamic>> gymTypes = [
    {
      'id': 'chest',
      'name': 'Gym ngực',
      'nameEn': 'Chest Workout',
      'icon': '💪',
      'calPerHour': 350,
      'met': 6.0,
    },
    {
      'id': 'back',
      'name': 'Gym lưng',
      'nameEn': 'Back Workout',
      'icon': '🏋️',
      'calPerHour': 320,
      'met': 5.5,
    },
    {
      'id': 'shoulders',
      'name': 'Gym vai',
      'nameEn': 'Shoulder Workout',
      'icon': '🤸',
      'calPerHour': 280,
      'met': 5.0,
    },
    {
      'id': 'legs',
      'name': 'Gym chân',
      'nameEn': 'Leg Workout',
      'icon': '🦵',
      'calPerHour': 400,
      'met': 7.0,
    },
    {
      'id': 'arms',
      'name': 'Gym tay',
      'nameEn': 'Arm Workout',
      'icon': '💪',
      'calPerHour': 250,
      'met': 4.5,
    },
    {
      'id': 'abs',
      'name': 'Gym bụng',
      'nameEn': 'Abs Workout',
      'icon': '🔥',
      'calPerHour': 280,
      'met': 5.0,
    },
    {
      'id': 'fullbody',
      'name': 'Full Body',
      'nameEn': 'Full Body',
      'icon': '💯',
      'calPerHour': 380,
      'met': 6.5,
    },
    {
      'id': 'running',
      'name': 'Chạy bộ',
      'nameEn': 'Running',
      'icon': '🏃',
      'calPerHour': 600,
      'met': 10.0,
    },
    {
      'id': 'walking',
      'name': 'Đi bộ',
      'nameEn': 'Walking',
      'icon': '🚶',
      'calPerHour': 280,
      'met': 4.5,
    },
    {
      'id': 'swimming',
      'name': 'Bơi lội',
      'nameEn': 'Swimming',
      'icon': '🏊',
      'calPerHour': 500,
      'met': 8.0,
    },
    {
      'id': 'cycling',
      'name': 'Đạp xe',
      'nameEn': 'Cycling',
      'icon': '🚴',
      'calPerHour': 450,
      'met': 7.5,
    },
    {
      'id': 'yoga',
      'name': 'Yoga',
      'nameEn': 'Yoga',
      'icon': '🧘',
      'calPerHour': 180,
      'met': 3.0,
    },
    {
      'id': 'hiit',
      'name': 'HIIT',
      'nameEn': 'HIIT',
      'icon': '⚡',
      'calPerHour': 700,
      'met': 12.0,
    },
    {
      'id': 'cardio',
      'name': 'Cardio',
      'nameEn': 'Cardio',
      'icon': '❤️',
      'calPerHour': 400,
      'met': 7.0,
    },
    {
      'id': 'stretching',
      'name': 'Giãn cơ',
      'nameEn': 'Stretching',
      'icon': '🙆',
      'calPerHour': 150,
      'met': 2.5,
    },
    {
      'id': 'custom',
      'name': 'Tùy chỉnh',
      'nameEn': 'Custom',
      'icon': '⚙️',
      'calPerHour': 300,
      'met': 5.0,
    },
  ];

  /// Calculate calories burned based on duration and workout type
  static double calculateCalories(
    String gymType,
    int durationMinutes, {
    double userWeight = 70,
  }) {
    final typeData = gymTypes.firstWhere(
      (t) =>
          t['name'] == gymType || t['nameEn'] == gymType || t['id'] == gymType,
      orElse: () => {'calPerHour': 300, 'met': 5.0},
    );

    final met = (typeData['met'] as num).toDouble();
    final calories = met * 3.5 * userWeight / 200 * durationMinutes;
    return calories;
  }

  /// Get icon for gym type
  String get icon {
    final found = gymTypes.firstWhere(
      (t) => t['name'] == gymType || t['nameEn'] == gymType,
      orElse: () => {'icon': '⚡'},
    );
    return found['icon'] as String;
  }

  /// Get duration in hours and minutes format
  String get durationStr {
    if (durationMinutes < 60) {
      return '$durationMinutes phút';
    }
    final hours = durationMinutes ~/ 60;
    final mins = durationMinutes % 60;
    if (mins == 0) {
      return '$hours giờ';
    }
    return '$hours giờ $mins phút';
  }

  /// Get time range string (e.g., "15:00 - 16:30")
  String get timeRangeStr {
    final startStr =
        '${scheduledTime.hour.toString().padLeft(2, '0')}:${scheduledTime.minute.toString().padLeft(2, '0')}';
    if (endTime != null) {
      final endStr =
          '${endTime!.hour.toString().padLeft(2, '0')}:${endTime!.minute.toString().padLeft(2, '0')}';
      return '$startStr - $endStr';
    }
    final calculatedEnd = scheduledTime.add(Duration(minutes: durationMinutes));
    final endStr =
        '${calculatedEnd.hour.toString().padLeft(2, '0')}:${calculatedEnd.minute.toString().padLeft(2, '0')}';
    return '$startStr - $endStr';
  }

  /// Get scheduled time string (HH:mm)
  String get timeStr {
    return '${scheduledTime.hour.toString().padLeft(2, '0')}:${scheduledTime.minute.toString().padLeft(2, '0')}';
  }

  /// Check if session is for today
  bool get isToday {
    final now = DateTime.now();
    return scheduledTime.year == now.year &&
        scheduledTime.month == now.month &&
        scheduledTime.day == now.day;
  }

  /// Check if session is upcoming (scheduled but not completed)
  bool get isUpcoming {
    return !isCompleted && scheduledTime.isAfter(DateTime.now());
  }

  /// Check if session is overdue
  bool get isOverdue {
    return !isCompleted && scheduledTime.isBefore(DateTime.now());
  }

  /// Create copy with modifications
  GymSession copyWith({
    String? id,
    DateTime? scheduledTime,
    DateTime? endTime,
    DateTime? actualTime,
    String? gymType,
    double? estimatedCalories,
    bool? isCompleted,
    int? durationMinutes,
  }) {
    return GymSession(
      id: id ?? this.id,
      scheduledTime: scheduledTime ?? this.scheduledTime,
      endTime: endTime ?? this.endTime,
      actualTime: actualTime ?? this.actualTime,
      gymType: gymType ?? this.gymType,
      estimatedCalories: estimatedCalories ?? this.estimatedCalories,
      isCompleted: isCompleted ?? this.isCompleted,
      durationMinutes: durationMinutes ?? this.durationMinutes,
    );
  }

  /// Mark session as completed
  GymSession complete() {
    return copyWith(actualTime: DateTime.now(), isCompleted: true);
  }
}
