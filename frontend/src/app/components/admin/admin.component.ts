import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  email = '';
  password = '';
  role:any = '';
  tasks:any = [];
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
  }

  @Output() ViewUser:EventEmitter<any> = new EventEmitter();

  AddUser(): void {
    this.authService.AddUser(this.email, this.password, this.role).subscribe({
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
  flag:boolean=true;

  CheckUser(): void {
    if(this.flag){
      this.flag = !this.flag
    this.authService.getUsers().subscribe({
      next: (res: any) => {
        this.tasks = res;
      },
      error: (error: any) => {
        console.error('Error Fetching Users', error);
      }
    });
  }
else{
  this.tasks=[]
  this.flag=!this.flag
}}


  DeleteUser(users: any): void {
    this.authService.deleteUsers(users.userId, {}).subscribe({
      next: (res: any) => {
        console.log('User Deleted:', res);
        this.CheckUser();
      },
      error: (error: any) => {
        console.error('Error Deleting User:', error);
      }
    });
  }
}