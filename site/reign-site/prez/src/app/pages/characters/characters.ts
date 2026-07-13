import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CharacterService, GameCharacter } from './character.service';

@Component({
    selector: 'app-characters',
    standalone: true,
    imports: [ButtonModule, ConfirmDialogModule, TableModule, TagModule],
    providers: [ConfirmationService],
    template: `
        <div class="card">
            <div class="text-surface-900 dark:text-surface-0 text-xl font-medium mb-6">Mes personnages</div>

            <p-table [value]="characters()" [loading]="loading()" dataKey="charId">
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
                    <tr>
                        <td>{{ character.name }}</td>
                        <td>{{ character.jobId }}</td>
                        <td>{{ character.baseLevel }} / {{ character.jobLevel }}</td>
                        <td>
                            <p-tag [value]="character.online ? 'En ligne' : 'Hors ligne'" [severity]="character.online ? 'success' : 'secondary'" />
                        </td>
                        <td>
                            <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (onClick)="confirmDelete(character)" />
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

        <p-confirmdialog [style]="{ width: '450px' }" />
    `
})
export class Characters implements OnInit {
    characters = signal<GameCharacter[]>([]);

    loading = signal(true);

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

    confirmDelete(character: GameCharacter): void {
        this.confirmationService.confirm({
            message: `Supprimer le personnage "${character.name}" ? Cette action déclenche le délai de grâce du serveur avant suppression définitive.`,
            header: 'Confirmer la suppression',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.characterService.delete(character.charId).subscribe(() => {
                    this.characters.set(this.characters().filter((c) => c.charId !== character.charId));
                });
            }
        });
    }
}
