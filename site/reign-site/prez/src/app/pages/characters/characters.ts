import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { CharacterService, GameCharacter } from './character.service';

const CAPITAL_MAP = 'prontera';
const CAPITAL_X = 156;
const CAPITAL_Y = 181;

@Component({
    selector: 'app-characters',
    standalone: true,
    imports: [ButtonModule, ConfirmDialogModule, TableModule, TagModule, ToastModule],
    providers: [ConfirmationService, MessageService],
    template: `
        <div class="card">
            <div class="text-surface-900 dark:text-surface-0 text-xl font-medium mb-6">Mes personnages</div>

            <p-table [value]="characters()" [loading]="loading()" dataKey="charId">
                <ng-template #body let-character>
                    <tr class="align-top">
                        <td>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 py-2">
                                <!-- Personnage : sprite, nom, job, niveau, statut -->
                                <div class="flex items-center gap-4">
                                    <div class="w-48 h-48 flex items-center justify-center shrink-0 bg-surface-100 dark:bg-surface-800 rounded-lg">
                                        @if (spriteUrl(character.charId); as url) {
                                            <img [src]="url" [alt]="character.name" class="max-w-full max-h-full" style="image-rendering: pixelated" />
                                        } @else {
                                            <i class="pi pi-user text-muted-color text-4xl"></i>
                                        }
                                    </div>
                                    <div>
                                        <div class="text-surface-900 dark:text-surface-0 text-lg font-medium">{{ character.name }}</div>
                                        <div class="text-muted-color text-sm">{{ character.jobName }}</div>
                                        <div class="text-muted-color text-sm mb-2">Niveau {{ character.baseLevel }} / {{ character.jobLevel }}</div>
                                        <div class="flex gap-2">
                                            <p-tag [value]="character.online ? 'En ligne' : 'Hors ligne'" [severity]="character.online ? 'success' : 'secondary'" />
                                            @if (character.faction) {
                                                <p-tag [value]="character.factionName" [severity]="character.faction === 1 ? 'info' : 'warn'" />
                                            }
                                        </div>
                                    </div>
                                </div>

                                <!-- Vie / mana / caractéristiques -->
                                <div class="max-w-xs">
                                    <div class="flex justify-between text-sm mb-1">
                                        <span class="font-medium">PV</span>
                                        <span>{{ character.hp }} / {{ character.maxHp }}</span>
                                    </div>
                                    <div class="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-3 mb-3">
                                        <div class="bg-red-500 h-3 rounded-full transition-all" [style.width.%]="percent(character.hp, character.maxHp)"></div>
                                    </div>

                                    <div class="flex justify-between text-sm mb-1">
                                        <span class="font-medium">Mana</span>
                                        <span>{{ character.sp }} / {{ character.maxSp }}</span>
                                    </div>
                                    <div class="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-3 mb-3">
                                        <div class="bg-blue-500 h-3 rounded-full transition-all" [style.width.%]="percent(character.sp, character.maxSp)"></div>
                                    </div>

                                    <div class="flex flex-col gap-1 text-sm">
                                        <div class="flex justify-between"><span class="text-muted-color">Zeny</span><span>{{ character.zeny }}</span></div>
                                        <div class="flex justify-between"><span class="text-muted-color">Force</span><span>{{ character.str }}</span></div>
                                        <div class="flex justify-between"><span class="text-muted-color">Agilité</span><span>{{ character.agi }}</span></div>
                                        <div class="flex justify-between"><span class="text-muted-color">Vitalité</span><span>{{ character.vit }}</span></div>
                                        <div class="flex justify-between"><span class="text-muted-color">Dextérité</span><span>{{ character.dex }}</span></div>
                                        <div class="flex justify-between"><span class="text-muted-color">Intelligence</span><span>{{ character.intelligence }}</span></div>
                                        <div class="flex justify-between"><span class="text-muted-color">Chance</span><span>{{ character.luk }}</span></div>
                                    </div>
                                </div>

                                <!-- Position et rapatriement -->
                                <div class="flex flex-col gap-3">
                                    <div>
                                        <div class="text-muted-color text-sm mb-1">Position actuelle</div>
                                        <div>{{ character.lastMap }} ({{ character.lastX }}, {{ character.lastY }})</div>
                                    </div>
                                    <div>
                                        <div class="text-muted-color text-sm mb-1">Point de sauvegarde</div>
                                        <div>{{ character.saveMap }} ({{ character.saveX }}, {{ character.saveY }})</div>
                                    </div>
                                    <div class="flex flex-col gap-2 mt-1">
                                        <p-button
                                            label="Rapatrier le personnage à Prontera"
                                            icon="pi pi-map-marker"
                                            severity="secondary"
                                            size="small"
                                            [outlined]="true"
                                            (onClick)="repatriateCharacter(character); $event.stopPropagation()"
                                        />
                                        <p-button
                                            label="Rapatrier le point de sauvegarde à Prontera"
                                            icon="pi pi-bookmark"
                                            severity="secondary"
                                            size="small"
                                            [outlined]="true"
                                            (onClick)="repatriateSavePoint(character); $event.stopPropagation()"
                                        />
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="align-top pt-2">
                            <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (onClick)="confirmDelete(character); $event.stopPropagation()" />
                        </td>
                    </tr>
                </ng-template>
                <ng-template #emptymessage>
                    <tr>
                        <td colspan="2" class="text-center py-6">Aucun personnage sur ce compte.</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <p-confirmdialog [style]="{ width: '450px' }" />
        <p-toast />
    `
})
export class Characters implements OnInit, OnDestroy {
    characters = signal<GameCharacter[]>([]);

