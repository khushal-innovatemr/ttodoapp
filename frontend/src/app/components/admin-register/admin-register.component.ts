import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-register',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './admin-register.component.html',
  styleUrl: './admin-register.component.css'
})
export class AdminRegisterComponent {
  email = '';
  password = '';
  role = '';
  errorMessage = '';
  successMessage = '';
  createdby = '';

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    this.authService.register(this.email, this.password,this.role,this.createdby).subscribe({
      next: (v) => {
        console.log(v);
        
        this.successMessage = 'User Created!';
        
        setTimeout(() => {
          this.successMessage = 'Redirecting to Admin..';
          
          setTimeout(() => {
            this.router.navigate(['/admin']);
          }, 2000);
          
        }, 3000);
      },
      error: (err) => (this.errorMessage = err.error.error)
    });
  }
}
