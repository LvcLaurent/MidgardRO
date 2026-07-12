import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AccountService } from './account.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ButtonModule, InputTextModule, MessageModule, PasswordModule, RadioButtonModule, FormsModule, RouterModule, AppFloatingConfigurator],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Créer un compte</div>
                            <span class="text-muted-color font-medium">Rejoins Reign of Midgard</span>
                        </div>

                        <div>
                            @if (errorMessage()) {
                                <p-message severity="error" [text]="errorMessage()!" styleClass="w-full mb-4"></p-message>
                            }
                            @if (successMessage()) {
                                <p-message severity="success" [text]="successMessage()!" styleClass="w-full mb-4"></p-message>
                            }

                            <label for="userId" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Identifiant</label>
                            <input pInputText id="userId" type="text" placeholder="Identifiant" class="w-full md:w-120 mb-8" [(ngModel)]="userId" />

                            <label for="email" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                            <input pInputText id="email" type="text" placeholder="Email" class="w-full md:w-120 mb-8" [(ngModel)]="email" />

                            <label class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Sexe</label>
                            <div class="flex gap-6 mb-8">
                                <div class="flex items-center gap-2">
                                    <p-radiobutton name="sex" value="M" [(ngModel)]="sex" inputId="sexM"></p-radiobutton>
                                    <label for="sexM">Masculin</label>
                                </div>
                                <div class="flex items-center gap-2">
                                    <p-radiobutton name="sex" value="F" [(ngModel)]="sex" inputId="sexF"></p-radiobutton>
                                    <label for="sexF">Féminin</label>
                                </div>
                            </div>

                            <label for="password" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Mot de passe</label>
                            <p-password id="password" [(ngModel)]="password" placeholder="Mot de passe" [toggleMask]="true" styleClass="mb-4" [fluid]="true"></p-password>

                            <label for="confirmPassword" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Confirmer le mot de passe</label>
                            <p-password id="confirmPassword" [(ngModel)]="confirmPassword" placeholder="Confirmer le mot de passe" [toggleMask]="true" styleClass="mb-4" [feedback]="false" [fluid]="true"></p-password>

                            <p-button label="Créer mon compte" styleClass="w-full mt-4" [loading]="loading()" (onClick)="register()"></p-button>

                            <div class="text-center mt-8">
                                <span class="text-muted-color font-medium">Déjà un compte ? </span>
                                <a routerLink="/auth/login" class="font-medium text-primary cursor-pointer">Se connecter</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Register {
    userId: string = '';

    email: string = '';

    sex: 'M' | 'F' = 'M';

    password: string = '';

    confirmPassword: string = '';

    loading = signal(false);

    errorMessage = signal<string | null>(null);

    successMessage = signal<string | null>(null);

    constructor(
        private accountService: AccountService,
        private router: Router
    ) {}

    register(): void {
        this.errorMessage.set(null);
        this.successMessage.set(null);

        if (this.password !== this.confirmPassword) {
            this.errorMessage.set('Les mots de passe ne correspondent pas');
            return;
        }

        this.loading.set(true);
        this.accountService.register({ userId: this.userId, password: this.password, email: this.email, sex: this.sex }).subscribe({
            next: () => {
                this.loading.set(false);
                this.successMessage.set('Compte créé, tu peux te connecter');
                setTimeout(() => this.router.navigateByUrl('/auth/login'), 1500);
            },
            error: (err) => {
                this.loading.set(false);
                this.errorMessage.set(err.status === 409 ? 'Cet identifiant est déjà pris' : 'Erreur lors de la création du compte');
            }
        });
    }
}
