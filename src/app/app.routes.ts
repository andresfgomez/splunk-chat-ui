import { Routes } from '@angular/router';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';

export const routes: Routes = [
    { path: 'auth/callback', component: AuthCallbackComponent },
    { path: 'chat', loadComponent: () => import('./features/chat/chat-layout/chat-layout.component').then(m => m.ChatLayoutComponent) },
    { path: '', redirectTo: 'chat', pathMatch: 'full' } // For now redirect to chat, auth guard will be added later
];
