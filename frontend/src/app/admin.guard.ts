import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      const token = this.authService.getToken();
      if (token) {
        try {
          const token_data = JSON.parse(atob(token.split('.')[1])); 
          if (token_data.role === 'admin') {
            const restrictedRoutes = ['/login', '/register', '/'];
            if (restrictedRoutes.includes(state.url)) {
              console.log("Admins cannot go to login, register, or home routes, redirecting to /admin");
              this.router.navigate(['/admin']);
              return false;
            }
            return true;
          } else {
            if (state.url.includes('/admin')) {
              this.router.navigate(['/']);
              return false;
            }
            return true;
          }
        } catch (error) {
          console.error("Invalid token format:", error);
        }
      }
    }
    this.router.navigate(['/login']);
    return false;
  }
}