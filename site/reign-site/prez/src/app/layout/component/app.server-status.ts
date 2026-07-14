import { Component, inject } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { ServerStatusService } from '@/app/layout/service/server-status.service';

@Component({
    selector: 'app-server-status',
    standalone: true,
    imports: [TooltipModule],
    template: `
        <div class="flex items-center gap-2 px-2" role="status">
            <span class="flex items-center gap-1" pTooltip="Login" tooltipPosition="bottom">
                <i class="pi pi-circle-fill text-xs" [class]="dotClass(serverStatusService.status()?.login)"></i>
            </span>
            <span class="flex items-center gap-1" pTooltip="Personnages" tooltipPosition="bottom">
                <i class="pi pi-circle-fill text-xs" [class]="dotClass(serverStatusService.status()?.character)"></i>
            </span>
            <span class="flex items-center gap-1" pTooltip="Jeu" tooltipPosition="bottom">
                <i class="pi pi-circle-fill text-xs" [class]="dotClass(serverStatusService.status()?.map)"></i>
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
