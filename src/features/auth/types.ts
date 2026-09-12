/**
 * En esta sesión el tipo de usuario se define aquí mismo, de forma
 * autocontenida: todavía no existe el feature de Users del que depender.
 */
export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

/** Respuesta de POST /api/auth/login (sin envoltura "data"). */
export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}
