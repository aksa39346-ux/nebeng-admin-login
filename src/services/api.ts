// ============================================
// API Configuration
// Ganti BASE_URL dengan URL Laravel backend kamu
// ============================================

export const API_BASE_URL = "http://localhost:8000/api";

// Helper untuk membuat request ke API
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || "Terjadi kesalahan" };
    }

    return { data };
  } catch (error) {
    console.error("API Error:", error);
    return { error: "Tidak dapat terhubung ke server" };
  }
}

// ============================================
// Auth API Services
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// Login
export async function login(data: LoginRequest) {
  return apiRequest<LoginResponse>("/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Forgot Password - Request reset link
export async function forgotPassword(data: ForgotPasswordRequest) {
  return apiRequest<{ message: string }>("/forgot-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Reset Password - Set new password
export async function resetPassword(data: ResetPasswordRequest) {
  return apiRequest<{ message: string }>("/reset-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Logout
export async function logout(token: string) {
  return apiRequest<{ message: string }>("/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
