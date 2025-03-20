import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = 'http://localhost:3002/auth';

  constructor(private http: HttpClient, private router: Router) {}

  private header_options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    withCredentials: true
  };

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, { email, password}, this.header_options);
  }

  register(name:string, email: string, password: string, role: string, createdby:string): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, {name, email, password, role, createdby}, this.header_options);
  }

  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/verify-otp`, { email, otp });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  AddUser(name:string,email: string, password: string, role: string, createdby:string): Observable<any> {
    return this.http.post(`${this.API_URL}/login/add`, { name,email, password, role, createdby });
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.API_URL}/login/users`);
  }

  viewUserTasks(userId: string): Observable<any> {
    return this.http.get(`${this.API_URL}/view/${userId}`);
  }
 
  deleteUsers(userId: string): Observable<any> { 
    console.log('Deleting user with ID:', userId);
    return this.http.delete(`${this.API_URL}/login/delete/${userId}`);
  }

  get_count(): Observable<any> {
    return this.http.get(`${this.API_URL}/hello`,this.header_options);
  }

  completed_count():Observable<any> {
    return this.http.get(`${this.API_URL}/completed`,this.header_options); 
  }

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  getCurrentUser() {
    return { role: 'user' }; 
  }
  
  IsNotAdmin(): boolean {
    const user = this.getCurrentUser();
    return user.role !== 'admin';
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  GenerateOtp(email: string):Observable<any>{
    console.log(email);
    return this.http.post(`${this.API_URL}/generate-otp`,{email},this.header_options);
  }

  VerifyOtp(email:string,otp:number):Observable<any>{
    return this.http.post(`${this.API_URL}/verify-otp`,{email,otp},this.header_options);
  }

}