import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

const API_BASE_URL = environment.apiBaseUrl;

const POLL_INTERVAL_MS = 60000;

export interface ServerStatus {
    login: boolean;
    character: boolean;
    map: boolean;
    onlineCount: number;
}

@Injectable({ providedIn: 'root' })
export class ServerStatusService implements OnDestroy {
    readonly status = signal<ServerStatus | null>(null);

    private intervalId?: ReturnType<typeof setInterval>;

    constructor(private http: HttpClient) {
        this.refresh();
        this.intervalId = setInterval(() => this.refresh(), POLL_INTERVAL_MS);
    }

    refresh(): void {
        this.http.get<ServerStatus>(`${API_BASE_URL}/server/status`).subscribe({
            next: (status) => this.status.set(status),
            error: () => this.status.set({ login: false, character: false, map: false, onlineCount: 0 })
        });
    }

    ngOnDestroy(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}
