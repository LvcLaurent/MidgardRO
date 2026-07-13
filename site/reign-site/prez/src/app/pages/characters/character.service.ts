import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';

const API_BASE_URL = environment.apiBaseUrl;

/**
 * Reprend (quasi) toutes les colonnes de la table `char` de rAthena - vue brute exhaustive pour
 * le panneau de focus, en attendant de savoir ce qui vaut la peine d'être mis en forme visuellement.
 */
export interface GameCharacter {
    charId: number;
    charNum: number;
    name: string;
    jobId: number;
    jobName: string;
    baseLevel: number;
    jobLevel: number;
    baseExp: number;
    jobExp: number;
    zeny: number;
    str: number;
    agi: number;
    vit: number;
    intelligence: number;
    dex: number;
    luk: number;
    pow: number;
    sta: number;
    wis: number;
    spl: number;
    con: number;
    crt: number;
    maxHp: number;
    hp: number;
    maxSp: number;
    sp: number;
    maxAp: number;
    ap: number;
    statusPoint: number;
    skillPoint: number;
    traitPoint: number;
    option: number;
    karma: number;
    manner: number;
    partyId: number;
    guildId: number;
    petId: number;
    homunId: number;
    elementalId: number;
    hair: number;
    hairColor: number;
    clothesColor: number;
    body: number;
    weapon: number;
    shield: number;
    headTop: number;
    headMid: number;
    headBottom: number;
    robe: number;
    lastMap: string;
    lastX: number;
    lastY: number;
    lastInstanceId: number;
    saveMap: string;
    saveX: number;
    saveY: number;
    partnerId: number;
    online: boolean;
    father: number;
    mother: number;
    child: number;
    fame: number;
    rename: number;
    deleteDate: number;
    moves: number;
    unbanTime: number;
    font: number;
    uniqueItemCounter: number;
    sex: 'M' | 'F';
    hotkeyRowshift: number;
    hotkeyRowshift2: number;
    clanId: number;
    lastLogin: string | null;
    titleId: number;
    showEquip: number;
    inventorySlots: number;
    bodyDirection: number;
    disableCall: number;
    disablePartyInvite: number;
    disableShowCostumes: number;
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

    /** Retourne une blob URL locale (à révoquer via URL.revokeObjectURL une fois affichée). */
    getSpriteUrl(charId: number) {
        return this.http
            .get(`${API_BASE_URL}/accounts/me/characters/${charId}/sprite`, { withCredentials: true, responseType: 'blob' })
            .pipe(map((blob) => URL.createObjectURL(blob)));
    }
}
