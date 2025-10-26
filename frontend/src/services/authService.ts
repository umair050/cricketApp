import { api } from '@/config/api';

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  country: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface VerifyCodeData {
  code: string;
}

export interface ResetPasswordData {
  code: string;
  newPassword: string;
}

export const authService = {
  async login(data: LoginData) {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  async signup(data: SignupData) {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  async forgotPassword(data: ForgotPasswordData) {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  async verifyResetCode(data: VerifyCodeData) {
    const response = await api.post('/auth/verify-reset-code', data);
    return response.data;
  },

  async resetPassword(data: ResetPasswordData) {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },
};
