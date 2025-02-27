export type UserRole = 'user' | 'admin';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface LoginData {
  email: string;
  password: string;
}
