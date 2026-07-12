import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';

const API_BASE_URL = environment.apiBaseUrl;

export interface Account {
    accountId: number;
    userId: string;
    email: string;
    characterSlots: number;
}

export interface RegisterPayload {
    userId: string;
    password: string;
    email: string;
    sex: 'M' | 'F';
}

export interface LoginPayload {
    userId: string;
    password: string;
}

@Injectable({ providedIn: 'root' })
export class AccountService {
    /** Compte connecté (source unique de vérité pour tout le layout). */
    readonly account = signal<Account | null>(null);

    constructor(private http: HttpClient) {
        this.refreshSession();
    }

    /** Vérifie si une session existe déjà (ex: au chargement de l'app). */
    refreshSession(): void {
        this.http.get<Account>(`${API_BASE_URL}/accounts/me`, { withCredentials: true }).subscribe({
            next: (account) => this.account.set(account),
            error: () => this.account.set(null)
        });
    }

    register(payload: RegisterPayload) {
        return this.http.post<Account>(`${API_BASE_URL}/accounts/register`, payload, { withCredentials: true });
    }

    login(payload: LoginPayload) {
        return this.http.post<Account>(`${API_BASE_URL}/accounts/login`, payload, { withCredentials: true }).pipe(tap((account) => this.account.set(account)));
    }

    logout() {
        return this.http.post<void>(`${API_BASE_URL}/accounts/logout`, {}, { withCredentials: true }).pipe(tap(() => this.account.set(null)));
    }
}
