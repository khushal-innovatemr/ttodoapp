import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
    providedIn: 'root'
})

export class RedirectGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(): boolean {
        if (this.authService.isAuthenticated()) {
            const token = this.authService.getToken();

            if (token) {
                try {
                    const token_data = JSON.parse(atob(token.split('.')[1]));
                    const userRole = token_data.role;
                    console.log(token_data.role,token_data.email);

                    alert('You are already logged in. Please log out first.');

                    if (userRole === 'admin') {
                        this.router.navigate(['/admin']);
                    } else {
                        this.router.navigate(['/dashboard']);
                    }

                    console.log("Redirecting authenticated user with role:", userRole);
                    return false;
                } catch (error) {
                    console.error("Error decoding token:", error);
                    localStorage.removeItem('token');
                    return true;
                }
            } else {
                localStorage.removeItem('token');
                return true;
            }
        } else {
            return true;
        }
    }
}