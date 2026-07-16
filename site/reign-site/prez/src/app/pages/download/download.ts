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
                        Téléchargez l'installeur du client, lancez-le, et jouez : le raccourci créé passe automatiquement par le launcher qui vérifie les mises à jour à chaque lancement.
                    </p>
                    <a href="https://drive.google.com/file/d/1GeTgEPyjEjFD1Z2SjT85y8qxqY5Db4Nr/view?usp=sharing" target="_blank" rel="noopener">
                        <p-button label="Télécharger le client" icon="pi pi-download"></p-button>
                    </a>
                </div>

                <div class="card">
                    <div class="text-surface-900 dark:text-surface-0 text-lg font-medium mb-3">Installation</div>
                    <ol class="text-surface-700 dark:text-surface-300 leading-relaxed list-decimal list-inside flex flex-col gap-2">
                        <li>Téléchargez et lancez l'installeur du client.</li>
                        <li>Un raccourci "Reign of Midgard" est créé sur le Bureau et dans le menu Démarrer.</li>
                        <li>Créez votre compte directement depuis ce site (bouton "Créer un compte" en haut de page).</li>
                        <li>Lancez le jeu depuis le raccourci - il vérifie et applique les mises à jour avant de démarrer, puis connectez-vous avec les mêmes identifiants.</li>
                    </ol>
                </div>
            </div>
        </div>
    `
})
export class Download {}
