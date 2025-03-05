import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  message = '';
  isSuccess = false;
  token: string | null = null;
  errorMessage = '';
  showTokenMessage = false; 
  showRedirectMessage = false;

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.token = res.token;  
        localStorage.setItem('token', res.token);

        this.showTokenMessage = true;
        this.message = 'Token Verified!!';
        this.isSuccess = true;

        if(res.role == 'admin'){
          this.message = 'Redirecting to Admin Dashboard';

          setTimeout(() => {
            this.router.navigate(['/admin'])
          },2000);
          return
        }
        

        setTimeout(() => {
          this.showRedirectMessage = true;
          this.message = 'Redirecting to Dashboard...';

          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 2000);
          
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = err.error.error;
      }
    });
  }
}
