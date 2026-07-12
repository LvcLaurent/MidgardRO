import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AccountService } from '../auth/account.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [ButtonModule, RouterModule],
    template: `
        <div class="flex flex-col items-center justify-center text-center py-20">
            <div class="text-surface-900 dark:text-surface-0 text-4xl font-medium mb-4">Reign of Midgard</div>
            <span class="text-muted-color font-medium mb-8">Serveur privé Ragnarok Online</span>

            @if (!accountService.account()) {
                <div class="flex gap-4">
                    <p-button label="Se connecter" routerLink="/auth/login"></p-button>
                    <p-button label="Créer un compte" severity="secondary" routerLink="/auth/register"></p-button>
                </div>
            }
        </div>
    `
})
export class Home {
    loading = signal(false);

    constructor(public accountService: AccountService) {}
}
