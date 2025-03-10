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
            alert('Please log out first');
            console.log("Unauthorized Logout")
            this.router.navigate(['/admin']);
            return false;
        }
        else 
        {
            return true;
        }
    }
}