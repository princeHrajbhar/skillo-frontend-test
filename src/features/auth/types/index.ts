// admin-dashboard\src\features\auth\types\index.ts
export interface User {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  isVerified: boolean;
}

export interface Session {
  id: string;
  userAgent?: string;
  ip?: string;
  lastUsedAt: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface VerifyOtpData {
  email: string;
  otp: string;
}

export interface ResendOtpData {
  email: string;
  type: 'REGISTER' | 'RESET_PASSWORD';
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  resetUrl: string;
  newPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}