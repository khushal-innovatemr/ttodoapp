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
  otp: any = '';
  password = '';
  message = '';
  isSuccess = false;
  token: string | null = null;
  errorMessage = '';
  showTokenMessage = false; 
  showRedirectMessage = false;
  isOtpVerified = false; 
  isOtpGenerated = false; 

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    if (!this.isOtpVerified) {
      this.errorMessage = 'Please verify your OTP before logging in.';
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.token = res.token;  
        localStorage.setItem('token', res.token);

        this.showTokenMessage = true;
        this.message = 'Token Verified!!';
        this.isSuccess = true;

        if (res.role === 'admin') {
          this.message = 'Redirecting to Admin Dashboard';
          this.router.navigate(['/admin']);
          return;
        }
        
        this.showRedirectMessage = true;
        this.message = 'Redirecting to Dashboard...';
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Login failed';
      }
    });
  }

  GenerateOtp(): void {
    this.authService.GenerateOtp(this.email).subscribe({
      next: () => {
        this.message = 'OTP sent successfully';
        this.isOtpGenerated = true;
      },
      error: (err) => {
        this.message = 'Error sending OTP';
        console.error(err);
      }
    });
  }

  VerifyOtp(): void {
    this.authService.VerifyOtp(this.email, this.otp).subscribe({
      next: () => {
        this.isOtpVerified = true;
        this.message = 'OTP verified successfully';
      },
      error: (err) => {
        this.message = 'Invalid OTP';
        this.isOtpVerified = false;
        console.error(err);
      }
    });
  }
}
