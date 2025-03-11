import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      const token = this.authService.getToken();
      if (token) {
        try {
          const data = JSON.parse(atob(token.split('.')[1]));
          const role = data.role;
          if (role !== 'admin') {
            this.authService.logout();
            alert('Unauthorized User Please Login Again');
            this.router.navigate(['/login']);
            return false;
          }
          console.log("Authenticated admin user");
          return true; 
        } catch (error) {
          console.error("Error decoding token:", error);
          localStorage.removeItem('token');
          return false;
        }
      } else {
        localStorage.removeItem('token');
        return false;
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}