import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Account, AccountService } from '../auth/account.service';

@Component({
    selector: 'app-accounts',
    standalone: true,
    imports: [TableModule, TagModule],
    template: `
        <div class="card">
            <div class="text-surface-900 dark:text-surface-0 text-xl font-medium mb-6">Comptes</div>

            <p-table [value]="accounts()" [loading]="loading()" dataKey="accountId">
                <ng-template #header>
                    <tr>
                        <th>ID</th>
                        <th>Identifiant</th>
                        <th>Email</th>
                        <th>Slots persos</th>
                        <th>Groupe</th>
                    </tr>
                </ng-template>
                <ng-template #body let-account>
                    <tr>
                        <td>{{ account.accountId }}</td>
                        <td>{{ account.userId }}</td>
                        <td>{{ account.email }}</td>
                        <td>{{ account.characterSlots }}</td>
                        <td>
                            @if (account.isAdmin) {
                                <p-tag value="Admin" severity="warn" />
                            }
                        </td>
                    </tr>
                </ng-template>
                <ng-template #emptymessage>
                    <tr>
                        <td colspan="5" class="text-center py-6">Aucun compte.</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `
})
export class Accounts implements OnInit {
    accounts = signal<Account[]>([]);

    loading = signal(true);

    constructor(
        private accountService: AccountService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.accountService.listAll().subscribe({
            next: (accounts) => {
                this.accounts.set(accounts);
                this.loading.set(false);
            },
            error: (error: HttpErrorResponse) => {
                this.loading.set(false);
                if (error.status === 401 || error.status === 403) {
                    this.router.navigateByUrl('/');
                }
            }
        });
    }
}
