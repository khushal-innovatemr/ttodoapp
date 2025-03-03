import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true, 
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    this.authService.register(this.email, this.password).subscribe({
      next: () => {
        this.successMessage = 'User Saved!';
        
        setTimeout(() => {
          this.successMessage = 'Redirecting to login page...';
          
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
          
        }, 3000);
      },
      error: (err) => (this.errorMessage = err.error.error)
    });
  }
}
