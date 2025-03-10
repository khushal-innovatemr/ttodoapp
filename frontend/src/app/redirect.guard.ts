import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      const user = this.authService.getCurrentUser();
      if (user.role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/']);
      }
      alert('Please log out first');
      console.log("Unauthorized Logout");
      return false;
    } else {
      return true;
    }
  }
}