import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AccountService } from '../auth/account.service';

interface NewsArticle {
    date: string;
    title: string;
    body: string;
}

const MONTHS_FR = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

function frenchDate(date: Date): string {
    return `${date.getDate()} ${MONTHS_FR[date.getMonth()]} ${date.getFullYear()}`;
}

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [ButtonModule, RouterModule],
    template: `
        <div class="flex flex-col items-center">
            <img src="images/banner.png" alt="Reign of Midgard" class="w-full max-w-4xl rounded-lg shadow-md mb-6" />

            <span class="text-muted-color font-medium mb-8">Serveur privé Ragnarok Online</span>

            @if (!accountService.account()) {
                <div class="flex gap-4 mb-12">
                    <p-button label="Se connecter" routerLink="/auth/login"></p-button>
                    <p-button label="Créer un compte" severity="secondary" routerLink="/auth/register"></p-button>
                </div>
            }

            <div class="w-full max-w-4xl flex flex-col gap-4">
                @for (article of articles; track article.title) {
                    <div class="card">
                        <div class="text-muted-color text-sm mb-1">{{ article.date }}</div>
                        <div class="text-surface-900 dark:text-surface-0 text-xl font-medium mb-3">{{ article.title }}</div>
                        <p class="text-surface-700 dark:text-surface-300 leading-relaxed">{{ article.body }}</p>
                    </div>
                }
            </div>
        </div>
    `
})
export class Home {
    loading = signal(false);

    articles: NewsArticle[] = [
        {
            date: frenchDate(new Date()),
            title: 'Les factions arrivent sur Reign of Midgard',
            body: "Depuis toujours, Midgard vivait sous la Foi du Panthéon nordique - jusqu'à la Rupture, l'événement qui a fait naître deux voies nouvelles : l'Ordre de la Faille et les Forgenoires. Chaque personnage peut désormais s'engager dans l'une de ces deux factions et en tirer un bonus (intelligence pour la lignée des Mages, dextérité pour celle des Mécaniciens). Le travail sur les premières quêtes de Midgard - celles qui vous accueilleront à votre arrivée à Izlude - commence dès maintenant."
        }
    ];

    constructor(public accountService: AccountService) {}
}
