import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';

@Component({
    selector: 'app-auth-callback',
    standalone: true,
    template: `
    <div class="h-full w-full flex items-center justify-center">
      <div class="glass-panel p-8 text-center">
        <p class="text-muted">Authenticating...</p>
      </div>
    </div>
  `
})
export class AuthCallbackComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const code = params['code'];
            if (code) {
                this.authService.handleCallback(code).subscribe({
                    next: () => {
                        this.router.navigate(['/chat']);
                    },
                    error: () => {
                        this.router.navigate(['/']);
                    }
                });
            } else {
                this.router.navigate(['/']);
            }
        });
    }
}
