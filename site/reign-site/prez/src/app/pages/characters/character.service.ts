import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

const API_BASE_URL = environment.apiBaseUrl;

export interface GameCharacter {
    charId: number;
    charNum: number;
    name: string;
    jobId: number;
    baseLevel: number;
    jobLevel: number;
    online: boolean;
}

@Injectable({ providedIn: 'root' })
export class CharacterService {
    constructor(private http: HttpClient) {}

    list() {
        return this.http.get<GameCharacter[]>(`${API_BASE_URL}/accounts/me/characters`, { withCredentials: true });
    }

    delete(charId: number) {
        return this.http.delete<void>(`${API_BASE_URL}/accounts/me/characters/${charId}`, { withCredentials: true });
    }
}