    loading = signal(true);

    private spriteUrls = signal<Map<number, string>>(new Map());

    constructor(
        private characterService: CharacterService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.load();
    }

    ngOnDestroy(): void {
        for (const url of this.spriteUrls().values()) {
            URL.revokeObjectURL(url);
        }
    }

    load(): void {
        this.loading.set(true);
        this.characterService.list().subscribe({
            next: (characters) => {
                this.characters.set(characters);
                this.loading.set(false);
                this.loadSprites(characters);
            },
            error: (error: HttpErrorResponse) => {
                this.loading.set(false);
                if (error.status === 401) {
                    this.router.navigateByUrl('/auth/login');
                }
            }
        });
    }

    private loadSprites(characters: GameCharacter[]): void {
        for (const character of characters) {
            this.characterService.getSpriteUrl(character.charId).subscribe({
                next: (url) => {
                    const next = new Map(this.spriteUrls());
                    next.set(character.charId, url);
                    this.spriteUrls.set(next);
                },
                error: () => {
                    // Pas de sprite disponible (job/état non couvert par zrenderer) : on garde le placeholder.
                }
            });
        }
    }

    spriteUrl(charId: number): string | null {
        return this.spriteUrls().get(charId) ?? null;
    }

    confirmDelete(character: GameCharacter): void {
        this.confirmationService.confirm({
            message: `Supprimer le personnage "${character.name}" ? Le personnage sera définitivement supprimé par le serveur dans 72h (délai de grâce).`,
            header: 'Confirmer la suppression',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.characterService.delete(character.charId).subscribe(() => {
                    this.characters.set(this.characters().filter((c) => c.charId !== character.charId));
                    const url = this.spriteUrls().get(character.charId);
                    if (url) {
                        URL.revokeObjectURL(url);
                        const next = new Map(this.spriteUrls());
                        next.delete(character.charId);
                        this.spriteUrls.set(next);
                    }
                });
            }
        });
    }

    repatriateCharacter(character: GameCharacter): void {
        this.characterService.repatriate(character.charId).subscribe(() => {
            this.updateCharacter(character.charId, { lastMap: CAPITAL_MAP, lastX: CAPITAL_X, lastY: CAPITAL_Y });
            this.messageService.add({ severity: 'success', summary: 'Rapatriement effectué', detail: `"${character.name}" sera à Prontera à la prochaine connexion.` });
        });
    }

    repatriateSavePoint(character: GameCharacter): void {
        this.characterService.repatriateSavePoint(character.charId).subscribe(() => {
            this.updateCharacter(character.charId, { saveMap: CAPITAL_MAP, saveX: CAPITAL_X, saveY: CAPITAL_Y });
            this.messageService.add({ severity: 'success', summary: 'Point de sauvegarde déplacé', detail: `Le point de sauvegarde de "${character.name}" est maintenant à Prontera.` });
        });
    }

    private updateCharacter(charId: number, changes: Partial<GameCharacter>): void {
        this.characters.set(this.characters().map((c) => (c.charId === charId ? { ...c, ...changes } : c)));
    }

    percent(value: number, max: number): number {
        return max > 0 ? Math.min(100, (value / max) * 100) : 0;
    }
}
