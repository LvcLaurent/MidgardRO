import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { AccountService } from '../auth/account.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [ButtonModule, InputTextModule, MessageModule, PasswordModule, FormsModule],
    template: `
        <div class="flex flex-col gap-6 max-w-xl">
            <div class="card">
                <div class="text-surface-900 dark:text-surface-0 text-xl font-medium mb-6">Mon profil</div>
                <div class="text-muted-color text-sm mb-1">Identifiant</div>
                <div class="text-surface-900 dark:text-surface-0 mb-6">{{ accountService.account()?.userId }}</div>

                @if (emailError()) {
                    <p-message severity="error" [text]="emailError()!" styleClass="w-full mb-4"></p-message>
                }
                @if (emailSuccess()) {
                    <p-message severity="success" [text]="emailSuccess()!" styleClass="w-full mb-4"></p-message>
                }

                <label for="email" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">Email</label>
                <input pInputText id="email" type="text" class="w-full mb-4" [(ngModel)]="email" />

                <p-button label="Mettre à jour l'email" [loading]="emailLoading()" (onClick)="updateEmail()"></p-button>
            </div>

            <div class="card">
                <div class="text-surface-900 dark:text-surface-0 text-xl font-medium mb-6">Changer le mot de passe</div>

                @if (passwordError()) {
                    <p-message severity="error" [text]="passwordError()!" styleClass="w-full mb-4"></p-message>
                }
                @if (passwordSuccess()) {
                    <p-message severity="success" [text]="passwordSuccess()!" styleClass="w-full mb-4"></p-message>
                }

                <label for="currentPassword" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">Mot de passe actuel</label>
                <p-password id="currentPassword" [(ngModel)]="currentPassword" [toggleMask]="true" [feedback]="false" styleClass="mb-4" [fluid]="true"></p-password>

                <label for="newPassword" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">Nouveau mot de passe</label>
                <p-password id="newPassword" [(ngModel)]="newPassword" [toggleMask]="true" styleClass="mb-4" [fluid]="true"></p-password>

                <label for="confirmNewPassword" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">Confirmer le nouveau mot de passe</label>
                <p-password id="confirmNewPassword" [(ngModel)]="confirmNewPassword" [toggleMask]="true" [feedback]="false" styleClass="mb-4" [fluid]="true"></p-password>

                <p-button label="Changer le mot de passe" [loading]="passwordLoading()" (onClick)="changePassword()"></p-button>
            </div>
        </div>
    `
})
export class Profile {
    email: string;

    emailLoading = signal(false);

    emailError = signal<string | null>(null);

    emailSuccess = signal<string | null>(null);

    currentPassword: string = '';

    newPassword: string = '';

    confirmNewPassword: string = '';

    passwordLoading = signal(false);

    passwordError = signal<string | null>(null);

    passwordSuccess = signal<string | null>(null);

    constructor(public accountService: AccountService) {
        this.email = accountService.account()?.email ?? '';
    }

    updateEmail(): void {
        this.emailError.set(null);
        this.emailSuccess.set(null);
        this.emailLoading.set(true);

        this.accountService.changeEmail(this.email).subscribe({
            next: () => {
                this.emailLoading.set(false);
                this.emailSuccess.set('Email mis à jour.');
            },
            error: (err) => {
                this.emailLoading.set(false);
                this.emailError.set(err.status === 409 ? 'Cet email est déjà utilisé par un autre compte.' : "Erreur lors de la mise à jour de l'email.");
            }
        });
    }

    changePassword(): void {
        this.passwordError.set(null);
        this.passwordSuccess.set(null);

        if (this.newPassword !== this.confirmNewPassword) {
            this.passwordError.set('Les nouveaux mots de passe ne correspondent pas.');
            return;
        }

        this.passwordLoading.set(true);
        this.accountService.changePassword(this.currentPassword, this.newPassword).subscribe({
            next: () => {
                this.passwordLoading.set(false);
                this.passwordSuccess.set('Mot de passe changé.');
                this.currentPassword = '';
                this.newPassword = '';
                this.confirmNewPassword = '';
            },
            error: (err) => {
                this.passwordLoading.set(false);
                this.passwordError.set(err.status === 401 ? 'Mot de passe actuel incorrect.' : 'Erreur lors du changement de mot de passe.');
            }
        });
    }
}
