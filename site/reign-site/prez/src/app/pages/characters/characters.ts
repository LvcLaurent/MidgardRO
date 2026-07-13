import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { CharacterService, GameCharacter } from './character.service';

@Component({
    selector: 'app-characters',
    standalone: true,
    imports: [ButtonModule, ConfirmDialogModule, TableModule, TagModule, ToastModule],
    providers: [ConfirmationService, MessageService],
    template: `
        <div class="card">
            <div class="text-surface-900 dark:text-surface-0 text-xl font-medium mb-6">Mes personnages</div>

            <p-table [value]="characters()" [loading]="loading()" dataKey="charId" selectionMode="single" [selection]="selected()" (onRowSelect)="onRowSelect($event)">
                <ng-template #body let-character>
                    <tr [pSelectableRow]="character" class="cursor-pointer align-top">
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
                                        <p-tag [value]="character.online ? 'En ligne' : 'Hors ligne'" [severity]="character.online ? 'success' : 'secondary'" />
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

        @if (selected(); as character) {
            <div class="card mt-4">
                <div class="flex items-center justify-between mb-4">
                    <div class="text-surface-900 dark:text-surface-0 text-xl font-medium">{{ character.name }} - détails</div>
                    <p-button icon="pi pi-times" text rounded severity="secondary" (onClick)="selected.set(null)" />
                </div>

                <!-- Vue brute et exhaustive pour le reste (guilde, équipement, hotkeys...), en attendant
                     de savoir ce qui vaut encore la peine d'être mis en forme visuellement. -->
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    @for (field of characterFields(character); track field.key) {
                        <div>
                            <div class="text-muted-color text-sm mb-1">{{ field.label }}</div>
                            <div>{{ field.value }}</div>
                        </div>
                    }
                </div>
            </div>
        }

        <p-confirmdialog [style]="{ width: '450px' }" />
        <p-toast />
    `
})
export class Characters implements OnInit, OnDestroy {
    characters = signal<GameCharacter[]>([]);

    loading = signal(true);

    selected = signal<GameCharacter | null>(null);

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

    onRowSelect(event: TableRowSelectEvent<GameCharacter>): void {
        this.selected.set(Array.isArray(event.data) ? null : (event.data ?? null));
    }

    confirmDelete(character: GameCharacter): void {
        this.confirmationService.confirm({
            message: `Supprimer le personnage "${character.name}" ? Le personnage sera définitivement supprimé par le serveur dans 72h (délai de grâce).`,
            header: 'Confirmer la suppression',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.characterService.delete(character.charId).subscribe(() => {
                    this.characters.set(this.characters().filter((c) => c.charId !== character.charId));
                    if (this.selected()?.charId === character.charId) {
                        this.selected.set(null);
                    }
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

    // TODO: pas encore branché côté serveur (nécessite map/coordonnées de la zone safe + un
    // endpoint qui demande au char-server de déplacer le personnage/son point de sauvegarde).
    repatriateCharacter(character: GameCharacter): void {
        this.messageService.add({ severity: 'info', summary: 'Bientôt disponible', detail: `Rapatriement de "${character.name}" pas encore implémenté.` });
    }

    repatriateSavePoint(character: GameCharacter): void {
        this.messageService.add({ severity: 'info', summary: 'Bientôt disponible', detail: `Rapatriement du point de sauvegarde de "${character.name}" pas encore implémenté.` });
    }

    percent(value: number, max: number): number {
        return max > 0 ? Math.min(100, (value / max) * 100) : 0;
    }

    characterFields(character: GameCharacter): { key: string; label: string; value: string }[] {
        return Object.entries(character).map(([key, value]) => ({
            key,
            label: this.toLabel(key),
            value: value === null || value === undefined || value === '' ? '-' : String(value)
        }));
    }

    private toLabel(key: string): string {
        const withSpaces = key.replace(/([A-Z])/g, ' $1');
        return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
    }
}
