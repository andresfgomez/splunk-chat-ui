import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AUTH_CONFIG, AuthConfig } from './auth.config';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    constructor(
        @Inject(AUTH_CONFIG) private config: AuthConfig,
        private http: HttpClient,
        private router: Router
    ) { }

    login(): void {
        const params = new HttpParams()
            .set('client_id', this.config.clientId)
            .set('redirect_uri', this.config.redirectUri)
            .set('response_type', 'code')
            .set('scope', this.config.scope)
            .set('state', this.generateState());

        window.location.href = `${this.config.authorizeUrl}?${params.toString()}`;
    }

    handleCallback(code: string): Observable<any> {
        const body = new HttpParams()
            .set('grant_type', 'authorization_code')
            .set('client_id', this.config.clientId)
            .set('code', code)
            .set('redirect_uri', this.config.redirectUri);

        return this.http.post(this.config.tokenUrl, body.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).pipe(
            tap((response: any) => {
                this.setSession(response);
                this.isAuthenticatedSubject.next(true);
            }),
            catchError(error => {
                console.error('Token exchange failed', error);
                return of(null);
            })
        );
    }

    logout(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('expires_at');
        this.isAuthenticatedSubject.next(false);
        this.router.navigate(['/']);
    }

    getToken(): string | null {
        return localStorage.getItem('access_token');
    }

    private hasToken(): boolean {
        return !!this.getToken();
    }

    private setSession(authResult: any): void {
        const expiresAt = JSON.stringify((authResult.expires_in * 1000) + new Date().getTime());
        localStorage.setItem('access_token', authResult.access_token);
        localStorage.setItem('expires_at', expiresAt);
    }

    private generateState(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}
