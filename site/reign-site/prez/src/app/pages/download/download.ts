import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-download',
    standalone: true,
    imports: [ButtonModule, TooltipModule],
    template: `
        <div class="flex flex-col items-center">
            <div class="w-full max-w-2xl flex flex-col gap-4">
                <div class="card flex flex-col items-center text-center gap-4">
                    <div class="text-surface-900 dark:text-surface-0 text-2xl font-medium">Rejoindre Reign of Midgard</div>
                    <p class="text-surface-700 dark:text-surface-300 leading-relaxed">
                        Le client de jeu est prêt à jouer : pas de patch officiel à installer, pas de launcher tiers. Téléchargez l'archive, décompressez-la où vous voulez, et lancez l'exécutable.
                    </p>
                    <p-button label="Télécharger le client" icon="pi pi-download" [disabled]="true" pTooltip="Lien à venir"></p-button>
                    <span class="text-muted-color text-sm">Lien de téléchargement bientôt disponible.</span>
                </div>

                <div class="card">
                    <div class="text-surface-900 dark:text-surface-0 text-lg font-medium mb-3">Installation</div>
                    <ol class="text-surface-700 dark:text-surface-300 leading-relaxed list-decimal list-inside flex flex-col gap-2">
                        <li>Téléchargez et décompressez l'archive du client.</li>
                        <li>Lancez l'exécutable fourni - aucune installation supplémentaire n'est nécessaire.</li>
                        <li>Créez votre compte directement depuis ce site (bouton "Créer un compte" en haut de page).</li>
                        <li>Connectez-vous en jeu avec les mêmes identifiants.</li>
                    </ol>
                </div>
            </div>
        </div>
    `
})
export class Download {}
