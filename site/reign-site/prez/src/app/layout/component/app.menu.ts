import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AccountService } from '@/app/pages/auth/account.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for (item of model(); track item.label) {
            @if (!item.separator) {
                <li app-menuitem [item]="item" [root]="true"></li>
            } @else {
                <li class="menu-separator"></li>
            }
        }
    </ul> `
})
export class AppMenu {
    private accountService = inject(AccountService);

    model = computed<MenuItem[]>(() => {
        const account = this.accountService.account();
        return [
            {
                label: 'Navigation',
                items: [{ label: 'Accueil', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'Compte',
                items: account
                    ? [{ label: 'Se déconnecter', icon: 'pi pi-fw pi-sign-out', command: () => this.accountService.logout().subscribe() }]
                    : [
                          { label: 'Se connecter', icon: 'pi pi-fw pi-sign-in', routerLink: ['/auth/login'] },
                          { label: 'Créer un compte', icon: 'pi pi-fw pi-user-plus', routerLink: ['/auth/register'] }
                      ]
            }
        ];
    });
}
