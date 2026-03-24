export interface ApiSuccess<T> { success: true; data: T; }
export interface ApiErrorBody { success: false; error: { message: string; code?: string; fields?: Record<string, string[]>; }; }
export type ApiResponse<T> = ApiSuccess<T> | ApiErrorBody;

export interface User { id: string; email: string; level: number; currentXp: number; xpToNextLevel: number; createdAt: string; }
export interface AuthPayload { user: User; authenticated: boolean; }
export interface Habit { id: string; userId: string; name: string; description: string | null; xpReward: number; isCompletedToday: boolean; createdAt: string; updatedAt: string; }
export interface CompleteHabitResult { habit: Habit; xpAwarded: number; leveledUp: boolean; user: User; }
export interface HabitLog { completedAt: string; xpAwarded: number; }
export interface ProgressSnapshot { level: number; currentXp: number; xpToNextLevel: number; progressPercent: number; }

export interface RegisterFormValues { email: string; password: string; }
export interface LoginFormValues { email: string; password: string; }
export interface HabitFormValues { name: string; description?: string; xpReward: number; }

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export interface LevelUpEvent { previousLevel: number; newLevel: number; }