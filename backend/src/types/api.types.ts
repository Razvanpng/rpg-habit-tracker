//Generic API envelope 

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    message: string;
    code?: string;
    // Field-level validation errors (from Zod)
    fields?: Record<string, string[]>;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

//User

export interface SafeUser {
  id: string;
  email: string;
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  createdAt: Date;
}

export interface AuthPayload {
  user: SafeUser;
  // JWT is delivered via HttpOnly cookie, not this field.
  // This field confirms successful auth to the client.
  authenticated: boolean;
}

//Habit

export interface HabitDto {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  xpReward: number;
  isCompletedToday: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompleteHabitResult {
  habit: HabitDto;
  xpAwarded: number;
  leveledUp: boolean;
  user: SafeUser;
}

//Progress

export interface ProgressSnapshot {
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  progressPercent: number;
}