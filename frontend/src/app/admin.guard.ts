import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      const token = this.authService.getToken();
      console.log("token",token)

      if (token) {
        try {
          const token_data = JSON.parse(atob(token.split('.')[1])); 
          console.log(token_data);

          if (token_data.role === 'admin') {
              console.log("you cannot go to home it is only for user")
              this.router.navigate(['/admin']) 
            return false;
          } else {
            console.log("user success")
            return true;
          }
        } catch (error) {
          console.error("Invalid token format:", error);
        }
      }
    }

    this.router.navigate(['/login']); // Redirect unauthorized users to login
    return false;
  }
}
