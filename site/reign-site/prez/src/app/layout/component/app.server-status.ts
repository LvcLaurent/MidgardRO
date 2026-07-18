import { Component, inject } from '@angular/core';
import { ServerStatusService } from '@/app/layout/service/server-status.service';

@Component({
    selector: 'app-server-status',
    standalone: true,
    imports: [],
    template: `
        <div class="px-4 pt-2 text-[0.857rem] uppercase font-bold text-surface-900 dark:text-surface-0">Serveur</div>
        <div class="flex flex-col gap-2 px-4 py-3 text-sm" role="status">
            <span class="flex items-center gap-2">
                <i class="pi pi-circle-fill text-xs" [class]="dotClass(serverStatusService.status()?.login)"></i>
                <span class="text-muted-color">Connexion</span>
            </span>
            <span class="flex items-center gap-2">
                <i class="pi pi-circle-fill text-xs" [class]="dotClass(serverStatusService.status()?.character)"></i>
                <span class="text-muted-color">Personnages</span>
            </span>
            <span class="flex items-center gap-2">
                <i class="pi pi-circle-fill text-xs" [class]="dotClass(serverStatusService.status()?.map)"></i>
                <span class="text-muted-color">Jeu</span>
            </span>
            <span class="flex items-center gap-2 pt-1">
                <i class="pi pi-users text-xs text-muted-color"></i>
                <span class="text-muted-color">{{ serverStatusService.status()?.onlineCount ?? 0 }} joueur{{ (serverStatusService.status()?.onlineCount ?? 0) > 1 ? 's' : '' }} en ligne</span>
            </span>
        </div>
    `
})
export class AppServerStatus {
    serverStatusService = inject(ServerStatusService);

    dotClass(up: boolean | undefined): string {
        if (up === undefined) {
            return 'text-muted-color';
        }
        return up ? 'text-green-500' : 'text-red-500';
    }
}
