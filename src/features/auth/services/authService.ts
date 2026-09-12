import type { LoginRequest, LoginResponse } from '../types';

const API_URL = 'http://localhost:3000';

export const authService = {
    async login(payload: LoginRequest): Promise<LoginResponse> {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });

        const body = await response.json().catch(() => null);

        if (!response.ok) {
            const message = body?.message ?? 'No pudimos iniciar sesión';
            throw new Error(Array.isArray(message) ? message.join(', ') : message);
        }

        return body as LoginResponse;
    }
}