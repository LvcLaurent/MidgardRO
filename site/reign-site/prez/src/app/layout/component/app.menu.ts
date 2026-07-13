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
        const navigationItems: MenuItem[] = [{ label: 'Accueil', icon: 'pi pi-fw pi-home', routerLink: ['/'] }];
        if (account) {
            navigationItems.push({ label: 'Mes personnages', icon: 'pi pi-fw pi-users', routerLink: ['/characters'] });
        }
        if (account?.isAdmin) {
            navigationItems.push({ label: 'Comptes', icon: 'pi pi-fw pi-shield', routerLink: ['/accounts'] });
        }

        return [
            {
                label: 'Navigation',
                items: navigationItems
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
