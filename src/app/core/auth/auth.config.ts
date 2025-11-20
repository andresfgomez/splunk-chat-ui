import { InjectionToken } from '@angular/core';

export interface AuthConfig {
    clientId: string;
    authorizeUrl: string;
    tokenUrl: string;
    redirectUri: string;
    scope: string;
}

export const AUTH_CONFIG = new InjectionToken<AuthConfig>('AUTH_CONFIG');

export const defaultAuthConfig: AuthConfig = {
    clientId: 'YOUR_CLIENT_ID', // Placeholder
    authorizeUrl: 'https://splunk-auth-server/authorize', // Placeholder
    tokenUrl: 'https://splunk-auth-server/token', // Placeholder
    redirectUri: window.location.origin + '/auth/callback',
    scope: 'openid profile email'
};
