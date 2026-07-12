import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Home } from './app/pages/home/home';

// Seuls l'accueil, le login et l'inscription sont actifs pour l'instant. Le
// reste du template (dashboard, uikit, landing, etc.) reste présent dans le
// code mais n'est pas routé.
export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [{ path: '', component: Home }]
    },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '' }
];
