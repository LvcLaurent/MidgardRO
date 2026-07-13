import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CharacterService, GameCharacter } from './character.service';

@Component({
    selector: 'app-characters',
    standalone: true,
    imports: [ButtonModule, ConfirmDialogModule, ProgressSpinnerModule, TableModule, TagModule],
    providers: [ConfirmationService],
    template: `
        <div class="card">
            <div class="text-surface-900 dark:text-surface-0 text-xl font-medium mb-6">Mes personnages</div>

            <p-table [value]="characters()" [loading]="loading()" dataKey="charId" selectionMode="single" [selection]="selected()" (onRowSelect)="onRowSelect($event)">
                <ng-template #header>
                    <tr>
                        <th>Nom</th>
                        <th>Classe</th>
                        <th>Niveau</th>
                        <th>Statut</th>
                        <th></th>
                    </tr>
                </ng-template>
                <ng-template #body let-character>
                    <tr [pSelectableRow]="character" class="cursor-pointer">
                        <td>{{ character.name }}</td>
                        <td>{{ character.jobName }}</td>
                        <td>{{ character.baseLevel }} / {{ character.jobLevel }}</td>
                        <td>
                            <p-tag [value]="character.online ? 'En ligne' : 'Hors ligne'" [severity]="character.online ? 'success' : 'secondary'" />
                        </td>
                        <td>
                            <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (onClick)="confirmDelete(character); $event.stopPropagation()" />
                        </td>
                    </tr>
                </ng-template>
                <ng-template #emptymessage>
                    <tr>
                        <td colspan="5" class="text-center py-6">Aucun personnage sur ce compte.</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        @if (selected(); as character) {
            <div class="card mt-4">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-4">
                        <div class="w-16 h-16 flex items-center justify-center shrink-0">
                            @if (spriteLoading()) {
                                <p-progress-spinner styleClass="w-8 h-8" strokeWidth="6" />
                            } @else if (spriteUrl()) {
                                <img [src]="spriteUrl()" [alt]="character.name" class="max-w-full max-h-full" style="image-rendering: pixelated" (error)="spriteUrl.set(null)" />
                            }
                        </div>
                        <div>
                            <div class="text-surface-900 dark:text-surface-0 text-xl font-medium">{{ character.name }}</div>
                            <div class="text-muted-color text-sm">{{ character.jobName }} - Niveau {{ character.baseLevel }} / {{ character.jobLevel }}</div>
                        </div>
                    </div>
                    <p-button icon="pi pi-times" text rounded severity="secondary" (onClick)="closeFocus()" />
                </div>

                <div class="max-w-md mb-6">
                    <div class="flex justify-between text-sm mb-1">
                        <span class="font-medium">PV</span>
                        <span>{{ character.hp }} / {{ character.maxHp }}</span>
                    </div>
                    <div class="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-3 mb-3">
                        <div class="bg-red-500 h-3 rounded-full transition-all" [style.width.%]="percent(character.hp, character.maxHp)"></div>
                    </div>

                    <div class="flex justify-between text-sm mb-1">
                        <span class="font-medium">SP</span>
                        <span>{{ character.sp }} / {{ character.maxSp }}</span>
                    </div>
                    <div class="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-3" [class.mb-3]="character.maxAp > 0">
                        <div class="bg-blue-500 h-3 rounded-full transition-all" [style.width.%]="percent(character.sp, character.maxSp)"></div>
                    </div>

                    @if (character.maxAp > 0) {
                        <div class="flex justify-between text-sm mb-1">
                            <span class="font-medium">AP</span>
                            <span>{{ character.ap }} / {{ character.maxAp }}</span>
                        </div>
                        <div class="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-3">
                            <div class="bg-amber-500 h-3 rounded-full transition-all" [style.width.%]="percent(character.ap, character.maxAp)"></div>
                        </div>
                    }
                </div>

                <!-- Vue brute et exhaustive pour le reste, en attendant de savoir ce qui vaut la peine
                     d'être mis en forme visuellement (carte, position, équipement...). -->
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
    `
})
export class Characters implements OnInit, OnDestroy {
    characters = signal<GameCharacter[]>([]);

    loading = signal(true);

    selected = signal<GameCharacter | null>(null);

    spriteUrl = signal<string | null>(null);

    spriteLoading = signal(false);

    constructor(
        private characterService: CharacterService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        this.loading.set(true);
        this.characterService.list().subscribe({
            next: (characters) => {
                this.characters.set(characters);
                this.loading.set(false);
            },
            error: (error: HttpErrorResponse) => {
                this.loading.set(false);
                if (error.status === 401) {
                    this.router.navigateByUrl('/auth/login');
                }
            }
        });
    }

    ngOnDestroy(): void {
        this.releaseSpriteUrl();
    }

    onRowSelect(event: TableRowSelectEvent<GameCharacter>): void {
        const character = Array.isArray(event.data) ? null : (event.data ?? null);
        this.selected.set(character);
        this.loadSprite(character);
    }

    closeFocus(): void {
        this.selected.set(null);
        this.releaseSpriteUrl();
    }

    private loadSprite(character: GameCharacter | null): void {
        this.releaseSpriteUrl();
        if (!character) {
            return;
        }
        this.spriteLoading.set(true);
        this.characterService.getSpriteUrl(character.charId).subscribe({
            next: (url) => {
                this.spriteLoading.set(false);
                this.spriteUrl.set(url);
            },
            error: () => this.spriteLoading.set(false)
        });
    }

    private releaseSpriteUrl(): void {
        const current = this.spriteUrl();
        if (current) {
            URL.revokeObjectURL(current);
        }
        this.spriteUrl.set(null);
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
                        this.closeFocus();
                    }
                });
            }
        });
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
