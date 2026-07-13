import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AccountService } from './account.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, InputTextModule, MessageModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Reign of Midgard</div>
                            <span class="text-muted-color font-medium">Se connecter</span>
                        </div>

                        <form (ngSubmit)="login()">
                            @if (errorMessage()) {
                                <p-message severity="error" [text]="errorMessage()!" styleClass="w-full mb-4"></p-message>
                            }

                            <label for="userId" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Identifiant</label>
                            <input pInputText id="userId" type="text" placeholder="Identifiant" class="w-full md:w-120 mb-8" [(ngModel)]="userId" name="userId" />

                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Mot de passe</label>
                            <p-password id="password1" [(ngModel)]="password" name="password" placeholder="Mot de passe" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>

                            <p-button type="submit" label="Se connecter" styleClass="w-full mt-4" [loading]="loading()"></p-button>

                            <div class="text-center mt-8">
                                <span class="text-muted-color font-medium">Pas encore de compte ? </span>
                                <a routerLink="/auth/register" class="font-medium text-primary cursor-pointer">Créer un compte</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Login {
    userId: string = '';

    password: string = '';

    loading = signal(false);

    errorMessage = signal<string | null>(null);

    constructor(
        private accountService: AccountService,
        private router: Router
    ) {}

    login(): void {
        this.errorMessage.set(null);
        this.loading.set(true);
        this.accountService.login({ userId: this.userId, password: this.password }).subscribe({
            next: () => {
                this.loading.set(false);
                this.router.navigateByUrl('/');
            },
            error: () => {
                this.loading.set(false);
                this.errorMessage.set('Identifiant ou mot de passe invalide');
            }
        });
    }
}
